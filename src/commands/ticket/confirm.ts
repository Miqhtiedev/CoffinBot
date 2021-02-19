import { Message, MessageEmbed } from "discord.js";
import { IGuild } from "../../schemas/Guild";
import Client from "../../structures/Client";
import { ICommand, RunCallback } from "../../structures/Interfaces";

let confirmation = new Map<string, Message>();

function TicketCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[], settings: IGuild | null) => {
    if (!confirmation.get(message.author.id)) {
      message.channel.send(`Please do \`${client.prefix}ticket setup\` before running this command!`);
      return;
    }

    await confirmation.get(message.author.id)?.delete();
    confirmation.delete(message.author.id);

    const embed = new MessageEmbed().setTitle("Create a ticket").setDescription("To create a ticket react with 📩!");
    const ticketMessage = await message.channel.send(embed);
    ticketMessage.react("📩");
    
    if(settings) {
      settings.ticketMessageID = ticketMessage.id;
      settings.ticketChannel = ticketMessage.channel.id;
    }
    await settings?.save();

    message.delete();
  };

  return {
    description: "Confirms setup for the ticket system!",
    category: "Admin",
    guildOnly: true,
    usage: "ticket confirm",
    run,
  };
}

export default TicketCommand();

export function addToConfirmation(id: string, message: Message) {
  confirmation.set(id, message);
}
export function removeFromConfirmation(id: string) {
  confirmation.delete(id);
}
