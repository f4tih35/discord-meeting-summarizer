import whisper


def first():
    model = whisper.load_model("base")
    text = model.transcribe("/Users/fatihmelihersoy/repos/fatih-repos/GitHub/discord-meeting-summarizer/processors/combined.wav").get('text')
    print(text)

def second():
    file_path = "/Users/fatihmelihersoy/repos/fatih-repos/GitHub/discord-meeting-summarizer/processors/output.txt"
    model = whisper.load_model("base")

    with open(file_path, "w") as file:
        text = model.transcribe("/Users/fatihmelihersoy/repos/fatih-repos/GitHub/discord-meeting-summarizer/processors/1-672774348050006037.wav").get('text')
        print('672774348050006037: ' + text)
        file.write(f'672774348050006037: {text}\n')
        text = model.transcribe("/Users/fatihmelihersoy/repos/fatih-repos/GitHub/discord-meeting-summarizer/processors/2-954419367637041274.wav").get('text')
        print('954419367637041274: ' + text)
        file.write(f'954419367637041274: {text}\n')
        text = model.transcribe("/Users/fatihmelihersoy/repos/fatih-repos/GitHub/discord-meeting-summarizer/processors/3-954419367637041274.wav").get('text')
        print('954419367637041274: ' + text)
        file.write(f'954419367637041274: {text}\n')
        text = model.transcribe("/Users/fatihmelihersoy/repos/fatih-repos/GitHub/discord-meeting-summarizer/processors/4-954419367637041274.wav").get('text')
        print('954419367637041274: ' + text)
        file.write(f'954419367637041274: {text}\n')
        text = model.transcribe("/Users/fatihmelihersoy/repos/fatih-repos/GitHub/discord-meeting-summarizer/processors/5-672774348050006037.wav").get('text')
        print('672774348050006037: ' + text)
        file.write(f'672774348050006037: {text}\n')
        text = model.transcribe("/Users/fatihmelihersoy/repos/fatih-repos/GitHub/discord-meeting-summarizer/processors/6-954419367637041274.wav").get('text')
        print('954419367637041274: ' + text)
        file.write(f'954419367637041274: {text}\n')
        text = model.transcribe("/Users/fatihmelihersoy/repos/fatih-repos/GitHub/discord-meeting-summarizer/processors/7-672774348050006037.wav").get('text')
        print('672774348050006037: ' + text)
        file.write(f'672774348050006037: {text}\n')
        text = model.transcribe("/Users/fatihmelihersoy/repos/fatih-repos/GitHub/discord-meeting-summarizer/processors/8-954419367637041274.wav").get('text')
        print('954419367637041274: ' + text)
        file.write(f'954419367637041274: {text}\n')
        text = model.transcribe("/Users/fatihmelihersoy/repos/fatih-repos/GitHub/discord-meeting-summarizer/processors/9-672774348050006037.wav").get('text')
        print('672774348050006037: ' + text)
        file.write(f'672774348050006037: {text}\n')
        text = model.transcribe("/Users/fatihmelihersoy/repos/fatih-repos/GitHub/discord-meeting-summarizer/processors/10-954419367637041274.wav").get('text')
        print('954419367637041274: ' + text)
        file.write(f'954419367637041274: {text}\n')
        text = model.transcribe("/Users/fatihmelihersoy/repos/fatih-repos/GitHub/discord-meeting-summarizer/processors/11-672774348050006037.wav").get('text')
        print('672774348050006037: ' + text)
        file.write(f'672774348050006037: {text}\n')

# chatgpt kullanarak bir summarizer yapacağım verdiğim textin özetini çıkaracak api key elimde var. python kodunu yaz
if __name__ == '__main__':
    first()





"""
Selamünaleyküm. Ağrıf. Ağrıf iklimselam ağrı. Nasılsın? Ağrı ne hatırını soruyorum sen? Ben de iyiyim. Ne haber? Peki sen niye roba ut gibi konuşuyorsun? Ya şimdi olur da bunu eeye sokarsak. Anlasın hani? Kelimeleri falan. O yüzden. Yok yok o kitpaneler kelimeleri çok dinledik. Tutabiliyor kan kese sen rahat ol. Eee iyi. Tamam yeter bu kadar şimdi. Stop yapalım.


"""