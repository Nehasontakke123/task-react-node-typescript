import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Student } from './src/models/Student.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/student-management';

async function main() {
  console.log('Connecting to:', MONGO_URI);
  await mongoose.connect(MONGO_URI);
  console.log('Connected successfully!');

  const count = await Student.countDocuments();
  console.log('Total student records in DB:', count);

  const students = await Student.find().limit(5);
  console.log('Sample student documents in DB:');
  console.dir(students.map(s => s.toObject()), { depth: null });

  await mongoose.disconnect();
}

main().catch(console.error);
