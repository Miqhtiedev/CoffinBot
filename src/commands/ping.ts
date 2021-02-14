import { Message } from "discord.js";
import Client from "../structures/Client";
import { ICommand, RunCallback } from "../structures/Interfaces";
function PingCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    message.channel.send(`Latency is \`${Date.now() - message.createdTimestamp}ms\`, pong!`);
  };

  return {
    description: "Pings discord!",
    guildOnly: false,
    category: "Util",
    usage: "ping",
    run,
  };
}

export default PingCommand();
