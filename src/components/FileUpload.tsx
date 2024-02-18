import { useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import type { TermDefPair } from "~/utils/types";
import StyledModal from "./Modal";

const StyledFileUpload = ({ classId }: { classId: string }) => {
  const [file, setFile] = useState<File>();
  const [extractedText, setExtractedText] = useState<string>("");
  const [flashcards, setFlashcards] = useState<TermDefPair[]>([]);
  const uploadUrl = api.gpt.getPresignedUrl.useQuery(
    { fileName: file ? file.name : "" },
    { retry: false, enabled: false },
  );
  const extractText = api.gpt.extractText.useQuery(
    { fileName: file ? file.name : "" },
    {
      retry: false,
      onSuccess: (data) => setExtractedText(data),
      enabled: false,
    },
  );
  const generateFlashcard = api.gpt.generateFlashcard.useQuery(
    { content: extractedText },
    { retry: false, onSuccess: (data) => setFlashcards(data), enabled: false },
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

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] != null) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      alert("Please choose a file to upload first.");
      return;
    }

    try {
      const urlResponse = await uploadUrl.refetch();
      const presignedUrl = urlResponse.data!;
      await fetch(presignedUrl, {
        method: "PUT",
        body: file,
      });
      await extractText.refetch();
    } catch (err) {
      alert("File upload failed. Try again!");
      console.error(err);
    }
  };

  useEffect(() => {
    if (extractedText) {
      void generateFlashcard.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extractedText]);

  useEffect(() => {
    if (flashcards.length !== 0) {
      void createSet.mutate({ name: file!.name, classId: classId });
    }
  }, [flashcards]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="py-2">
      <label
        className="reg-text w-32 cursor-pointer rounded-md bg-mediumBlue py-2 text-white hover:opacity-75"
        style={{
          width: "50%",
          padding: "15px",
          paddingBottom: "15px",
          marginBottom: "3%",
        }}
      >
        Upload Materials
        <input
          type="file"
          onChange={handleFileInput}
          onClick={onOpen}
          style={{ display: "none" }}
        />
      </label>
      {/* <VStack align={"center"}>
        <div className="flex w-full justify-center">
          <input type="file" onChange={handleFileInput} />
        </div>
        <button
          className="reg-text w-full cursor-pointer rounded-md bg-darkBlue py-3 text-white hover:opacity-75"
          onClick={uploadFile}
        >
          Generate from File
        </button>
      </VStack> */}
      <StyledModal
        isOpen={isOpen}
        onClose={onClose}
        onClick={uploadFile}
        isScan
      />
    </div>
  );
};

export default StyledFileUpload;
