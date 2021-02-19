import { Message, TextChannel } from "discord.js";
import { IGuild } from "../../schemas/Guild";
import Client from "../../structures/Client";
import { ICommand, RunCallback } from "../../structures/Interfaces";
import logger from "../../utils/Logger";

function TicketCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[], settings: IGuild | null) => {
    if (!settings?.ticketMessageID) {
      message.channel.send(`Ticket system does not exist! Do \`${client.prefix}ticket setup\` to create one.`);
      return;
    }

    // Delete all ticket channels
    settings.tickets.forEach((ticket) => {
      message.guild?.channels.cache.find(c => c.id === ticket.channelID)?.delete();
    })

    const ticketid = settings.ticketMessageID;
    const ticketChannel = settings.ticketChannel;

    settings.ticketMessageID = undefined;
    settings.ticketChannel = undefined;
    settings.tickets = [];
    settings.totalTickets = 0;
    await settings.save();

    // Get "Welcome to ticket" message and delete it.
    (message.guild?.channels.cache.find((c) => c.id === ticketChannel) as TextChannel).messages
      .fetch(ticketid)
      .then(async (msg) => {
        await msg.delete();
        message.channel.send("Removed the ticket system.");
      })
      .catch((err) => {
        message.channel.send("An unexpected error occured while trying to run this command!");
        logger.error(err);
        return;
      });
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
