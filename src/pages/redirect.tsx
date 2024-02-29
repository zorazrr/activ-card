import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";

const Redirect = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userMutation = api.user.setUserRole.useMutation();

  useEffect(() => {
    console.log(router.query.role);
    if (!router.query.role && !session?.user.id) return;
    if (status === "loading") return;
    if (!session?.user.id) return;
    userMutation.mutate(
      { userId: session?.user?.id, role: router.query.role as string },
      {
        onSuccess: () => {
          const redirect = async () => await router.push("/dashboard");
          void redirect();
        },
      },
    );
  }, [router, session?.user.id, status]);

  return <h1>Redirecting...</h1>;
};

export default Redirect;
