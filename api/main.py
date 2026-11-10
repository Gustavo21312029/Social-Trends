"""
SocialTrends API — MVP
Roda como Vercel Serverless Function (Python 3.12).
"""
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI(title="SocialTrends API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────
# DADOS MOCK — substituir por dados reais (ver TODOs abaixo)
# ─────────────────────────────────────────────────────────────

TRENDING_MOCK = {
    "tiktok": [
        {"id": "tk1", "titulo": "POV: você descobre que o chefe leu seu WhatsApp",
         "som": "original_sound_88", "views": 1_200_000, "likes": 85_000,
         "hashtags": ["#fyp", "#viral", "#humor"], "crescimento": "+340%"},
        {"id": "tk2", "titulo": "3 erros que todo dev júnior comete",
         "som": "som_tech_viral_02", "views": 870_000, "likes": 62_000,
         "hashtags": ["#dev", "#programacao"], "crescimento": "+210%"},
    ],
    "instagram": [
        {"id": "ig1", "titulo": "Carrossel: 5 atalhos do VS Code",
         "formato": "carrossel", "likes": 12_400, "saves": 3_200,
         "compartilhamentos": 1_800, "crescimento": "+180%"},
        {"id": "ig2", "titulo": "Reel: rotina de um dev remoto",
         "formato": "reels", "likes": 24_000, "saves": 6_100,
         "compartilhamentos": 4_500, "crescimento": "+290%"},
    ],
    "x": [
        {"id": "x1", "titulo": "Thread sobre salários de dev no Brasil",
         "likes": 8_900, "retweets": 2_300, "crescimento": "+150%"},
    ],
    "facebook": [
        {"id": "fb1", "titulo": "Vídeo: dicas de produtividade com IA",
         "likes": 5_400, "compartilhamentos": 1_200, "crescimento": "+90%"},
    ],
}

def _build_heatmap():
    dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
    horas = [6, 9, 12, 15, 18, 21]
    return {
        "instagram": {
            "reels": [{"dia": d, "hora": h, "score": (i * 7 + j * 11) % 60 + 40}
                      for i, d in enumerate(dias) for j, h in enumerate(horas)],
            "posts": [{"dia": d, "hora": h, "score": (i * 5 + j * 9) % 50 + 35}
                      for i, d in enumerate(dias) for j, h in enumerate(horas)],
        },
    }

BEST_TIMES_MOCK = _build_heatmap()

# ─────────────────────────────────────────────────────────────
# ROTAS
# ─────────────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

@app.get("/api/trending")
def trending(platform: str = Query("all", pattern="^(all|tiktok|instagram|x|facebook)$"),
             limit: int = 10):
    if platform == "all":
        items = [v for lst in TRENDING_MOCK.values() for v in lst]
    else:
        items = TRENDING_MOCK.get(platform, [])
    return {"platform": platform, "count": len(items),
            "updated_at": datetime.utcnow().isoformat(),
            "items": items[:limit]}

@app.get("/api/best-times")
def best_times(platform: str = Query("instagram", pattern="^(instagram|tiktok|x|facebook)$"),
               format: str = Query("reels", pattern="^(reels|posts|stories)$")):
    data = BEST_TIMES_MOCK.get(platform, {}).get(format, [])
    return {"platform": platform, "format": format, "heatmap": data}

@app.get("/api/analyze")
def analyze(username: str = Query(..., min_length=1),
            platform: str = Query("instagram")):
    return {
        "username": username, "platform": platform,
        "status": "mock",
        "message": "Integração real pendente.",
        "suggested_times": ["Qua 12:00", "Qui 09:00", "Sex 18:00"],
        "suggested_formats": ["Reels", "Carrossel"],
    }
