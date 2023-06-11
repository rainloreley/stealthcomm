import {signIn, signOut, useSession} from "next-auth/react";
import {useEffect} from "react";
import {createHash, sign} from "crypto";

export default function AccountHub() {
    const {data: session} = useSession();

    if (session) {
        return (
            <div className={"w-full h-full"}>
                <div id={"topbar"} className={"w-full h-14 bg-gray-100 border-b-2 shadow-2xl flex justify-between items-center"}>
                    <div className={"ml-2"}>
                        <p className={"font-semibold"}>Account Center</p>
                    </div>
                    <div className={"flex mr-2 items-center"}>
                        <button className={"shadow-2xl mr-4 border-2 rounded-xl bg-gray-200 px-2 text-sm"} onClick={() => signOut()}>Sign out</button>
                        <p className={"mr-3 font-semibold"}>{session.user?.name}</p>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://gravatar.com/avatar/${createHash("md5").update(session.user?.email!).digest("hex")}?d=identicon&size=100`} className={"rounded-full w-8 h-8"}  alt={"Profile Picture"}/>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className={"w-full h-full flex justify-center items-center"}>
                <button className={"px-10 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-2xl border-2 text-3xl font-semibold"} onClick={() => {signIn("authentik")}}>Sign In</button>
            </div>
        )
    }
}