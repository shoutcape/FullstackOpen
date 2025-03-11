import { useMutation } from '@apollo/client';
import { CREATE_REVIEW } from '../graphql/mutations';
import useAuthStorage from './useAuthStorage';

const useCreateReview = () => {
  const [mutate] = useMutation(CREATE_REVIEW);
  const authStorage = useAuthStorage();

  const reviewMutation = async ({ ownerName, repositoryName, rating, text, }) => {
    const review = {
      ownerName: ownerName,
      repositoryName: repositoryName,
      rating: Number(rating),
      text: text,
    };

    const authToken = await authStorage.getAccessToken();

    try {
      await mutate({
        variables: { review },
        context: {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      });
      console.log(review);
    } catch (error) {
      console.log(error);
      return error.message;
    }
  };

  return [reviewMutation];
};

export default useCreateReview;
