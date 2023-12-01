import { createContext, useContext } from 'react';
import { PageInfo } from './types';

export const PageInfoContext = createContext<PageInfo>(null);

export const usePageInfoContext = () => useContext(PageInfoContext);
