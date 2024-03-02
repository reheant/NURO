import React from 'react';

const ReminderCard = () => {
  return (
    <div className="bg-gray-800 text-white w-full mx-auto rounded-lg border-1 border-white border-radius-sm flex items-center justify-between">
      <div>
        <div className="text-lg font-bold">Monica's Birthday</div>
        <div className="text-sm">Lived for 15614 Days,</div>
      </div>
      <div className="text-right border-white">
        <div className="text-xl">13th, Jul</div>
      </div>
    </div>
  );
};

export default ReminderCard;