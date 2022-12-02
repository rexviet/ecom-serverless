import * as Mongoose from 'mongoose';
import path from 'path';

let connected = false;
const filePath = path.join(__dirname, 'rds-combined-ca-bundle.pem');

const uri = process.env.CONNECTION_STRING;

export const connect = async () => {
  if (!connected) {
    // mongoose.connect()
    await Mongoose.connect(uri, {
      serverSelectionTimeoutMS: 50000,
      ssl: true,
      sslCA: filePath,
      tlsCAFile: filePath,
      tls: true,
    });
    console.log('connect success');
    connected = true;
  }
};
