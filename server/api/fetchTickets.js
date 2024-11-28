const supabase = require('../supabaseClient.js');

const fetchTickets = async () => {
  let allTickets = [];
  let page = 0;
  const pageSize = 1000; // Supabase fetch limit per query

  while (true) {
    const { data, error } = await supabase
      .from('ticket_info')
      .select('*')
      .range(page * pageSize, (page + 1) * pageSize - 1); // Fetch a chunk

    if (error) {
      console.error('Error fetching tickets:', error.message);
      return null;
    }

    if (data.length === 0) {
      break; // No more data to fetch
    }

    allTickets = allTickets.concat(data);
    page++;
  }

  return allTickets;
};

module.exports = fetchTickets;
