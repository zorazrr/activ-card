import { z } from "zod";
import OpenAI from "openai";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const gptRouter = createTRPCRouter({
    // Upload a file to AWS S3 and use Textract to extract text from the file
    // Returns the extracted text
    uploadFile: publicProcedure.mutation(async () => {
        // const S3_BUCKET = process.env.S3_BUCKET_NAME;

        // const s3 = new S3Client({
        //     region: process.env.AWS_REGION
        // });
        // try {
        //     const uploadParams = {
        //         Bucket: "treehacksfiles",
        //         Key: file.name,
        //         Body: file,
        //     };

        //     const command = new PutObjectCommand(uploadParams);
        //     await s3.send(command);

        //     alert('File uploaded successfully.');
        // } catch (err) {
        //     alert('File upload failed.');
        //     console.error(err);
        // }
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