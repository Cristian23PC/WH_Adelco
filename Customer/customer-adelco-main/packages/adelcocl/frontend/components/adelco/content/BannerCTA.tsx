import Link from 'next/link';
import { Button } from '@adelco/web-components';
import Image from 'frontastic/lib/image';

export interface BannerCTAProps {
  image: { media: any } | any;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaLink?: string;
}

const BannerCTA: React.FC<BannerCTAProps> = ({
  image,
  title,
  subtitle,
  ctaLabel,
  ctaLink
}) => {
  return (
    <div className="relative flex justify-center p-2 align-middle">
      <div className="aspect-h-7 tablet:aspect-h-3 w-full">
        <Image
          media={image.media ? image.media : { media: '' }}
          src={!image.media ? image : ''}
          className="object-cover object-top opacity-70 tablet:opacity-100"
          alt={'Tile Image'}
        />
      </div>

      <div className="absolute top-1/2 flex max-w-md -translate-y-1/2 flex-col justify-center text-center tablet:left-10 tablet:max-w-xl tablet:text-left">
        <div className="text-md mb-2 tablet:text-lg">{subtitle}</div>
        <h2
          className={`sm:px-0 sm:text-left w-full whitespace-pre-line px-10 text-center text-2xl font-extrabold tracking-tight text-black tablet:text-4xl desktop:w-60 desktop:text-5xl`}
        >
          {title}
        </h2>

        {ctaLabel && ctaLink && (
          <div className="mt-10 flex w-full justify-center tablet:justify-start">
            <Link href={ctaLink}>
              <Button>{ctaLabel}</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerCTA;
