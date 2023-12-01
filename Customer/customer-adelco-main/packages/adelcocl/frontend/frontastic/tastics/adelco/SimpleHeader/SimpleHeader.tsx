import Link from 'next/link';
import { SimpleNavbar } from '@adelco/web-components';

const linkRenderer = (link, label) => <Link href={link}>{label}</Link>;

const SimpleHeaderTastic = () => {
  return <SimpleNavbar linkRenderer={linkRenderer} />;
};

export default SimpleHeaderTastic;
