import { FC } from 'react';
import Link from 'next/link';
import { Footer } from '@adelco/web-components';

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
    <div className="mt-12 tablet:mt-14 desktop:mt-16">
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
            href: 'https://store.adelco.cl/terminos-y-condiciones/'
          }
        }}
      />
    </div>
  );
};

export default FooterTastic;
