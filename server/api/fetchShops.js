const supabase = require('../supabaseClient.js');

const fetchShops = async () => {
  try {
    const { data, error } = await supabase.from('ticket_info').select('shop');

    if (error) {
      console.error('Error fetching shops:', error.message);
      return null;
    }

    const uniqueShops = Array.from(new Set(data.map((item) => item.shop))).sort(
      (a, b) => a.localeCompare(b)
    );

    return uniqueShops.map((shop) => ({ shop }));
  } catch (error) {
    console.error('Unexpected error fetching shops:', error.message);
    return null;
  }
};

module.exports = fetchShops;
