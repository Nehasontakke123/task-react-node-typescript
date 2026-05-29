import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { Student } from '../models/Student.js';
import {
  createEmailHash,
  decryptBackendLayer,
  encryptBackendLayer,
  decryptFrontendField,
  type StudentPayload
} from '../utils/crypto.js';


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

    const { fullName, email, phoneNumber, dateOfBirth, gender, address, courseEnrolled, password } = req.body as {
      fullName: string;
      email: string;
      phoneNumber: string;
      dateOfBirth: string;
      gender: string;
      address: string;
      courseEnrolled: string;
      password?: string;
    };

    const decrypted: StudentPayload = {
      fullName: decryptFrontendField(fullName),
      email: decryptFrontendField(email),
      phoneNumber: decryptFrontendField(phoneNumber),
      dateOfBirth: decryptFrontendField(dateOfBirth),
      gender: decryptFrontendField(gender) as 'Male' | 'Female' | 'Other',
      address: decryptFrontendField(address),
      courseEnrolled: decryptFrontendField(courseEnrolled),
      password: password ? decryptFrontendField(password) : undefined,
    };

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

    await Student.create({
      fullName: encryptBackendLayer(fullName),
      email: encryptBackendLayer(email),
      phoneNumber: encryptBackendLayer(phoneNumber),
      dateOfBirth: encryptBackendLayer(dateOfBirth),
      gender: encryptBackendLayer(gender),
      address: encryptBackendLayer(address),
      courseEnrolled: encryptBackendLayer(courseEnrolled),
      emailHash,
      passwordHash,
      isDeleted: false,
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
    const decryptedEmail = decryptFrontendField(email);
    const decryptedPassword = decryptFrontendField(password);

    const emailHash = createEmailHash(decryptedEmail);
    const student = await Student.findOne({ emailHash, isDeleted: { $ne: true } });

    if (!student) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const matches = await bcrypt.compare(decryptedPassword, student.passwordHash);
    if (!matches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const decryptedFullName = decryptFrontendField(decryptBackendLayer(student.fullName));
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT_SECRET is missing' });
    }

    const token = jwt.sign({ id: student._id.toString(), email: decryptedEmail }, jwtSecret, { expiresIn: '1d' });

    return res.json({
      token,
      user: {
        id: student._id.toString(),
        email: decryptedEmail,
        fullName: decryptedFullName,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to login' });
  }
};

export const getStudents = async (_req: Request, res: Response) => {
  try {
    const students = await Student.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });
    const response: any[] = [];

    for (const student of students) {
      try {
        // Guard against legacy documents that may be missing new field-level fields
        if (!student.fullName || !student.email) {
          console.warn(`Skipping legacy student record ${student._id} — missing field-level encrypted fields.`);
          continue;
        }
        response.push({
          _id: student._id.toString(),
          // decryptBackendLayer returns the frontend cipher (inner envelope)
          // The client calls decryptField() on each to get the final plaintext
          fullName: decryptBackendLayer(student.fullName),
          email: decryptBackendLayer(student.email),
          phoneNumber: decryptBackendLayer(student.phoneNumber),
          dateOfBirth: decryptBackendLayer(student.dateOfBirth),
          gender: decryptBackendLayer(student.gender),
          address: decryptBackendLayer(student.address),
          courseEnrolled: decryptBackendLayer(student.courseEnrolled),
          createdAt: student.createdAt,
          updatedAt: student.updatedAt,
        });
      } catch (fieldErr) {
        console.error(`Failed to decrypt student record ${student._id}:`, fieldErr);
        // Skip corrupt/legacy records instead of crashing the entire list
      }
    }

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
      Student.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).limit(5),
      Student.find({ isDeleted: { $ne: true } }).select('fullName courseEnrolled'),
      Student.countDocuments({ isDeleted: { $ne: true } }),
      Student.countDocuments({ isDeleted: { $ne: true }, createdAt: { $gte: today } }),
    ]);

    // Guard for legacy documents missing encrypted fields
    const activeCourses = new Set<string>();
    for (const student of allStudents) {
      try {
        if (!student.courseEnrolled) continue;
        const decrypted = decryptFrontendField(decryptBackendLayer(student.courseEnrolled));
        activeCourses.add(decrypted);
      } catch (e) {
        console.error(`Failed to decrypt course for student ${student._id}:`, e);
      }
    }

    const latestStudents = [] as any[];
    for (const student of students) {
      try {
        latestStudents.push({
          _id: student._id.toString(),
          fullName: decryptFrontendField(decryptBackendLayer(student.fullName)),
          courseEnrolled: decryptFrontendField(decryptBackendLayer(student.courseEnrolled)),
          createdAt: student.createdAt,
        });
      } catch (e) {
        console.error(`Failed to decrypt latest student ${student._id}:`, e);
      }
    }

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
    const { fullName, email, phoneNumber, dateOfBirth, gender, address, courseEnrolled, password } = req.body as {
      fullName: string;
      email: string;
      phoneNumber: string;
      dateOfBirth: string;
      gender: string;
      address: string;
      courseEnrolled: string;
      password?: string;
    };

    const decrypted: StudentPayload = {
      fullName: decryptFrontendField(fullName),
      email: decryptFrontendField(email),
      phoneNumber: decryptFrontendField(phoneNumber),
      dateOfBirth: decryptFrontendField(dateOfBirth),
      gender: decryptFrontendField(gender) as 'Male' | 'Female' | 'Other',
      address: decryptFrontendField(address),
      courseEnrolled: decryptFrontendField(courseEnrolled),
      password: password ? decryptFrontendField(password) : undefined,
    };

    const payloadErrors = validateStudentPayload(decrypted, false);
    if (payloadErrors.length) {
      return res.status(422).json({ message: 'Student data validation failed', errors: payloadErrors });
    }

    const student = await Student.findOne({ _id: id, isDeleted: { $ne: true } });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const emailHash = createEmailHash(decrypted.email);
    const duplicate = await Student.findOne({ emailHash, _id: { $ne: id } });
    if (duplicate) {
      return res.status(409).json({ message: 'Another student already uses this email' });
    }

    student.fullName = encryptBackendLayer(fullName);
    student.email = encryptBackendLayer(email);
    student.phoneNumber = encryptBackendLayer(phoneNumber);
    student.dateOfBirth = encryptBackendLayer(dateOfBirth);
    student.gender = encryptBackendLayer(gender);
    student.address = encryptBackendLayer(address);
    student.courseEnrolled = encryptBackendLayer(courseEnrolled);
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
    const student = await Student.findById(req.params.id);
    if (!student || student.isDeleted) {
      return res.status(404).json({ message: 'Student not found' });
    }
    student.isDeleted = true;
    await student.save();
    return res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to delete student' });
  }
};
