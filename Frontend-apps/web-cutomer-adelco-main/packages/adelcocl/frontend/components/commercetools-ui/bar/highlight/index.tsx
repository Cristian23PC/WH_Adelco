import React from 'react';

const HighlightBar: React.FC = ({ children }) => {
  return (
    <>
      {/* eslint-disable-next-line */}
      <div className="lg:mt-0 lg:flex-row lg:divide-y-0 lg:divide-x lg:py-5 lg:shadow-none mt-5 flex flex-col divide-y divide-solid divide-gray-200 border-solid py-0 shadow-[0_-1px_10px_#f7f7f7]">
        {children}
      </div>
    </>
  );
};

export default HighlightBar;
