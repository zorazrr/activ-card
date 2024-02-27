import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { HStack } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";

import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      router.push("/dashboard");
    }
  }, [session, status]);

  return (
    <>
      <Head>
        <title>Sign Up</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HStack height="100%" className="main-class min-h-screen">
        <div className="bg-darkBlue " style={{ width: "30%", height: "100%" }}>
          <div className="p-5 hover:opacity-75">
            <Link href="/">
              <Image
                src="/assets/logo.png"
                alt="header"
                width={65}
                height={65}
              />
            </Link>
          </div>
          <div
            className="h3 text-white"
            style={{ textAlign: "center", marginTop: "35%" }}
          >
            Continue With
          </div>
          <hr style={{ width: "65%", margin: "auto" }}></hr>

          <div
            className="reg-text flex items-center py-2"
            style={{
              backgroundColor: "white",
              width: "50%",
              margin: "auto",
              marginTop: "10%",
              borderRadius: "10px",
            }}
          >
            <button
              className="justify-content flex items-start space-x-4 hover:opacity-75"
              style={{
                margin: "auto",
                paddingTop: "5px",
                paddingBottom: "5px",
              }}
              onClick={() =>
                signIn("google", { callbackUrl: `/dashboard` })
              }
            >
              <Image
                src={"/assets/google.png"}
                alt="google login"
                width={20}
                height={20}
                style={{ marginRight: "3px" }}
              />
              <p className="reg-text mr-[20px]">{"Continue with Google"}</p>
            </button>
          </div>
          <div
            className="reg-text flex items-center py-2"
            style={{
              backgroundColor: "white",
              width: "50%",
              margin: "auto",
              marginTop: "5%",
              borderRadius: "10px",
            }}
          >
            <button
              className="justify-content flex items-start space-x-4 hover:opacity-75"
              style={{
                margin: "auto",
                paddingTop: "5px",
                paddingBottom: "5px",
              }}
            >
              <Image
                src={"/assets/msft.png"}
                alt="google login"
                width={20}
                height={20}
              />
              <div className="reg-text">{"Continue with Microsoft"}</div>
            </button>
          </div>
        </div>

        <div
          style={{ marginLeft: "18%" }}
          className="custom-image-class relative inline-block"
        >
          <Image
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
      </HStack>
    </>
  );
}
