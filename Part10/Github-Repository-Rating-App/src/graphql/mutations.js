import { gql } from '@apollo/client';

export const AUTHENTICATE = gql`
  mutation ($credentials: AuthenticateInput) {
    authenticate(credentials: $credentials) {
      accessToken
    }
  }
`;

export const CREATE_REVIEW = gql`
  mutation ($review: CreateReviewInput) {
    createReview(review: $review) {
      id
      createdAt
    }
  }
`;

export const CREATE_USER = gql`
  mutation ($user: CreateUserInput) {
    createUser(user: $user) {
      id
      createdAt
    }
  }
`;

export const REMOVE_REVIEW = gql`
  mutation ($deleteReviewId: ID!) {
  deleteReview(id: $deleteReviewId)
}
`
