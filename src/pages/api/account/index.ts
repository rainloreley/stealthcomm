import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/db/prisma";
import { authOptions } from '../auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import {NotificationProvider, User} from "@prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<(User & {notificationproviders: NotificationProvider[], objects: Object[]}) | any>
) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        res.status(401).json({err: "not_signedin"});
        return;
    }

    const sessionUser = session.user!

    const userData = await prisma.user.findFirst({
        where: {
            email: sessionUser.email!
        },
        include: {
            notificationproviders: true,
            objects: true
        }
    });

    if (!userData) {
        res.status(401).json({err: "notexist"});
        return;
    }

    res.status(200).json(userData);
}
