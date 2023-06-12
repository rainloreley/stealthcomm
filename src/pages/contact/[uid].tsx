import useSWR from 'swr';
import { useRouter } from 'next/router'
import { useState } from "react";
import { MaterialSymbol } from 'react-material-symbols';
import {SendingObject} from "@/pages/api/send";
import LoadingSpinner from "@/components/LoadingSpinner";
import {signOut} from "next-auth/react";
import {createHash} from "crypto";
// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json())

type Category = {
    id: number,
    text: string,
    specifiers: string[],
    icon: string
}

const fixedCategories: Category[] = [
    {
        id: 0,
        text: "Schaden",
        specifiers: [
            "Ich habe dein Auto beschädigt",
            "Du hast mein Auto beschädiigt",
            "Ich habe gesehen wie dein Auto beschädigt wurde"
        ],
        icon: "minor_crash"
    },
    {
        id: 1,
        text: "Parken",
        specifiers: [
            "Dein Auto blockiert mich",
            "Dein Auto steht auf meinem Parkplatz",
            "Dein Auto blockiert einen Rettungsweg",
            "Dein Auto blockiert eine Ein-/Ausfahrt",
            "Dein Auto steht im absoluten Halteverbot",
            "Es gibt ein anderes Parkproblem"
        ],
        icon: "local_parking"
    },
    {
        id: 2,
        text: "Lichter",
        specifiers: [
            "Die Lichter am Auto sind eingeschaltet",
            "Deine Lichter funktionieren nicht vollständig"
        ],
        icon: "flash_on"
    },
    {
        id: 3,
        text: "Fenster",
        specifiers: [
            "Ein oder mehrere Fenster sind offen",
            "Deine Scheibe wurde eingeschlagen",
            "Du hast einen Schaden an einer oder mehreren Scheiben"
        ],
        icon: "video_label"
    },
    {
        id: 4,
        text: "Auto offen",
        specifiers: [
            "Dein Auto ist nicht abgeschlossen"
        ],
        icon: "lock_open"
    },
    {
        id: 5,
        text: "Abschleppen",
        specifiers: [
            "Dein Auto wird eventuell gleich abgeschleppt",
            "Dein Auto wurde abgeschleppt"
        ],
        icon: "front_loader"
    },
    {
        id: 6,
        text: "Sonstige Gefahr",
        specifiers: [
            "Dein Auto steht im Gefahrenbereich",
            "Eine Person oder ein Tier ist in Gefahr",
            "Die Handbremse ist gelöst und das Auto bewegt sich",
            "Dein Reifen ist platt"
        ],
        icon: "warning"
    },
    {
        id: 7,
        text: "Sonstiges",
        specifiers: [
            "Eine eigene Nachricht senden"
        ],
        icon: "notifications"
    }
]

export default function ContactOwnerOfObjectPage() {

    const router = useRouter()

    const { data, error } = useSWR('/api/object/' + router.query.uid, fetcher)

    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedSpecifier, setSelectedSpecifier] = useState<string | null>(null);

    const [enteredSenderName, setEnteredSenderName] = useState<string>("");
    const [enteredSenderPhoneNumber, setEnteredSenderPhoneNumber] = useState<string>("");
    const [enteredSenderEmailAddress, setEnteredSenderEmailAddress] = useState<string>("");
    const [enteredFreeformText, setEnteredFreeformText] = useState<string>("");
    const [freeformCharactersLeft, setFreeformCharactersLeft] = useState<number>(2000);
    const [sendingError, setSendingError] = useState<string | null>(null);
    const [isSending, setIsSending] = useState<boolean>(false);

    const [showMessageSentScreen, setShowMessageSentScreen] = useState<boolean>(false);

    const sendForm = async () => {
        setSendingError(null);
        setIsSending(true);
        const sendingData: SendingObject = {
            object: data.uid,
            category: fixedCategories.find((e) => e.id == selectedCategory)?.text!,
            specifier: selectedSpecifier!,
            freeform: enteredFreeformText,
            sender: {
                name: enteredSenderName,
                phone: enteredSenderPhoneNumber,
                email: enteredSenderEmailAddress
            }
        }

        fetch("/api/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sendingData)
        }).then(async (response) => {
            setIsSending(false);
            if (response.status != 200) {
                setSendingError((await response.json())["err"]);
            }
            else {
                //success
                setShowMessageSentScreen(true);
            }
        });



    }

    if (data?.err != undefined) return (<div className={"flex justify-center p-8"}>
        <p className={"font-semibold text-lg dark:text-white"}>Fehler bei der Datenabfrage</p>
    </div>)
    if (!data) return <div className={"flex justify-center p-8 w-full"}><LoadingSpinner /></div>

    if (showMessageSentScreen) return (
        <main className={"min-h-screen overflow-y-scroll overflow-x-hidden min-w-screen flex justify-center py-16 px-6 dark:text-white"}>
            <div id={"box"} className={"text-center w-96 flex justify-center items-center"}>
                <div>
                    <h1 className={"font-bold text-3xl"}>Nachricht erfolgreich gesendet!</h1>
                    <div className={"mt-4 mb-2"}>
                        <MaterialSymbol icon={"task_alt"} size={60} color={"#10b981"} />
                    </div>
                    <p>Der Besitzer wurde benachrichtigt. Du kannst diesen Tab nun schließen.</p>
                </div>
            </div>
        </main>
    )

    return (
        <main className={"min-h-screen overflow-y-scroll overflow-x-hidden min-w-screen dark:text-white"}>
            <div id={"topbar"} className={"w-full h-14 bg-gray-100 dark:bg-gray-800 border-b-2 dark:border-b-gray-700 shadow-lg flex justify-between items-center"}>
                <div className={"ml-2"}>
                    <p className={"font-semibold"}>Kontakt aufnehmen</p>
                </div>
            </div>
            <div className={"py-16 px-6 flex justify-center"}>
                <div id={"box"} className={"text-center w-96"}>
                    <h1 className={"font-semibold text-3xl text-left"}>Besitzer von <span className={"text-emerald-500"}>{data.name}</span> kontaktieren</h1>
                    <p className={"mt-16 font-semibold"}>Um welches <span className={"text-emerald-500"}>Thema</span> geht es?</p>
                    <div className={`grid grid-cols-2 gap-4 mt-4`}>
                        {fixedCategories.map((category, index) => {
                            return (
                                <button key={category.id} className={`${category.id === selectedCategory ? `bg-emerald-500 text-white` : `bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-100`} font-semibold text-lg flex justify-between items-center rounded-md px-4 py-2`} onClick={() => {
                                    setSelectedCategory(category.id)
                                    setSelectedSpecifier(fixedCategories[index].specifiers[0]);
                                }}>
                                    {category.text}
                                    <div className={"pl-2 flex items-center"}>
                                        <MaterialSymbol icon={category.icon} size={26} />
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                    {selectedSpecifier !== null ? <div>
                        <p className={"mt-16 font-semibold"}>Wähle eine <span className={"text-emerald-500"}>Nachricht</span></p>
                        <div className={"bg-gray-100 dark:bg-gray-800 mt-4 p-4 rounded-lg"}>
                            <div className={"flex items-center justify-center pb-4"}>
                                <p className={"mr-2 font-semibold"}>{fixedCategories[selectedCategory!].text}</p>
                                <MaterialSymbol icon={fixedCategories[selectedCategory!].icon} size={26} />
                            </div>
                            {fixedCategories[selectedCategory!].specifiers.map((specifier) => {
                                return (
                                    <button key={specifier} className={"border-t dark:border-t-gray-500 py-2 w-full text-left flex items-center"} onClick={() => {
                                        setSelectedSpecifier(specifier);
                                    }}>
                                        <div className={`w-4 h-4 border border-gray-600 rounded ${selectedSpecifier === specifier ? "bg-emerald-500" : ""}`}></div>
                                        <p className={`ml-2 ${selectedSpecifier == specifier ? "text-emerald-500" : ""}`}>{specifier}</p>
                                    </button>
                                )
                            })}
                        </div>
                        <div className={"mt-8 w-full"}>
                            <p className={"font-semibold"}>Wie kann der Besitzer dich erreichen?</p>
                            <div className={"w-full text-left mt-4"}>
                                <p className={"text-gray-600 dark:text-gray-300"}>Name <span className={"italic text-sm"}>(optional)</span></p>
                                <input value={enteredSenderName} className={"bg-gray-100 dark:bg-gray-700 h-10 mt-1 rounded-lg border-gray-400 w-full px-2"} onChange={(content) => {
                                    setEnteredSenderName(content.target.value);
                                }} />
                            </div>
                            <div className={"w-full text-left mt-4"}>
                                <p className={"text-gray-600 dark:text-gray-300"}>Telefonnummer <span className={"italic text-sm"}>(optional)</span></p>
                                <input value={enteredSenderPhoneNumber} type={"tel"} className={"bg-gray-100 dark:bg-gray-700 h-10 mt-1 rounded-lg border-gray-400 w-full px-2"} onChange={(content) => {
                                    setEnteredSenderPhoneNumber(content.target.value);
                                }} />
                            </div>
                            <div className={"w-full text-left mt-4"}>
                                <p className={"text-gray-600 dark:text-gray-300"}>E-Mail Adresse <span className={"italic text-sm"}>(optional)</span></p>
                                <input value={enteredSenderEmailAddress} type={"email"} className={"bg-gray-100 dark:bg-gray-700 h-10 mt-1 rounded-lg border-gray-400 w-full px-2"} onChange={(content) => {
                                    setEnteredSenderEmailAddress(content.target.value);
                                }} />
                            </div>
                            <div className={"w-full text-left mt-4"}>
                                <p className={"text-gray-600 dark:text-gray-300"}>Eigene Nachricht <span className={"italic text-sm"}>(optional)</span></p>
                                <textarea value={enteredFreeformText} maxLength={2000} className={"bg-gray-100 dark:bg-gray-700 mt-1 rounded-lg h-32 border-gray-400 w-full px-2 py-1"} onChange={(content) => {
                                    setEnteredFreeformText(content.target.value);
                                    setFreeformCharactersLeft(2000 - content.target.value.length)
                                }} />
                                <div className={"flex justify-end"}>
                                    <p className={"text-sm text-gray-400 dark:text-gray-500"}>{freeformCharactersLeft}</p>
                                </div>
                            </div>
                        </div>
                        <div className={"mt-8"}>
                            {isSending ?
                                <div className={"w-full flex justify-center"}>
                                    <LoadingSpinner />
                                </div>
                                :
                                <button onClick={() => sendForm()} className={"bg-emerald-500 text-white rounded-lg px-12 font-semibold text-lg py-4"}>Absenden</button> }
                        </div>
                        {sendingError != null ? <div className={"text-red-400 mt-4"}>
                            <p>{sendingError}</p>
                        </div> : <div></div>}
                    </div> : <div />}
                </div>
            </div>
        </main>
    )
}