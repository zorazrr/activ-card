// @ts-nocheck
import fs from "fs";
import { z } from "zod";
import OpenAI from "openai";
import fs from "fs";
import {
  DetectDocumentTextCommand,
  TextractClient,
} from "@aws-sdk/client-textract";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { TermDefPair } from "~/utils/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const s3 = new S3Client({
  region: process.env.REACT_APP_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY!,
  },
});

const parseDataUrl = (dataUrl: string, fileName: string) => {
  const regex = /^data:.+\/(.+);base64,(.*)$/;
  const matches = dataUrl.match(regex);
  const ext = matches[1];
  const data = matches[2];
  const buffer = Buffer.from(data, "base64");
  const filePath = "./public/assets/" + fileName + "." + ext;
  fs.writeFileSync(filePath, buffer);
  return filePath;
};

export const gptRouter = createTRPCRouter({
  /**
   * Generate a presigned URL for uploading a file to S3
   * @param fileName The name of the file to upload
   * @returns The presigned URL
   */
  getPresignedUrl: publicProcedure
    .input(z.object({ fileName: z.string() }))
    .query(async ({ input }) => {
      const command = new PutObjectCommand({
        Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
        Key: input.fileName,
      });
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      return url;
    }),
  /**
   * Extract text from a file using AWS Textract
   * @param fileName The name of the file to extract text from
   * @returns The extracted text as a string
   */
  extractText: publicProcedure
    .input(z.object({ fileName: z.string() }))
    .query(async ({ input }) => {
      const textractClient = new TextractClient({
        region: process.env.REACT_APP_AWS_REGION,
        credentials: {
          accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        },
      });
      const detectDocumentTextCommand = new DetectDocumentTextCommand({
        Document: {
          S3Object: {
            Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
            Name: input.fileName,
          },
        },
      });
      const { Blocks } = await textractClient.send(detectDocumentTextCommand);
      const concatenatedString = Blocks.reduce((accumulator, block) => {
        if (block.BlockType === "WORD") {
          return `${accumulator} ${block.Text}`;
        }
        return accumulator;
      }, "").trim();
      return concatenatedString;
    }),
  /**
   * Generate flashcard based on given subject and return the term-definition pairs
   * @param subject The subject to generate flashcards about
   * @returns The term-definition pairs
   */
  generateFlashcardsFromPromptedSubject: publicProcedure
    .input(z.object({ subject: z.string() }))
    .query(async ({ input }) => {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful teaching assistant." },
          {
            role: "user",
            content:
              "For the given subject, generate 3 relevant (term:definition) pairs, keep it short.",
          },
          { role: "assistant", content: input.subject },
        ],
        model: "gpt-3.5-turbo",
      });
      const lines = completion.choices[0].message.content.split("\n");
      const termDefPairs: TermDefPair[] = lines.map((line) => {
        // Split each line by the first colon to separate the term and the definition
        const [term, definition] = line.split(/:\s*/);
        return {
          term: term.replace(/^\d+\.\s*/, ""), // Remove the numbering
          def: definition.trim(), // Trim any leading or trailing whitespace
        };
      });
      return termDefPairs;
    }),
  generateImage: publicProcedure
    .input(z.object({ imagePath: z.string() }))
    .mutation(async ({ input }) => {
      const regex = /^data:.+\/(.+);base64,(.*)$/;
      const matches = input.imagePath.match(regex);
      const ext = matches[1];
      const data = matches[2];
      const buffer = Buffer.from(data, "base64");
      const filePath = "./public/assets/drawing." + ext;
      fs.writeFileSync(filePath, buffer);

      // Cast the ReadStream to `any` to appease the TypeScript compiler
      const image = await openai.images.createVariation({
        image: fs.createReadStream(filePath),
      });

      return image.data;
    }),
});

/**
 * Generate flashcard based on text and return the term-definition pairs
 * @param content The content to generate flashcards from
 * @returns The term-definition pairs
 */
generateFlashcard: publicProcedure
  .input(z.object({ content: z.string() }))
  .query(async ({ input }) => {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful teaching assistant." },
        {
          role: "user",
          content:
            "From the given content only, extract 3 (term:definition) pairs, keep it short.",
        },
        { role: "assistant", content: input.content },
      ],
      model: "gpt-3.5-turbo",
    });
    const lines = completion.choices[0].message.content.split("\n");
    const termDefPairs: TermDefPair[] = lines.map((line) => {
      // Split each line by the first colon to separate the term and the definition
      const [term, definition] = line.split(/:\s*/);
      return {
        term: term.replace(/^\d+\.\s*/, ""), // Remove the numbering
        def: definition.trim(), // Trim any leading or trailing whitespace
      };
    });
    return termDefPairs;
  });
/**
 * Check if the student's answer matches the definition
 * @param term The term to check
 * @param definition The definition to check
 * @param studentInput The student's input to check
 * @returns Whether the student's input matches the definition, binary
 */
checkAnswer: publicProcedure
  .input(
    z.object({
      term: z.string(),
      definition: z.string(),
      studentInput: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    const formattedInput = `Term: ${input.term}\nDefinition: ${input.definition}\nStudent Answer: ${input.studentInput}`;
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful teaching assistant." },
        {
          role: "user",
          content:
            "Given the following term, student answer, and definition, check if the student's answer match the definition.",
        },
        { role: "assistant", content: formattedInput },
        { role: "assistant", content: "Summarize with Yes or No." },
      ],
      model: "gpt-3.5-turbo",
    });
    return {
      isCorrect: completion.choices[0].message.content
        .toLowerCase()
        .includes("yes"),
    };
  });
/**
 * Transcribe speech to text
 * @returns The transcribed text
 */
speechToText: publicProcedure
  .input(z.object({ audioUrl: z.string() }))
  .mutation(async ({ input }) => {
    const filePath = parseDataUrl(input.audioUrl, "audio");
    const audioFileWebm = fs.createReadStream(filePath);
    const transcript = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: audioFileWebm,
      content_type: "audio/mp3",
    });
    console.log(transcript);
    return transcript;
  });
