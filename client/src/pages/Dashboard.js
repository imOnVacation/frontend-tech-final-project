import React from 'react';
import TicketStatusGraph from '../components/TicketStatusGraph';
import TicketTrendByShop from '../components/TicketTrendByShop';

const Dashboard = () => {
  return (
    <div>
      <TicketStatusGraph />
      <TicketTrendByShop />
    </div>
  );
};

export default Dashboard;
