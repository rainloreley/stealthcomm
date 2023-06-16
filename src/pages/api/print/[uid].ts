import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/db/prisma";

type PrintData = {
    url: string
}
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<PrintData | any>
) {
    const {uid} = req.query;

    if (typeof uid !== "string") res.status(401).json({err: "invalid_uid"})

    const req_uid: string = uid as string;

    const data = await prisma.object.findUnique({
        where: {
            uid: req_uid
        }
    });



    if (data == null) {
        res.status(404).json({err: "notfound"});
    }
    else {
        const full_url = process.env.NEXTAUTH_URL + "/contact/" + data!.uid
        res.status(200).json({
            url: full_url
        });
    }


}
