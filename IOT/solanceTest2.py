import certifi
import paho.mqtt.client as mqtt
from time import sleep
import io
import subprocess
import threading
import queue
import wave
import numpy as np
from google.cloud import speech_v1p1beta1 as speech
import simpleaudio as sa
import pymongo
from openai import OpenAI
from datetime import datetime
from dateutil import parser
from gtts import gTTS
from pydub import AudioSegment
import json;
from google.oauth2 import service_account
import geocoder

username="solace-cloud-client"
password="ggkm4e7ookoujmbnngjrjcl1pg"
host="mr-connection-7xb77sv49db.messaging.solace.cloud"

def on_connect(solace_client, userdata, flags, rc):
    print("connected")
    #client.publish("conversations", payload="new user connected")

def get_location():
    current_location=geocoder.ip('me')
    latitude,longitude=current_location.latlng
    location = { "latitude" : latitude,
                 "longitude": longitude}
    
    solace_client.publish("/location",json.dumps(location))
    
    
    
    
def on_message(solace_client, userdata, message):
        
    print(f'{message.topic}, {message.payload}')


solace_client = mqtt.Client(transport="websockets")
solace_client.on_connect = on_connect
solace_client.on_message = on_message
solace_client.tls_set(ca_certs=certifi.where())
solace_client.username_pw_set(username, password)
solace_client.connect(host,  port=8443)

solace_client.loop_start()


CONNECTION_STRING = "mongodb+srv://athavanth5:B5kyEZwIsa5nKudY@nurocluster.nklr1tm.mongodb.net/?retryWrites=true&w=majority"
# connect to your Atlas cluster
mongo_client = pymongo.MongoClient(CONNECTION_STRING)

openAIclient = OpenAI(api_key="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")

credentials = service_account.Credentials.from_service_account_file("./auth.json")
scoped_credentials = credentials.with_scopes(["https://www.googleapis.com/auth/cloud-platform"])

# Define a queue for audio chunks
audio_queue = queue.Queue()
SAMPLINGRATE = 8000

client = speech.SpeechClient(credentials=credentials)

def _get_microphone_name():
    """
    Retrieve the microphone name in Windows .
    """
    command = ["ffmpeg", "-list_devices", "true", "-f", "alsa", "-i", ""]

    try:
        ffmpeg_devices = subprocess.run(command, text=True, stderr=subprocess.PIPE, encoding="utf-8")
        microphone_lines = [line for line in ffmpeg_devices.stderr.splitlines() if "(audio)" in line]

        if microphone_lines:
            microphone_name = microphone_lines[0].split('"')[1]
            print(f"Using microphone: {microphone_name}")
            return f"audio={microphone_name}"
    except FileNotFoundError:
        print("ffmpeg was not found. Please install it or make sure it is in your system PATH.")

    return "default"

def get_database():
    return mongo_client['NURO']

def play_audio(mytext):  
    # Language in which you want to convert 
    language = 'en'
      
    # Passing the text and language to the engine,  
    # here we have marked slow=False. Which tells  
    # the module that the converted audio should  
    # have a high speed 
    myobj = gTTS(text=mytext, lang=language, slow=False) 
      
    # Saving the converted audio in a mp3 file named 
    # welcome  
    myobj.save("welcome.mp3") 
      
    # Playing the converted file 
    os.system("mpg321 welcome.mp3")

def add_conversation(sentence, currentspeaker):
    dbname = get_database()
    now_date = str(datetime.now())
    new_convo=[
      {
        "timestamp": now_date,
        "context": f"sentence: '{sentence}', speaker_tag: {currentspeaker}"
        }
    ]
    dbname['Events'].insert_many(new_convo)
    solance_convo = {"speaker_tag": currentspeaker, "context": sentence}
    solace_client.publish("/conversation",json.dumps(solance_convo))
    print(sentence)

def audio_capture(ffmpeg_command, chunk_len):
    """Capture audio data from FFmpeg and enqueue it."""
    with subprocess.Popen(ffmpeg_command, stdout=subprocess.PIPE) as ffmpeg_process:
        while True:
            raw = ffmpeg_process.stdout.read(chunk_len)
            if raw == b"":
                break
            audio_queue.put(raw)
    audio_queue.put(None)  # Signal that capturing is done

def audio_processing():
    """Dequeue and process audio data."""
    get_initial = False
    current_speaker = None
    sentence = ""
    while True:
        raw = audio_queue.get()
        if raw is None:  # Check for the signal to stop processing
            break
        
        with wave.open('new_output.wav', 'wb') as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(SAMPLINGRATE)
            wav_file.writeframesraw(raw)
        
        # Assuming diarization_pipeline and asr_pipeline can handle the file directly
            
        if (not get_initial):
            duplicate_wav_wave('new_output.wav', 'temp_output.wav')
            get_initial = True
            
        files = ["temp_output.wav", "new_output.wav"]
        append_wav_files("output2.wav", files)
        sentence, current_speaker = detect_speakers("output2.wav",current_speaker, sentence)
        
        audio_queue.task_done()

def duplicate_wav_wave(source_path, destination_path):
    with wave.open(source_path, 'rb') as source_wave:
        params = source_wave.getparams()
        audio_data = source_wave.readframes(params.nframes)
        
        with wave.open(destination_path, 'wb') as destination_wave:
            destination_wave.setparams(params)
            destination_wave.writeframes(audio_data)

def detect_speakers(speech_file,current_speaker, sentence):


    with open(speech_file, "rb") as audio_file:
        content = audio_file.read()

    # wave_obj = sa.WaveObject.from_wave_file(speech_file)
    # play_obj = wave_obj.play()
    # play_obj.wait_done()

    audio = speech.RecognitionAudio(content=content)

    diarization_config = speech.SpeakerDiarizationConfig(
        enable_speaker_diarization=True,
        min_speaker_count=1,
        max_speaker_count=2, #CHANGE THIS AS NEEDED
    )

    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=SAMPLINGRATE,
        language_code="en-US",
        diarization_config=diarization_config,
    )

    #print("Waiting for operation to complete...")
    response = client.recognize(config=config, audio=audio)
    # The transcript within each result is separate and sequential per result.
    # However, the words list within an alternative includes all the words
    # from all the results thus far. Thus, to get all the words with speaker
    # tags, you only have to take the words list from the last result:
    
    result = response.results
    
    if (len(result) == 0):
        return sentence, current_speaker;
    else:
        result= result[-1]
    words_info = result.alternatives[0].words
    # print(words_info)
    # Printing out the output:
    latestTimestamp=15
    gotNewWord= False
    forgot=False

    for word_info in words_info:
        if (word_info.start_time.seconds<15):
            continue;
        gotNewWord=True;
        if (word_info.word =="forgot"):
            forgot=True;
        if current_speaker is None:
            # First word, so set the current_speaker and start the sentence
            current_speaker = word_info.speaker_tag
            sentence = word_info.word
        elif current_speaker != word_info.speaker_tag:
            # Speaker has changed, print the previous sentence and reset
            #print(repetition)
            if (len(sentence) != 0):
                print(f"sentence {sentence} current_speaker {current_speaker}")
                add_conversation(sentence, current_speaker)
                
            current_speaker = word_info.speaker_tag
            sentence = word_info.word  # Start new sentence with the new speaker's first word
        else:
            # Same speaker, continue the sentence
            if (word_info.start_time.seconds - latestTimestamp > 2):
                print(f"sentence {sentence} current_speaker {current_speaker}")
                add_conversation(sentence, current_speaker)
                sentence = word_info.word
            sentence += " " + word_info.word
            latestTimestamp = word_info.start_time.seconds
        
    if(forgot):
        askChatGPT(sentence, current_speaker)
        solace_client.publish("/forgot","true")
    if(not gotNewWord):
        print(f"sentence {sentence} current_speaker {current_speaker}")
        add_conversation(sentence, current_speaker)
        sentence=""

    return sentence , current_speaker

def testing_forgot():
    solace_client.publish("/forgot",payload = "true")
    print("publisjhing forogt")


def play_audio_async(text_to_speak):
    # Generate speech using gTTS
    tts = gTTS(text=text_to_speak, lang='en')
    mp3_fp = io.BytesIO()
    tts.write_to_fp(mp3_fp)
    mp3_fp.seek(0)
    
    # Convert MP3 to WAV in memory
    mp3_audio = AudioSegment.from_file(mp3_fp, format="mp3")
    wav_fp = io.BytesIO()
    mp3_audio.export(wav_fp, format="wav")
    wav_fp.seek(0)

    # Use the wave module to read the WAV data correctly
    with wave.open(wav_fp, 'rb') as wave_read:
        wave_obj = sa.WaveObject.from_wave_read(wave_read)
        play_obj = wave_obj.play()
        play_obj.wait_done()

def get_embedding(text_to_embed):
    response = openAIclient.embeddings.create(model= "text-embedding-ada-002", input=[text_to_embed]).data[0].embedding
    return response

def getVectorDBRespone(sentence):
    pipeline = [
    {
        '$vectorSearch': {
        'index': 'eventsContextIndex', 
        'path': 'context_embedding', 
        'queryVector': get_embedding(sentence), 
        'numCandidates': 200, 
        'limit': 10
        }
    }, {
        '$project': {
        '_id': 0, 
        'timestamp': 1, 
        'context': 1, 
        # 'score': {
        #     '$meta': 'vectorSearchScore'
        # }
        }
    }
    ]
    # run pipeline
    result = mongo_client["NURO"]["Events"].aggregate(pipeline)


    returnValue = ""
    for i in result:
        returnValue += json.dumps(i)
    
    return returnValue

def askChatGPT(sentence, currentspeaker):

    NURO_intro = "Hello, Athavan. I am NURO, your wearable Memory Aid Assistant. I can remind you what you forgot."

    # Create and start a new thread for the audio playback
    thread = threading.Thread(target=play_audio_async, args=(NURO_intro,))
    thread.start()

    print("I FORGOT")

    background = getVectorDBRespone(sentence)

    messages = []

    messages.append({"role": "system", "content": " You are a medical AI assistant named NURO helping dementia patients. Your role is similar to Google Home and Alexa. As an assistant, you need to help the patient based from their past conversations, reminders and background information which are provided. Also assume speaker tag 1 is the patient."})

    messages.append({"role":"user","content":"backgroundInformation:"+ background + "question:"+ sentence})

    completion = openAIclient.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=messages)
    reply = completion.choices[0].message.content
    messages.append({"role": "assistant", "content":reply})
    print(reply)
    while (thread.is_alive()):
        continue;
    
    thread = threading.Thread(target=play_audio_async, args=(reply,))
    thread.start()

    return "Print"





def append_wav_files(output_filename, input_filenames):
    # Open the first input file to get the parameters
    with wave.open(input_filenames[0], 'rb') as wave_file:
        params = wave_file.getparams()
        
    # Open the output file with the same parameters as the input files
    with wave.open(output_filename, 'wb') as output_wave:
        output_wave.setparams(params)
        
        # Loop through each input file and append its frames to the output file
        for filename in input_filenames:
            with wave.open(filename, 'rb') as input_wave:
                while True:
                    frames = input_wave.readframes(1024)
                    if not frames:
                        break
                    output_wave.writeframes(frames)

def main():
    ffmpeg_command = [
        "ffmpeg",
        "-f", "alsa",
        "-i", "default",  # Assume this function is defined elsewhere
        "-ac", "1",
        "-ar", str(SAMPLINGRATE),
        "-f", "wav",
        "-fflags", "nobuffer",
        "-hide_banner",
        #"-loglevel", "quiet",
        "pipe:1",
    ]

    chunk_len = int(round(SAMPLINGRATE * 15)) * 2  # 10 seconds of audio

    get_location()
    # Start the audio capture thread
    #on_message()
    capture_thread = threading.Thread(target=audio_capture, args=(ffmpeg_command, chunk_len))
    capture_thread.start()

    # Start the audio processing thread
    processing_thread = threading.Thread(target=audio_processing)
    processing_thread.start()


    # Wait for both threads to complete
    capture_thread.join()
    processing_thread.join()
    
if __name__ == "__main__":
    #result = get_database()['NURO']['Events'].delete_many({})
    #print(result)
    #getVectorDBRespone("hello")
    #on_message()
    main()
    
    #testing_forgot()






#while True:
    
#    print("x")
#    sleep(5)
