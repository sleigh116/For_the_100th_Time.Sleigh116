# This file can be empty or contain package-level initialization code

from flask import Flask
from .home import home_bp
from .solar import solar_bp

def register_routes(app: Flask):
    # Register blueprints with unique names
    app.register_blueprint(home_bp, url_prefix="/api/home")
    app.register_blueprint(solar_bp, url_prefix="/api")
