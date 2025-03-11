import { createContext, useState } from 'react';

const SortOptionContext = createContext();

 export const SortOptionProvider = ({ children }) => {
  const [sortOption, setSortOption] = useState('Latest repositories');

  return (
    <SortOptionContext.Provider value={{sortOption, setSortOption}}>
      {children}
    </SortOptionContext.Provider>
  )
}

export default SortOptionContext;
