import React from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, getKeyValue, Modal, useDisclosure, ModalContent, ModalBody, ModalHeader, ModalFooter, Button, Input, Textarea} from "@nextui-org/react";
import {users} from "./data";
import { IconDotsVertical, IconPlus } from "@tabler/icons-react";

export default function App() {
  const [page, setPage] = React.useState(1);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(-1);
  const rowsPerPage = 4;
  
  const {isOpen, onOpen, onOpenChange} = useDisclosure();


  const pages = Math.ceil(users.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return users.slice(start, end);
  }, [page, users]);

  return (
    <>
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{selectedIndex !== -1 ? items[selectedIndex as number]?.name: 'Create a new Reminder'}</ModalHeader>
            <ModalBody>
              <Input label="Name" placeholder={selectedIndex !== -1 ? items[selectedIndex as number]?.name: ''} />
              <Input label="Type" placeholder={selectedIndex !== -1 ? items[selectedIndex as number]?.type: ''} />
              <Input label="Date" placeholder={selectedIndex !== -1 ? items[selectedIndex as number]?.date: ''} />
              <Input label="Time" placeholder={selectedIndex !== -1 ? items[selectedIndex as number]?.time: ''} />
              <Textarea
                isRequired
                label="Description"
                labelPlacement="outside"
                placeholder={selectedIndex === -1 ? items[selectedIndex as number]?.description: ''}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Delete
              </Button>
              <Button color="primary" onPress={onClose}>
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
          {items.map((item, index) => (
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