import { FC, PropsWithChildren } from 'react';

export interface DashboardSectionProps extends PropsWithChildren {
  title: string;
}

const DashboardSection: FC<DashboardSectionProps> = ({ title, children }) => {
  return (
    <section className="rounded-lg border-snow border p-4">
      <h2 className="text-xs font-bold">{title}</h2>
      <div className="my-4 border-b border-snow" />
      {children}
    </section>
  );
};

export default DashboardSection;
