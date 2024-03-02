import React from "react";
//import { useEffect, useState } from "react";
import {Card, CardBody} from "@nextui-org/react";

function Home() {
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

  return (
    <div className="w-full flex justify-center items-center h-full">
  <div className="w-full h-full">
    <div className="flex flex-wrap -mx-2 overflow-hidden">
      <div className="flex flex-col flex-grow -mx-2 overflow-hidden">
        <div className="flex flex-grow my-2 px-2 w-1/2 overflow-hidden">
          <div className="flex-grow my-2 w-1/2 overflow-hidden">
            <Card className="h-full">
              <CardBody>
                {/*Content*/}
              </CardBody>
            </Card>
          </div>

          <div className="flex-grow my-2 w-1/2 overflow-hidden">
            <Card>
              <CardBody>
                {/*Content*/}
              </CardBody>
            </Card>
          </div>
        </div>
        <div className="my-2 px-2 w-1/2 overflow-hidden">
          <Card>
            <CardBody>
              {/*Content*/}
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="flex-grow my-2 px-2 overflow-hidden">
        <Card>
          <CardBody>
            {/*Content*/}
          </CardBody>
        </Card>
      </div>

      <div className="my-2 px-2 w-full overflow-hidden">
        <Card>
          <CardBody>
          </CardBody>
        </Card>
      </div>
    </div>
  </div>
</div>

  );
}

export default Home;
