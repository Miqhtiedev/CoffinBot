import { Message, MessageEmbed } from "discord.js";
import Client from "../structures/Client";
import { ICommand, RunCallback } from "../structures/Interfaces";
function BotInfoCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    if(!client.uptime) return;
    const daysUp = Math.floor(client.uptime / 86400000);
    const hoursUp = Math.floor(client.uptime / 3600000) % 24;
    const minutesUp = Math.floor(client.uptime / 60000) % 60;
    const secondsUp = Math.floor(client.uptime / 1000) % 60;

    if (!client.user) return;
    message.channel.send(new MessageEmbed()
    .setTitle("Bot Info")
    .addField("Uptime", `${daysUp} days, ${hoursUp} hours, ${minutesUp} minutes and ${secondsUp} seconds`)
    .addField("Version", client.version)
    .setFooter("Contact Miqhtie#0001 for support with the bot.")
    .setColor("#0083dd"));
  };

  return {
    description: "Gives info about the bot!",
    guildOnly: false,
    category: "Util",
    usage: "info",
    run,
  };
}

export default BotInfoCommand();
