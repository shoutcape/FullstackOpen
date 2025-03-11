import { useApolloClient, useMutation } from '@apollo/client';
import { AUTHENTICATE } from '../graphql/mutations';
import useAuthStorage from './useAuthStorage';

const useSignIn = () => {
  const [mutate, result] = useMutation(AUTHENTICATE);
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();

  const signIn = async ({ username, password }) => {
    const credentials = {
      username: username,
      password: password,
    };

    try {
      const { data } = await mutate({ variables: { credentials } });
      await authStorage.setAccessToken(data.authenticate.accessToken);
      apolloClient.resetStore();

      return data;
    } catch (error) {
      return error.message;
    }
  };

  return [signIn, result];
};

export default useSignIn;
