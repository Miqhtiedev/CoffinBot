import { Message } from "discord.js";
import Client from "../structures/Client";
export default async function channelDelete(client: Client, message: Message) {
  if (!message.guild) return;
  const settings = await client.getSettings(message.guild.id);
  if (settings.ticketMessageID === message.id) {
    settings.ticketChannel = undefined;
    settings.ticketMessageID = undefined;
    settings.totalTickets = 0;
    settings.tickets = [];
    await settings.save();
  }
}
