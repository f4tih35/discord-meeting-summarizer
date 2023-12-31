import os
import re
import wave


def custom_sort(file_name):
    numbers = re.findall(r'^\d+', file_name)
    return int(numbers[0]) if numbers else 0


def combine_pcm_files(directory, output_pcm_file):
    pcm_files = sorted([f for f in os.listdir(directory) if f.endswith('.pcm')], key=custom_sort)

    with open(output_pcm_file, 'wb') as outfile:
        for filename in pcm_files:
            with open(os.path.join(directory, filename), 'rb') as infile:
                outfile.write(infile.read())


def pcm_to_wav(pcm_file, wav_file, channels=2, bit_depth=16, sampling_rate=48000):
    with open(pcm_file, 'rb') as pcmfile:
        pcm_data = pcmfile.read()

    with wave.open(wav_file, 'wb') as wavfile:
        wavfile.setnchannels(channels)
        wavfile.setsampwidth(bit_depth // 8)
        wavfile.setframerate(sampling_rate)
        wavfile.writeframes(pcm_data)


def process_audio_files(file_path):
    combined_pcm = 'combined.pcm'
    combined_wav = 'combined.wav'

    combine_pcm_files(file_path, combined_pcm)
    pcm_to_wav(combined_pcm, combined_wav)

    print(f"Converted combined PCM to {combined_wav}")


def start_processor(file_path):
    combined_pcm = 'combined.pcm'
    combined_wav = 'combined.wav'

    combine_pcm_files(file_path, combined_pcm)
    pcm_to_wav(combined_pcm, combined_wav)

    print(f"Converted combined PCM to {combined_wav}")


if __name__ == '__main__':
    start_processor('/path/to/recordings')
