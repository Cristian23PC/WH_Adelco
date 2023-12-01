import { FC } from 'react';
import Link from 'next/link';
import { Footer } from 'am-ts-components';

type Props = {
  data: {
    instagramLink: string;
    facebookLink: string;
    linkedinLink: string;
    year: string;
    address: string;
    email: string;
    phone: string;
  };
};

const FooterTastic: FC<Props> = ({ data }) => {
  return (
    <Footer
      instagramLink={data.instagramLink}
      facebookLink={data.facebookLink}
      linkedinLink={data.linkedinLink}
      year={data.year}
      address={data.address}
      email={data.email}
      phone={data.phone}
      termsLinkComponent={{
        Component: Link,
        props: {
          href: '/terms',
        },
      }}
    />
  );
};

export default FooterTastic;
