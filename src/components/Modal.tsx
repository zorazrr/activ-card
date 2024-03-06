import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  type ModalProps,
  Textarea,
  ModalFooter,
} from "@chakra-ui/react";
import StyledButton from "./Button";

const StyledModal = ({
  isOpen,
  onClose,
  onClick,
  setSubject,
}: Omit<ModalProps, "children"> & {
  onClick: () => Promise<void>;
  setSubject?: any;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent backgroundColor="white" padding={3}>
        <ModalHeader>Generate Flashcards</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            minH="150px"
            placeholder="Type in a subject or a sentence to generate relevant flashcards"
            onChange={(e) => setSubject(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <StyledButton label="Submit" colorInd={0} onClick={onClick} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StyledModal;
