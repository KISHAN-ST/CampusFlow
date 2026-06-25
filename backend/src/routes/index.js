const { Router } = require('express');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');

const { registerStudent, getStudent, listStudents } = require('../controllers/student.controller');
const { createTaskController, listTasks, updateTaskController, deleteTaskController } = require('../controllers/task.controller');
const { createNoticeController } = require('../controllers/notice.controller');
const { summarize, flashcards, chat, mockTest, prepPlan } = require('../controllers/ai.controller');

const router = Router();

// ── Health ────────────────────────────────────────────────
router.get('/', (req, res) => res.json({ status: 'Backend Running' }));

// ── Student ───────────────────────────────────────────────
const studentValidation = [
  body('name').notEmpty().withMessage('name is required'),
  body('phone').notEmpty().withMessage('phone is required'),
  body('gmail').notEmpty().isEmail().withMessage('a valid gmail is required'),
];

router.post('/student',      studentValidation, validate, registerStudent);
router.get('/students',      listStudents);
router.get('/student/:id',   getStudent);

// ── Task ──────────────────────────────────────────────────
const taskCreateValidation = [
  body('title').notEmpty().withMessage('title is required'),
  body('deadline').notEmpty().withMessage('deadline is required'),
  body('studentId').notEmpty().withMessage('studentId is required'),
];

router.post('/task',         taskCreateValidation, validate, createTaskController);
router.get('/tasks',         listTasks);
router.put('/task/:id',      updateTaskController);
router.delete('/task/:id',   deleteTaskController);

// ── Notice ────────────────────────────────────────────────
const noticeValidation = [
  body('title').notEmpty().withMessage('title is required'),
  body('content').notEmpty().withMessage('content is required'),
];

router.post('/notice',       noticeValidation, validate, createNoticeController);

// ── AI ────────────────────────────────────────────────────
router.post('/ai/summarize',   summarize);
router.post('/ai/flashcards',  flashcards);
router.post('/ai/chat',        chat);
router.post('/ai/mock-test',   mockTest);
router.post('/ai/prep-plan',   prepPlan);

module.exports = router;
