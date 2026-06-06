from apscheduler.schedulers.background import BackgroundScheduler
from db.supabase_client import supabase
from services.football_api import get_fixture
from services.mistral_ai import score_content
from services.scoring import score_prediction
import time

def process_finished_matches():
    print("Scheduler: checking matches...")
    try:
        matches = supabase.table('matches')\
            .select('*')\
            .in_('status', ['Live', 'Upcoming', 'Finished'])\
            .eq('ai_processed', False)\
            .execute().data

        for match in matches:
            print(f"Checking match {match['id']}: {match['home_team']} vs {match['away_team']}")

            if match['status'] != 'Finished':
                result = get_fixture(match['id'])
                if not result or not result['is_finished']:
                    continue
                supabase.table('matches').update({
                    'status': 'Finished',
                    'home_score': result['home_score'],
                    'away_score': result['away_score'],
                }).eq('id', match['id']).execute()
                home_score = result['home_score']
                away_score = result['away_score']
            else:
                home_score = match['home_score']
                away_score = match['away_score']

            takes = supabase.table('hot_takes')\
                .select('*')\
                .eq('match_id', match['id'])\
                .is_('ai_rating', 'null')\
                .execute().data

            for take in takes:
                print(f"Scoring take {take['id']}...")
                result = score_content(
                    'hot take', take['hot_take_text'],
                    match['home_team'], match['away_team'],
                    home_score, away_score
                )
                if result:
                    supabase.table('hot_takes').update({
                        'ai_rating': result['score'],
                        'ai_roast': result['roast']
                    }).eq('id', take['id']).execute()
                time.sleep(1)

            analyses = supabase.table('analyses')\
                .select('*')\
                .eq('match_id', match['id'])\
                .is_('ai_rating', 'null')\
                .execute().data

            for analysis in analyses:
                print(f"Scoring analysis {analysis['id']}...")
                result = score_content(
                    'pre-match analysis', analysis['analysis_text'],
                    match['home_team'], match['away_team'],
                    home_score, away_score
                )
                if result:
                    supabase.table('analyses').update({
                        'ai_rating': result['score'],
                    }).eq('id', analysis['id']).execute()
                time.sleep(1)

            predictions = supabase.table('predictions')\
                .select('*')\
                .eq('match_id', match['id'])\
                .is_('is_correct', 'null')\
                .execute().data

            for pred in predictions:
                score_prediction(pred, match['home_team'], match['away_team'], home_score, away_score)

            supabase.table('matches').update({
                'ai_processed': True
            }).eq('id', match['id']).execute()

            print(f"Match {match['id']} fully processed.")

    except Exception as e:
        print(f"Scheduler error: {e}")

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(process_finished_matches, 'interval', minutes=5)
    scheduler.start()
    print("Scheduler started — checking matches every 5 minutes.")
    return scheduler