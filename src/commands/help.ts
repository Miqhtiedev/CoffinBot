import { MessageEmbed, Message } from "discord.js";
import Client from "../structures/Client";
import { ICommand, RunCallback } from "../structures/Interfaces";

function HelpCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    let categories: string[] = [];
    client.commands.forEach((cmd) => {
      if (!categories.includes(cmd.category)) categories.push(cmd.category);
    });

    const embed = new MessageEmbed().setColor("#069420");

    // Show all categories and commands
    if (args.length === 0) {
      embed.setTitle("Help | " + message.guild?.name);
      categories.forEach((cateogry) => {
        embed.addField(cateogry, getFormattedCommandsInCategory(cateogry, client));
      });
      embed.setFooter(`Do ${client.prefix}help <command> for help with a command!`);
      message.channel.send(embed);
      return;
    } else if (args[0]) {
      const commandName = args[0].toLowerCase();

      const command = client.commands.get(commandName);
      if (command === undefined) {
        message.channel.send(`Invalid command!`);
        return;
      }

      embed.setTitle(`Help | ${commandName} command`);
      embed.addField("Description:", command.description, true);
      embed.addField("Usage:", `\`${client.prefix + command.usage}\``, true);
      embed.setFooter("<> = Required | [] = Optional");
      message.channel.send(embed);
    }
  };

  return {
    description: "Shows this menu!",
    guildOnly: false,
    category: "Util",
    usage: "help [command]",
    run,
  };
}

function getFormattedCommandsInCategory(name: string, client: Client): string {
  let msg = "";
  for (const cmd of client.commands) {
    if (cmd[1].category === name) msg += `\`${cmd[0]}\`, `;
  }

  msg = msg.substring(0, msg.length - 2); // Remove extra comma and space
  return msg;
}

export default HelpCommand();
