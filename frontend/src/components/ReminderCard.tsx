import React, { useEffect, useState } from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, getKeyValue, Modal, useDisclosure, ModalContent, ModalBody, ModalHeader, ModalFooter, Button, Input, Textarea} from "@nextui-org/react";
import {users} from "./data";
import { IconDotsVertical, IconPlus } from "@tabler/icons-react";

export default function App(props:any) {

  const [page, setPage] = React.useState(1);
  const [name, setname] = React.useState("");
  const [type, settype] = React.useState("");
  const [description, setdescription] = React.useState("");
  const [date, setdate] = React.useState("");
  const [time, settime] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState<number>(-1);
  const rowsPerPage = 4;
  
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  // State to store reminders
  const [reminders, setReminders] = useState<any>([]);

  // Fetch reminders from Flask backend when component mounts
  useEffect(() => {
    fetch('http://localhost:5000/api/reminders')
      .then(response => response.json())
      .then(data => setReminders(data))
      .catch(error => console.error('Error fetching reminders:', error));
  }, [selectedIndex]); // Empty dependency array ensures effect runs only once after initial render


  const pages = Math.ceil(reminders.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return reminders.slice(start, end);
  }, [page, reminders]);

  // Handler function for the button click event to add the reminder
  const handleAddReminder = () => {
    // Define the URL of the backend route
    const url = 'http://localhost:5000/api/reminders';

    // Prepare the data to be sent in the POST request
    const data = {
      type: type,
      name: name,
      description: description,
      date: date,
      time: time
    };

    // Make the POST request to the backend
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      // Check if the request was successful
      if (response.ok) {
        // Parse the JSON response
        return response.json();
      }
      // If the request was not successful, throw an error
      throw new Error('Failed to add reminder.');
    })
    .then(createdItem => {
      // If the reminder was added successfully, log the created item
      console.log('Reminder added successfully:', createdItem);
      // You can perform further actions with the created item here
    })
    .catch(error => {
      // If an error occurs during the request, log the error
      console.error('Error:', error);
    });
  }

  return (
    <>
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{selectedIndex !== -1 ? items[selectedIndex as number]?.name: 'Create a new Reminder'}</ModalHeader>
            <ModalBody>
              <Input label="Name" value={name} onValueChange={setname} placeholder={selectedIndex !== -1 ? items[selectedIndex as number]?.name: ''} />
              <Input label="Type" value={type} onValueChange={settype} placeholder={selectedIndex !== -1 ? items[selectedIndex as number]?.type: ''} />
              <Input label="Date" value={date} onValueChange={setdate} placeholder={selectedIndex !== -1 ? items[selectedIndex as number]?.date: ''} />
              <Input label="Time" value={time} onValueChange={settime} placeholder={selectedIndex !== -1 ? items[selectedIndex as number]?.time: ''} />
              <Textarea
                isRequired
                label="Description"
                labelPlacement="outside"
                value={description} onValueChange={setdescription}
                placeholder={selectedIndex === -1 ? items[selectedIndex as number]?.description: ''}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={()=>{onClose();}}>
                Delete
              </Button>
              <Button color="primary" onPress={()=>{props.sendReminder(name,description,date,time); handleAddReminder(); setSelectedIndex(-1); onClose();}}>
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal><Table
      aria-label="Example table with client side pagination"
      bottomContent={<div className="flex w-full justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="secondary"
          page={page}
          total={pages}
          onChange={(page) => setPage(page)} />
      </div>}
      classNames={{
        wrapper: "min-h-[222px]",
      }}
      onRowAction={(key) => { setSelectedIndex(key as number); onOpen(); } }
    >
        <TableHeader>
          <TableColumn key="name"> <div style={{display:'flex', alignItems: 'center', }}><div>REMINDER/APPOINTMENT</div> <Button onClick={()=>{setSelectedIndex(-1);onOpen()}} style ={{marginLeft: 5}} size="sm" isIconOnly color="default" aria-label="Add an Item">
        <IconPlus />
      </Button> </div></TableColumn>
          <TableColumn key="type">TYPE</TableColumn>
          <TableColumn key="date">DATE & TIME</TableColumn>
          <TableColumn key="description">DESCRIPTION</TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {items.map((item:any, index:number) => (
            <TableRow key={index}>
              <TableCell> {item.name} </TableCell>
              <TableCell> {item.type} </TableCell>
              <TableCell> {item.date} {item.time} </TableCell>
              <TableCell style={{ maxWidth: 30, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table></>
  );
}