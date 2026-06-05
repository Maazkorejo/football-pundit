from flask import Blueprint, request, jsonify
from db.supabase_client import supabase

leaderboard_bp = Blueprint('leaderboard', __name__)

@leaderboard_bp.route('/tournament', methods=['GET'])
def tournament_ranking():
    users = supabase.table('users').select('*').execute().data
    rankings = []
    for user in users:
        uid = user['id']
        takes = supabase.table('hot_takes').select('ai_rating').eq('user_id', uid).execute().data
        analyses = supabase.table('analyses').select('ai_rating').eq('user_id', uid).execute().data
        predictions = supabase.table('predictions').select('points_earned').eq('user_id', uid).execute().data
        take_score = sum(t['ai_rating'] for t in takes if t['ai_rating'])
        analysis_score = sum(a['ai_rating'] for a in analyses if a['ai_rating'])
        prediction_score = sum(p['points_earned'] for p in predictions if p['points_earned'])
        total = take_score + analysis_score + prediction_score
        rankings.append({
            'user': user,
            'total_score': total,
            'take_score': take_score,
            'analysis_score': analysis_score,
            'prediction_score': prediction_score,
            'takes_posted': len(takes),
            'analyses_posted': len(analyses),
            'predictions_made': len(predictions)
        })
    rankings.sort(key=lambda x: x['total_score'], reverse=True)
    for i, r in enumerate(rankings):
        r['rank'] = i + 1
    return jsonify({'success': True, 'data': rankings})