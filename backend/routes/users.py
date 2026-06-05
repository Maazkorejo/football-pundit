from flask import Blueprint, request, jsonify
from db.supabase_client import supabase

users_bp = Blueprint('users', __name__)

# Register new user
@users_bp.route('/', methods=['POST'])
def create_user():
    data = request.json
    required = ['name', 'favorite_club', 'favorite_player', 'favorite_international_team']
    for field in required:
        if not data.get(field):
            return jsonify({'success': False, 'error': f'{field} is required'}), 400

    result = supabase.table('users').insert({
        'name': data['name'],
        'favorite_club': data['favorite_club'],
        'favorite_player': data['favorite_player'],
        'favorite_international_team': data['favorite_international_team'],
        'email': data.get('email', None)
    }).execute()

    return jsonify({'success': True, 'data': result.data[0]}), 201

# Get all users
@users_bp.route('/', methods=['GET'])
def get_users():
    result = supabase.table('users').select('*').execute()
    return jsonify({'success': True, 'data': result.data})

# Get single user
@users_bp.route('/<user_id>', methods=['GET'])
def get_user(user_id):
    result = supabase.table('users').select('*').eq('id', user_id).execute()
    if not result.data:
        return jsonify({'success': False, 'error': 'User not found'}), 404
    return jsonify({'success': True, 'data': result.data[0]})