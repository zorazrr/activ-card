import type { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, type ReactNode } from "react";

const ProtectedPage = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      await router.push("/");
    };
    if (status === "loading") return;
    if (!session) {
      void redirect();
    }
  }, [router, session, status]);

  return <>{children}</>;
};

export default ProtectedPage;
