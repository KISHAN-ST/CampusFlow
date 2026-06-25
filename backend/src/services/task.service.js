const supabase = require('../config/supabaseClient');

const TABLE = 'tasks';

const createTask = async ({ title, subject, description, deadline, reminderTime, calendar, studentId }) => {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{
      title,
      subject,
      description,
      deadline,
      reminder_time: reminderTime || null,
      calendar: calendar !== undefined ? String(calendar) : null,
      student_id: studentId,
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const getAllTasks = async () => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*, students(name, phone)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const updateTask = async (id, updates) => {
  const allowed = {};
  if (updates.title !== undefined)        allowed.title        = updates.title;
  if (updates.subject !== undefined)      allowed.subject      = updates.subject;
  if (updates.description !== undefined)  allowed.description  = updates.description;
  if (updates.deadline !== undefined)     allowed.deadline     = updates.deadline;
  if (updates.reminderTime !== undefined) allowed.reminder_time = updates.reminderTime;
  if (updates.calendar !== undefined)     allowed.calendar     = String(updates.calendar);
  if (updates.status !== undefined)       allowed.status       = updates.status;

  const { data, error } = await supabase
    .from(TABLE)
    .update(allowed)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const deleteTask = async (id) => {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
};

module.exports = { createTask, getAllTasks, updateTask, deleteTask };
