import { Message, MessageEmbed } from "discord.js";
import { IGuild } from "../../schemas/Guild";
import Client from "../../structures/Client";
import { ICommand, RunCallback } from "../../structures/Interfaces";
import { addToConfirmation, removeFromConfirmation } from "./confirm";

function TicketCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[], settings: IGuild | null) => {
    if (settings?.ticketMessageID) {
      message.channel.send(`Ticket system already exists! Do \`${client.prefix}ticket remove\` to remove the ticket system!`);
      return;
    }

    message.delete();
    const embed = new MessageEmbed().setTitle("⚠️ Confirmation Needed⚠️").setDescription(`Please run \`${client.prefix}ticket confirm\` in the next 10 seconds!`).setColor("#0xc4fa00");
    const confirmationMessage = await message.channel.send(embed);
    addToConfirmation(message.author.id, confirmationMessage);
    setTimeout(() => {
      removeFromConfirmation(message.author.id);
      confirmationMessage.delete().catch(() => {});
    }, 10000);
  };

  return {
    description: "Sets up the ticket system!",
    category: "Admin",
    guildOnly: true,
    usage: "ticket setup",
    run,
  };
}

export default TicketCommand();
