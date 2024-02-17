import { z } from "zod";
import fs from "fs";
import OpenAI from "openai";

import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const gptRouter = createTRPCRouter({
    // Upload a file to AWS S3 and use Textract to extract text from the file
    // Returns the extracted text
    uploadFile: publicProcedure.mutation(async () => {
        const file = await openai.files.create({
            file: fs.createReadStream("README.md"),
            purpose: "assistants",
        });

        return {
            file
        };
    }),
    // Generate flashcard based on text 
    // Returns the generated flashcard
    generateFlashcard: publicProcedure.input(z.object({})).query(async () => {
        const completion = await openai.chat.completions.create({
            messages: [{ "role": "system", "content": "You are a helpful assistant." },
            { "role": "user", "content": "Generate a term and definition pair based on this content." },
            { "role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020." }],
            model: "gpt-3.5-turbo",
        });
        console.log(completion!.choices[0].message.content)

        return completion!.choices[0].message.content
    })
});