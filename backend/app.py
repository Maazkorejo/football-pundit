from flask import Flask
from flask_cors import CORS
from config import FLASK_SECRET_KEY
from scheduler import start_scheduler
import os

from routes.users import users_bp
from routes.matches import matches_bp
from routes.takes import takes_bp
from routes.analyses import analyses_bp
from routes.predictions import predictions_bp
from routes.leaderboard import leaderboard_bp

app = Flask(__name__)
app.secret_key = FLASK_SECRET_KEY
CORS(app)

app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(matches_bp, url_prefix='/api/matches')
app.register_blueprint(takes_bp, url_prefix='/api/takes')
app.register_blueprint(analyses_bp, url_prefix='/api/analyses')
app.register_blueprint(predictions_bp, url_prefix='/api/predictions')
app.register_blueprint(leaderboard_bp, url_prefix='/api/leaderboard')

if __name__ == '__main__':
    if os.environ.get('WERKZEUG_RUN_MAIN') != 'true':
        start_scheduler()
    app.run(debug=True, use_reloader=True)