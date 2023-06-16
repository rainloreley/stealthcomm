import {SendingObject} from "@/pages/api/send";
import prisma from "@/db/prisma";
import sendDiscordMessage from "@/providers/discord/discord";
import sendEmail from "@/providers/email/email";

async function notifyProviders(userId: string, senderInfo: SendingObject) {
    const providers = await prisma.notificationProvider.findMany({
        where: {
            userId: userId
        }
    });

    for (const provider of providers) {
        const config = JSON.parse(provider.config);
        switch (provider.type) {
            case "discord":
                sendDiscordMessage(config, senderInfo);
                break;
            case "email":
                sendEmail(config, senderInfo);
                break;
        }
    }


}

export default notifyProviders;