import React, { useState } from 'react';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 client
const s3 = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const FileUpload = () => {
    const [file, setFile] = useState(null);

    const handleFileInput = (e) => {
        setFile(e.target.files[0]);
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

            alert('File uploaded successfully.');
        } catch (err) {
            alert('File upload failed.');
            console.error(err);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileInput} />
            <button onClick={uploadFile}>Generate Flashcards</button>
        </div>
    );
};

export default FileUpload;
