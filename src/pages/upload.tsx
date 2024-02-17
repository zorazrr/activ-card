import React, { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import type { TermDefPair } from '~/utils/types';


const FileUpload = () => {
    const [file, setFile] = useState<File>();
    const [extractedText, setExtractedText] = useState<string>("");
    const [flashcards, setFlashcards] = useState<TermDefPair[]>([]);
    const uploadUrl = api.gpt.getPresignedUrl.useQuery({ fileName: file ? file.name : "" }, { retry: false, enabled: false });
    const extractText = api.gpt.extractText.useQuery({ fileName: file ? file.name : "" }, { retry: false, onSuccess: (data) => setExtractedText(data), enabled: false });
    const generateFlashcard = api.gpt.generateFlashcard.useQuery({ content: extractedText }, { retry: false, onSuccess: (data) => setFlashcards(data), enabled: false });

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
            const urlResponse = await uploadUrl.refetch();;
            const presignedUrl = urlResponse.data!;
            await fetch(presignedUrl, {
                method: 'PUT',
                body: file,
            });
            await extractText.refetch();
            alert('Successfully extracted text from file.');
        }
        catch (err) {
            alert('File upload failed.');
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
        <div>
            <input type="file" onChange={handleFileInput} />
            <button onClick={uploadFile}>Generate Flashcards</button>
            {flashcards?.map((pair, index) =>
                <div key={index}>
                    <h3>{pair.term}</h3>
                    <p>{pair.def}</p>
                </div>)}
        </div>
    );
};

export default FileUpload;
