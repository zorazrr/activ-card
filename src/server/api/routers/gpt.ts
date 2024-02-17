import { z } from "zod";
import OpenAI from "openai";
import { DetectDocumentTextCommand, TextractClient } from '@aws-sdk/client-textract';

import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const gptRouter = createTRPCRouter({
    // Upload a file to AWS S3 and use Textract to extract text from the file
    // Returns the extracted text
    extractText: publicProcedure.mutation(async () => {
        const textractClient = new TextractClient({
            region: "us-east-1",
            credentials: {
                accessKeyId: "AKIA4MTWIFKYCTHCZ7PP",
                secretAccessKey: "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"
            }
        });
        const detectDocumentTextCommand = new DetectDocumentTextCommand({
            Document: {
                S3Object: {
                    Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
                    Name: "sample.pdf"
                },
            },
        });
        const { Blocks } = await textractClient.send(detectDocumentTextCommand);
        const concatenatedString = Blocks.reduce((accumulator, block) => {
            if (block.BlockType === 'WORD') {
                return `${accumulator} ${block.Text}`;
            }
            return accumulator;
        }, '').trim();

        return concatenatedString;
    }),
    // Generate flashcard based on text 
    // Returns the generated flashcard
    generateFlashcard: publicProcedure.input(z.object({ content: z.string() })).query(async ({ input }) => {
        const completion = await openai.chat.completions.create({
            messages: [{ "role": "system", "content": "You are a helpful teaching assistant." },
            { "role": "user", "content": "From the given content only, extract 3 [term:definition] pairs, keep it short." },
            { "role": "assistant", "content": input.content }],
            model: "gpt-3.5-turbo",
        });
        console.log(completion!.choices[0].message.content)
        return completion!.choices[0].message.content
    })
});