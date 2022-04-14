import mongoose from "mongoose";

/* CharacterSchema will correspond to a collection in your MongoDB database. */
const Connect_4_Players_Schema = new mongoose.Schema({
  player_1_nme: {
    type: String,
  },
  player_2_name: {
    type: String,
  },
  winner: {
    type: String,
  },
});

export default mongoose.models.Connect_4_Players ||
  mongoose.model("Connect_4_Players", Connect_4_Players_Schema);
