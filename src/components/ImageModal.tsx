import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  type ModalProps,
  Spinner,
  Button,
  Flex, // Use Flex instead of Box for layout control
} from "@chakra-ui/react";
import { type Badge, Role } from "@prisma/client";
import NextImage from "next/image";

import { type Image } from "openai/resources/images.mjs";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import StyledButton from "./Button";

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
  const [isSaved, setIsSaved] = useState(false);

  const uploadUrl = api.gpt.getPresignedUrl.useQuery(
    { fileName: fileName },
    { retry: false, enabled: false },
  );

  useEffect(() => {
    const uploadFile = async () => {
      const urlResponse = await uploadUrl.refetch();
      const presignedUrl = urlResponse.data!;

      if (images?.[0]) {
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
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
      <ModalOverlay />
      <ModalContent
        minH="50vh"
        backgroundColor={"white"}
        display="flex"
        flexDirection="column" // Ensure vertical stacking
        style={{ marginTop: "15vh" }}
      >
        <ModalHeader textAlign={"center"}>
          {images?.[0]?.url && "Congratulations on your New Creation!"}
        </ModalHeader>
        <ModalCloseButton />
        {/* TODO: Put party streamer animation when sticker is revealed */}
        <Flex
          flex="1" // Flex property allows this container to expand
          flexDirection="column" // Stack children vertically
          justifyContent="center" // Center children vertically
          alignItems="center" // Center children horizontally
        >
          {images?.[0]?.url ? (
            <>
              <NextImage
                src={images[0].url}
                width="600"
                height="600"
                alt="Your Badges"
                style={{
                  paddingLeft: "5vh",
                  paddingBottom: "2.5vh",
                  paddingRight: "5vh",
                }}
              />
              {session && session.user.role == Role.STUDENT && (
                <div style={{ paddingBottom: "2.5vh" }}>
                  <Button
                    isLoading={isSaved}
                    backgroundColor="mediumBlue.500"
                    textColor="white"
                    onClick={() => {
                      setIsSaved(true);
                      setFileName(`uploads/${Date.now()}_${session.user.id}`);
                    }}
                    py={2}
                    borderRadius="md"
                    _hover={{ opacity: "75%" }}
                    w="8rem"
                  >
                    Save It
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Flex
              justifyContent="center" // Center spinner horizontally
              alignItems="center" // Center spinner vertically
              width="100%" // Take up full width
              height="100%" // Take up the remaining height
            >
              <Spinner size="xl" /> {/* Optionally adjust the size */}
            </Flex>
          )}
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default ImageModal;
