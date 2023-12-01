import React, { ReactNode } from 'react';
import Head from 'next/head';

interface HeadProps {
  title?: string;
  description?: string;
  children?: ReactNode;
}

const HeadComponent = ({ title, description, children }: HeadProps) => {
  return (
    <Head>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {children}
    </Head>
  );
};

export default HeadComponent;
