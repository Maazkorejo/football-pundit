from flask import Blueprint, request, jsonify
from db.supabase_client import supabase

predictions_bp = Blueprint('predictions', __name__)

@predictions_bp.route('/', methods=['POST'])
def create_prediction():
    data = request.json
    if not data.get('user_id') or not data.get('match_id') or not data.get('predicted_winner'):
        return jsonify({'success': False, 'error': 'user_id, match_id and predicted_winner are required'}), 400
    result = supabase.table('predictions').insert({
        'user_id': data['user_id'],
        'match_id': data['match_id'],
        'predicted_winner': data['predicted_winner'],
        'predicted_home_score': data.get('predicted_home_score'),
        'predicted_away_score': data.get('predicted_away_score'),
        'reasoning': data.get('reasoning')
    }).execute()
    return jsonify({'success': True, 'data': result.data[0]}), 201

@predictions_bp.route('/', methods=['GET'])
def get_predictions():
    match_id = request.args.get('match_id')
    user_id = request.args.get('user_id')
    query = supabase.table('predictions').select('*').order('created_at', desc=True)
    if match_id:
        query = query.eq('match_id', match_id)
    if user_id:
        query = query.eq('user_id', user_id)
    result = query.execute()
    return jsonify({'success': True, 'data': result.data})