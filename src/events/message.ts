import { Message } from "discord.js";
import Guild, { IGuild } from "../schemas/Guild"
import Client from "../structures/Client";

export default async function message(client: Client, message: Message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(client.prefix)) return;
  
  let settings: IGuild | null = null;


  if (message.guild) {
    settings = await Guild.findOne({ guildID: message.guild.id });
    if (!settings) {
      settings = new Guild({ guildID: message.guild.id });
      settings.save();
    }
  }

  const args: string[] = message.content.slice(client.prefix.length).trim().split(/ +/g);
  const commandName = args.shift()!.toLowerCase();

  const command = client.commands.get(commandName);

  if (command) {
    client.executeCommand(command, message, args, settings);
  } else {
    message.channel.send(`Unknown command! Do \`${client.prefix}help\` for help!`);
  }
}
