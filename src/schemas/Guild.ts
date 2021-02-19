import { Schema, model, Document } from "mongoose";

export interface ITicket {
  member: string, 
  lockMessageID: string,
  channelID: string
}

export interface IGuild extends Document {
  guildID: string;
  
  ticketMessageID: string | undefined,
  ticketChannel: string | undefined
  totalTickets: number
  ticketRoles: Array<string>
  tickets: ITicket[];
}

const GuildScema = new Schema({
  guildID: { type: String, requried: true, index: true, unique: true },

  ticketMessageID: {type: String, default: undefined},
  ticketChannel: {type: String, default: undefined},
  totalTickets: {type: Number, default: 0},
  ticketRoles: {type: Array<string>(), default: []},
  tickets: {type: Array<ITicket>(), default: []}
});

export default model<IGuild>("Guild", GuildScema);