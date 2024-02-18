import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  type ModalProps,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import NextImage from "next/image";

import { type Image } from "openai/resources/images.mjs";

const ImageModal = ({
  isOpen,
  onClose,
  images,
}: Omit<ModalProps, "children"> & { images?: Image[] }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent minH="300px">
        <ModalHeader>Your Badge</ModalHeader>
        <ModalCloseButton />
        <VStack>
          {images?.[0]?.url ? (
            <NextImage
              src={images[0].url}
              width="500"
              height="500"
              alt="Your Badges"
            />
          ) : (
            <Spinner />
          )}
        </VStack>
      </ModalContent>
    </Modal>
  );
};

export default ImageModal;
