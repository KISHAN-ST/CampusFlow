const supabase = require('../config/supabaseClient');

const TABLE = 'students';

const createStudent = async ({ name, branch, year, subjects, phone, gmail }) => {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ name, branch, year: year ? Number(year) : null, subjects, phone, gmail }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const getStudentById = async (id) => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const getAllStudents = async () => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const getAllStudentPhones = async () => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('phone');

  if (error) throw new Error(error.message);
  return data.map((s) => s.phone);
};

module.exports = { createStudent, getStudentById, getAllStudents, getAllStudentPhones };
