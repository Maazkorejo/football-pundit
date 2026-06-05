import requests
from config import FOOTBALL_API_KEY

BASE_URL = "https://v3.football.api-sports.io"

HEADERS = {
    "x-apisports-key": FOOTBALL_API_KEY
}

def get_fixture(fixture_id):
    try:
        response = requests.get(
            f"{BASE_URL}/fixtures",
            headers=HEADERS,
            params={"id": fixture_id},
            timeout=15
        )
        response.raise_for_status()
        data = response.json()
        fixtures = data.get('response', [])
        if not fixtures:
            return None
        fixture = fixtures[0]
        status = fixture['fixture']['status']['short']
        home_score = fixture['goals']['home']
        away_score = fixture['goals']['away']
        is_finished = status in ['FT', 'AET', 'PEN']
        return {
            'is_finished': is_finished,
            'status': status,
            'home_score': home_score or 0,
            'away_score': away_score or 0,
        }
    except Exception as e:
        print(f"Football API error: {e}")
        return None