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
  HStack,
  PinInput,
  PinInputField,
} from "@chakra-ui/react";
import { ClassCode, type Classroom } from "@prisma/client";
import { useRouter } from "next/router";
import { type AddClassRes } from "~/utils/types";
import { type UseTRPCMutationResult } from "@trpc/react-query/shared";

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
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleInputChange = (value: string) => {
    setValue(value);
  };

  const handleClose = (classRoom: Classroom | undefined) => {
    if (classRoom) {
      router.push(`/dashboard?class=${classRoom?.id}`);
    }

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
            handleClose(response.class);
            router.push(`/dashboard?class=${response.class?.id}`);
            setJoinedClass(null);
            setValue("");
            onClose();
          },
        },
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => handleClose(undefined)}
      isCentered={true}
    >
      <ModalOverlay />
      <ModalContent backgroundColor={"white"}>
        <ModalHeader>Join Through Code Below</ModalHeader>
        <ModalBody>
          <>
            <HStack justifyContent="center">
              <PinInput
                onChange={handleInputChange}
                type="alphanumeric"
                size="lg"
              >
                <PinInputField bg="gray.300" />
                <PinInputField bg="gray.300" />
                <PinInputField bg="gray.300" />
                <PinInputField bg="gray.300" />
              </PinInput>
            </HStack>
          </>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button type="submit" onClick={handleJoinClass}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default JoinClassModal;
