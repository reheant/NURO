//ts-nocheck
import React, { useEffect, useState } from "react";
//import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { createMap } from "../components/Maps";
import UserCard from "../components/UserCard";
import BarChart from "../components/BarChart";
import ReminderCard from "../components/ReminderCard";
import messaging from "../Messaging";
import Paho from "paho-mqtt";

function Home() {

  const [latitude, setLatitude] = useState(-75.68)
  const [longitude, setLongitude] = useState(45.42)

  const [forgotNumber, setForgetNumber] = useState(0)


  function handleMessage(message:any){
    if(message.destinationName === '/location'){
      const location =JSON.parse(message.payloadString)
      setLatitude(location.latitude)
      setLongitude(location.longitude)
    }
    if(message.destinationName === '/forgot'){
      setForgetNumber((prev)=> prev+1);
    }

  }

  
  useEffect(()=>{
    messaging.register(handleMessage);
  }
  ,[])

  useEffect(()=>{
    fetch('http://localhost:5000/api/forgot_count')
      .then(response => {
        // Check if response is successful
        if (response.ok) {
          return response.json();
        }
        throw new Error('Failed to fetch forgot count.');
      })
      .then(data => {
        // Set the fetched document in state
        setForgetNumber(data.forgot);
      })
      .catch(error => {
        console.error('Error fetching forgot count:', error);
      });
  },[forgotNumber])
  // const [data, setData] = useState<any>(null);
  // const [error, setError] = useState<string | null>(null);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("http://localhost:5000/items");
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }

  //       const result = await response.json();
  //       setData(result);
  //     } catch (error: any) {
  //       setError(error.message);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    createMap(latitude,longitude)
  }, [latitude,longitude])

  function sendLostMessage(){
    let messageObj = new Paho.Message("Hey this is NURO Assistant. Your caregiver has informed me that you are lost. Please enter the nearest hospital and be safe. Call 911 if it is an emergency.");
    messageObj.destinationName = "/AIresponse/lost";
    messaging.send(messageObj);
  }

  function sendNewReminderMessage(name:string, description:string, date:string , time:string){
    let messageObj = new Paho.Message(`Hey this is NURO Assistant. Your caregiver has just added a reminder called ${name} . ${description} on ${date} at ${time}`);
    messageObj.destinationName = "/AIresponse/reminder";
    messaging.send(messageObj);
  }


  return (
    <><div className="w-full flex justify-center items-center h-full m-auto">
      <div className="w-full h-full flex flex-col justify-center align-center">
        <div className="flex flex-wrap -mx-2 overflow-hidden">
          <div className="flex flex-col flex-grow -mx-2 overflow-hidden">
            <div className="flex flex-wrap nowrap flex-grow-1 my-2 w-1/2 overflow-hidden">
              <div className=" my-2 mx-2 px-2 h-full flex-grow overflow-hidden">
                <Card className="h-full">
                  <CardBody>
                    <UserCard
                      firstName="Athavan"
                      lastName="Thambimuthu"
                      sex="Male"
                      ethnicity="Irish"
                      address="1234 Journalist Ave, News City, NC" />
                  </CardBody>
                </Card>
              </div>

              <div className="my-2 mx-2 flex-grow overflow-hidden">
                <Card className="h-full">
                  <CardHeader className="w-full flex justify center items-center">
                    History
                  </CardHeader>
                  <CardBody className="w-13 h-13">
                    <BarChart dataPoints={[3, 2, 4, 3, forgotNumber]} />
                  </CardBody>
                </Card>
              </div>
            </div>
            <div className="max-h-full py-4 ml-2 w-1/2 overflow-hidden">
                  <ReminderCard sendReminder={sendNewReminderMessage}/>
            </div>
          </div>

          <div className="my-2 px-2 overflow-hidden">
            <Card isFooterBlurred>
              <CardBody>
                <div id="map" style={{ width: 500, height: 612 }} />
              </CardBody>
              <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large mt-600 left-180 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                <p className="text-tiny text-white/80"> LOST ?</p>
                <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm" onClick={()=>{sendLostMessage()}}>
                  Notify me
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div><div className="my-2 px-2 w-full overflow-hidden">
        <Card>
          <CardBody>
          </CardBody>
        </Card>
      </div></>

  );
}

export default Home;
