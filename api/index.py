from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import httpx
import os
import asyncio

app = FastAPI(title="SocialTrends API", version="0.6.0")

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
NICHOS = {
    "tecnologia": {"hashtags": ["programacao", "devlife", "tecnologia", "python"]},
    "fitness": {"hashtags": ["fitness", "gym", "workout", "saude", "treino"]},
    "culinaria": {"hashtags": ["receita", "culinaria", "gastronomia", "comidacaseira"]},
    "marketing": {"hashtags": ["marketingdigital", "empreendedorismo", "negocios"]},
    "viagem": {"hashtags": ["viagem", "turismo", "mochilao", "destinos"]},
    "moda": {"hashtags": ["moda", "beleza", "estilo", "maquiagem"]},
    "games": {"hashtags": ["games", "gamer", "esports", "twitch", "gameplay"]},
    "esportes": {"hashtags": ["esportes", "futebol", "basquete", "treino", "skate"]},
    "filmes": {"hashtags": ["filmes", "series", "cinema", "netflix", "streaming"]},
    "musica": {"hashtags": ["musica", "show", "festival", "cantor", "podcast"]}
}

# --- DADOS DE DEMONSTRAÇÃO SUPER COMPLETOS (PLANO B) ---
# Isso garante que o site fique sempre cheio e bonito, mesmo se o Apify demorar
MOCK_TRENDS = {
    "tecnologia": [
        {"id": "1", "platform": "tiktok", "titulo": "3 erros que todo dev júnior comete", "views": 870000, "likes": 62000, "crescimento": "+210%"},
        {"id": "2", "platform": "instagram", "titulo": "Carrossel: 5 atalhos do VS Code", "views": 45000, "likes": 12400, "crescimento": "+180%"},
        {"id": "3", "platform": "tiktok", "titulo": "Como a IA está mudando a programação", "views": 1500000, "likes": 150000, "crescimento": "+350%"}
    ],
    "fitness": [
        {"id": "4", "platform": "tiktok", "titulo": "Treino de 5 minutos para iniciantes", "views": 1200000, "likes": 85000, "crescimento": "+340%"},
        {"id": "5", "platform": "instagram", "titulo": "Reel: rotina de treino em casa", "views": 80000, "likes": 24000, "crescimento": "+290%"},
        {"id": "6", "platform": "tiktok", "titulo": "O que comer antes do treino?", "views": 950000, "likes": 72000, "crescimento": "+150%"}
    ],
    "games": [
        {"id": "7", "platform": "tiktok", "titulo": "Gameplay insana de GTA 6", "views": 5000000, "likes": 400000, "crescimento": "+500%"},
        {"id": "8", "platform": "instagram", "titulo": "Setup gamer dos sonhos", "views": 120000, "likes": 35000, "crescimento": "+120%"},
        {"id": "9", "platform": "tiktok", "titulo": "Dicas para subir de elo no Valorant", "views": 2300000, "likes": 180000, "crescimento": "+220%"}
    ],
    "esportes": [
        {"id": "10", "platform": "instagram", "titulo": "Melhores momentos do jogo de ontem", "views": 300000, "likes": 45000, "crescimento": "+200%"},
        {"id": "11", "platform": "tiktok", "titulo": "Treino de explosão para futebol", "views": 800000, "likes": 60000, "crescimento": "+180%"}
    ]
}
DEFAULT_MOCK = MOCK_TRENDS["tecnologia"] # Fallback geral

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
            
            # Timeout curto (4s) para não estourar o Vercel de 10s
            for _ in range(4):
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

# --- ROTA DE TENDÊNCIAS ---
@app.get("/trending")
@app.get("/api/trending")
async def trending(
    platform: str = Query("all", pattern="^(all|tiktok|instagram|x|facebook)$"),
    nicho: str = Query("tecnologia")
):
    nicho_config = NICHOS.get(nicho, NICHOS["tecnologia"])
    hashtags = nicho_config["hashtags"]
    mock_fallback = MOCK_TRENDS.get(nicho, DEFAULT_MOCK)

    # Se não tiver token, retorna o mock bonito
    if not APIFY_TOKEN:
        return {"platform": platform, "nicho": nicho, "updated_at": datetime.utcnow().isoformat(), "items": mock_fallback}

    results = []

    # 1. TikTok
    if platform in ("all", "tiktok"):
        tiktok_data = await fetch_from_apify(
            TIKTOK_ACTOR,
            {"hashtags": hashtags, "resultsPerPage": 3, "shouldDownloadVideos": False} # Puxa menos para ser mais rápido
        )
        if tiktok_data:
            for item in tiktok_data:
                desc = item.get("desc") or item.get("text") or f"Tendência no TikTok sobre #{hashtags[0]}"
                results.append({
                    "id": item.get("id", ""), "platform": "tiktok",
                    "titulo": (desc[:80] + "...") if len(desc) > 80 else desc,
                    "views": item.get("playCount", 0), "likes": item.get("diggCount", 0),
                    "crescimento": "+Novo"
                })

    # 2. Instagram
    if platform in ("all", "instagram"):
        ig_data = await fetch_from_apify(
            INSTAGRAM_ACTOR,
            {"hashtags": hashtags, "resultsLimit": 3}
        )
        if ig_data:
            for item in ig_data:
                # O Instagram via Apify pode retornar a legenda em campos diferentes
                desc = item.get("caption") or item.get("text") or f"Post sobre #{hashtags[0]}"
                if isinstance(desc, dict): # As vezes vem como dicionário
                    desc = desc.get("text", "Post em alta")
                
                results.append({
                    "id": item.get("id", ""), "platform": "instagram",
                    "titulo": (desc[:80] + "...") if len(desc) > 80 else desc,
                    "views": item.get("videoViewCount", 0), # Tenta pegar views de vídeo
                    "likes": item.get("likesCount", 0),
                    "crescimento": "+Novo"
                })

    # SE O APIFY FALHAR OU DEMORAR, USA O PLANO B COMPLETO PARA NÃO DEIXAR A TELA VAZIA
    if not results:
        results = mock_fallback

    return {"platform": platform, "nicho": nicho, "updated_at": datetime.utcnow().isoformat(), "items": results}

# --- ROTA DE HORÁRIOS ---
@app.get("/best-times")
@app.get("/api/best-times")
def best_times(platform: str = Query("instagram"), format: str = Query("reels")):
    dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
    horas = [6, 9, 12, 15, 18, 21]
    heatmap = [{"dia": d, "hora": h, "score": (i * 7 + j * 11) % 60 + 40}
               for i, d in enumerate(dias) for j, h in enumerate(horas)]
    return {"platform": platform, "format": format, "heatmap": heatmap}

# --- ROTA DE ANÁLISE ---
@app.get("/analyze")
@app.get("/api/analyze")
def analyze(username: str = Query(...), platform: str = Query("instagram")):
    return {
        "username": username, "platform": platform,
        "status": "mock", "message": "Análise real requer Meta Graph API.",
        "suggested_times": ["Qua 12:00", "Qui 09:00", "Sex 18:00"],
        "suggested_formats": ["Reels", "Carrossel"],
    }
