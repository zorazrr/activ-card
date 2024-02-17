import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import type { TermDefPair } from "~/utils/types";

const StyledFileUpload = () => {
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

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] != null) {
      setFile(e.target.files[0]);
      await uploadFile();
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
      // alert("Successfully extracted text from file.");
      window.location.href = "../";
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

  return (
    <div className="py-2">
      <label
        className="reg-text bg-darkBlue w-32 cursor-pointer rounded-md py-2 text-white hover:opacity-75"
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
          style={{ display: "none" }}
        />
      </label>
    </div>
  );
};

export default StyledFileUpload;
