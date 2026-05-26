import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { Student } from '../models/Student.js';
import { createEmailHash, decryptBackendLayer, decryptFrontendPayload, encryptBackendLayer, encryptFrontendPayload, type StudentPayload } from '../utils/crypto.js';

const publicPayload = (payload: StudentPayload) => {
  const { password: _password, ...student } = payload;
  return student;
};

const validateStudentPayload = (payload: StudentPayload, requirePassword: boolean) => {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9+\-\s()]{7,18}$/;
  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  if (!payload.fullName || payload.fullName.trim().length < 3) errors.push('Full name must be at least 3 characters');
  if (!emailRegex.test(payload.email || '')) errors.push('Valid email is required');
  if (!phoneRegex.test(payload.phoneNumber || '')) errors.push('Valid phone number is required');
  if (!payload.dateOfBirth || Number.isNaN(Date.parse(payload.dateOfBirth))) errors.push('Valid date of birth is required');
  if (!['Male', 'Female', 'Other'].includes(payload.gender)) errors.push('Valid gender is required');
  if (!payload.address || payload.address.trim().length < 8) errors.push('Address must be at least 8 characters');
  if (!payload.courseEnrolled) errors.push('Course enrolled is required');
  if (requirePassword && !payload.password) errors.push('Password is required');
  if (payload.password && !strongPassword.test(payload.password)) errors.push('Password must include uppercase, lowercase, number, and symbol');

  return errors;
};

const validationErrors = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ message: 'Validation failed', errors: errors.array() });
    return true;
  }
  return false;
};

export const registerStudent = async (req: Request, res: Response) => {
  try {
    if (validationErrors(req, res)) return;

    const { payload } = req.body as { payload: string };
    const decrypted = decryptFrontendPayload<StudentPayload>(payload);
    const payloadErrors = validateStudentPayload(decrypted, true);
    if (payloadErrors.length) {
      return res.status(422).json({ message: 'Student data validation failed', errors: payloadErrors });
    }
    const emailHash = createEmailHash(decrypted.email);

    const existing = await Student.findOne({ emailHash });
    if (existing) {
      return res.status(409).json({ message: 'A student with this email already exists' });
    }

    if (!decrypted.password) {
      return res.status(422).json({ message: 'Password is required' });
    }

    const passwordHash = await bcrypt.hash(decrypted.password, 12);
    const frontendCipherWithoutPassword = encryptFrontendPayload(publicPayload(decrypted));

    await Student.create({
      payload: encryptBackendLayer(frontendCipherWithoutPassword),
      emailHash,
      passwordHash,
    });

    return res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to register student' });
  }
};

export const loginStudent = async (req: Request, res: Response) => {
  try {
    if (validationErrors(req, res)) return;

    const { email, password } = req.body as { email: string; password: string };
    const student = await Student.findOne({ emailHash: createEmailHash(email) });

    if (!student) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const matches = await bcrypt.compare(password, student.passwordHash);
    if (!matches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const frontendCipher = decryptBackendLayer(student.payload);
    const decrypted = decryptFrontendPayload<StudentPayload>(frontendCipher);
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT_SECRET is missing' });
    }

    const token = jwt.sign({ id: student._id.toString(), email: decrypted.email }, jwtSecret, { expiresIn: '1d' });

    return res.json({
      token,
      user: {
        id: student._id.toString(),
        email: decrypted.email,
        fullName: decrypted.fullName,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to login' });
  }
};

export const getStudents = async (_req: Request, res: Response) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    const response = students.map((student) => ({
      _id: student._id.toString(),
      payload: decryptBackendLayer(student.payload),
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    }));

    return res.json({ students: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to fetch students' });
  }
};

export const getLatestStudents = async (_req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [students, allStudents, totalStudents, registeredToday] = await Promise.all([
      Student.find().sort({ createdAt: -1 }).limit(5),
      Student.find().select('payload'),
      Student.countDocuments(),
      Student.countDocuments({ createdAt: { $gte: today } }),
    ]);

    const activeCourses = new Set(
      allStudents.map((student) => {
        const frontendCipher = decryptBackendLayer(student.payload);
        return decryptFrontendPayload<StudentPayload>(frontendCipher).courseEnrolled;
      }),
    );

    const latestStudents = students.map((student) => {
      const frontendCipher = decryptBackendLayer(student.payload);
      const decrypted = decryptFrontendPayload<StudentPayload>(frontendCipher);

      return {
        _id: student._id.toString(),
        fullName: decrypted.fullName,
        courseEnrolled: decrypted.courseEnrolled,
        createdAt: student.createdAt,
      };
    });

    return res.json({
      students: latestStudents,
      stats: {
        totalStudents,
        activeCourses: activeCourses.size,
        registeredToday,
        encryptionLayers: 2,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to fetch latest students' });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    if (validationErrors(req, res)) return;

    const { id } = req.params;
    const { payload } = req.body as { payload: string };
    const decrypted = decryptFrontendPayload<StudentPayload>(payload);
    const payloadErrors = validateStudentPayload(decrypted, false);
    if (payloadErrors.length) {
      return res.status(422).json({ message: 'Student data validation failed', errors: payloadErrors });
    }
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const emailHash = createEmailHash(decrypted.email);
    const duplicate = await Student.findOne({ emailHash, _id: { $ne: id } });
    if (duplicate) {
      return res.status(409).json({ message: 'Another student already uses this email' });
    }

    const frontendCipherWithoutPassword = encryptFrontendPayload(publicPayload(decrypted));
    student.payload = encryptBackendLayer(frontendCipherWithoutPassword);
    student.emailHash = emailHash;
    if (decrypted.password) {
      student.passwordHash = await bcrypt.hash(decrypted.password, 12);
    }

    await student.save();
    return res.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to update student' });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Student not found' });
    }
    return res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to delete student' });
  }
};
