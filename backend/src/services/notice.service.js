const supabase = require('../config/supabaseClient');

const TABLE = 'notices';

const createNotice = async ({ title, content, summary }) => {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ title, content, summary: summary || null }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

module.exports = { createNotice };
