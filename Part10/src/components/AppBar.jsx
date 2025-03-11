import { View, StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import Text from './Text';
import { Link } from 'react-router-native';
import { useApolloClient, useQuery } from '@apollo/client';
import { ME } from '../graphql/queries';
import useAuthStorage from '../hooks/useAuthStorage';
import { useEffect, useState } from 'react';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#24292e',
    flexDirection: 'row',
  },
  textStyle: {
    padding: 20,
    color: '#ffffff',
    fontWeight: 700,
    fontSize: 16,
  },
});

const AppBar = () => {
  const { data, loading } = useQuery(ME);
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();
  const [signedIn, setSignedIn] = useState(false);

  const signOut = async () => {
    await authStorage.removeAccessToken();
    await apolloClient.resetStore();
    setSignedIn(false);
  };

  useEffect(() => {
    if (data && data.me) {
      setSignedIn(true);
    }
  }, [data]);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <Link to={'/'}>
          <Text style={styles.textStyle}>Repositories</Text>
        </Link>
        {signedIn ? (
          <View style={{ flexDirection: 'row' }}>
            <Link to={'/ReviewCreation'}>
              <Text style={styles.textStyle}>Create a review</Text>
            </Link>
            <Link to={'/MyReviews'}>
              <Text style={styles.textStyle}>My Reviews</Text>
            </Link>
            <Link to={'/SignIn'} onPress={signOut}>
              <Text style={styles.textStyle}>Sign Out</Text>
            </Link>
          </View>
        ) : (
          <View style={{ flexDirection: 'row' }}>
            <Link to={'/SignIn'}>
              <Text style={styles.textStyle}>Sign In</Text>
            </Link>
            <Link to={'/SignUp'}>
              <Text style={styles.textStyle}>Sign Up</Text>
            </Link>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
export default AppBar;
