import React, { useEffect, useState } from "react";
import {Card, CardBody} from "@nextui-org/react";
import {Input} from "@nextui-org/react";
import messaging from "../Messaging";
import Paho from "paho-mqtt";

export default function App() {

  const [conversations, setConversations] = useState<any>([]);
  const [caregiver, setCaregiver] = useState("")

  function handleMessage(message:any){
    if(message.destinationName === '/conversation'){
      const conversation =JSON.parse(message.payloadString)
      setConversations([ // with a new array
        ...conversations, // that contains all the old items
        {speakerTag:conversation.speakerTag,context:conversation.context}// and one new item at the end
      ])
      
    }

  }

  function sendMessage(){
    let messageObj = new Paho.Message(`Hey this is NURO Assistant. Your caregiver wants to say ${caregiver}`);
    messageObj.destinationName = "/AIresponse/caregiver";
    messaging.send(messageObj);
  }

  const handleKeyDown = (event:any) => {
    if (event.key === 'Enter') {
      // Call a function to send the request, e.g., handleAddReminder
      sendMessage();
    }
  }

  useEffect(()=>{
    messaging.register(handleMessage);
  })

  const placements = [
    "outside-left",
  ];

  const cardStylePatient = {
    backgroundColor: "blue", // Set background color to blue
    color: "white", // Set text color to white
    zIndex: "9999" // Set z-index to ensure it appears on top of other content
  };

  const cardStyleStranger = {
    backgroundColor: "grey", // Set background color to blue
    color: "white", // Set text color to white
    zIndex: "9999" // Set z-index to ensure it appears on top of other content
  };

  const getContainerStyleStranger = (marginBottomValue: any) => ({
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: "300px",
    height: "100vh",
    marginBottom: `${marginBottomValue}px`
  });


  const getContainerStylePatient = (marginBottomValue: any) => ({
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginRight: "300px",
    height: "100vh",
    marginBottom: `${marginBottomValue}px`
  });

  const inputContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  };

  return (
    <div style={{display:'flex', flexDirection:'column', width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}}><div style={{maxWidth:1024, width:'100%', height:500, display:'flex', flexDirection:'column', overflowY:'auto'}}>
      {conversations.map((conversation: any, index: number)=>(
        <div style={{width:'100%', display:'flex', justifyContent:conversation.speakerTag === 1? 'flex-end': 'flex-start'}} ><Card style={{marginBottom:20 , width:500, alignSelf:'flex-end'}}>
              <CardBody style={conversation.speakerTag===1? cardStylePatient : cardStyleStranger}>
                <p>{conversation.speakerTag===1 ? 'Patient' : 'Stranger' }: {conversation.context}</p> {/* Added textStyle */}
              </CardBody>
            </Card></div>
      ))}
    </div>
    <div style={inputContainerStyle}>
    <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex w-full flex-wrap items-end md:flex-nowrap mb-6 md:mb-0 gap-4">
            {placements.map((placement) => (
              <Input
                key={placement}
                type="answer"
                value={caregiver}
                onValueChange={setCaregiver}
                label="Caregiver:"
                labelPlacement={placement as any}
                placeholder="Enter your message"
                onKeyDown={handleKeyDown}
                />
            ))}
          </div>
        </div>
      </div>
      </div>
      </div>  
  );
}