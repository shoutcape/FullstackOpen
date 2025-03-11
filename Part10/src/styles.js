import { StyleSheet } from 'react-native-web';
import theme from './theme';

export const repositoryStyles = StyleSheet.create({
  separator: {
    height: 10,
    backgroundColor: 'lightgray',
    marginTop: 10,
  },
  fullname: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  container: {
    paddingTop: 10,
    flexDirection: 'row',
  },
  AvatarImage: {
    height: 50,
    width: 50,
    margin: 10,
    borderRadius: 5,
  },
  language: {
    color: theme.colors.white,
    backgroundColor: theme.colors.primary,
    padding: 5,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  mainInfo: {
    padding: 10,
    gap: 10,
    flex: 1,
  },
  stats: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'space-evenly',
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    padding: 15,
    margin: 10,
    alignItems: 'center',
  },
});

export const reviewStyles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 20,
    marginHorizontal: 10,
    gap: 15,
  },
  container: {
    flexDirection: 'column',
    gap: 10,
    flex: 1,
  },
  rating: {
    borderWidth: 3,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
    borderRadius: 30,
    height: 60,
    width: 60,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 10,
    gap: 15,
  },
  button: {
    borderRadius:5,
    paddingHorizontal: 10
  }
});

export const formStyles = {
  container: {
    padding: 20,
    flexDirection: 'column',
    gap: 15,
  },
  notification: {
    marginTop: -10,
  },

  textInput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  inputError: {
    borderColor: theme.colors.warning,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
};

export const sortingModalStyles = {
  container: {
    alignSelf: 'center',
    paddingVertical: 20,
    width: '60%',
    backgroundColor: 'white',
    borderRadius: 5,
    gap: 10,
  },
};

export const sortingHeaderStyles = {
  container: {
    backgroundColor: 'lightgray',
    width: '100%',
    borderRadius: 0,
    gap: 5,
  },
  searchBar: {
    width: '90%',
    backgroundColor: 'white',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 5,
  },
};

export const buttonStyles = {
  listButton: {
    borderRadius: 0,
    justifyContent: 'flex-start',
    width: '100%',
  },
};
