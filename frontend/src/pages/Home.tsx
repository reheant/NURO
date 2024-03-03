import React, { useEffect, useState } from "react";
//import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { createMap } from "../components/Maps";
import UserCard from "../components/UserCard";
import BarChart from "../components/BarChart";
import ReminderCard from "../components/ReminderCard";
import messaging from "../Messaging";

function Home() {


  const [connected, setConnected] = useState(false)
  function handleMessage(message:any){
    console.log(message)
  }

  useEffect(()=>{
    messaging.register(handleMessage);
    if(!connected){
      messaging.connectWithPromise().then(response => {
				console.log("Succesfully connected to Solace Cloud.", response);
				messaging.subscribe("exampletopic");
				setConnected(true)
			}).catch(error => {
				console.log("Unable to establish connection with Solace Cloud, see above logs for more details.", error);
			});
    }
  },[])
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
    createMap()
  }, [])

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
                    Number of Forgets
                  </CardHeader>
                  <CardBody className="w-13 h-13">
                    <BarChart dataPoints={[3, 2, 4, 3, 4]} />
                  </CardBody>
                </Card>
              </div>
            </div>
            <div className="max-h-full py-4 ml-2 w-1/2 overflow-hidden">
              <Card>
                <CardHeader>
                  Reminders
                </CardHeader>
                <CardBody>
                  <ReminderCard />
                  <ReminderCard />
                  <ReminderCard />
                  <ReminderCard />
                </CardBody>
              </Card>
            </div>
          </div>

          <div className="my-2 px-2 overflow-hidden">
            <Card isFooterBlurred>
              <CardBody>
                <div id="map" style={{ width: 500, height: 500 }} />
              </CardBody>
              <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large mt-600 left-180 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                <p className="text-tiny text-white/80">Available soon.</p>
                <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
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
