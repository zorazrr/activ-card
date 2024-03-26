// @ts-nocheck
import { z } from "zod";
import OpenAI, { toFile } from "openai";
import fs from "fs";
import {
  DetectDocumentTextCommand,
  TextractClient,
} from "@aws-sdk/client-textract";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { TermDefPair } from "~/utils/types";
import { SetType } from "@prisma/client";
import { getSetTypeEnum } from "~/utils/helpers";

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
   * @param setType The type of set to engineer term and definition off of
   * @param readingComprehensionLevel The grade level to set these cards at
   * @returns The term-definition pairs
   */
  generateFlashcardsFromPromptedSubject: publicProcedure
    .input(
      z.object({
        subject: z.string(),
        setType: z
          .enum(["ASSIGNMENT", "INVERTED", "LITERACY", "THEORY"])
          .optional(),
        readingComprehensionLevel: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.setType) {
        return [];
      }
      let prompt;
      const numCards = 3;

      const readingComprehensionLevel = Number(input.readingComprehensionLevel);

      switch (getSetTypeEnum(input.setType)) {
        case SetType.ASSIGNMENT:
          prompt = `with the reading comprehension level of a ${readingComprehensionLevel == 0 ? "kindergarten" : "grade " + String(readingComprehensionLevel)} classroom, generate ${String(numCards)} relevant (term:definition) pairs, keep it concise and simple, focusing on keeping the parts most important to the definition. Provide in the following format of Term:Definition`;
          break;
        case SetType.INVERTED:
          prompt = `with the reading comprehension level of a ${readingComprehensionLevel == 0 ? "kindergarten" : "grade " + String(readingComprehensionLevel)} classroom, i'm doing an inverted classroom meaning i want students to start get thinking about the topics even before we start the unit. generate ${String(numCards)} questions they can type responses to that help me accomplish this with them. only give me the sentences, nothing else`;
          break;
        case SetType.LITERACY:
          prompt = `with the reading comprehension level of a ${readingComprehensionLevel == 0 ? "kindergarten" : "grade " + String(readingComprehensionLevel)} classroom, generate ${String(numCards)} sentences for them to practice reading and literacy. only give me the sentences, nothing else`;
          break;
        case SetType.THEORY:
          prompt = `with the level of a ${readingComprehensionLevel == 0 ? "kindergarten" : "grade " + String(readingComprehensionLevel)} classroom,  using Bloom's taxonomy level of "Evaluating, Creating, Synthesis", generate ${String(numCards)} mix of open-ended or high level concept questions to strengthen their understanding, keep it concise and simple. Only give me the response in the format of questions and only give questions that can be responded through speech (no visual material or drawing needed`;
          break;
      }

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a helpful teaching assistant in a ${readingComprehensionLevel == 0 ? "kindergarten" : "grade " + String(readingComprehensionLevel)} classroom`,
          },
          {
            role: "user",
            content: `For the given prompt or subject, ${[prompt]}`,
          },
          { role: "assistant", content: input.subject }, // TODO: Figure out why this is here
        ],
        model: "gpt-3.5-turbo",
      });

      console.log(completion.choices[0].message.content);
      const lines = completion.choices[0].message.content.split("\n");
      console.log("HERE ARE THE LINES");
      console.log(lines);

      let termDefPairs: TermDefPair[];

      switch (input.setType) {
        case SetType.ASSIGNMENT:
          termDefPairs = lines
            .map((line) => {
              if (line) {
                const [term, definition] = line.split(/:\s*/);
                return {
                  term: term.replace(/^\d+\.\s*/, ""), // Remove the numbering
                  def: definition.trim(), // Trim any leading or trailing whitespace
                };
              } else {
                return undefined;
              }
              // Split each line by the first colon to separate the term and the definition
            })
            .filter((value) => value !== undefined);
          console.log(termDefPairs);
          break;

        case SetType.INVERTED:
          const placeholderForDefinitionInvertedClass =
            "will accept any effort-based responses...";
          termDefPairs = lines.map((line) => {
            return {
              term: line.replace(/^\d+\.\s*/, ""), // Remove the numbering for the questions
              def: placeholderForDefinitionInvertedClass, // Trim any leading or trailing whitespace
            };
          });
          break;
        case SetType.LITERACY:
          termDefPairs = lines.map((line) => {
            return {
              term: line.replace(/^\d+\.\s*/, ""), // Remove the numbering for the questions
              def: line.replace(/^\d+\.\s*/, ""), // Reading will have same term and definition
            };
          });
          break;
        case SetType.THEORY:
          const placeholderForTheoryDefinition =
            "will accept responses fact checked by AI and, if question is hypothetical, then will check based on approach and effort basis...";
          termDefPairs = lines.map((line) => {
            return {
              term: line.replace(/^\d+\.\s*/, ""), // Remove the numbering for the questions
              def: placeholderForTheoryDefinition, // Trim any leading or trailing whitespace
            };
          });
          break;
      }

      return termDefPairs;
    }),
  /**
   * Generate flashcard based on text and return the term-definition pairs
   * @param content The content to generate flashcards from
   * @returns The term-definition pairs
   */
  generateFlashcard: publicProcedure
    .input(
      z.object({
        content: z.string(),
        setType: z
          .enum(["ASSIGNMENT", "INVERTED", "LITERACY", "THEORY"])
          .optional(),
        readingComprehensionLevel: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.setType) {
        return [];
      }
      let prompt;
      const numCards = 3;

      switch (getSetTypeEnum(input.setType)) {
        case SetType.ASSIGNMENT:
          prompt = `with the reading comprehension level of a ${readingComprehensionLevel == 0 ? "kindergarten" : "grade " + String(readingComprehensionLevel)} classroom, generate ${String(numCards)} relevant (term:definition) pairs, keep it concise and simple, focusing on keeping the parts most important to the definition.`;
          break;
        case SetType.INVERTED:
          prompt = `with the reading comprehension level of a ${readingComprehensionLevel == 0 ? "kindergarten" : "grade " + String(readingComprehensionLevel)} classroom, i'm doing an inverted classroom meaning i want students to start get thinking about the topics even before we start the unit. generate ${String(numCards)} questions they can type responses to that help me accomplish this with them. only give me the sentences, nothing else`;
          break;
        case SetType.LITERACY:
          prompt = `with the reading comprehension level of a ${readingComprehensionLevel == 0 ? "kindergarten" : "grade " + String(readingComprehensionLevel)} classroom, generate ${String(numCards)} sentences for them to practice reading and literacy. only give me the sentences, nothing else`;
          break;
        case SetType.THEORY:
          prompt = `with the level of a ${readingComprehensionLevel == 0 ? "kindergarten" : "grade " + String(readingComprehensionLevel)} classroom,  using Bloom's taxonomy level of "Evaluating, Creating, Synthesis", generate ${String(numCards)} mix of open-ended or high level concept questions to strengthen their understanding, keep it concise and simple. Only give me the response in the format of questions and only give questions that can be responded through speech (no visual material or drawing needed`;
          break;
      }

      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful teaching assistant." },
          {
            role: "user",
            content: `From the given content only,  ${[prompt]}.`,
          },
          { role: "assistant", content: input.content },
        ],
        model: "gpt-3.5-turbo",
      });
      const lines = completion.choices[0].message.content.split("\n");
      let termDefPairs: TermDefPair[];

      switch (input.setType) {
        case SetType.ASSIGNMENT:
          termDefPairs = lines.map((line) => {
            if (line) {
              // Split each line by the first colon to separate the term and the definition
              const [term, definition] = line.split(/:\s*/);
              return {
                term: term.replace(/^\d+\.\s*/, ""), // Remove the numbering
                def: definition.trim(), // Trim any leading or trailing whitespace
              };
            }
          });
          break;

        case SetType.INVERTED:
          const placeholderForDefinitionInvertedClass =
            "will accept any effort-based responses...";
          termDefPairs = lines.map((line) => {
            return {
              term: line.replace(/^\d+\.\s*/, ""), // Remove the numbering for the questions
              def: placeholderForDefinitionInvertedClass, // Trim any leading or trailing whitespace
            };
          });
          break;
        case SetType.LITERACY:
          termDefPairs = lines.map((line) => {
            return {
              term: line.replace(/^\d+\.\s*/, ""), // Remove the numbering for the questions
              def: line.replace(/^\d+\.\s*/, ""), // Reading will have same term and definition
            };
          });
          break;
        case SetType.THEORY:
          const placeholderForTheoryDefinition =
            "will accept responses fact checked by AI and, if question is hypothetical, then will check based on approach and effort basis...";
          termDefPairs = lines.map((line) => {
            return {
              term: line.replace(/^\d+\.\s*/, ""), // Remove the numbering for the questions
              def: placeholderForTheoryDefinition, // Trim any leading or trailing whitespace
            };
          });
          break;
      }

      return termDefPairs;
    }),
  generateImage: publicProcedure
    .input(z.object({ imagePath: z.string() }))
    .mutation(async ({ input }) => {
      const regex = /^data:.+\/(.+);base64,(.*)$/;
      const matches = input.imagePath.match(regex);
      const data = matches[2];
      const buffer = Buffer.from(data, "base64");

      buffer.name = "image.png";

      const file = await toFile(buffer);

      const res = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Describe this image very briefly and in a way that it can be drawn and colored by someone with your explanation. Focus on technical details (colors used, object drawn, etc). If you find yourself describing or seeing anything inappropriate, then instead describe an image you think would be kid friendly to generate.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${data}`,
                  detail: "low",
                },
              },
            ],
          },
        ],
        max_tokens: 100,
      });

      const imgPrompt = res.choices[0].message.content;

      const img = await openai.images.generate({
        model: "dall-e-3",
        prompt: imgPrompt + " Make it simplistic cartoon style and for kids.",
        n: 1,
        size: "1024x1024",
      });

      return img.data;
    }),
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
        type: z.enum(["ASSIGNMENT", "INVERTED", "LITERACY", "THEORY"]),
      }),
    )
    .mutation(async ({ input }) => {
      let formattedInput: string;
      let prompt: string;

      switch (getSetTypeEnum(input.type)) {
        case SetType.ASSIGNMENT:
          formattedInput = `Term: ${input.term}\nDefinition: ${input.definition}\nStudent Answer: ${input.studentInput}`;
          prompt = `Given the following term, student answer, and definition, check if the student's answer conveys the important stuff from the definition. Don't be too picky on technicalities/verbage.`;
          break;
        case SetType.INVERTED:
          formattedInput = `Term: ${input.term}\nStudent Answer: ${input.studentInput}`;
          prompt = `Given the following question and student's answer, this is an inverted classroom style \
          so I just want to make sure student responses show they put thinking effort (decent quantity and quality of response) \
          in trying to formulate an answer that is relevant to the question (it is ok if their answer \ 
          is a little incorrect as long as it is reasonable and relevant). `;
          break;
        case SetType.LITERACY:
          formattedInput = `Term: ${input.term}\nStudent Answer: ${input.studentInput}`;
          prompt = `The student answer should match the term exactly word by word. \
          Even if word is not said properly (not direct match with term string) then mark it wrong`;
          break;
        case SetType.THEORY:
          formattedInput = `Term: ${input.term}\nStudent Answer: ${input.studentInput}`;
          prompt = `Given the following question and student's answer, accept responses that are reasonable and correct for the most part. \ 
          Don't get too picky about small technicalities but don't accept any responses with significant errors \
          in their understanding or not a lot of effort or thinking.`;
          break;
      }

      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful teaching assistant." },
          {
            role: "user",
            content: prompt,
          },
          { role: "assistant", content: formattedInput },
          { role: "assistant", content: "Summarize with Yes or No." },
        ],
        model: "gpt-3.5-turbo",
      });
      console.log("HI");
      console.log(completion);
      return {
        isCorrect: completion.choices[0].message.content
          .toLowerCase()
          .includes("yes"),
      };
    }),
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
    }),
  // TODO: 3, Send reading comprehension level with this too so feedback is made for age group
  // TODO 12: Consider combining this with previous
  explainAnswer: publicProcedure
    .input(
      z.object({
        term: z.string(),
        definition: z.string(),
        studentInput: z.string(),
        type: z.enum(["ASSIGNMENT", "INVERTED", "LITERACY", "THEORY"]),
      }),
    )
    .mutation(async ({ input }) => {
      let formattedInput: string;
      let prompt: string;

      switch (getSetTypeEnum(input.type)) {
        case SetType.ASSIGNMENT:
          formattedInput = `Term: ${input.term}\nDefinition: ${input.definition}\nStudent Answer: ${input.studentInput}`;
          prompt =
            "Given the following term, student answer,\
          and definition, explain why the student answer is inaccurate\
          and what the student should remember from the definition to get it right next time.\
          Keep your answer quick and easy to read, encouraging and pretend you are talking to the student.  Bold the words/phrases to help reader understand their mistake and actions/suggestions for next attempt? Bold with <b></b> tags";
          break;
        case SetType.INVERTED:
          formattedInput = `Question: ${input.term}\nStudent Answer: ${input.studentInput}`;
          prompt = `Given the following question and student's answer, this is an inverted classroom style so I just want to make sure student responses show they put a strong effort even if some of what they wrote may be incorrect.
           I just want to make sure that they are thinking and trying. The answer provided was marked inaccurate based on criteria above so explain why it was marked this way and suggest what the student could improve for next time 
           Keep your answer quick and easy to read, encouraging and pretend you are talking to the student. Bold the words/phrases to help reader understand their mistake and actions/suggestions for next attempt? Bold with <b></b> tags`;
          break;
        case SetType.LITERACY:
          formattedInput = `Term: ${input.term}\nStudent Answer: ${input.studentInput}`;
          prompt = `The student answer should match the term word by word because I am doing a literacy exercise with them where I read the term and they read it back to me. Explain to the student why their answer was marked incorrect (if certain words were not read out loud/skipped in their answer)
          Keep your answer quick and easy to read, encouraging and pretend you are talking to the student.  Bold the words/phrases to help reader understand their mistake and actions/suggestions for next attempt? Bold with <b></b> tags`;
          break;
        case SetType.THEORY:
          formattedInput = `Question: ${input.term}\nStudent Answer: ${input.studentInput}`;
          prompt = `Given the following question and student's answer, accept responses that are reasonable and correct for the most part. Don't get too picky about small technicalities but don't accept any responses with significant errors in their understanding or not a lot of effort or thinking. \
          The answer provided was marked inaccurate based on criteria above so explain why it was marked this way and suggest what the student could improve for next time
          Keep your answer quick and easy to read, encouraging and pretend you are talking to the student. Bold the words/phrases to help reader understand their mistake and actions/suggestions for next attempt? Bold with <b></b> tags
          `;
          break;
      }

      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful teaching assistant." },
          {
            role: "user",
            content: prompt,
          },
          { role: "assistant", content: formattedInput },
        ],
        model: "gpt-3.5-turbo",
      });
      return completion.choices[0].message.content;
    }),
});
