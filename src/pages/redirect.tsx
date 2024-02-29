import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";
import {
  Spinner,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import StyledButton from "~/components/Button";
import { Role } from "@prisma/client";

const Redirect = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userMutation = api.user.setUserRole.useMutation();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleRoleSelection = async (role: string) => {
    userMutation.mutate(
      {
        userId: session!.user?.id,
        role: role,
      },
      {
        onSuccess: async () => {
          onClose();
          await signIn("google", {
            callbackUrl: "/dashboard",
            redirect: false,
          });
        },
      },
    );
    onClose();
  };

  useEffect(() => {
    if (!router.query.role && !session?.user.id) return;
    if (status === "loading") return;
    if (!session?.user.id) return;

    userMutation.mutate(
      {
        userId: session?.user?.id,
        role: router.query.role
          ? (router.query.role as string)
          : session.user.role,
      },
      {
        onSuccess: async (response) => {
          if (response.role == Role.UNKNOWN) {
            onOpen();
            return;
          } else {
            await signIn("google", {
              callbackUrl: "/dashboard",
              redirect: false,
            });
          }
        },
      },
    );
  }, [router, session?.user.id, status]);

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Spinner thickness="4px" size="xl" />
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={"xl"}>
        <ModalOverlay />
        <ModalContent backgroundColor={"white"}>
          <ModalHeader>Choose Your Role</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <StyledButton
                label="I'm a Teacher"
                colorInd={1}
                onClick={() => {
                  handleRoleSelection("teacher");
                }}
                style={{
                  paddingTop: "15px",
                  paddingBottom: "15px",
                }}
              />
              <StyledButton
                label="I'm a Student"
                colorInd={2}
                onClick={() => {
                  handleRoleSelection("student");
                }}
                style={{
                  paddingTop: "15px",
                  paddingBottom: "15px",
                }}
              />
              <br></br>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Redirect;
