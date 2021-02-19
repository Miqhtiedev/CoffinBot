import { Message } from "discord.js";
import { IGuild } from "../../schemas/Guild";
import Client from "../../structures/Client";
import { ICommand, RunCallback } from "../../structures/Interfaces";
function TicketCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[], settings: IGuild | null) => {
    if (args.length === 0) {
      message.channel.send("Invalid arguments! Please specify a role!");
      return;
    }

    message.guild?.roles
      .fetch(args[0] as string)
      .then(async (role) => {
        if (!role) {
          message.channel.send("Invalid role id.");
          return;
        }

        if (!settings?.ticketRoles.includes(role.id)) {
          message.channel.send(`Role is not supported. Do \`${client.prefix}ticket addrole ${role.id}\` to add this role!`);
          return;
        }

        settings.ticketRoles = settings.ticketRoles.filter((ele) => {
          return ele !== role.id;
        });

        await settings?.save();
        message.channel.send(`Remvoed ${role.name} from the supported role list!`);
      })
      .catch(() => {
        message.channel.send("Invalid role id!");
      });
  };

  return {
    description: "Remove role from the supported ticket roles!",
    category: "Admin",
    guildOnly: true,
    usage: "ticket removerole <role>",
    run,
  };
}

export default TicketCommand();
