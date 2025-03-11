import { useQuery } from '@apollo/client';
import { GET_SINGLE_REPOSITORY } from '../graphql/queries';

const useRepository = (variables) => {
  const { data, loading, refetch, fetchMore, ...result } = useQuery(
    GET_SINGLE_REPOSITORY,
    {
      fetchPolicy: 'cache-and-network',
      variables,
    },
  );

  const handleFetchMore = () => {
    const canFetchMore =
      !loading && data.repository?.reviews.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }

    fetchMore({
      variables: {
        ...variables,
        after: data.repository.reviews.pageInfo.endCursor,
      },
    });
  };

  return {
    repository: data?.repository,
    loading,
    refetch,
    fetchMore: handleFetchMore,
    ...result,
  };
};

export default useRepository;
