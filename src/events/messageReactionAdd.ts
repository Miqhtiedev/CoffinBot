import { MessageReaction, User } from "discord.js";
import Client from "../structures/Client";

import createTicket from "./messageReaction/createTicket";
import deleteTicket from "./messageReaction/deleteTicket";

export default async function messageReactionAdd(client: Client, messageReaction: MessageReaction, user: User) {  
  // Makes sure user in not a bot and that the reaction was in a guild
  if (user.bot || !messageReaction.message.guild) return;

  // Gets guild settings
  const settings = await client.getSettings(messageReaction.message.guild.id);

  // Checks if ticket system exists
  if (!settings.ticketMessageID) return;

  if (messageReaction.emoji.toString() === "📩" && messageReaction.message.id === settings.ticketMessageID) {
    createTicket.run(messageReaction, user, settings);
  } else if (messageReaction.emoji.toString() === "🔒" && settings.tickets.find(t => t.lockMessageID === messageReaction.message.id)) {
    deleteTicket.run(messageReaction, settings);
  }
}
