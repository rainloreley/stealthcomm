type EmailConfig = {
    email: string
}

type DiscordConfig = {
    webhook: string
    userPingId: string | null
}

export type {EmailConfig, DiscordConfig}