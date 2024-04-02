import React from 'react';

const Toolbar = () => {
  return (
    <div className="toolbar">
      <div className="toolbar-icon" draggable="true" id="icon1">
        Icon 1
      </div>
      <div className="toolbar-icon" draggable="true" id="icon2">
        Icon 2
      </div>
      {/* Add more toolbar icons as needed */}
    </div>
  );
};

export default Toolbar;
