import { Router } from 'express';
import { body, param } from 'express-validator';
import { deleteStudent, getLatestStudents, getStudents, loginStudent, registerStudent, updateStudent } from '../controllers/studentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

const loginRules = [
  body('email').isString().notEmpty().withMessage('Email is required'),
  body('password').isString().notEmpty().withMessage('Password is required'),
];

const registerRules = [
  body('fullName').isString().notEmpty().withMessage('Full name is required'),
  body('email').isString().notEmpty().withMessage('Email is required'),
  body('phoneNumber').isString().notEmpty().withMessage('Phone number is required'),
  body('dateOfBirth').isString().notEmpty().withMessage('Date of birth is required'),
  body('gender').isString().notEmpty().withMessage('Gender is required'),
  body('address').isString().notEmpty().withMessage('Address is required'),
  body('courseEnrolled').isString().notEmpty().withMessage('Course enrolled is required'),
  body('password').isString().notEmpty().withMessage('Password is required'),
];

const updateRules = [
  param('id').isMongoId().withMessage('Valid student id is required'),
  body('fullName').isString().notEmpty().withMessage('Full name is required'),
  body('email').isString().notEmpty().withMessage('Email is required'),
  body('phoneNumber').isString().notEmpty().withMessage('Phone number is required'),
  body('dateOfBirth').isString().notEmpty().withMessage('Date of birth is required'),
  body('gender').isString().notEmpty().withMessage('Gender is required'),
  body('address').isString().notEmpty().withMessage('Address is required'),
  body('courseEnrolled').isString().notEmpty().withMessage('Course enrolled is required'),
  body('password').optional().isString(),
];

router.post('/register', registerRules, registerStudent);

router.get('/students/latest', getLatestStudents);

router.post('/login', loginRules, loginStudent);

router.get('/students', authMiddleware, getStudents);

router.put('/student/:id', authMiddleware, updateRules, updateStudent);

router.delete(
  '/student/:id',
  authMiddleware,
  [param('id').isMongoId().withMessage('Valid student id is required')],
  deleteStudent,
);

export default router;
