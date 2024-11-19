import React from 'react';
import TicketStatusGraph from '../components/TicketStatusGraph';
import TicketStatusSummary from '../components/TicketStatusSummary';

const Dashboard = () => {
  return (
    <>
      <div>
        <TicketStatusGraph />
      </div>
      <div>
        <TicketStatusSummary />
      </div>
    </>
  );
};

export default Dashboard;
