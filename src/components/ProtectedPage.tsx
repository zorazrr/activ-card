import type { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, type ReactNode } from "react";

const ProtectedPage = ({ children, requiredRole }: { children: ReactNode, requiredRole: Role }) => {

    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        const redirect = async () => {
            await router.push("/");
        }
        if (status === "loading") return;
        if (!session) {
            void redirect();
        }
        else if (session.user.role !== requiredRole) {
            console.log("You are not authorized to view this page");
            void redirect();
        }
        else {
            console.log("You are logged in as " + session.user.email);
            console.log("Your role is " + session.user.role);
        }
    }, [requiredRole, router, session, status])

    return (
        <>
            {children}
        </>
    )
}

export default ProtectedPage;