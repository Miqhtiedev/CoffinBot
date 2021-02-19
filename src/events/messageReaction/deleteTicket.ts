import { MessageReaction } from "discord.js";
import { IGuild } from "../../schemas/Guild";

export default {
  run: async function (messageReaction: MessageReaction, settings: IGuild) {   
    const ticket = settings.tickets.find((t) => t.lockMessageID === messageReaction.message.id);
    if (!ticket) return;

    settings.tickets = settings.tickets.filter((ele) => {
      return ele !== ticket;
    });
    await settings.save();

    messageReaction.message.channel.delete();
  },
};
