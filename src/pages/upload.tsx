import React, { useEffect, useState } from 'react';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { api } from '~/utils/api';

// Initialize S3 client
const s3 = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: "AKIA4MTWIFKYCTHCZ7PP",
        secretAccessKey: "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"
    }
});

const FileUpload = () => {
    const [file, setFile] = useState<File>();
    const [extractedText, setExtractedText] = useState<string>("");
    const generateFlashcard = api.gpt.generateFlashcard.useQuery({ content: extractedText }, { enabled: false });
    const extractText = api.gpt.extractText.useMutation({ retry: false, onSuccess: (data) => setExtractedText(data as string) });


    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0] != null) {
            setFile(e.target.files[0]);
        }
    };

    const uploadFile = async () => {
        if (!file) {
            alert('Please choose a file to upload first.');
            return;
        }

        try {
            const uploadParams = {
                Bucket: "treehacksfiles",
                Key: file.name,
                Body: file,
            };

            const command = new PutObjectCommand(uploadParams);
            await s3.send(command);
            await extractText.mutateAsync();

            alert('File uploaded successfully.');
        } catch (err) {
            alert('File upload failed.');
            console.error(err);
        }
    };

    useEffect(() => {
        if (extractedText) {
            void generateFlashcard.refetch();
        }
    }, [extractedText, generateFlashcard]);

    return (
        <div>
            <input type="file" onChange={handleFileInput} />
            <button onClick={uploadFile}>Generate Flashcards</button>
        </div>
    );
};

export default FileUpload;
