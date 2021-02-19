import { Message } from "discord.js";
import { IGuild } from "../schemas/Guild";
import Client from "../structures/Client";

export default async function message(client: Client, message: Message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(client.prefix)) return;

  let settings: IGuild | null = null;

  if (message.guild) {
    settings = await client.getSettings(message.guild.id);
  }

  const args: string[] = message.content.slice(client.prefix.length).trim().split(/ +/g);
  const commandName = args.shift()!.toLowerCase();

  const command = client.commands.get(commandName);

  if (command) {
    client.executeCommand(command, message, args, settings);
  } else if (message.content.length > 1) {
    message.channel.send(`Unknown command! Do \`${client.prefix}help\` for help!`);
  }
}
