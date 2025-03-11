import { useMutation } from '@apollo/client';
import { REMOVE_REVIEW } from '../graphql/mutations';
import useMyReviews from './useMyReviews';

const useRemoveReview = (id) => {
  const [mutate, result] = useMutation(REMOVE_REVIEW);
  const { refetch } = useMyReviews();

  const removeReview = async () => {

    try {
      await mutate({
        variables: { deleteReviewId: id },
      });
      await refetch()
    } catch (error) {
      console.log(error);
      return error.message;
    }
  };

  return [removeReview, result];
};

export default useRemoveReview;
