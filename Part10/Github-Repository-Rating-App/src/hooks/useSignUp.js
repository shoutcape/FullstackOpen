import { useApolloClient, useMutation } from '@apollo/client';
import { CREATE_USER } from '../graphql/mutations';

const useSignUp = () => {
  const [mutate] = useMutation(CREATE_USER);
  const apolloClient = useApolloClient();

  const signUp = async ({ username, password }) => {
    const user = {
      username: username,
      password: password,
    };

    try {
      const { data } = await mutate({ variables: { user } });
      apolloClient.resetStore();
      return data.createUser;
    } catch (error) {
      return error.message;
    }
  };

  return [signUp];
};


export default useSignUp;
