import {signIn, signOut, useSession} from "next-auth/react";
import {useEffect} from "react";
import {createHash} from "crypto";
import useSWR from "swr";
import LoadingSpinner from "@/components/LoadingSpinner";
import {NotificationProvider, Object, User} from "@prisma/client";
import {MaterialSymbol} from "react-material-symbols";

// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function AccountHub() {
    const {data: session} = useSession();

    const { data } = useSWR('/api/account', fetcher)

    useEffect(() => {
        if (data && session) {
            if (data?.err != undefined) {
                signOut();
            }
        }
    }, [data, session]);

    if (!session) {
        return (
            <div className={"w-full h-full flex justify-center items-center"}>
                <button className={"px-10 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-2xl border-2 text-3xl font-semibold"} onClick={() => {signIn("authentik")}}>Sign In</button>
            </div>
        )
    }

    if (data?.err != undefined) return (<div className={"flex justify-center p-8"}>
        <p className={"font-semibold text-lg dark:text-white"}>Fehler bei der Datenabfrage</p>
    </div>)
    if (!data) return <div className={"flex justify-center p-8 w-full"}><LoadingSpinner /></div>

    const userData = data as (User & {notificationproviders: NotificationProvider[], objects: Object[]})
    return (
        <div className={"w-full h-full flex flex-col"}>
            <div id={"topbar"} className={"w-full relative h-16 bg-gray-100 border-b-2 flex justify-between items-center"}>
                <div className={"ml-2"}>
                    <p className={"font-semibold"}>Account Center</p>
                </div>
                <div className={"flex mr-2 items-center"}>
                    <button className={"shadow-2xl mr-4 border-2 rounded-xl bg-gray-200 px-2 text-sm"} onClick={() => signOut()}>Sign out</button>
                    <p className={"mr-3 font-semibold"}>{userData.name}</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://gravatar.com/avatar/${createHash("md5").update(userData.email).digest("hex")}?d=identicon&size=100`} className={"rounded-full w-8 h-8"}  alt={"Profile Picture"}/>
                </div>
            </div>
            <div className={"flex relative h-full"}>
                <div id={"sidebar"} className={"w-36 h-full bg-gray-100"}>
                </div>
                <div id={"content"} className={"p-8"}>
                    <h1 className={"font-bold text-3xl"}>Meine Objekte</h1>
                    {userData.objects.map((object: Object) => {
                        return (
                            <div key={object.uid} className={"mt-2 bg-gray-100 rounded border px-4 py-2 flex justify-between items-center"}>
                                <h2 className={"text-xl font-bold"}>{object.name}</h2>
                                <a href={"/print/" + object.uid} className={"h-[30px]"}>
                                    <MaterialSymbol icon={"print"} size={30} />
                                </a>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}