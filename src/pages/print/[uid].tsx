import useSWR from "swr";
import {useRouter} from "next/router";
import LoadingSpinner from "@/components/LoadingSpinner";
import styles from "../../styles/PrintPage.module.css";
import QRCode from "react-qr-code";
import {MaterialSymbol} from "react-material-symbols";
import {useEffect} from "react";

// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function PrintContactSheet() {
    const router = useRouter()
    const { data, error } = useSWR('/api/print/' + router.query.uid, fetcher)

    useEffect(() => {
        if (data) {
            window.print();
        }
    }, [data]);


    if (data?.err != undefined) return (<div className={"flex justify-center p-8"}>
        <p className={"font-semibold text-lg dark:text-white"}>Fehler bei der Datenabfrage</p>
    </div>)
    if (!data) return <div className={"flex justify-center p-8 w-full"}><LoadingSpinner /></div>

    return (
        <div className={styles.frame}>
            <div className={"flex h-full justify-between items-center pr-4 pl-2 text-white"}>
                <div className={"w-1/2"}>
                    <div className={"h-8 flex justify-center items-center"}><MaterialSymbol icon={"mail"} size={35} color={"#10b981"} /></div>
                    <p className={"text-lg font-bold text-center"}>KFZ-Halter kontaktieren</p>
                    <div className={"h-8"}></div>
                </div>
                <div className={"p-1.5 bg-white rounded-lg"}>
                    <QRCode value={data.url} size={100} bgColor={"#fff"} fgColor={"#000"} />
                </div>
            </div>
        </div>
    )
}