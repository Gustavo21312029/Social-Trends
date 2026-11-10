from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import httpx
import os

app = FastAPI(title="SocialTrends API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

APIFY_TOKEN = os.getenv("APIFY_TOKEN")

# --- ROTA DE TENDÊNCIAS (DADOS REAIS) ---
@app.get("/api/trending")
async def trending(platform: str = Query("all", pattern="^(all|tiktok|instagram|x|facebook)$")):
    
    # Se não tiver o token configurado, retorna um aviso
    if not APIFY_TOKEN:
        return {"items": [], "message": "APIFY_TOKEN não configurado na Vercel."}

    try:
        # Exemplo real: Buscando vídeos em alta no TikTok via Apify
        # Usamos o ator "clockworks/tiktok-scraper" que é o mais popular
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://api.apify.com/v2/acts/clockworks~tiktok-scraper/runs?token={APIFY_TOKEN}",
                json={
                    "hashtags": ["viral", "fyp", "tutorial"],
                    "resultsPerPage": 5,
                    "shouldDownloadVideos": False
                },
                timeout=30.0
            )
            
            run_data = response.json()
            run_id = run_data.get("data", {}).get("id")
            
            if not run_id:
                return {"items": [], "message": "Falha ao iniciar a busca no TikTok."}

            # O Apify leva alguns segundos para processar. 
            # Para simplificar na Vercel, vamos aguardar a conclusão.
            # (Em produção, isso seria feito via Cron Job / Background)
            import time
            await_time = 0
            items = []
            while await_time < 30:
                status_res = await client.get(f"https://api.apify.com/v2/actor-runs/{run_id}?token={APIFY_TOKEN}")
                status = status_res.json().get("data", {}).get("status")
                
                if status == "SUCCEEDED":
                    dataset_id = status_res.json().get("data", {}).get("defaultDatasetId")
                    data_res = await client.get(f"https://api.apify.com/v2/datasets/{dataset_id}/items?token={APIFY_TOKEN}")
                    items = data_res.json()
                    break
                
                time.sleep(2)
                await_time += 2

            # Formata os dados reais para o seu frontend
            formatted_items = []
            for item in items:
                formatted_items.append({
                    "id": item.get("id"),
                    "titulo": item.get("desc", "Sem descrição")[:80] + "...",
                    "views": item.get("playCount", 0),
                    "likes": item.get("diggCount", 0),
                    "crescimento": "+Novo" # APIs gratuitas não costumam dar o % de crescimento direto
                })

            return {
                "platform": "tiktok", 
                "updated_at": datetime.utcnow().isoformat(),
                "items": formatted_items
            }

    except Exception as e:
        return {"items": [], "message": f"Erro na integração: {str(e)}"}

# --- ROTA DE HORÁRIOS (MANTIDA MOCK POR ENQUANTO) ---
@app.get("/api/best-times")
def best_times(platform: str = Query("instagram"), format: str = Query("reels")):
    dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
    horas = [6, 9, 12, 15, 18, 21]
    heatmap = [{"dia": d, "hora": h, "score": (i * 7 + j * 11) % 60 + 40}
               for i, d in enumerate(dias) for j, h in enumerate(horas)]
    return {"platform": platform, "format": format, "heatmap": heatmap}

# --- ROTA DE ANÁLISE (MANTIDA MOCK POR ENQUANTO) ---
@app.get("/api/analyze")
def analyze(username: str = Query(...), platform: str = Query("instagram")):
    return {
        "username": username, "platform": platform,
        "status": "mock",
        "message": "Análise real requer Meta Graph API.",
        "suggested_times": ["Qua 12:00", "Qui 09:00", "Sex 18:00"],
        "suggested_formats": ["Reels", "Carrossel"],
    }
