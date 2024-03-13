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
  HStack,
} from "@chakra-ui/react";
import { ClassCode, Classroom } from "@prisma/client";
import { useRouter } from "next/router";
import { AddClassRes } from "~/utils/types";
import { PinInput, PinInputField } from "@chakra-ui/react";

const AddClassModal = ({ isOpen, onClose, addClassAPI, teacherId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [createdClass, setCreatedClass] = useState<Classroom | null>(null);
  const [classCode, setClassCode] = useState<ClassCode | null>("");
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
          onSuccess: async (response: AddClassRes) => {
            setCreatedClass(response.class);
            setClassCode(response.classCode);
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
        <ModalHeader>
          {currentPage === 1 ? "Enter Class Name" : "Join Through Code Below"}
        </ModalHeader>
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
          {currentPage === 2 && createdClass && classCode && (
            <HStack>
              <PinInput
                type="alphanumeric"
                isDisabled
                value={classCode.code}
                size="lg"
              >
                <PinInputField bg="gray.300" />
                <PinInputField bg="gray.300" />
                <PinInputField bg="gray.300" />
                <PinInputField bg="gray.300" />
              </PinInput>
            </HStack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddClassModal;
