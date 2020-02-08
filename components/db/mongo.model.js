import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const redisSchema = new Schema({
  originalChannel: String,
  originalMessage: String,
})

const redisModel = mongoose.model('redisModel', redisSchema);

export { redisModel };