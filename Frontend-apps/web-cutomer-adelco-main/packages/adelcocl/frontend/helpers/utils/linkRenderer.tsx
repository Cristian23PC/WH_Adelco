import React from 'react';
import Link from 'next/link';

/* TODO: To be replaced */
export const linkRenderer = (element: { url: string; label: string }) => (
  <Link href={{ pathname: element.url }}>
    <a>{element.label}</a>
  </Link>
);
export const LinkRenderer = ({ href, children, ...props }) => (
  <Link href={href} {...props}>
    <div>{children}</div>
  </Link>
);
/* TODO: Refactor link renderers to use just one (uikit changes required) */
export const cartLinkRenderer = (url: string, label: string, target?: '_blank' | '_self') => (
  <Link href={url}>
    <a target={target}>{label}</a>
  </Link>
);
