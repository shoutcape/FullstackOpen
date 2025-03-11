import { NativeRouter } from 'react-router-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import { ApolloProvider } from '@apollo/client';
import Main from './src/components/Main';
import createApolloClient from './src/utils/apolloClient';
import AuthStorage from './src/utils/authStorage';
import AuthStorageContext from './src/contexts/AuthStorageContext';
import { AppRegistry } from 'react-native-web';

const authStorage = new AuthStorage();
const apolloClient = createApolloClient(authStorage);

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <NativeRouter>
        <ApolloProvider client={apolloClient}>
          <AuthStorageContext.Provider value={authStorage}>
            <Main />
          </AuthStorageContext.Provider>
        </ApolloProvider>
      </NativeRouter>
      <StatusBar style='light' />
    </SafeAreaView>
  );
};

AppRegistry.registerComponent('RepositoryApp', () => App)


export default App;
