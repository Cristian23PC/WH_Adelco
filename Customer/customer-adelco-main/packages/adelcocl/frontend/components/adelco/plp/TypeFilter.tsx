import { Accordion, Radio } from '@adelco/web-components';
import { Filter } from 'contexts/Filter/types';
import { FC, MouseEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { useFilterContext } from 'contexts/Filter/FilterContext';

interface TypeFilter {
  filter: Filter;
  closeFilters: VoidFunction;
}

const TypeFilter: FC<TypeFilter> = ({ filter, closeFilters }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const { trackSelectFilter } = useFilterContext();

  const handleOnChange = (e: MouseEvent<HTMLInputElement>, title: string) => {
    closeFilters();
    trackSelectFilter(title);
    const data = new URL(window.location.href);
    const { offset, slug, ...query } = router.query;

    router.push({
      pathname: `${data.pathname.replace('search', 'categorias')}/${
        e.currentTarget.value
      }`,
      query: {
        ...query
      }
    });
  };

  return (
    <Accordion
      title={filter.title}
      open={isOpen}
      onClick={() => setIsOpen((prevState) => !prevState)}
    >
      <div className="mt-2 flex max-h-64 flex-col gap-y-2 overflow-y-auto">
        {filter.options.map(({ slug, title, count }, _, items) => (
          <label
            key={slug}
            className="flex cursor-pointer items-center gap-2 rounded-[10px] p-2 text-sm text-corporative-03 ring-1 ring-inset ring-snow"
            htmlFor={slug}
          >
            <Radio
              id={slug}
              onClick={(e) =>
                items.length !== 1 ? handleOnChange(e, title) : undefined
              }
              checked={items.length === 1}
              value={slug}
              readOnly
              variant="sm"
            />
            <span className="whitespace-normal">
              {title} ({count})
            </span>
          </label>
        ))}
      </div>
    </Accordion>
  );
};

export default TypeFilter;
