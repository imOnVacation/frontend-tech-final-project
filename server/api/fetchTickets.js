const supabase = require('../supabaseClient.js');

const fetchTickets = async () => {
  const { data, error } = await supabase.from('ticket_info').select('*');
  if (error) {
    console.error('Error fetching tickets:', error.message);
    return null;
  }
  console.log(data);
  return data;
};

module.exports = fetchTickets;
