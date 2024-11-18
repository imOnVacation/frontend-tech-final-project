import React from 'react';
import TicketStatusGraph from '../components/TicketStatusGraph';
import TicketStatusSummary from '../components/TicketStatusSummary';

const Dashboard = () => {
  return (
    <>
      <div>
        <h1>This is the Dashboard page</h1>
      </div>
      <div>
        <TicketStatusGraph />
        <TicketStatusSummary />
      </div>
    </>
  );
};

export default Dashboard;
