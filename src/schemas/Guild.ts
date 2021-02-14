import { Schema, model, Document } from "mongoose";
export interface IGuild extends Document {
  guildID: string;
}

const GuildScema = new Schema({
  guildID: { type: String, requried: true, index: true, unique: true },
});

export default model<IGuild>("Guild", GuildScema);