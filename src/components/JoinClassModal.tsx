import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Input,
} from "@chakra-ui/react";
import { ClassCode, Classroom } from "@prisma/client";
import { useRouter } from "next/router";
import { AddClassRes } from "~/utils/types";
import { UseTRPCMutationResult } from "@trpc/react-query/shared";

const JoinClassModal = ({
  isOpen,
  onClose,
  joinClassAPI,
  studentId,
}: {
  isOpen: boolean;
  onClose: () => void;
  joinClassAPI: UseTRPCMutationResult<any, any, any, any>;
  studentId: string;
}) => {
  const [joinedClass, setJoinedClass] = useState<Classroom | null>(null);
  const [classCode, setClassCode] = useState<ClassCode | null>(null);
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setValue(e.target.value);
  };

  const handleClose = () => {
    router.push(`/dashboard?class=${joinedClass?.id}`);
    setJoinedClass(null);
    setValue("");
    onClose();
  };

  const handleJoinClass = async () => {
    if (studentId) {
      await joinClassAPI.mutate(
        { studentId: studentId, classCode: value },
        {
          onSuccess: async (response: AddClassRes) => {
            setJoinedClass(response.class);
            setClassCode(response.classCode);
          },
        },
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size={"full"}>
      <ModalOverlay />
      <ModalContent backgroundColor={"white"}>
        <ModalHeader>Join Through Code Below</ModalHeader>
        <ModalBody>
          <>
            <Input
              value={value}
              onChange={handleInputChange}
              placeholder="Enter your code"
              size="sm"
            />

            <Button type="submit" onClick={handleJoinClass}>
              Submit
            </Button>
          </>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default JoinClassModal;
