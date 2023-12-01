import Typography from 'components/commercetools-ui/typography';
import { Reference, ReferenceLink } from 'helpers/reference';
import Image from 'frontastic/lib/image';

export interface TileProps {
  image: { media: any } | any;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaReference?: Reference;
}

const Tile: React.FC<TileProps> = ({
  image,
  title,
  subtitle,
  ctaLabel,
  ctaReference
}) => {
  return (
    <div className="relative flex justify-center p-2 align-middle">
      <div className="aspect-h-7 md:aspect-h-3 w-full">
        <Image
          media={image.media ? image.media : { media: '' }}
          src={!image.media ? image : ''}
          className="md:opacity-100 object-cover object-top opacity-70"
          alt={'Tile Image'}
        />
      </div>

      <div className="md:left-10 md:max-w-xl md:text-left absolute top-1/2 flex max-w-md -translate-y-1/2 flex-col justify-center text-center">
        <div className="text-small md:font-medium mb-2">
          <Typography>{subtitle}</Typography>
        </div>
        <h2
          className={`text-medium sm:px-0 sm:text-left md:text-4xl lg:w-60 lg:text-5xl w-full whitespace-pre-line px-10 text-center font-extrabold tracking-tight text-black`}
        >
          <Typography>{title}</Typography>
        </h2>

        {ctaLabel && ctaReference && (
          <div className="md:justify-start flex w-full justify-center">
            <ReferenceLink
              target={ctaReference}
              className=" bg-accent-400 hover:bg-accent-500 md:w-fit mt-8 w-72 rounded-md border border-transparent px-4 py-2 text-center text-base font-semibold text-white"
            >
              <Typography>{ctaLabel}</Typography>
            </ReferenceLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tile;
