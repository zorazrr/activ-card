import Link from "next/link";
import StyledButton from "~/components/Button";
import StyledFileUpload from "~/components/FileUpload";
import Image from "next/image";
import { useRouter } from "next/router";
import { Modal, useDisclosure } from "@chakra-ui/react";
import StyledModal from "~/components/Modal";
import { api } from "~/utils/api";
import { useState, useEffect } from "react";
import { type TermDefPair } from "~/utils/types";

export default function SetCreationMediumSelection() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
    await generateFlashcard.refetch();
    createSet.mutate({
      classId: router.query.classId as string,
      name: subject,
    });
  };

  // useEffect(() => {
  //   if (subject) {
  //     void generateFlashcard.refetch();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [subject]);

  // useEffect(() => {
  //   if (flashcards.length !== 0) {
  //     void createSet.mutate({ name: subject, classId: classId });
  //   }
  // }, [flashcards]);

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
          <div
            className="flex-col items-start justify-between space-y-6"
            style={{ marginTop: "5%" }}
          >
            <StyledFileUpload classId={router.query.classId as string} />
            <StyledButton
              label="Generate Using AI"
              colorInd={2}
              onClick={onOpen}
              style={{
                width: "50%",
                paddingTop: "15px",
                paddingBottom: "15px",
                marginBottom: "3%",
              }}
            />
            <StyledButton
              label="Create from Scratch"
              colorInd={2}
              onClick={() => {}}
              style={{
                width: "50%",
                paddingTop: "15px",
                paddingBottom: "15px",
                marginBottom: "3%",
              }}
            />
          </div>
        </div>
      </div>
      <StyledModal
        isOpen={isOpen}
        onClose={onClose}
        isScan={false}
        onClick={createNewSet}
        setSubject={setSubject}
      />
    </>
  );
}
