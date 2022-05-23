import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type Convo = {
  __typename?: 'Convo';
  all_seen_by_user: Scalars['Boolean'];
  friend?: Maybe<User>;
  id: Scalars['Int'];
};

export type Error = {
  __typename?: 'Error';
  message: Scalars['String'];
  type: Scalars['String'];
};

export type Listing = {
  __typename?: 'Listing';
  createdAt: Scalars['Date'];
  description: Scalars['String'];
  district: Scalars['String'];
  id: Scalars['Int'];
  listedBy?: Maybe<User>;
  name: Scalars['String'];
  photos: Array<Scalars['String']>;
  pricePerDay?: Maybe<Scalars['Int']>;
  pricePerMonth?: Maybe<Scalars['Int']>;
  pricePerWeek?: Maybe<Scalars['Int']>;
  state: Scalars['String'];
  street: Scalars['String'];
};

export type ListingsResponse = {
  __typename?: 'ListingsResponse';
  hasMore: Scalars['Boolean'];
  items: Array<Listing>;
};

export type LoginResponse = Error | User;

export type Message = {
  __typename?: 'Message';
  content: Scalars['String'];
  convoId: Scalars['Int'];
  createdAt: Scalars['Date'];
  fromId?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  toId?: Maybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createConvo: Convo;
  createListing: Listing;
  deleteListing?: Maybe<Scalars['Int']>;
  deleteUser: Scalars['Boolean'];
  loginUser: LoginResponse;
  loginWithGoogle: User;
  logoutUser: Scalars['Boolean'];
  registerUser: LoginResponse;
  registerWithGoogle: User;
  updateConvo: Scalars['Boolean'];
  updateListing: Listing;
  updateUser?: Maybe<User>;
};


export type MutationCreateConvoArgs = {
  firstId: Scalars['Int'];
  secondId: Scalars['Int'];
};


export type MutationCreateListingArgs = {
  description: Scalars['String'];
  district: Scalars['String'];
  name: Scalars['String'];
  photos: Array<Scalars['String']>;
  pricePerDay: Scalars['Int'];
  pricePerMonth?: InputMaybe<Scalars['Int']>;
  pricePerWeek?: InputMaybe<Scalars['Int']>;
  state: Scalars['String'];
  street: Scalars['String'];
  userId: Scalars['Int'];
};


export type MutationDeleteListingArgs = {
  listingId: Scalars['Int'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['Int'];
};


export type MutationLoginUserArgs = {
  email: Scalars['String'];
};


export type MutationLoginWithGoogleArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
};


export type MutationRegisterUserArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
};


export type MutationRegisterWithGoogleArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
};


export type MutationUpdateConvoArgs = {
  convoId: Scalars['Int'];
  userId: Scalars['Int'];
};


export type MutationUpdateListingArgs = {
  description?: InputMaybe<Scalars['String']>;
  district?: InputMaybe<Scalars['String']>;
  itemId: Scalars['Int'];
  name?: InputMaybe<Scalars['String']>;
  photos?: InputMaybe<Array<Scalars['String']>>;
  pricePerDay?: InputMaybe<Scalars['Int']>;
  pricePerMonth?: InputMaybe<Scalars['Int']>;
  pricePerWeek?: InputMaybe<Scalars['Int']>;
  state?: InputMaybe<Scalars['String']>;
  street?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateUserArgs = {
  avatar_url?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  name?: InputMaybe<Scalars['String']>;
};

export type PaginatedMessages = {
  __typename?: 'PaginatedMessages';
  hasMore: Scalars['Boolean'];
  messages: Array<Maybe<Message>>;
};

export type Query = {
  __typename?: 'Query';
  convoWithUser: PaginatedMessages;
  convosByUser: Array<Maybe<Convo>>;
  isThereConvoWithFriend?: Maybe<Scalars['Int']>;
  listing: Listing;
  listings: ListingsResponse;
  listingsByUser: ListingsResponse;
  me: User;
  search: Array<Listing>;
  user: LoginResponse;
};


export type QueryConvoWithUserArgs = {
  after?: InputMaybe<Scalars['Int']>;
  convoId: Scalars['Int'];
  take: Scalars['Int'];
};


export type QueryConvosByUserArgs = {
  user_id?: InputMaybe<Scalars['Int']>;
};


export type QueryIsThereConvoWithFriendArgs = {
  friendId: Scalars['Int'];
  userId: Scalars['Int'];
};


export type QueryListingArgs = {
  id: Scalars['Int'];
};


export type QueryListingsArgs = {
  after?: InputMaybe<Scalars['Int']>;
  take: Scalars['Int'];
};


export type QueryListingsByUserArgs = {
  after?: InputMaybe<Scalars['Int']>;
  take: Scalars['Int'];
  user_id: Scalars['Int'];
};


export type QuerySearchArgs = {
  district?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  term?: InputMaybe<Scalars['String']>;
};


export type QueryUserArgs = {
  id: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  auth_method?: Maybe<Scalars['String']>;
  avatar_url?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type ErrorFragmentFragment = { __typename: 'Error', type: string, message: string };

export type ListingFragmentFragment = { __typename: 'Listing', id: number, name: string, description: string, pricePerDay?: number | null, pricePerWeek?: number | null, pricePerMonth?: number | null, street: string, district: string, state: string, photos: Array<string>, createdAt: any };

export type UserFragmentFragment = { __typename: 'User', id: number, name: string, email?: string | null, avatar_url?: string | null };

export type CreateConvoMutationVariables = Exact<{
  firstId: Scalars['Int'];
  secondId: Scalars['Int'];
}>;


export type CreateConvoMutation = { __typename?: 'Mutation', createConvo: { __typename?: 'Convo', id: number, all_seen_by_user: boolean, friend?: { __typename?: 'User', id: number, name: string } | null } };

export type CreateListingMutationVariables = Exact<{
  name: Scalars['String'];
  description: Scalars['String'];
  userId: Scalars['Int'];
  street: Scalars['String'];
  district: Scalars['String'];
  state: Scalars['String'];
  photos: Array<Scalars['String']> | Scalars['String'];
  pricePerDay: Scalars['Int'];
  pricePerWeek?: InputMaybe<Scalars['Int']>;
  pricePerMonth?: InputMaybe<Scalars['Int']>;
}>;


export type CreateListingMutation = { __typename?: 'Mutation', createListing: { __typename: 'Listing', id: number, name: string, description: string, pricePerDay?: number | null, pricePerWeek?: number | null, pricePerMonth?: number | null, street: string, district: string, state: string, photos: Array<string>, createdAt: any, listedBy?: { __typename?: 'User', id: number, name: string, email?: string | null } | null } };

export type DeleteListingMutationVariables = Exact<{
  listingId: Scalars['Int'];
}>;


export type DeleteListingMutation = { __typename?: 'Mutation', deleteListing?: number | null };

export type DeleteUserMutationVariables = Exact<{
  deleteUserId: Scalars['Int'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: boolean };

export type LoginUserMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type LoginUserMutation = { __typename?: 'Mutation', loginUser: { __typename: 'Error', type: string, message: string } | { __typename: 'User', id: number, name: string, email?: string | null, avatar_url?: string | null } };

export type LoginWithGoogleMutationVariables = Exact<{
  name: Scalars['String'];
  email: Scalars['String'];
}>;


export type LoginWithGoogleMutation = { __typename?: 'Mutation', loginWithGoogle: { __typename: 'User', id: number, name: string, email?: string | null } };

export type LogoutUserMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutUserMutation = { __typename?: 'Mutation', logoutUser: boolean };

export type RegisterUserMutationVariables = Exact<{
  name: Scalars['String'];
  email: Scalars['String'];
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: { __typename: 'Error', type: string, message: string } | { __typename: 'User', id: number, name: string, email?: string | null, avatar_url?: string | null } };

export type RegisterWithGoogleMutationVariables = Exact<{
  name: Scalars['String'];
  email: Scalars['String'];
}>;


export type RegisterWithGoogleMutation = { __typename?: 'Mutation', registerWithGoogle: { __typename?: 'User', id: number, name: string, email?: string | null, avatar_url?: string | null } };

export type UpdateConvoMutationVariables = Exact<{
  convoId: Scalars['Int'];
  userId: Scalars['Int'];
}>;


export type UpdateConvoMutation = { __typename?: 'Mutation', updateConvo: boolean };

export type UpdateListingMutationVariables = Exact<{
  itemId: Scalars['Int'];
  name?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  pricePerDay?: InputMaybe<Scalars['Int']>;
  pricePerWeek?: InputMaybe<Scalars['Int']>;
  pricePerMonth?: InputMaybe<Scalars['Int']>;
  street?: InputMaybe<Scalars['String']>;
  district?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  photos?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
}>;


export type UpdateListingMutation = { __typename?: 'Mutation', updateListing: { __typename?: 'Listing', id: number, name: string, description: string, pricePerDay?: number | null, pricePerWeek?: number | null, pricePerMonth?: number | null, street: string, district: string, state: string, photos: Array<string>, listedBy?: { __typename?: 'User', id: number, name: string, email?: string | null } | null } };

export type UpdateUserMutationVariables = Exact<{
  updateUserId: Scalars['Int'];
  name?: InputMaybe<Scalars['String']>;
  avatarUrl?: InputMaybe<Scalars['String']>;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser?: { __typename?: 'User', id: number, name: string, email?: string | null, avatar_url?: string | null, auth_method?: string | null } | null };

export type ConvoWithUserQueryVariables = Exact<{
  convoId: Scalars['Int'];
  after?: InputMaybe<Scalars['Int']>;
  take: Scalars['Int'];
}>;


export type ConvoWithUserQuery = { __typename?: 'Query', convoWithUser: { __typename?: 'PaginatedMessages', hasMore: boolean, messages: Array<{ __typename?: 'Message', id: number, fromId?: number | null, convoId: number, toId?: number | null, content: string, createdAt: any } | null> } };

export type ConvosByUserQueryVariables = Exact<{
  userId?: InputMaybe<Scalars['Int']>;
}>;


export type ConvosByUserQuery = { __typename?: 'Query', convosByUser: Array<{ __typename?: 'Convo', id: number, all_seen_by_user: boolean, friend?: { __typename?: 'User', id: number, name: string } | null } | null> };

export type IsThereConvoQueryVariables = Exact<{
  userId: Scalars['Int'];
  friendId: Scalars['Int'];
}>;


export type IsThereConvoQuery = { __typename?: 'Query', isThereConvoWithFriend?: number | null };

export type ListingQueryVariables = Exact<{
  listingId: Scalars['Int'];
}>;


export type ListingQuery = { __typename?: 'Query', listing: { __typename?: 'Listing', id: number, name: string, description: string, pricePerDay?: number | null, pricePerWeek?: number | null, pricePerMonth?: number | null, street: string, district: string, state: string, photos: Array<string>, listedBy?: { __typename?: 'User', id: number, name: string } | null } };

export type ListingsQueryVariables = Exact<{
  take: Scalars['Int'];
  after?: InputMaybe<Scalars['Int']>;
}>;


export type ListingsQuery = { __typename?: 'Query', listings: { __typename?: 'ListingsResponse', hasMore: boolean, items: Array<{ __typename?: 'Listing', id: number, name: string, pricePerDay?: number | null, pricePerWeek?: number | null, pricePerMonth?: number | null, street: string, district: string, state: string, photos: Array<string>, listedBy?: { __typename?: 'User', id: number, name: string } | null }> } };

export type ListingsByUserQueryVariables = Exact<{
  userId: Scalars['Int'];
  take: Scalars['Int'];
  after?: InputMaybe<Scalars['Int']>;
}>;


export type ListingsByUserQuery = { __typename?: 'Query', listingsByUser: { __typename?: 'ListingsResponse', hasMore: boolean, items: Array<{ __typename: 'Listing', id: number, name: string, pricePerDay?: number | null, pricePerWeek?: number | null, pricePerMonth?: number | null, street: string, district: string, state: string, photos: Array<string>, createdAt: any }> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename: 'User', id: number, name: string, email?: string | null, avatar_url?: string | null, auth_method?: string | null } };

export type SearchQueryVariables = Exact<{
  term?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  district?: InputMaybe<Scalars['String']>;
}>;


export type SearchQuery = { __typename?: 'Query', search: Array<{ __typename?: 'Listing', id: number, name: string, description: string, pricePerDay?: number | null, pricePerWeek?: number | null, pricePerMonth?: number | null, street: string, district: string, state: string, photos: Array<string>, createdAt: any, listedBy?: { __typename?: 'User', id: number, name: string, email?: string | null } | null }> };

export type UserQueryVariables = Exact<{
  userId: Scalars['Int'];
}>;


export type UserQuery = { __typename?: 'Query', user: { __typename?: 'Error', type: string, message: string } | { __typename?: 'User', id: number, name: string, avatar_url?: string | null } };

export const ErrorFragmentFragmentDoc = gql`
    fragment ErrorFragment on Error {
  __typename
  type
  message
}
    `;
export const ListingFragmentFragmentDoc = gql`
    fragment ListingFragment on Listing {
  __typename
  id
  name
  description
  pricePerDay
  pricePerWeek
  pricePerMonth
  street
  district
  state
  photos
  createdAt
}
    `;
export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  __typename
  id
  name
  email
  avatar_url
}
    `;
export const CreateConvoDocument = gql`
    mutation CreateConvo($firstId: Int!, $secondId: Int!) {
  createConvo(firstId: $firstId, secondId: $secondId) {
    id
    friend {
      id
      name
    }
    all_seen_by_user
  }
}
    `;

export function useCreateConvoMutation() {
  return Urql.useMutation<CreateConvoMutation, CreateConvoMutationVariables>(CreateConvoDocument);
};
export const CreateListingDocument = gql`
    mutation CreateListing($name: String!, $description: String!, $userId: Int!, $street: String!, $district: String!, $state: String!, $photos: [String!]!, $pricePerDay: Int!, $pricePerWeek: Int, $pricePerMonth: Int) {
  createListing(
    name: $name
    description: $description
    userId: $userId
    street: $street
    district: $district
    state: $state
    photos: $photos
    pricePerDay: $pricePerDay
    pricePerWeek: $pricePerWeek
    pricePerMonth: $pricePerMonth
  ) {
    ...ListingFragment
    listedBy {
      id
      name
      email
    }
  }
}
    ${ListingFragmentFragmentDoc}`;

export function useCreateListingMutation() {
  return Urql.useMutation<CreateListingMutation, CreateListingMutationVariables>(CreateListingDocument);
};
export const DeleteListingDocument = gql`
    mutation DeleteListing($listingId: Int!) {
  deleteListing(listingId: $listingId)
}
    `;

export function useDeleteListingMutation() {
  return Urql.useMutation<DeleteListingMutation, DeleteListingMutationVariables>(DeleteListingDocument);
};
export const DeleteUserDocument = gql`
    mutation DeleteUser($deleteUserId: Int!) {
  deleteUser(id: $deleteUserId)
}
    `;

export function useDeleteUserMutation() {
  return Urql.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument);
};
export const LoginUserDocument = gql`
    mutation LoginUser($email: String!) {
  loginUser(email: $email) {
    __typename
    ... on User {
      ...UserFragment
    }
    ... on Error {
      ...ErrorFragment
    }
  }
}
    ${UserFragmentFragmentDoc}
${ErrorFragmentFragmentDoc}`;

export function useLoginUserMutation() {
  return Urql.useMutation<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument);
};
export const LoginWithGoogleDocument = gql`
    mutation LoginWithGoogle($name: String!, $email: String!) {
  loginWithGoogle(name: $name, email: $email) {
    __typename
    id
    name
    email
  }
}
    `;

export function useLoginWithGoogleMutation() {
  return Urql.useMutation<LoginWithGoogleMutation, LoginWithGoogleMutationVariables>(LoginWithGoogleDocument);
};
export const LogoutUserDocument = gql`
    mutation LogoutUser {
  logoutUser
}
    `;

export function useLogoutUserMutation() {
  return Urql.useMutation<LogoutUserMutation, LogoutUserMutationVariables>(LogoutUserDocument);
};
export const RegisterUserDocument = gql`
    mutation RegisterUser($name: String!, $email: String!) {
  registerUser(name: $name, email: $email) {
    __typename
    ... on User {
      ...UserFragment
    }
    ... on Error {
      ...ErrorFragment
    }
  }
}
    ${UserFragmentFragmentDoc}
${ErrorFragmentFragmentDoc}`;

export function useRegisterUserMutation() {
  return Urql.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument);
};
export const RegisterWithGoogleDocument = gql`
    mutation RegisterWithGoogle($name: String!, $email: String!) {
  registerWithGoogle(name: $name, email: $email) {
    id
    name
    email
    avatar_url
  }
}
    `;

export function useRegisterWithGoogleMutation() {
  return Urql.useMutation<RegisterWithGoogleMutation, RegisterWithGoogleMutationVariables>(RegisterWithGoogleDocument);
};
export const UpdateConvoDocument = gql`
    mutation UpdateConvo($convoId: Int!, $userId: Int!) {
  updateConvo(convoId: $convoId, userId: $userId)
}
    `;

export function useUpdateConvoMutation() {
  return Urql.useMutation<UpdateConvoMutation, UpdateConvoMutationVariables>(UpdateConvoDocument);
};
export const UpdateListingDocument = gql`
    mutation UpdateListing($itemId: Int!, $name: String, $description: String, $pricePerDay: Int, $pricePerWeek: Int, $pricePerMonth: Int, $street: String, $district: String, $state: String, $photos: [String!]) {
  updateListing(
    itemId: $itemId
    name: $name
    description: $description
    pricePerDay: $pricePerDay
    pricePerWeek: $pricePerWeek
    pricePerMonth: $pricePerMonth
    street: $street
    district: $district
    state: $state
    photos: $photos
  ) {
    id
    name
    description
    listedBy {
      id
      name
      email
    }
    pricePerDay
    pricePerWeek
    pricePerMonth
    street
    district
    state
    photos
  }
}
    `;

export function useUpdateListingMutation() {
  return Urql.useMutation<UpdateListingMutation, UpdateListingMutationVariables>(UpdateListingDocument);
};
export const UpdateUserDocument = gql`
    mutation UpdateUser($updateUserId: Int!, $name: String, $avatarUrl: String) {
  updateUser(id: $updateUserId, name: $name, avatar_url: $avatarUrl) {
    id
    name
    email
    avatar_url
    auth_method
  }
}
    `;

export function useUpdateUserMutation() {
  return Urql.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument);
};
export const ConvoWithUserDocument = gql`
    query ConvoWithUser($convoId: Int!, $after: Int, $take: Int!) {
  convoWithUser(convoId: $convoId, after: $after, take: $take) {
    hasMore
    messages {
      id
      fromId
      convoId
      toId
      content
      createdAt
    }
  }
}
    `;

export function useConvoWithUserQuery(options: Omit<Urql.UseQueryArgs<ConvoWithUserQueryVariables>, 'query'>) {
  return Urql.useQuery<ConvoWithUserQuery>({ query: ConvoWithUserDocument, ...options });
};
export const ConvosByUserDocument = gql`
    query ConvosByUser($userId: Int) {
  convosByUser(user_id: $userId) {
    id
    friend {
      id
      name
    }
    all_seen_by_user
  }
}
    `;

export function useConvosByUserQuery(options?: Omit<Urql.UseQueryArgs<ConvosByUserQueryVariables>, 'query'>) {
  return Urql.useQuery<ConvosByUserQuery>({ query: ConvosByUserDocument, ...options });
};
export const IsThereConvoDocument = gql`
    query IsThereConvo($userId: Int!, $friendId: Int!) {
  isThereConvoWithFriend(userId: $userId, friendId: $friendId)
}
    `;

export function useIsThereConvoQuery(options: Omit<Urql.UseQueryArgs<IsThereConvoQueryVariables>, 'query'>) {
  return Urql.useQuery<IsThereConvoQuery>({ query: IsThereConvoDocument, ...options });
};
export const ListingDocument = gql`
    query Listing($listingId: Int!) {
  listing(id: $listingId) {
    id
    name
    description
    listedBy {
      id
      name
    }
    pricePerDay
    pricePerWeek
    pricePerMonth
    street
    district
    state
    photos
  }
}
    `;

export function useListingQuery(options: Omit<Urql.UseQueryArgs<ListingQueryVariables>, 'query'>) {
  return Urql.useQuery<ListingQuery>({ query: ListingDocument, ...options });
};
export const ListingsDocument = gql`
    query Listings($take: Int!, $after: Int) {
  listings(take: $take, after: $after) {
    items {
      id
      name
      listedBy {
        id
        name
      }
      pricePerDay
      pricePerWeek
      pricePerMonth
      street
      district
      state
      photos
    }
    hasMore
  }
}
    `;

export function useListingsQuery(options: Omit<Urql.UseQueryArgs<ListingsQueryVariables>, 'query'>) {
  return Urql.useQuery<ListingsQuery>({ query: ListingsDocument, ...options });
};
export const ListingsByUserDocument = gql`
    query ListingsByUser($userId: Int!, $take: Int!, $after: Int) {
  listingsByUser(user_id: $userId, take: $take, after: $after) {
    items {
      __typename
      id
      name
      pricePerDay
      pricePerWeek
      pricePerMonth
      street
      district
      state
      photos
      createdAt
    }
    hasMore
  }
}
    `;

export function useListingsByUserQuery(options: Omit<Urql.UseQueryArgs<ListingsByUserQueryVariables>, 'query'>) {
  return Urql.useQuery<ListingsByUserQuery>({ query: ListingsByUserDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    __typename
    id
    name
    email
    avatar_url
    auth_method
  }
}
    `;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const SearchDocument = gql`
    query Search($term: String, $state: String, $district: String) {
  search(term: $term, state: $state, district: $district) {
    id
    name
    description
    listedBy {
      id
      name
      email
    }
    pricePerDay
    pricePerWeek
    pricePerMonth
    street
    district
    state
    photos
    createdAt
  }
}
    `;

export function useSearchQuery(options?: Omit<Urql.UseQueryArgs<SearchQueryVariables>, 'query'>) {
  return Urql.useQuery<SearchQuery>({ query: SearchDocument, ...options });
};
export const UserDocument = gql`
    query User($userId: Int!) {
  user(id: $userId) {
    ... on User {
      id
      name
      avatar_url
    }
    ... on Error {
      type
      message
    }
  }
}
    `;

export function useUserQuery(options: Omit<Urql.UseQueryArgs<UserQueryVariables>, 'query'>) {
  return Urql.useQuery<UserQuery>({ query: UserDocument, ...options });
};