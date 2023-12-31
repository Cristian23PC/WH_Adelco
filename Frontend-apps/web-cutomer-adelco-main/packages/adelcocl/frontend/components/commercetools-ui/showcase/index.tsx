import React from 'react';

export interface Props {
  content?: string;
}

const Showcase: React.FC<Props> = ({ content }) => {
  return (
    <div className="dark:text-light-100 md:p-8 w-full border border-solid border-slate-300 p-4 text-slate-600">
      {content}
    </div>
  );
};

export default Showcase;
