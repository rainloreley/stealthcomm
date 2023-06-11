import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/db/prisma";

enum ObjectType {
    car = 0
}

type ObjectData = {
    uid: string,
    type: ObjectType,
    name: string
}

/*const fixedData: ObjectData[] = [
    {uid: "123", type: 0, name: "HD-MI-1791"}
]*/

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ObjectData | any>
) {
    const {uid} = req.query;

    if (typeof uid !== "string") res.status(401).json({err: "invalid_uid"})

    const req_uid: string = uid as string;

    const data = await prisma.object.findUnique({
        where: {
            uid: req_uid
        }
    });

    console.log(data);
    if (data == null) {
        res.status(404).json({err: "notfound"});
    }
    else {
        res.status(200).json(data);
    }


}
