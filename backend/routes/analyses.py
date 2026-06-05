from flask import Blueprint, request, jsonify
from db.supabase_client import supabase

analyses_bp = Blueprint('analyses', __name__)

@analyses_bp.route('/', methods=['POST'])
def create_analysis():
    data = request.json
    if not data.get('user_id') or not data.get('match_id') or not data.get('analysis_text'):
        return jsonify({'success': False, 'error': 'user_id, match_id and analysis_text are required'}), 400
    if len(data['analysis_text']) < 100:
        return jsonify({'success': False, 'error': 'Analysis must be at least 100 characters'}), 400
    result = supabase.table('analyses').insert({
        'user_id': data['user_id'],
        'match_id': data['match_id'],
        'analysis_text': data['analysis_text']
    }).execute()
    return jsonify({'success': True, 'data': result.data[0]}), 201

@analyses_bp.route('/', methods=['GET'])
def get_analyses():
    match_id = request.args.get('match_id')
    user_id = request.args.get('user_id')
    query = supabase.table('analyses').select('*').order('created_at', desc=True)
    if match_id:
        query = query.eq('match_id', match_id)
    if user_id:
        query = query.eq('user_id', user_id)
    result = query.execute()
    return jsonify({'success': True, 'data': result.data})