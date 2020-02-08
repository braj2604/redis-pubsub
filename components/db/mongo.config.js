import mongoose from 'mongoose';

export async function connect() {
  const url = process.env.DB_URL;
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}