import { Message } from "discord.js";
import { IGuild } from "../../schemas/Guild";
import Client from "../../structures/Client";
import { ICommand, RunCallback } from "../../structures/Interfaces";
function TicketCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[], settings: IGuild | null) => {
    if(args.length === 0) {
      message.channel.send("Invalid arguments! Please specify a role!");
      return;
    }

    message.guild?.roles.fetch(args[0] as string).then(async (role) => {
      if(!role) {
        message.channel.send("Invalid role id.")        
        return;
      } 
      if(settings?.ticketRoles.includes(role.id)) {
        message.channel.send(`Role already included in role list. Do \`${client.prefix}ticket removerole ${role.id}\` to remove this role!`);
        return;
      }
      settings?.ticketRoles.push(role.id);
      await settings?.save();
      message.channel.send(`Added ${role.name} to the supported role list!`);
    }).catch(() => {
      message.channel.send("Invalid role id!");
    })

  };

  return {
    description: "Add role for the ticket system to give access to tickets!",
    category: "Admin",
    guildOnly: true,
    usage: "ticket addrole <role>",
    run,
  };
}

export default TicketCommand();
