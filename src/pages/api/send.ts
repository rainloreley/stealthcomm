import type { NextApiRequest, NextApiResponse } from 'next'
import sendEmail from "@/providers/email/email";
import prisma from "@/db/prisma";
import notifyProviders from "@/providers/notifyProviders";

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
        })

        if (objectData == null) return res.status(401).json({err: "notfound"});

        await notifyProviders(objectData.ownerId, requestData);
    }
}
