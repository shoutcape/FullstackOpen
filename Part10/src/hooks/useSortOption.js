import { useContext } from 'react';
import SortOptionContext from '../contexts/SortOptionContext';

const useSortOption = () => {
  return useContext(SortOptionContext);
};

export default useSortOption;
