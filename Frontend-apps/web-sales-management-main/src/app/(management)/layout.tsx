'use client';
import { FC, PropsWithChildren } from 'react';
import Menu from '@/components/Menu';

const ManagementLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex-1 h-full w-full bg-snow py-6">
      <div className="mx-auto grid grid-cols-12 gap-6 w-[1280px] desktop:w-[1340px]">
        <div className="col-span-3 pl-4 desktop:pl-0">
          <Menu />
        </div>
        <div className="col-span-9 pr-4 desktop:pr-0">{children}</div>
      </div>
    </div>
  );
};

export default ManagementLayout;
