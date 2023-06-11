import {DiscordConfig} from "@/providers/configs";
import {SendingObject} from "@/pages/api/send";

function sendDiscordMessage(config: DiscordConfig, senderInfo: SendingObject) {
    var params = {
        username: "Your name",
        avatar_url: "",
        content: "<@419890490406862859>",
        embeds: [
            {
                "title": "Some title",
                "color": 16711680,
                "thumbnail": {
                    "url": "https://media.tenor.com/lBoeGrikScQAAAAi/obama-obamium.gif",
                },
                "fields": [
                    {
                        "name": "Your fields here",
                        "value": "Whatever you wish to send\n**aaaa**",
                        "inline": false
                    },
                    {
                        "name": "Your fields here",
                        "value": "Whatever you wish to send",
                        "inline": false
                    },
                    {
                        "name": "Your fields here",
                        "value": "Whatever you wish to send",
                        "inline": false
                    },
                    {
                        "name": "Your fields here",
                        "value": "Whatever you wish to send",
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
        console.log(r);
    }).catch((error) => {
        console.log(error);
    })
}

export default sendDiscordMessage