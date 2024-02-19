# ActiveCard

AI-powered active learning suite for 4th - 8th students and teachers, with multimedia support, LLM-assisted question generation and answer validation, and iterative creation.

<p align="center">
<img src="https://github.com/zorazrr/activ-card/blob/main/public/assets/flashcard.png" alt="Flashcard Demo" width="400">
</p>

## Getting Started

Clone this repository

```
git clone https://github.com/zorazrr/activ-card.git
```

Create a `.env` file 

```
DATABASE_URL=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
OPENAI_API_KEY=
REACT_APP_AWS_ACCESS_KEY_ID=
REACT_APP_AWS_SECRET_ACCESS_KEY=
REACT_APP_AWS_REGION=
REACT_APP_S3_BUCKET_NAME=
```

Running the app

```
yarn && yarn dev
```

Then go to http://localhost:3000 in your browser.



## Technology

This project uses the [T3 Stack](https://create.t3.gg/).

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

Additional technologies used:

- [OpenAI API](https://platform.openai.com/docs/overview)
- [AWS](https://aws.amazon.com/) (S3 and Textract)