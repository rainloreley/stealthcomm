import type { NextApiRequest, NextApiResponse } from 'next'
import sendEmail from "@/providers/email";
import prisma from "@/db/prisma";

type SenderInfo = {
    name: string,
    phone: string,
    email: string
}

type SendingObject = {
    object: string
    category: string,
    specifier: string
    freeform: string,
    sender: SenderInfo
}

export type {SendingObject, SenderInfo}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        res.status(405);
    } else {

        const requestData = (req.body) as SendingObject

        const objectData = await prisma.object.findUnique({
            where: {
                uid: requestData.object
            },
            include: {
                owner: true
            }
        })

        if (objectData == null) return res.status(401).json({err: "notfound"});

        console.log(requestData)
        const ownerEmail = (await objectData!.owner).email;

        sendEmail(ownerEmail, requestData, function (error) {
            if (!error) {
                res.status(200).json({});
            }
            else {
                res.status(401).json({err: error.message});
            }
        });



    }
}
