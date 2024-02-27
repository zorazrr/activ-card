import { signOut } from "next-auth/react"

const Signout = () => {
    return <button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>
}

export default Signout;