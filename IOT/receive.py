import certifi
import paho.mqtt.client as mqtt
from time import sleep
from gtts import gTTS
import os

username="solace-cloud-client"
password="ggkm4e7ookoujmbnngjrjcl1pg"
host="mr-connection-7xb77sv49db.messaging.solace.cloud"

def on_connect(client, userdata, flags, rc):
    print("connected")
#    client.publish("conversations", payload="new user connected")
    client.subscribe('/AIresponse/reminder')
    client.subscribe('/AIresponse/lost')
    client.subscribe('/AIresponse/caregiver')
    
    
    
def on_message(client, userdata, message):
    
    print("MESSAGE")
  
    # Language in which you want to convert 
    language = 'en'
      
    # Passing the text and language to the engine,  
    # here we have marked slow=False. Which tells  
    # the module that the converted audio should  
    # have a high speed 
    myobj = gTTS(text=str(message.payload), lang=language, slow=False) 
      
    # Saving the converted audio in a mp3 file named 
    # welcome  
    myobj.save("welcome.mp3") 
      
    # Playing the converted file 
    os.system("mpg123 welcome.mp3")
    
  

    
client = mqtt.Client(transport="websockets")
client.on_connect = on_connect
client.on_message = on_message
client.tls_set(ca_certs=certifi.where())
client.username_pw_set(username, password)
client.connect(host,  port=8443)
client.loop_forever()


