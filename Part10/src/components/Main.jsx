import { Navigate, Route, Routes } from 'react-router-native';
import AppBar from './AppBar';
import RepositoryList from './RepositoryList';
import SignIn from './SignIn';
import { StyleSheet, View } from 'react-native';
import SingleRepositoryView from './SingleRepositoryView';
import ReviewForm from './ReviewForm';
import SignUp from './SignUp';
import { SearchQueryProvider } from '../contexts/SearchQueryContext';
import MyReviews from './MyReviews';
import { SortOptionProvider } from '../contexts/SortOptionContext';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
  },
});

const Main = () => {
  return (
    <View style={styles.container}>
      <AppBar />
      <SortOptionProvider>
        <SearchQueryProvider>
          <Routes>
            <Route path='/' element={<RepositoryList />} />
            <Route path='/SignIn' element={<SignIn />} />
            <Route path='/SignUp' element={<SignUp />} />
            <Route path='/MyReviews' element={<MyReviews />} />
            <Route path='/ReviewCreation' element={<ReviewForm />} />
            <Route path='/item/:id' element={<SingleRepositoryView />} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </SearchQueryProvider>
      </SortOptionProvider>
    </View>
  );
};

export default Main;
