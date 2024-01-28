import os
import re
import wave
import whisper
from models import db, Entity
from flask import jsonify


class Utils:
    @staticmethod
    def process_recording(entity_id):
        def __custom_sort(file_name):
            numbers = re.findall(r'^\d+', file_name)
            return int(numbers[0]) if numbers else 0

        if entity_id:
            entity = Entity.query.filter(Entity.id == entity_id).first()
            if entity:
                # combine pcm files
                file_path = entity.pcms_file_path
                pcm_files = sorted([f for f in os.listdir(file_path) if f.endswith('.pcm')], key=__custom_sort)
                combined_pcm = file_path + '/combined.pcm'
                with open(combined_pcm, 'wb') as outfile:
                    for filename in pcm_files:
                        with open(os.path.join(file_path, filename), 'rb') as infile:
                            outfile.write(infile.read())

                # convert pcm to wav
                channels = 2
                bit_depth = 16
                sampling_rate = 48000

                with open(combined_pcm, 'rb') as pcmfile:
                    pcm_data = pcmfile.read()

                combined_wav = file_path + '/combined.wav'
                with wave.open(combined_wav, 'wb') as wavfile:
                    wavfile.setnchannels(channels)
                    wavfile.setsampwidth(bit_depth // 8)
                    wavfile.setframerate(sampling_rate)
                    wavfile.writeframes(pcm_data)

                # save pcm and wav paths to db
                entity.pcm_file_path = combined_pcm
                entity.wav_file_path = combined_wav
                db.session.commit()

                # voice to text
                model = whisper.load_model("base")
                text = model.transcribe(combined_wav).get('text')

                response = {'is_success': True, 'message': 'Success', 'response_code': 200, 'data': text}
            else:
                response = {'is_success': False, 'message': 'Recording not found.', 'response_code': 400, 'data': None}
        else:
            response = {'is_success': False, 'message': 'Entity id required.', 'response_code': 400, 'data': None}

        return jsonify(response)
