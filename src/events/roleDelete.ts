import { Role } from "discord.js";
import Client from "../structures/Client";

export default async function roleDelete(client: Client, role: Role) {
  const settings = await client.getSettings(role.guild.id);
  if(settings.ticketRoles.includes(role.id)) {
    settings.ticketRoles = settings.ticketRoles.filter((ele) => {
      return ele !== role.id;
    })
    await settings.save();
  }
}
