import { MessageEmbed, MessageReaction, User } from "discord.js";
import { ITicket, IGuild } from "../../schemas/Guild";
import logger from "../../utils/Logger";

export default {
  run: async function messageReactionAdd(messageReaction: MessageReaction, user: User, settings: IGuild) {
    messageReaction.message.reactions.resolve("📩")?.users.remove(user.id);

    // Checks if ticket already exists
    if (settings.tickets.find((t) => t.member === user.id)) return;

    const ticketNumber = settings.totalTickets + 1;
    settings.totalTickets = ticketNumber;
    await settings.save();

    messageReaction.message.guild?.channels
      .create(`ticket-${ticketNumber}`)
      .then(async (channel) => {
        const embed = new MessageEmbed()
          .setTitle("Welcome to the ticket!")
          .setDescription("Staff will be with you shortly, please be patient. When you are ready to close this ticket react to this message with the lock icon!")
          .setFooter("React with 🔒 to close the ticket!");

        await channel.updateOverwrite(user, { VIEW_CHANNEL: true, SEND_MESSAGES: true, ATTACH_FILES: true, EMBED_LINKS: true, USE_EXTERNAL_EMOJIS: true });
        if (messageReaction.message.guild) await channel.updateOverwrite(messageReaction.message.guild.roles.everyone, { VIEW_CHANNEL: false });
        settings.ticketRoles.forEach(async (roleid) => {
          channel.guild.roles
            .fetch(roleid)
            .then((role) => {
              if (role) channel.updateOverwrite(role, { VIEW_CHANNEL: true, SEND_MESSAGES: true, ATTACH_FILES: true, EMBED_LINKS: true, USE_EXTERNAL_EMOJIS: true });
            })
            .catch((err) => {
              logger.error(err);
            });
        });
        const lockMessage = await channel.send(embed);
        lockMessage.react("🔒");
        lockMessage.pin();

        const ticket: ITicket = {
          member: user.id,
          lockMessageID: lockMessage.id,
          channelID: channel.id,
        };
        settings.tickets.push(ticket);
        await settings.save();
      })
      .catch((err) => {
        logger.error(err);
      });
  },
};
