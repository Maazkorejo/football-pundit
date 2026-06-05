from flask import Blueprint, request, jsonify
from db.supabase_client import supabase

matches_bp = Blueprint('matches', __name__)

@matches_bp.route('/', methods=['GET'])
def get_matches():
    status = request.args.get('status')
    query = supabase.table('matches').select('*').order('match_date')
    if status:
        query = query.eq('status', status)
    result = query.execute()
    return jsonify({'success': True, 'data': result.data})

@matches_bp.route('/<int:match_id>', methods=['GET'])
def get_match(match_id):
    match = supabase.table('matches').select('*').eq('id', match_id).execute()
    if not match.data:
        return jsonify({'success': False, 'error': 'Match not found'}), 404
    takes = supabase.table('hot_takes').select('*').eq('match_id', match_id).execute()
    analyses = supabase.table('analyses').select('*').eq('match_id', match_id).execute()
    predictions = supabase.table('predictions').select('*').eq('match_id', match_id).execute()
    return jsonify({'success': True, 'data': {
        'match': match.data[0],
        'hot_takes': takes.data,
        'analyses': analyses.data,
        'predictions': predictions.data
    }})