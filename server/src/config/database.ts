import mongoose from 'mongoose';

export async function connectDatabase(uri: string) {
  if (!uri) return false;
  await mongoose.connect(uri);
  return true;
}
