import { Channel, TextChannel } from "discord.js";

import Client from "../structures/Client";
export default async function channelDelete(client: Client, channel: Channel) {
  if (!channel.isText()) return;

  const txtChannel = channel as TextChannel;

  if (!txtChannel.guild) return;

  const settings = await client.getSettings(txtChannel.guild.id);

  if (settings.ticketChannel === txtChannel.id) {
    settings.ticketChannel = undefined;
    settings.ticketMessageID = undefined;
    settings.tickets = [];
    settings.ticketRoles = [];
    settings.totalTickets = 0;
    await settings.save();
  } else if (settings.tickets.find((t) => t.channelID === channel.id)) {
    const ticket = settings.tickets.find((t) => t.channelID === channel.id);
    settings.tickets = settings.tickets.filter((ele) => {
      return ele !== ticket;
    });
    await settings.save();
  }
}
