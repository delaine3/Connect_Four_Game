import mongoose from 'mongoose'


/* CharacterSchema will correspond to a collection in your MongoDB database. */
const connect_4_Player_Schema = new mongoose.Schema({

  name: {

    type: String,
  },
  score: {

    type: Number,
  },



})

export default mongoose.models.connect_4_Player || mongoose.model('connect_4_Player', connect_4_Player_Schema)
