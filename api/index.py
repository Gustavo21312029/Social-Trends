from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import httpx
import os
import time

app = FastAPI(title="SocialTrends API", version="0.3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

APIFY_TOKEN = os.getenv("APIFY_TOKEN")

# --- ROTA DE TENDÊNCIAS (DADOS REAIS COM PLANO B) ---
@app.get("/trending")
@app.get("/api/trending")
async def trending(platform: str = Query("all", pattern="^(all|tiktok|instagram|x|facebook)$")):
    
    # Dados de demonstração (Plano B) caso o Apify falhe ou não tenha token
    mock_fallback = [
        {"id": "tk1", "platform": "tiktok", "titulo": "POV: você descobre que o chefe leu seu WhatsApp", "views": 1200000, "likes": 85000, "crescimento": "+340%"},
        {"id": "tk2", "platform": "tiktok", "titulo": "3 erros que todo dev júnior comete", "views": 870000, "likes": 62000, "crescimento": "+210%"},
        {"id": "ig1", "platform": "instagram", "titulo": "Carrossel: 5 atalhos do VS Code", "likes": 12400, "crescimento": "+180%"}
    ]

    # Se não tiver o token configurado, retorna o Plano B
    if not APIFY_TOKEN:
        return {"platform": "demo", "updated_at": datetime.utcnow().isoformat(), "items": mock_fallback}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://api.apify.com/v2/acts/clockworks~tiktok-scraper/runs?token={APIFY_TOKEN}",
                json={
                    "hashtags": ["viral", "fyp"],
                    "resultsPerPage": 5,
                    "shouldDownloadVideos": False
                },
                timeout=8.0
            )
            
            run_data = response.json()
            run_id = run_data.get("data", {}).get("id")
            
            if not run_id:
                return {"platform": "demo", "updated_at": datetime.utcnow().isoformat(), "items": mock_fallback}

            # O Vercel tem limite de 10s. Tentamos buscar por no máximo 6s.
            await_time = 0
            items = []
            while await_time < 6:
                status_res = await client.get(f"https://api.apify.com/v2/actor-runs/{run_id}?token={APIFY_TOKEN}")
                status = status_res.json().get("data", {}).get("status")
                
                if status == "SUCCEEDED":
                    dataset_id = status_res.json().get("data", {}).get("defaultDatasetId")
                    data_res = await client.get(f"https://api.apify.com/v2/datasets/{dataset_id}/items?token={APIFY_TOKEN}")
                    items = data_res.json()
                    break
                
                time.sleep(1)
                await_time += 1

            # Se não conseguir dados a tempo, usa o Plano B
            if not items:
                return {"platform": "demo", "updated_at": datetime.utcnow().isoformat(), "items": mock_fallback}

            # Formata os dados REAIS se o Apify tiver sucesso
            formatted_items = []
            for item in items:
                # Busca a descrição em vários campos possíveis
                descricao = item.get("desc") or item.get("text") or item.get("title") or "Vídeo em alta no TikTok"
                if len(descricao) > 80:
                    descricao = descricao[:80] + "..."

                formatted_items.append({
                    "id": item.get("id", ""),
                    "platform": "tiktok", # Força a plataforma para o frontend
                    "titulo": descricao,
                    "views": item.get("playCount", 0),
                    "likes": item.get("diggCount", 0),
                    "crescimento": "+Novo" 
                })

            return {
                "platform": "tiktok", 
                "updated_at": datetime.utcnow().isoformat(),
                "items": formatted_items
            }

    except Exception as e:
        # Se der qualquer erro na requisição, retorna o Plano B
        return {"platform": "demo", "updated_at": datetime.utcnow().isoformat(), "items": mock_fallback}

# --- ROTA DE HORÁRIOS (MANTIDA MOCK POR ENQUANTO) ---
@app.get("/best-times")
@app.get("/api/best-times")
def best_times(platform: str = Query("instagram"), format: str = Query("reels")):
    dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
    horas = [6, 9, 12, 15, 18, 21]
    heatmap = [{"dia": d, "hora": h, "score": (i * 7 + j * 11) % 60 + 40}
               for i, d in enumerate(dias) for j, h in enumerate(horas)]
    return {"platform": platform, "format": format, "heatmap": heatmap}

# --- ROTA DE ANÁLISE (MANTIDA MOCK POR ENQUANTO) ---
@app.get("/analyze")
@app.get("/api/analyze")
def analyze(username: str = Query(...), platform: str = Query("instagram")):
    return {
        "username": username, "platform": platform,
        "status": "mock",
        "message": "Análise real requer Meta Graph API.",
        "suggested_times": ["Qua 12:00", "Qui 09:00", "Sex 18:00"],
        "suggested_formats": ["Reels", "Carrossel"],
    }
