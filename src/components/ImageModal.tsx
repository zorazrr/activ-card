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
import { useEffect, useState } from "react";

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
      onClose();
    },
  });
  const [fileName, setFileName] = useState<string>("test");

  const uploadUrl = api.gpt.getPresignedUrl.useQuery(
    { fileName: fileName },
    { retry: false, enabled: false },
  );

  useEffect(() => {
    const uploadFile = async () => {
      const urlResponse = await uploadUrl.refetch();
      const presignedUrl = urlResponse.data!;
      console.log(urlResponse);
      console.log(presignedUrl);

      if (images && images[0]) {
        saveBadge.mutate({
          genImageURL: images[0].url!,
          presignedURL: presignedUrl,
          fileName: fileName,
          userId: session?.user.id!,
          setId: setId,
        });
      }
    };

    if (fileName) {
      uploadFile();
    }
  }, [fileName]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent minH="300px" backgroundColor={"white"}>
        <ModalHeader>Your Badge</ModalHeader>
        <ModalCloseButton />
        <VStack>
          {images?.[0]?.url ? (
            <>
              <NextImage
                src={images[0].url}
                width="500"
                height="500"
                alt="Your Badges"
              />
              {session && session.user.role == Role.STUDENT && (
                <Button
                  onClick={() => {
                    setFileName(`uploads/${Date.now()}_${session.user.id}`);
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
