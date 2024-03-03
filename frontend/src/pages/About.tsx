import React from "react";
import {Card, CardBody} from "@nextui-org/react";
import {Input} from "@nextui-org/react";

export default function App() {

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
    position: "fixed" as "fixed",
    bottom: "20px",
    left: "0",
    right: "0",
  };

  return (
    <><>
      <div style={getContainerStylePatient(20)}>
        <Card>
          <CardBody style={cardStylePatient}>
            <p>Patient: First Sentence.</p> {/* Added textStyle */}
          </CardBody>
        </Card>
      </div>
      <div style={getContainerStyleStranger(40)}>
        <Card>
          <CardBody style={cardStyleStranger}>
            <p>Stranger: Second Sentence.</p> {/* Added textStyle */}
          </CardBody>
        </Card>
      </div>
      <div style={getContainerStylePatient(70)}>
        <Card>
          <CardBody style={cardStylePatient}>
            <p>Patient: Third Sentence.</p> {/* Added textStyle */}
          </CardBody>
        </Card>
      </div>
      <div style={getContainerStyleStranger(100)}>
        <Card>
          <CardBody style={cardStyleStranger}>
            <p>Stranger: Fourth Sentence.</p> {/* Added textStyle */}
          </CardBody>
        </Card>
      </div>
    </>
    <div style={inputContainerStyle}>
    <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex w-full flex-wrap items-end md:flex-nowrap mb-6 md:mb-0 gap-4">
            {placements.map((placement) => (
              <Input
                key={placement}
                type="answer"
                label="Caregiver:"
                labelPlacement={placement as any}
                placeholder="Enter your message"
                />
            ))}
          </div>
        </div>
      </div>
      </div>
      </>  
  );
}