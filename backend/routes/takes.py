from flask import Blueprint, request, jsonify
from db.supabase_client import supabase

takes_bp = Blueprint('takes', __name__)

@takes_bp.route('/', methods=['POST'])
def create_take():
    data = request.json
    if not data.get('user_id') or not data.get('match_id') or not data.get('hot_take_text'):
        return jsonify({'success': False, 'error': 'user_id, match_id and hot_take_text are required'}), 400
    if len(data['hot_take_text']) < 20:
        return jsonify({'success': False, 'error': 'Take must be at least 20 characters'}), 400
    result = supabase.table('hot_takes').insert({
        'user_id': data['user_id'],
        'match_id': data['match_id'],
        'hot_take_text': data['hot_take_text']
    }).execute()
    return jsonify({'success': True, 'data': result.data[0]}), 201

@takes_bp.route('/', methods=['GET'])
def get_takes():
    match_id = request.args.get('match_id')
    user_id = request.args.get('user_id')
    query = supabase.table('hot_takes').select('*').order('created_at', desc=True)
    if match_id:
        query = query.eq('match_id', match_id)
    if user_id:
        query = query.eq('user_id', user_id)
    result = query.execute()
    return jsonify({'success': True, 'data': result.data})