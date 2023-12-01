import React from 'react';
import LanguageSwitcher from 'components/commercetools-ui/language-switcher';
import Typography from 'components/commercetools-ui/typography';
import Column, { Link, Column as FooterColumn } from './column';
import { renderIcon } from './renderIcon';
export interface Props {
  columns: FooterColumn[];
  copyright?: string;
  copyrightLinks?: Link[];
}

const Footer: React.FC<Props> = ({ columns, copyright, copyrightLinks }) => {
  return (
    <footer aria-labelledby="footer-heading">
      <div className="lg:px-8 mx-auto w-full bg-gray-100 px-6 dark:bg-transparent">
        <div className="xl:grid xl:grid-cols-2 xl:gap-8 mx-auto max-w-5xl py-10 px-2">
          <div
            className={`md:gap-4 grid grid-cols-1 gap-10 md:grid-cols-${(columns.length + 1).toString()} xl:col-span-2`}
          >
            {columns?.map((column, index) => (
              <div key={index} className="md:flex md:justify-center">
                <Column column={column} />
              </div>
            ))}
            <div className="md:justify-center justify-start">
              <div className="md:justify-start flex space-x-2">
                {renderIcon('speaker')}
                <h3 className="dark:text-light-100 text-sm font-medium text-gray-800">
                  <Typography>Language</Typography>
                </h3>
              </div>
              <LanguageSwitcher className="md:px-8 p-4" />
            </div>
          </div>
        </div>
      </div>
      {copyright && (
        <div className="bg-primary-400 sm:px-10 flex place-content-between border-t border-gray-200 p-4">
          <p className="sm:text-sm text-xs text-white">© {copyright}</p>
          <ul className="flex">
            {copyrightLinks?.map((item, i) => (
              <li key={i} className="text-xs">
                <p className="sm:text-sm px-2 text-gray-300 hover:text-white">
                  <Typography>{item.name}</Typography>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </footer>
  );
};

export default Footer;
