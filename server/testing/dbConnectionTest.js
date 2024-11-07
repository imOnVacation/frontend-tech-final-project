const supabase = require('../supabaseClient');

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('ticket_info')
      .select('*')
      .limit(1);
    if (error) {
      console.error('Connection failed:', error.message);
    } else {
      console.log('Connection successful. Retrieved data:', data);
    }
  } catch (error) {
    console.error('Unexpected error occurred:', error);
  }
}

testConnection();
