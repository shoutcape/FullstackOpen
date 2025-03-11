import { gql } from '@apollo/client';

export const GET_REPOSITORIES = gql`
  query (
    $orderBy: AllRepositoriesOrderBy
    $orderDirection: OrderDirection
    $searchKeyword: String
    $after: String
    $first: Int
  ) {
    repositories(
      orderBy: $orderBy
      orderDirection: $orderDirection
      searchKeyword: $searchKeyword
      after: $after
      first: $first
    ) {
      edges {
        node {
          description
          forksCount
          fullName
          id
          language
          ownerAvatarUrl
          ratingAverage
          reviewCount
          stargazersCount
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
      }
    }
  }
`;

export const ME = gql`
  query {
    me {
      id
      username
    }
  }
`;

export const GET_REVIEWS = gql`
  query {
    me {
      id
      reviews {
        edges {
          node {
            id
            text
            rating
            createdAt
            repository {
              fullName
              url
            }
            user {
              id
            }
          }
        }
      }
    }
  }
`;

export const GET_SINGLE_REPOSITORY = gql`
  query($repositoryId: ID!, $first: Int, $after: String) {
    repository(id: $repositoryId) {
      description
      forksCount
      fullName
      id
      language
      name
      ownerAvatarUrl
      ownerName
      ratingAverage
      reviewCount
      url
      createdAt
      stargazersCount
      openIssuesCount
      reviews(first: $first, after: $after) {
        edges {
          node {
            id
            rating
            text
            createdAt
            user {
              username
              id
            }
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
        }
      }
    }
  }`;
