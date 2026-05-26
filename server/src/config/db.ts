import dns from 'node:dns';
import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  const directMongoUri = process.env.MONGO_DIRECT_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is missing');
  }

  const dnsServers = process.env.MONGO_DNS_SERVERS?.split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers?.length) {
    dns.setServers(dnsServers);
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const isSrvDnsFailure = message.includes('querySrv') || message.includes('ENOTFOUND') || message.includes('ECONNREFUSED');

    if (!directMongoUri || !isSrvDnsFailure) {
      throw error;
    }

    console.warn('MongoDB SRV lookup failed. Retrying with MONGO_DIRECT_URI...');
    await mongoose.connect(directMongoUri, {
      serverSelectionTimeoutMS: 15000,
    });
  }

  console.log('MongoDB connected');
};
