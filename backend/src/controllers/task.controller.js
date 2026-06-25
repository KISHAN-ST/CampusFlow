const asyncHandler = require('../middlewares/asyncHandler');
const { createTask, getAllTasks, updateTask, deleteTask } = require('../services/task.service');
const { getStudentById } = require('../services/student.service');
const { sendDeadlineWebhook } = require('../services/webhook.service');
const { sendSuccess, sendError } = require('../utils/response');

const createTaskController = asyncHandler(async (req, res) => {
  const { title, subject, description, deadline, reminderTime, calendar, studentId } = req.body;

  const task = await createTask({ title, subject, description, deadline, reminderTime, calendar, studentId });

  // Fire-and-forget: resolve student info and trigger n8n webhook
  getStudentById(studentId)
    .then((student) => {
      console.log('[TASK] Student resolved for webhook:', student ? student.name : 'NOT FOUND', '| studentId:', studentId);
      if (student) {
        sendDeadlineWebhook({
          studentName: student.name,
          phone:       student.phone,
          email:       student.gmail,
          title,
          description,
          deadline,
          calendar,
        });
      }
    })
    .catch((err) => console.error('[TASK] Failed to resolve student for webhook:', err.message));

  return sendSuccess(res, 'Task created successfully', task, 201);
});

const listTasks = asyncHandler(async (req, res) => {
  const tasks = await getAllTasks();
  return sendSuccess(res, 'Tasks fetched successfully', tasks);
});

const updateTaskController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const task = await updateTask(id, req.body);
  if (!task) return sendError(res, 'Task not found', 404);
  return sendSuccess(res, 'Task updated successfully', task);
});

const deleteTaskController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteTask(id);
  return sendSuccess(res, 'Task deleted successfully', {});
});

module.exports = { createTaskController, listTasks, updateTaskController, deleteTaskController };
