from db.supabase_client import supabase

def score_prediction(prediction, home_team, away_team, home_score, away_score):
    predicted_winner = prediction['predicted_winner']
    pred_home = prediction.get('predicted_home_score')
    pred_away = prediction.get('predicted_away_score')

    # Determine actual winner
    if home_score > away_score:
        actual_winner = home_team
    elif away_score > home_score:
        actual_winner = away_team
    else:
        actual_winner = 'Draw'

    is_correct = predicted_winner == actual_winner

    # Points logic
    if pred_home is not None and pred_away is not None:
        if pred_home == home_score and pred_away == away_score:
            points = 5  # Exact scoreline
        elif is_correct:
            points = 3  # Correct winner
        else:
            points = 0
    elif is_correct:
        points = 3
    else:
        points = 0

    supabase.table('predictions').update({
        'is_correct': is_correct,
        'points_earned': points
    }).eq('id', prediction['id']).execute()

    return points