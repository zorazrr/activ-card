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
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />

      <ModalContent backgroundColor="white" padding={3}>
        <ModalHeader>Search or prompt for any topic, be specific!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            minH="150px"
            placeholder="(e.g. 'Water Cycle', 'Generate sentences using these names: [Tommy, Ayesha]', 'Give me a halloween themed practice on liquids, gases, solids)'"
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
