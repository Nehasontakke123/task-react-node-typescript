import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const studentSchema = new Schema(
  {
    payload: {
      type: String,
      required: true,
    },
    emailHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export type StudentDocument = InferSchemaType<typeof studentSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Student = mongoose.model('Student', studentSchema);
