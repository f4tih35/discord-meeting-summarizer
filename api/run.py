import os
import subprocess

import rq_dashboard
from flask import Flask, request, jsonify
from flask_rq2 import RQ

app = Flask(__name__)
app.config.from_object('config.Config')
rq = RQ(app)
app.register_blueprint(rq_dashboard.blueprint, url_prefix="/rq")


@rq.job
def process_audio_file(file_path):
    try:
        subprocess.run(["python", "processor/processor.py", file_path], check=True)
    except subprocess.SubprocessError as e:
        print(f"An error occurred during processing: {e}")


@app.route('/process-audio', methods=['POST'])
def process_audio():
    data = request.get_json()
    if not data or 'file_path' not in data:
        return jsonify({'error': 'File path not provided'}), 400

    file_path = data['file_path']

    if not os.path.exists(file_path):
        return jsonify({'error': 'File not found at the provided path'}), 404

    job = process_audio_file.queue(file_path)
    return jsonify({'message': 'Processing queued', 'job_id': job.id})


if __name__ == '__main__':
    app.run(debug=app.config['DEBUG'])
