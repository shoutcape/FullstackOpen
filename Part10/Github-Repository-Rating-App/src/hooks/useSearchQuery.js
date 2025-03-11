import { useContext } from 'react';
import SearchQueryContext from '../contexts/SearchQueryContext';

const useSearchQuery = () => {
  return useContext(SearchQueryContext);
};

export default useSearchQuery;
