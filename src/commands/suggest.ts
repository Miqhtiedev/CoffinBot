import { Message, MessageEmbed, TextChannel } from "discord.js";
import Client from "../structures/Client";
import { ICommand, RunCallback } from "../structures/Interfaces";
function SuggestionCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    if (args.length === 0) {
      message.channel.send("Invalid Syntax.\n`c!suggest <suggestion>`");
      return;
    }

    const suggestion = args.join(" ");
    const channel = message.guild?.channels.cache.find((c) => c.id === "760262972068855874" || c.name === "suggestions") as TextChannel;
    if (!channel) {
      message.channel.send("I couldn't find the suggestion channel?");
      return;
    }

    const suggestionEmbed = new MessageEmbed()
      .setFooter(`${message.member?.displayName} • CoffinBot v${client.version}`, message.author.displayAvatarURL())
      .setColor("#007FFF")
      .setTitle("Suggestion:")
      .setDescription(suggestion)
      .setTimestamp();
    channel.send(suggestionEmbed).then((msg) => {
      msg.react("✅");
      msg.react("❎");
    });
  };

  return {
    description: "Make a suggestion to the discord!",
    guildOnly: false,
    category: "Util",
    usage: "suggest <suggestion>",
    run,
  };
}

export default SuggestionCommand();
