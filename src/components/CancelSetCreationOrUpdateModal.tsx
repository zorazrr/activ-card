import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  type ModalProps,
  ModalFooter,
  HStack,
  Button,
} from "@chakra-ui/react";

const CancelSetCreationOrUpdateModal = ({
  isOpen,
  onClose,
  onClick,
  isEdit,
}: Omit<ModalProps, "children"> & {
  onClick: () => void;
  isEdit: boolean;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent backgroundColor="white" padding={3}>
        <ModalHeader>You have unsaved changes!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {`Please press ${isEdit ? "'Update Set'" : "'Create'"} to save your changes.`}
        </ModalBody>
        <ModalFooter mt={3}>
          <HStack>
            <Button onClick={onClick} colorScheme="red">
              Leave Page
            </Button>
            <Button onClick={onClose}>Stay</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CancelSetCreationOrUpdateModal;
