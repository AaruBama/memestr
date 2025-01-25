import { createContext, useContext } from 'react';

export const PageContext = createContext(false);

export const usePageContext = () => useContext(PageContext);
