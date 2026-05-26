import { Router } from 'express';
import { body, param } from 'express-validator';
import { deleteStudent, getLatestStudents, getStudents, loginStudent, registerStudent, updateStudent } from '../controllers/studentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

const payloadRule = body('payload').isString().notEmpty().withMessage('Encrypted payload is required');

router.post('/register', payloadRule, registerStudent);

router.get('/students/latest', getLatestStudents);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  loginStudent,
);

router.get('/students', authMiddleware, getStudents);

router.put(
  '/student/:id',
  authMiddleware,
  [param('id').isMongoId().withMessage('Valid student id is required'), payloadRule],
  updateStudent,
);

router.delete(
  '/student/:id',
  authMiddleware,
  [param('id').isMongoId().withMessage('Valid student id is required')],
  deleteStudent,
);

export default router;
