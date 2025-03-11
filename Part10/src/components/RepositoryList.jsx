import { FlatList, View, Image, Pressable } from 'react-native';
import useRepositories from '../hooks/useRepositories';
import { useNavigate } from 'react-router-native';
import Text from '../components/Text';
import {
  buttonStyles,
  repositoryStyles,
  sortingHeaderStyles,
  sortingModalStyles,
} from '../styles';
import { useEffect, useState } from 'react';
import {
  Modal,
  Portal,
  Button,
  PaperProvider,
  Searchbar,
} from 'react-native-paper';
import useSearchQuery from '../hooks/useSearchQuery';
import useSortOption from '../hooks/useSortOption';

const ItemSeparator = () => <View style={repositoryStyles.separator} />;

const checkValues = (value) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return `${value}`;
};

const RepositorySortingHeader = ({ setShowModal }) => {
  const { searchQuery, setSearchQuery } = useSearchQuery();
  const { sortOption } = useSortOption();
  return (
    <View style={sortingHeaderStyles.container}>
      <Searchbar
        placeholder='Search'
        onChangeText={setSearchQuery}
        value={searchQuery}
        mode='view'
        showDivider={false}
        style={sortingHeaderStyles.searchBar}
        inputStyle={{
          alignSelf: 'center',
          color: 'black',
        }}
      />
      <Button
        onPress={() => setShowModal(true)}
        contentStyle={{
          padding: 10,
          justifyContent: 'space-between',
          flexDirection: 'row-reverse',
        }}
        textColor='black'
        icon='chevron-down'
        style={sortingHeaderStyles.container}
      >
        {sortOption}
      </Button>
    </View>
  );
};
const RepositorySortingModal = ({ showModal, setShowModal }) => {
  const { setSortOption } = useSortOption();
  const sortBy = (option) => {
    setSortOption(option);
    setShowModal(false);
  };

  const buttonProps = {
    mode: 'text',
    textColor: 'black',
    style: buttonStyles.listButton,
    contentStyle: {
      justifyContent: 'flex-start',
      paddingHorizontal: 10,
    },
  };

  return (
    <Portal>
      <Modal
        visible={showModal}
        onDismiss={() => {
          setShowModal(false);
        }}
        contentContainerStyle={sortingModalStyles.container}
      >
        <Text
          style={{ paddingHorizontal: 20, marginBottom: 10 }}
          color='textSecondary'
        >
          Select an item...
        </Text>
        <Button {...buttonProps} onPress={() => sortBy('Latest repositories')}>
          Latest repositories
        </Button>
        <Button
          {...buttonProps}
          onPress={() => sortBy('Highest rated repositories')}
        >
          Highest rated repositories
        </Button>
        <Button
          {...buttonProps}
          onPress={() => sortBy('Lowest rated repositories')}
        >
          Lowest rated repositories
        </Button>
      </Modal>
    </Portal>
  );
};

export const RepositoryItem = ({ item }) => {
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
    </View>
  );
};

export const RepositoryListContainer = ({ repositories, onEndReach }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : [];
  return (
    <View style={{ flex: 1 }}>
      <PaperProvider>
        <RepositorySortingModal
          showModal={showModal}
          setShowModal={setShowModal}
        />
        <View>
          <FlatList
            data={repositoryNodes}
            ItemSeparatorComponent={ItemSeparator}
            renderItem={({ item }) => (
              <Pressable onPress={() => navigate(`item/${item.id}`)}>
                <RepositoryItem item={item} />
              </Pressable>
            )}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
              <RepositorySortingHeader setShowModal={setShowModal} />
            }
            onEndReached={onEndReach}
          />
        </View>
      </PaperProvider>
    </View>
  );
};

const RepositoryList = () => {
  const { sortOption } = useSortOption();
  const { repositories, refetch, fetchMore } = useRepositories({
    first: 3
  });
  const { searchQuery } = useSearchQuery();
  const [delayedSearchQuery, setDelayedSearchQuery] = useState('');

  useEffect(() => {
    const timeoutHandler = setTimeout(() => {
      setDelayedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(timeoutHandler);
    };
  }, [searchQuery]);


  useEffect(() => {
    switch (sortOption) {
      case 'Latest repositories':
        refetch({
          orderBy: 'CREATED_AT',
          orderDirection: 'DESC',
          searchKeyword: searchQuery,
        });
        break;
      case 'Highest rated repositories':
        refetch({
          orderBy: 'RATING_AVERAGE',
          orderDirection: 'DESC',
          searchKeyword: searchQuery,
        });
        break;
      case 'Lowest rated repositories':
        refetch({
          orderBy: 'RATING_AVERAGE',
          orderDirection: 'ASC',
          searchKeyword: searchQuery,
        });
        break;
      default:
        break;
    }
  }, [sortOption, delayedSearchQuery]);

  const onEndReach = () => {
    fetchMore()
  }

  return (
    <RepositoryListContainer 
      repositories={repositories} 
      onEndReach={onEndReach}
    />
  )};

export default RepositoryList;
