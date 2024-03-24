import Link from "next/link";
import StyledButton from "~/components/Button";
import StyledFileUpload from "~/components/FileUpload";
import Image from "next/image";
import { useRouter } from "next/router";
import { HStack, Spinner, VStack, useDisclosure } from "@chakra-ui/react";
import StyledModal from "~/components/Modal";
import { api } from "~/utils/api";
import { useState } from "react";
import { type TermDefPair } from "~/utils/types";

export default function SetCreationMediumSelection() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const [flashcards, setFlashcards] = useState<TermDefPair[]>([]);
  const [subject, setSubject] = useState<string>("");

  const generateFlashcard =
    api.gpt.generateFlashcardsFromPromptedSubject.useQuery(
      { subject: subject },
      {
        retry: false,
        onSuccess: (data) => setFlashcards(data),
        enabled: false,
      },
    );

  const createCard = api.card.createCardsforSet.useMutation({
    retry: false,
    onSuccess: (data) => {
      window.location.href = `../set/${data.id}`;
    },
  });

  const createSet = api.set.createSet.useMutation({
    retry: false,
    onSuccess: (data) =>
      createCard.mutate({ setId: data.id, cards: flashcards }),
  });

  const createNewSet = async () => {
    setIsLoading(true);
    onClose();
    await generateFlashcard.refetch();
    createSet.mutate({
      classId: router.query.classId as string,
      name: subject,
    });
  };

  const createSetFromScratch = api.set.createSet.useMutation({
    retry: false,
    onSuccess: (data) => (window.location.href = `../set/${data.id}`),
  });

  const createNewSetFromScratch = async () => {
    createSetFromScratch.mutate({
      classId: router.query.classId as string,
      name: subject,
    });
  };

  return (
    <>
      <div className="p-5 hover:opacity-75">
        <Link href="/">
          <Image src="/assets/logo.png" alt="header" width={65} height={65} />
        </Link>
      </div>
      {/* Adjusted div for centering text */}
      <div
        className="flex items-start justify-center"
        style={{ height: "100vh" }}
      >
        <div className="text-center" style={{ marginTop: "5%" }}>
          <div className="h2 text-darkBlue">Create a Set</div>
          <br></br>
          <VStack spacing={8}>
            <HStack spacing={8}>
              <StyledFileUpload
                classId={router.query.classId as string}
                setIsLoading={setIsLoading}
              />
              <StyledButton
                label="Generate Using AI"
                colorInd={1}
                onClick={onOpen}
                style={{
                  width: "120%",
                  paddingTop: "13px",
                  paddingBottom: "13px",
                  marginRight: "5%",
                }}
              />
              <div style={{ marginLeft: "25px " }}>
                <StyledButton
                  label="Create from Scratch"
                  colorInd={1}
                  onClick={createNewSetFromScratch}
                  style={{
                    width: "120%",
                    paddingTop: "13px",
                    paddingBottom: "13px",
                    marginRight: "10%",
                  }}
                />
              </div>
            </HStack>
            {(isLoading || createSet.isLoading) && (
              <>
                <Spinner size={"xl"} />
                <div className="h4 text-darkBlue">Building your deck...</div>
              </>
            )}
          </VStack>
        </div>
      </div>
      <StyledModal
        isOpen={isOpen}
        onClose={onClose}
        onClick={createNewSet}
        setSubject={setSubject}
      />
    </>
  );
}
