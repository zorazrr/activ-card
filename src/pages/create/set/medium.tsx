import Link from "next/link";
import StyledButton from "~/components/Button";
import StyledFileUpload from "~/components/FileUpload";
import Image from "next/image";
import { useState } from "react";
import { type TermDefPair } from "~/utils/types";

export default function SetCreationMediumSelection() {
  const [flashcards, setFlashcards] = useState<TermDefPair[]>([]);
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
            <StyledFileUpload />
            <StyledButton
              label="Generate Using AI"
              colorInd={2}
              onClick={() => {}}
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
    </>
  );
}
