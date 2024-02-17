import { api } from "~/utils/api";

const placeHolder = () => {
    // const fileUpload = api.gpt.uploadFile.useMutation({retry: false});
    const flashcard = api.gpt.generateFlashcard.useQuery({}, { retry: false });

    return (
        <div>
            <h1>Upload</h1>
        </div>
    );
}

export default placeHolder;