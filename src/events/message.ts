import { Message } from "discord.js";
import Client from "../structures/Client";

export default async function message(client: Client, message: Message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(client.prefix)) return;

  const args: string[] = message.content.slice(client.prefix.length).trim().split(/ +/g);
  const commandName = args.shift()!.toLowerCase();

  const command = client.commands.get(commandName);

  if (command) {
    client.executeCommand(command, message, args);
  } else {
    message.channel.send(`Unknown command! Do \`${client.prefix}help\` for help!`);
  }
}
