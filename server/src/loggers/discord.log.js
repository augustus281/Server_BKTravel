'use strict'

const { Client, GatewayIntentBits } = require("discord.js")

const {
    CHANNEL_ID, TOKEN_DISCORD
} = process.env

class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        })

        this.channelId = CHANNEL_ID

        this.client.on('ready', () => {
            console.log(`Logged is as ${this.client.user.tag}!`)
        })

        this.client.login(TOKEN_DISCORD)
    }

    sendToFormatCode(logData) {
        const { code, message = "This is some addittional information about the code.", title = "Code Example" } = logData

        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt('00ff00', 16), // convert hexadecimal color code to integer
                    title,
                    description: '```json\n' + JSON.stringify(code, null, 2) + '\n```'
                }
            ]
        }
        const channel = this.client.channels.cache.get(this.channelId)
        if (!channel) {
            console.error(`Couldn't find the channel...`, this.channelId);
            return;
        }
        channel.send(codeMessage).catch(e => console.error(e))
    }

    sendToMessage(message = 'message') {
        const channel = this.client.channels.cache.get(this.channelId)
        if (!channel) {
            console.error(`Couldn't find the channel...`, this.channelId);
            return;
        }
        channel.send(message).catch(e => console.error(e))
           
    }
}

// const loggerService = new LoggerService() 

module.exports =  new LoggerService() 