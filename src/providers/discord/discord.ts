import {DiscordConfig} from "@/providers/configs";
import {SendingObject} from "@/pages/api/send";
import {stripHtml} from "string-strip-html";

function sendDiscordMessage(config: DiscordConfig, senderInfo: SendingObject) {
    var params = {
        username: "StealthComm",
        avatar_url: "",
        content: config.userPingId != null ? `<@${config.userPingId!}>` : "",
        embeds: [
            {
                "title": "Neue Nachricht bezüglich deines Autos",
                "color": 1096065,
                "thumbnail": {
                    "url": "https://media.tenor.com/lBoeGrikScQAAAAi/obama-obamium.gif",
                },
                "fields": [
                    {
                        "name": "Thema",
                        "value": senderInfo.category,
                        "inline": false
                    },
                    {
                        "name": "Nachricht",
                        "value": senderInfo.specifier,
                        "inline": false
                    },
                    {
                        "name": "Weitere Infos",
                        "value": senderInfo.freeform != "" ? stripHtml(senderInfo.freeform).result : "---",
                        "inline": false
                    },
                    {
                        "name": "Kontaktinformationen",
                        "value": `**Name:** ${senderInfo.sender.name != "" ? senderInfo.sender.name : "---"}\n**Telefonnummer:** ${senderInfo.sender.phone != "" ? senderInfo.sender.phone : "---"}\n**E-Mail-Adresse:** ${senderInfo.sender.email != "" ? senderInfo.sender.email : "---"}`,
                        "inline": false
                    }
                ]
            }
        ]
    }
    fetch(config.webhook, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    }).then(r => {
        // TODO: Callback
    }).catch((error) => {
        console.log(error);
    })
}

export default sendDiscordMessage