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
import { useRouter } from "next/router";

const AddClassModal = ({ isOpen, onClose, addClassAPI, teacherId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [createdClass, setCreatedClass] = useState<Classroom | null>(null);
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setValue(e.target.value);
  };

  const handleClose = () => {
    router.push(`/dashboard?class=${createdClass?.id}`);
    setCreatedClass(null);
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
            setCreatedClass(response);
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
          {currentPage === 2 && createdClass && <div>Class Code</div>}
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddClassModal;
