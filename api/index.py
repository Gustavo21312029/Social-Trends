from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import httpx
import os
import time
import asyncio

app = FastAPI(title="SocialTrends API", version="0.5.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

APIFY_TOKEN = os.getenv("APIFY_TOKEN")
TIKTOK_ACTOR = "clockworks~tiktok-scraper"
INSTAGRAM_ACTOR = os.getenv("INSTAGRAM_ACTOR_ID", "apify~instagram-scraper")

# --- CONFIGURAÇÃO DE NICHOS E HASHTAGS ---
# Você pode expandir esta lista com quantos nichos desejar.
NICHOS = {
    "tecnologia": {
        "label": "Tecnologia & Programação",
        "hashtags": ["programacao", "devlife", "tecnologia", "python", "javascript", "ia"]
    },
    "fitness": {
        "label": "Fitness & Saúde",
        "hashtags": ["fitness", "gym", "workout", "saude", "treino", "vidasaudavel"]
    },
    "culinaria": {
        "label": "Culinária & Gastronomia",
        "hashtags": ["receita", "culinaria", "gastronomia", "comidacaseira", "chef", "foodie"]
    },
    "marketing": {
        "label": "Marketing & Negócios",
        "hashtags": ["marketingdigital", "empreendedorismo", "negocios", "socialmedia", "vendas", "branding"]
    },
    "viagem": {
        "label": "Viagem & Turismo",
        "hashtags": ["viagem", "turismo", "mochilao", "destinos", "viajar", "travel"]
    },
    "moda": {
        "label": "Moda & Beleza",
        "hashtags": ["moda", "beleza", "estilo", "maquiagem", "skincare", "fashion"]
    }
}

# --- DADOS DE DEMONSTRAÇÃO (PLANO B) ---
MOCK_TRENDS = {
    "tecnologia": [
        {"id": "tk1", "platform": "tiktok", "titulo": "3 erros que todo dev júnior comete", "views": 870000, "likes": 62000, "crescimento": "+210%"},
        {"id": "ig1", "platform": "instagram", "titulo": "Carrossel: 5 atalhos do VS Code", "likes": 12400, "crescimento": "+180%"}
    ],
    "fitness": [
        {"id": "tk2", "platform": "tiktok", "titulo": "Treino de 5 minutos para iniciantes", "views": 1200000, "likes": 85000, "crescimento": "+340%"},
        {"id": "ig2", "platform": "instagram", "titulo": "Reel: rotina de treino em casa", "likes": 24000, "crescimento": "+290%"}
    ]
}
# Nichos sem mock específico usarão o "tecnologia" como fallback
DEFAULT_MOCK = MOCK_TRENDS["tecnologia"]

# --- FUNÇÃO AUXILIAR PARA CHAMAR O APIFY ---
async def fetch_from_apify(actor_id: str, input_data: dict, limit: int = 5):
    if not APIFY_TOKEN:
        return None
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"https://api.apify.com/v2/acts/{actor_id}/runs?token={APIFY_TOKEN}",
                json=input_data, timeout=8.0
            )
            run_id = resp.json().get("data", {}).get("id")
            if not run_id: return None
            
            for _ in range(6):
                status_resp = await client.get(f"https://api.apify.com/v2/actor-runs/{run_id}?token={APIFY_TOKEN}")
                status_data = status_resp.json().get("data", {})
                if status_data.get("status") == "SUCCEEDED":
                    dataset_id = status_data.get("defaultDatasetId")
                    items_resp = await client.get(f"https://api.apify.com/v2/datasets/{dataset_id}/items?token={APIFY_TOKEN}")
                    return items_resp.json()[:limit]
                await asyncio.sleep(1)
            return None
    except Exception:
        return None

# --- ROTA DE TENDÊNCIAS POR NICHO ---
@app.get("/trending")
@app.get("/api/trending")
async def trending(
    platform: str = Query("all", pattern="^(all|tiktok|instagram|x|facebook)$"),
    nicho: str = Query("tecnologia", description="Nicho para filtrar as tendências")
):
    # Se o nicho não existir, usa 'tecnologia' como padrão
    nicho_config = NICHOS.get(nicho, NICHOS["tecnologia"])
    hashtags = nicho_config["hashtags"]
    mock_fallback = MOCK_TRENDS.get(nicho, DEFAULT_MOCK)

    if not APIFY_TOKEN:
        all_items = []
        for p in ["tiktok", "instagram"]:
            if platform == "all" or platform == p:
                all_items.extend(mock_fallback)
        return {"platform": platform, "nicho": nicho, "updated_at": datetime.utcnow().isoformat(), "items": all_items}

    results = []

    # 1. TikTok
    if platform in ("all", "tiktok"):
        # Passamos a lista de hashtags do nicho selecionado
        tiktok_data = await fetch_from_apify(
            TIKTOK_ACTOR,
            {"hashtags": hashtags, "resultsPerPage": 5, "shouldDownloadVideos": False}
        )
        if tiktok_data:
            for item in tiktok_data:
                desc = item.get("desc") or item.get("text") or "Vídeo em alta"
                results.append({
                    "id": item.get("id", ""), "platform": "tiktok",
                    "titulo": (desc[:80] + "...") if len(desc) > 80 else desc,
                    "views": item.get("playCount", 0), "likes": item.get("diggCount", 0),
                    "crescimento": "+Novo"
                })
        elif platform == "tiktok": results.extend(mock_fallback)

    # 2. Instagram
    if platform in ("all", "instagram"):
        ig_data = await fetch_from_apify(
            INSTAGRAM_ACTOR,
            {"hashtags": hashtags, "resultsLimit": 5}
        )
        if ig_data:
            for item in ig_data:
                desc = item.get("caption") or "Post em alta"
                results.append({
                    "id": item.get("id", ""), "platform": "instagram",
                    "titulo": (desc[:80] + "...") if len(desc) > 80 else desc,
                    "likes": item.get("likesCount", 0),
                    "crescimento": "+Novo"
                })
        elif platform == "instagram": results.extend(mock_fallback)

    return {"platform": platform, "nicho": nicho, "updated_at": datetime.utcnow().isoformat(), "items": results}
