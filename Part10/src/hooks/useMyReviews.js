import { useQuery } from '@apollo/client';
import { GET_REVIEWS } from '../graphql/queries';

const useMyReviews = () => {
  const { data, loading, refetch } = useQuery(GET_REVIEWS, {
    fetchPolicy: 'cache-and-network',
  });

  const me = data?.me


  return { me, loading, refetch };
};

export default useMyReviews;



        //variables: { review },
        //context: {
        //  headers: {
        //    Authorization: `Bearer ${authToken}`,
        //  },
