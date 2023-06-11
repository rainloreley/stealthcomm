import type { NextApiRequest, NextApiResponse } from 'next'
import sendDiscordMessage from "@/providers/discord/discord";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.status(200).json({});
}
