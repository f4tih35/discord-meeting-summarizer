from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)


class Entity(db.Model):
    __tablename__ = 'entities'
    id = db.Column(db.Integer, primary_key=True)
    sound_file_path = db.Column(db.String)
    text_file_path = db.Column(db.String)


@app.route('/process/<entity_id>', methods=['GET'])
def process(entity_id):
    if not entity_id:
        return jsonify({'error': 'Entity id required'}), 404

    entity = Entity.query.filter(Entity.id == entity_id).first()

    if entity is None:
        return jsonify({'error': 'Entity not found'}), 404

    return jsonify({'id': entity.id, 'message': "Processing..."})


if __name__ == '__main__':
    app.run()
