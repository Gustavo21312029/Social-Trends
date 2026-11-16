"""Social Trends: amostras por hashtag com fallback explicitamente demonstrativo."""
import asyncio
import json
import os
import time
from datetime import datetime, timezone
from pathlib import Path

import httpx
from fastapi import FastAPI, Query

app = FastAPI(title="Social Trends API", version="1.0.0")
PLATFORMS = {"all", "tiktok", "instagram", "x", "youtube", "facebook"}
NICHOS = {
    "tecnologia": ["tecnologia", "programacao", "inteligenciaartificial"],
    "fitness": ["fitness", "treino", "saude"],
    "culinaria": ["receita", "culinaria", "gastronomia"],
    "marketing": ["marketingdigital", "empreendedorismo", "negocios"],
    "viagem": ["viagem", "turismo", "destinos"],
    "moda": ["moda", "beleza", "estilo"],
    "games": ["games", "gamer", "gameplay"],
    "esportes": ["esportes", "futebol", "basquete"],
    "filmes": ["filmes", "series", "cinema"],
    "musica": ["musica", "show", "festival"],
}
DEMO_PATH = Path(__file__).resolve().parent.parent / "public" / "demo-data.json"
DEMO_ITEMS = json.loads(DEMO_PATH.read_text(encoding="utf-8"))["items"]
CACHE = {}


def demo_items(platform, nicho, days):
    return [item for item in DEMO_ITEMS
            if (platform == "all" or item["platform"] == platform)
            and (nicho == "all" or item["nicho"] == nicho)
            and item["age_days"] < days]


async def fetch_from_apify(actor_id, input_data):
    """One bounded synchronous Actor request. Credentials never enter responses."""
    token = os.getenv("APIFY_TOKEN")
    if not token:
        return []
    try:
        async with httpx.AsyncClient(timeout=9.0) as client:
            response = await client.post(
                f"https://api.apify.com/v2/acts/{actor_id}/run-sync-get-dataset-items",
                headers={"Authorization": f"Bearer {token}"},
                params={"timeout": 7, "format": "json"},
                json=input_data,
            )
            response.raise_for_status()
            data = response.json()
            return data if isinstance(data, list) else []
    except (httpx.HTTPError, ValueError):
        return []


def nonnegative_number(value):
    try:
        return max(0, int(value or 0))
    except (TypeError, ValueError, OverflowError):
        return 0


def published_age(value):
    try:
        if isinstance(value, (int, float)):
            published = datetime.fromtimestamp(value, tz=timezone.utc)
        else:
            published = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
            if published.tzinfo is None:
                published = published.replace(tzinfo=timezone.utc)
        return max(0, (datetime.now(timezone.utc) - published).total_seconds() / 86400)
    except (TypeError, ValueError, OverflowError, OSError):
        return None


async def live_platform(platform, nicho, days):
    tags = NICHOS[nicho]
    if platform == "tiktok":
        actor = os.getenv("TIKTOK_ACTOR_ID", "clockworks~tiktok-scraper")
        payload = {"hashtags": tags, "resultsPerPage": 15, "shouldDownloadVideos": False}
    else:
        actor = os.getenv("INSTAGRAM_ACTOR_ID", "apify~instagram-scraper")
        payload = {"directUrls": [f"https://www.instagram.com/explore/tags/{tag}/" for tag in tags],
                   "resultsType": "posts", "resultsLimit": 15}
    raw = await fetch_from_apify(actor, payload)
    output = []
    for index, item in enumerate(raw):
        if not isinstance(item, dict):
            continue
        age = published_age(item.get("createTime") if platform == "tiktok" else item.get("timestamp"))
        # Without a date, the publication cannot substantiate the selected period.
        if age is None or age >= days:
            continue
        title = item.get("text") or item.get("desc") or item.get("caption") or "Publicação sobre #" + tags[0]
        if isinstance(title, dict):
            title = title.get("text", "Publicação")
        author = item.get("authorMeta") or {}
        if not isinstance(author, dict):
            author = {}
        views = item.get("playCount") if platform == "tiktok" else item.get("videoViewCount", item.get("videoPlayCount"))
        url = item.get("webVideoUrl") if platform == "tiktok" else item.get("url")
        output.append({
            "id": platform + "-" + str(item.get("id", index)), "platform": platform,
            "nicho": nicho, "titulo": str(title)[:160], "description": str(title)[:1000],
            "views": nonnegative_number(views) if views is not None else None,
            "likes": nonnegative_number(item.get("diggCount") if platform == "tiktok" else item.get("likesCount")),
            "creator": "@" + str(author.get("name") or item.get("ownerUsername") or "criador").lstrip("@"),
            "format": "Vídeo curto" if platform == "tiktok" else "Publicação",
            "image": "assets/" + nicho + ".jpg", "image_alt": "Imagem ilustrativa do nicho",
            "url": url, "age_days": age, "source": "live",
        })
    return output


@app.get("/trending")
@app.get("/api/trending")
async def trending(
    platform: str = Query("all", pattern="^(all|tiktok|instagram|x|youtube|facebook)$"),
    nicho: str = Query("all", pattern="^(all|tecnologia|fitness|culinaria|marketing|viagem|moda|games|esportes|filmes|musica)$"),
    days: int = Query(7, ge=1, le=30),
):
    key = (platform, nicho, days)
    cached = CACHE.get(key)
    if cached and time.monotonic() - cached[0] < 900:
        return cached[1]
    # A specific niche is required for meaningful hashtag collection. Unsupported
    # platforms and the aggregate niche use the explicitly labeled demo catalog.
    can_collect = os.getenv("APIFY_TOKEN") and nicho != "all" and platform in {"all", "tiktok", "instagram"}
    items = []
    if can_collect:
        selected = ["tiktok", "instagram"] if platform == "all" else [platform]
        batches = await asyncio.gather(*(live_platform(p, nicho, days) for p in selected))
        items = [item for batch in batches for item in batch]
    source = "live" if items else "demo"
    if not items:
        items = demo_items(platform, nicho, days)
    # Deduplicate collected posts before ranking the available sample.
    items = list({item["id"]: item for item in items}.values())
    result = {"platform": platform, "nicho": nicho, "days": days, "source": source,
              "scope": "hashtag_sample" if source == "live" else "illustrative_examples",
              "updated_at": datetime.now(timezone.utc).isoformat(),
              "items": sorted(items, key=lambda x: x["views"] or 0, reverse=True)}
    CACHE[key] = (time.monotonic(), result)
    return result


@app.get("/best-times")
@app.get("/api/best-times")
def best_times(platform: str = Query("instagram"), format: str = Query("reels")):
    days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
    hours = [6, 9, 12, 15, 18, 21]
    return {"source": "demo", "platform": platform, "format": format,
            "heatmap": [{"dia": day, "hora": hour, "score": (i * 7 + j * 11) % 60 + 40}
                        for i, day in enumerate(days) for j, hour in enumerate(hours)]}


@app.get("/analyze")
@app.get("/api/analyze")
def analyze(username: str = Query(..., min_length=1, max_length=80), platform: str = Query("instagram")):
    return {"username": username, "platform": platform, "status": "not_connected",
            "message": "A análise personalizada requer uma integração com os insights da sua conta.",
            "suggested_times": [], "suggested_formats": []}
