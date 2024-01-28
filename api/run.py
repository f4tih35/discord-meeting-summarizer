from flask import Flask
from config import Config
from models import db
from utils import Utils

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)


@app.route('/process/<entity_id>', methods=['GET'])
def process(entity_id):
    response = Utils.process_recording(entity_id)
    return response


if __name__ == '__main__':
    app.run()
