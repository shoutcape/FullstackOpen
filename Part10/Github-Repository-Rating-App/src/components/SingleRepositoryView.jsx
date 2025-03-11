import { FlatList, View, Image, Pressable, Alert } from 'react-native';
import * as Linking from 'expo-linking';
import { useParams } from 'react-router-native';
import Text from '../components/Text';
import { Button } from 'react-native-paper'


import useRepository from '../hooks/useRepository';
import { repositoryStyles, reviewStyles } from '../styles';
import { format } from 'date-fns';
import theme from '../theme';
import useRemoveReview from '../hooks/useRemoveReview';

const ItemSeparator = () => <View style={repositoryStyles.separator} />;

const RepositoryItem = ({ item }) => {

  const openUrl = () => {
    Linking.openURL(item.url);
  };

  const checkValues = (value) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return `${value}`;
  };

  return (
    <View testID='repositoryItem'>
      <View style={repositoryStyles.container}>
        <View>
          <Image
            style={repositoryStyles.AvatarImage}
            source={{ uri: item.ownerAvatarUrl }}
          />
        </View>
        <View style={repositoryStyles.mainInfo}>
          <Text style={repositoryStyles.fullname}>{item.fullName}</Text>
          <Text style={{ flexWrap: 'wrap' }}>{item.description}</Text>
          <Text style={repositoryStyles.language}>{item.language}</Text>
        </View>
      </View>
      <View style={repositoryStyles.stats}>
        <View style={{ alignItems: 'center' }}>
          <Text fontWeight={'bold'}>{checkValues(item.stargazersCount)}</Text>
          <Text>Stars</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text fontWeight={'bold'}>{checkValues(item.forksCount)}</Text>
          <Text>Forks</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text fontWeight={'bold'}>{checkValues(item.reviewCount)}</Text>
          <Text>Reviews</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text fontWeight={'bold'}>{checkValues(item.ratingAverage)}</Text>
          <Text>Rating</Text>
        </View>
      </View>
      <View>
        <Pressable style={repositoryStyles.button} onPress={openUrl}>
          <Text color='white' fontWeight='bold' fontSize='subheading'>
            Open in Github
          </Text>
        </Pressable>
      </View>
      <ItemSeparator/>
    </View>
  );
};

export const ReviewItem = ({ item, userId='' }) => {
  const openUrl = () => {
    Linking.openURL(item.repository.url);
  };

  const [removeReview] = useRemoveReview(item.id)

  const openAlert = () => {
    Alert.alert('Delete review', 'Are you sure you want to delete this review?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: async () => await removeReview(),
          style: 'cancel'
        }
      ]
    )
  }

  return (
    <View>
      <View style={reviewStyles.mainContainer}>
        <View style={reviewStyles.rating}>
          <Text fontWeight={'bold'} color={'primary'}>
            {item.rating}
          </Text>
        </View>
        <View style={reviewStyles.container}>
          <Text fontWeight={'bold'}>{item.user?.username || item.repository?.fullName}</Text>
          <Text style={{ marginTop: -5 }} color={'textSecondary'}>
            {format(new Date(item.createdAt), 'dd.MM.yyyy')}
          </Text>
          <Text>{item.text}</Text>
        </View>
      </View>
      {userId == item.user?.id &&
        (
          <View style={reviewStyles.buttonContainer}>
            <Button 
              mode='contained'
              style={reviewStyles.button}
              buttonColor={theme.colors.primary}
              onPress={openUrl}
            >
              View Repository
            </Button>
            <Button 
              mode='contained'
              style={reviewStyles.button}
              buttonColor={theme.colors.warning}
              onPress={openAlert}
            >
              Delete Review
            </Button>
          </View>
        )
      }
    </View>
  );
};

const SingleRepositoryView = () => {
  const { id } = useParams();
  const { repository, loading, fetchMore } = useRepository({
    repositoryId: id,
    first: 2
  });

  if (loading || !repository) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const reviewNodes = repository.reviews
    ? repository.reviews.edges.map((edge) => edge.node)
    : [];

  const endReached = () => {
    fetchMore()
  }


  return (
    <View style={{flexGrow: 1, flexShrink: 1}}>
      <FlatList
        data={reviewNodes}
        renderItem={({ item }) => <ReviewItem item={item} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<RepositoryItem item={repository} />}
        ItemSeparatorComponent={ItemSeparator}
        onEndReached={endReached}
      />
    </View>
  );
};

export default SingleRepositoryView;
