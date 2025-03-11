import { FlatList, View } from 'react-native';
import { ReviewItem } from './SingleRepositoryView';
import { repositoryStyles } from '../styles';
import useMyReviews from '../hooks/useMyReviews';
import Text from '../components/Text';


const MyReviews = () => {
  const { me, loading } = useMyReviews();

  const reviewNodes = me ? me.reviews.edges.map((edge) => edge.node) : [];

  const ItemSeparator = () => <View style={repositoryStyles.separator} />;

  if (loading) {
    return <View>
      <Text>Loading...</Text>
    </View>
  }

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={reviewNodes}
        renderItem={({ item }) => <ReviewItem item={item} userId={me.id} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default MyReviews;
