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
  Button,
} from "@chakra-ui/react";
import { Badge, Role } from "@prisma/client";
import NextImage from "next/image";

import { type Image } from "openai/resources/images.mjs";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

const ImageModal = ({
  isOpen,
  onClose,
  images,
  setId,
}: Omit<ModalProps, "children"> & {
  images?: Image[];
  setId: string;
}) => {
  const { data: session, status } = useSession();
  const saveBadge = api.badge.createBadge.useMutation({
    retry: false,
    onSuccess: (data: Badge | undefined) => {
      console.log("hi");
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent minH="300px" backgroundColor={"white"}>
        <ModalHeader>Your Badge</ModalHeader>
        <ModalCloseButton />
        <VStack>
          {images?.[0]?.b64_json ? (
            <>
              <NextImage
                src={`data:image/png;base64, ${images[0].b64_json}`}
                width="500"
                height="500"
                alt="Your Badges"
              />
              {session && session.user.role == Role.STUDENT && (
                <Button
                  onClick={() => {
                    saveBadge.mutate({
                      data: images[0]!.b64_json!,
                      userId: session?.user.id!,
                      setId: setId,
                    });
                  }}
                >
                  Save It
                </Button>
              )}
            </>
          ) : (
            <Spinner />
          )}
        </VStack>
      </ModalContent>
    </Modal>
  );
};

export default ImageModal;
