import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Img from "next/image";
import StyledButton from "~/components/Button";

import { api } from "~/utils/api";
import { useState } from "react";
import { Image } from "openai/resources/images.mjs";

export default function Home() {
  // const hello = api.post.hello.useQuery({ text: "from tRPC" });
  // const [images, setImages] = useState<Image[] | undefined>();
  // const generateFlashcard = api.gpt.generateImage.useQuery(
  //   { imagePath: "./public/assets/cupcake.png" },
  //   { retry: false, onSuccess: (data: Image[]) => setImages(data) },
  // );
  // console.log("here are the images");
  // console.log(images);

  return (
    <>
      <Head>
        <title>ActiveCard</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="main-class flex items-center justify-between space-x-4">
        <div className="p-5 hover:opacity-75">
          <Link href="/">
            <Img src="/assets/logo.png" alt="header" width={65} height={65} />
          </Link>
        </div>
        <div className="main-class flex items-center justify-between space-x-4 p-5">
          <Link href="/login">
            <StyledButton label="Log In" colorInd={0} onClick={() => {}} />
          </Link>
          <Link href="/signup">
            <StyledButton label="Sign Up" colorInd={1} onClick={() => {}} />
          </Link>
        </div>
      </div>
      <div
        className="main-class justify-content flex items-center"
        style={{
          width: "100%",
          paddingTop: "5%",
          paddingLeft: "25%",
          paddingRight: "15%",
        }}
      >
        <div
          className="main-class justify-content flex-col items-center"
          style={{ margin: "auto", paddingBottom: "30%" }}
        >
          <div className="h1 text-darkBlue" style={{ margin: "auto" }}>
            ActiveCard
          </div>
          <div style={{ margin: "auto" }}>
            <Link href="/signup">
              <StyledButton
                label="Get Started"
                colorInd={0}
                onClick={() => {}}
                style={{ width: "65%", height: "50px" }}
              />
            </Link>
          </div>
        </div>
        <div
          style={{ marginRight: "10%", marginTop: "5%" }}
          className="custom-image-class relative inline-block"
        >
          <Img
            src="/assets/big_logo.png" // Assume your image is in the public/images folder
            alt="Logo"
            width={650} // Desired width of the image in pixels
            height={390} // Desired height of the image in pixels
            className="custom-image-class block"
          />
          <div
            className="typewriter absolute left-3/4 top-1/2 -translate-x-3/4 -translate-y-3/4 transform text-white"
            style={{ width: "150%", fontSize: "18px", marginTop: "5%" }}
          >
            <h1>Active Learning &#129309; Meets &#129309; Flashcards </h1>
          </div>
        </div>
        {/* {<AuthShowcase />} */}
      </div>
    </>
  );
}

// function AuthShowcase() {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.post.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined },
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// }
