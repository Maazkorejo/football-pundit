import requests
import json
import time
from config import MISTRAL_API_KEY

MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions"

def score_content(content_type, content_text, home_team, away_team, home_score, away_score):
    prompt = f"""Match: {home_team} vs {away_team}. Final result: {home_team} {home_score} - {away_score} {away_team}.

User submitted this {content_type}: "{content_text}"

Rate this out of 10 based on accuracy vs the actual result, boldness, and insight.
Return ONLY valid JSON with no extra text:
{{"score": <integer 1-10>, "roast": "<funny roast string if score is 5 or below, otherwise null>", "reasoning": "<one sentence>"}}"""

    headers = {
        "Authorization": f"Bearer {MISTRAL_API_KEY}",
        "Content-Type": "application/json"
    }

    body = {
        "model": "mistral-large-latest",
        "messages": [
            {"role": "system", "content": "You are a brutally honest football pundit judge. Rate user takes against actual match results. Always return valid JSON only."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 200,
        "temperature": 0.7
    }

    try:
        response = requests.post(MISTRAL_URL, headers=headers, json=body, timeout=30)
        response.raise_for_status()
        content = response.json()['choices'][0]['message']['content'].strip()
        # Clean up any markdown formatting
        content = content.replace('```json', '').replace('```', '').strip()
        result = json.loads(content)
        return {
            'score': max(1, min(10, int(result.get('score', 5)))),
            'roast': result.get('roast'),
            'reasoning': result.get('reasoning', '')
        }
    except Exception as e:
        print(f"Mistral error: {e}")
        return None