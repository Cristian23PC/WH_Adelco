import React, { useRef, type FC } from 'react';
import { Icon } from '../../../feedback';
import { type MenuItem } from '../../CategoriesMenu/types';
import CategoryItemIcon from './CategoryItemIcon';
import { type IconName, type LinkRenderer } from '../../../../utils/types';
import useDragToScroll from '../../../../utils/hooks/useDragToScroll';
import classNames from 'classnames';

export const DEFAULT_LITERALS = {
  categoriesTitle: 'Nuestras Categorías'
};

const categoryIconMapper: Record<string, IconName> = {
  generico: 'adelco_generico',
  'bebestibles-C1010360': 'adelco_bebestibles',
  'perfumeria-C1010350': 'adelco_perfumeria',
  'desayuno-y-dulces-C1010320': 'adelco_desayuno_dulces',
  'mascotas-C1010340': 'adelco_mascotas',
  'despensa-C1010310': 'adelco_abarrotes',
  'bebe-y-ninos-C1010380': 'adelco_mundo_bebe',
  'hogar-C1010330': 'adelco_hogar',
  'limpieza-C1010300': 'adelco_limpieza',
  'ferreteria-y-automotriz-C1010400': 'adelco_ferreteria_automotriz',
  'lacteos-refrigerados-y-huevos-C1010370': 'adelco_lacteos'
};

interface SubcategoryHeaderProps {
  exitSubcategory: VoidFunction;
  categoryList: MenuItem[];
  linkRenderer: LinkRenderer;
  literals?: typeof DEFAULT_LITERALS;
  onCategoryClick: (index: number) => void;
}
const SubcategoryHeader: FC<SubcategoryHeaderProps> = ({
  exitSubcategory,
  categoryList,
  linkRenderer,
  literals,
  onCategoryClick
}) => {
  const categoryContainerRef = useRef(null);

  const getMappedIcon = (slug: string): IconName => {
    const filteredSlug = slug.replace('/categorias/', '');
    return categoryIconMapper[filteredSlug ?? 'generico'] ?? 'adelco_generico';
  };

  const {
    dragStyleClasses,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseLeave
  } = useDragToScroll(categoryContainerRef);
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };
  return (
    <div className="py-2 pl-6">
      <div className="flex items-center gap-2.5">
        <Icon onClick={exitSubcategory} name="arrow_back" />
        <span>{l.categoriesTitle}</span>
      </div>
      <div
        ref={categoryContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={classNames(
          dragStyleClasses,
          'flex gap-4 py-2 overflow-y-auto scrollbar-hide'
        )}
      >
        {categoryList?.map((item, index) => {
          return linkRenderer(
            item.slug ?? '',
            <CategoryItemIcon
              key={item.title}
              iconName={getMappedIcon(item.slug as string)}
              title={item.title}
              onClick={() => {
                onCategoryClick(index);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SubcategoryHeader;
