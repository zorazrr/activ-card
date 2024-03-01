import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Classroom } from "@prisma/client";

const AddClassModal = ({ isOpen, onClose, addClassAPI, teacherId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [secondPageData, setSecondPageData] = useState<Classroom | null>(null);
  const [value, setValue] = useState("");
  const [] = useState();

  const handleInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setValue(e.target.value);
  };

  const handleClose = () => {
    setSecondPageData(null);
    setCurrentPage(1);
    setValue("");
    onClose();
  };

  const handleCreateClass = async () => {
    if (teacherId) {
      const apiResponse = await addClassAPI.mutate(
        { teacherId: teacherId, className: value },
        {
          onSuccess: async (response: Classroom) => {
            setSecondPageData(response);
            setCurrentPage(2);
          },
        },
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size={"full"}>
      <ModalOverlay />
      <ModalContent backgroundColor={"white"}>
        <ModalHeader>Enter Class Name</ModalHeader>
        <ModalBody>
          {currentPage === 1 && (
            <>
              <Input
                value={value}
                onChange={handleInputChange}
                placeholder="Enter your classroom"
                size="sm"
              />

              <Button type="submit" onClick={handleCreateClass}>
                Submit
              </Button>
            </>
          )}
          {currentPage === 2 && secondPageData && <div>hi</div>}
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddClassModal;
