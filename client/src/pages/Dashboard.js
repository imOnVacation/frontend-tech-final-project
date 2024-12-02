import React from 'react';
import TicketStatusGraph from '../components/TicketStatusGraph';
import TicketTrendByShop from '../components/TicketTrendByShop';

const Dashboard = () => {
  return (
    <div className='pages-bg'>
      <TicketStatusGraph />
      <TicketTrendByShop />
    </div>
  );
};

export default Dashboard;
