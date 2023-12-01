import React, { Fragment, type FC } from 'react';
import classnames from 'classnames';
import { Icon } from '../../feedback';

export interface BreadcrumbProps {
  className?: string;
  elements: Array<{ label: string; url: string }>;
  linkRenderer?: (url: { url: string; label: string }) => any;
  'data-testid'?: string;
}

const Breadcrumb: FC<BreadcrumbProps> = ({
  className = '',
  elements = [],
  linkRenderer = (element: { url: string; label: string }) => (
    <a href={element.url}>{element.label}</a>
  ),
  'data-testid': dataTestId = 'adelco-breadcrumb'
}) => {
  return (
    <div
      className={classnames(
        'flex text-xs tablet:font-semibold gap-2 py-4',
        className
      )}
      data-testid={dataTestId}
    >
      {elements.map((element, index) => {
        const isLast = index === elements.length - 1;
        return (
          <Fragment key={index}>
            <span
              className={classnames(
                'flex items-center tablet:underline',
                isLast
                  ? 'text-corporative-03 font-bold tablet:semibold'
                  : 'text-corporative-02 tablet:text-corporative-02-hover'
              )}
              key={element.label}
            >
              {linkRenderer(element)}
            </span>
            {!isLast && (
              <span className="flex items-center">
                <Icon name="arrow_s_right" width={16} height={16} />
              </span>
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
