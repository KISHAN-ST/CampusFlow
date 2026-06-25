const asyncHandler = require('../middlewares/asyncHandler');
const { createStudent, getStudentById, getAllStudents } = require('../services/student.service');
const { sendSuccess, sendError } = require('../utils/response');

const registerStudent = asyncHandler(async (req, res) => {
  const { name, branch, year, subjects, phone, gmail } = req.body;
  const student = await createStudent({ name, branch, year, subjects, phone, gmail });
  return sendSuccess(res, 'Student registered successfully', student, 201);
});

const getStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const student = await getStudentById(id);
  if (!student) return sendError(res, 'Student not found', 404);
  return sendSuccess(res, 'Student fetched successfully', student);
});

const listStudents = asyncHandler(async (req, res) => {
  const students = await getAllStudents();
  return sendSuccess(res, 'Students fetched successfully', students);
});

module.exports = { registerStudent, getStudent, listStudents };
