import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Convo: ResolverTypeWrapper<Convo>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Error: ResolverTypeWrapper<Error>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Listing: ResolverTypeWrapper<Listing>;
  ListingsResponse: ResolverTypeWrapper<ListingsResponse>;
  LoginResponse: ResolversTypes['Error'] | ResolversTypes['User'];
  Message: ResolverTypeWrapper<Message>;
  Mutation: ResolverTypeWrapper<{}>;
  PaginatedMessages: ResolverTypeWrapper<PaginatedMessages>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean'];
  Convo: Convo;
  Date: Scalars['Date'];
  Error: Error;
  Int: Scalars['Int'];
  Listing: Listing;
  ListingsResponse: ListingsResponse;
  LoginResponse: ResolversParentTypes['Error'] | ResolversParentTypes['User'];
  Message: Message;
  Mutation: {};
  PaginatedMessages: PaginatedMessages;
  Query: {};
  String: Scalars['String'];
  User: User;
}>;

export type ConvoResolvers<ContextType = any, ParentType extends ResolversParentTypes['Convo'] = ResolversParentTypes['Convo']> = ResolversObject<{
  all_seen_by_user?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  friend?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type ErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ListingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Listing'] = ResolversParentTypes['Listing']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  district?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  listedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  photos?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  pricePerDay?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  pricePerMonth?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  pricePerWeek?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  street?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ListingsResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ListingsResponse'] = ResolversParentTypes['ListingsResponse']> = ResolversObject<{
  hasMore?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['Listing']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResponse'] = ResolversParentTypes['LoginResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Error' | 'User', ParentType, ContextType>;
}>;

export type MessageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Message'] = ResolversParentTypes['Message']> = ResolversObject<{
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  convoId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  fromId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  toId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createConvo?: Resolver<ResolversTypes['Convo'], ParentType, ContextType, RequireFields<MutationCreateConvoArgs, 'firstId' | 'secondId'>>;
  createListing?: Resolver<ResolversTypes['Listing'], ParentType, ContextType, RequireFields<MutationCreateListingArgs, 'description' | 'district' | 'name' | 'photos' | 'pricePerDay' | 'state' | 'street' | 'userId'>>;
  deleteListing?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, RequireFields<MutationDeleteListingArgs, 'listingId'>>;
  deleteUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  loginUser?: Resolver<ResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<MutationLoginUserArgs, 'email'>>;
  loginWithGoogle?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationLoginWithGoogleArgs, 'email' | 'name'>>;
  logoutUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  registerUser?: Resolver<ResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<MutationRegisterUserArgs, 'email' | 'name'>>;
  registerWithGoogle?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationRegisterWithGoogleArgs, 'email' | 'name'>>;
  updateConvo?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateConvoArgs, 'convoId' | 'userId'>>;
  updateListing?: Resolver<ResolversTypes['Listing'], ParentType, ContextType, RequireFields<MutationUpdateListingArgs, 'itemId'>>;
  updateUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'id'>>;
}>;

export type PaginatedMessagesResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaginatedMessages'] = ResolversParentTypes['PaginatedMessages']> = ResolversObject<{
  hasMore?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  messages?: Resolver<Array<Maybe<ResolversTypes['Message']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  convoWithUser?: Resolver<ResolversTypes['PaginatedMessages'], ParentType, ContextType, RequireFields<QueryConvoWithUserArgs, 'convoId' | 'take'>>;
  convosByUser?: Resolver<Array<Maybe<ResolversTypes['Convo']>>, ParentType, ContextType, Partial<QueryConvosByUserArgs>>;
  isThereConvoWithFriend?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, RequireFields<QueryIsThereConvoWithFriendArgs, 'friendId' | 'userId'>>;
  listing?: Resolver<ResolversTypes['Listing'], ParentType, ContextType, RequireFields<QueryListingArgs, 'id'>>;
  listings?: Resolver<ResolversTypes['ListingsResponse'], ParentType, ContextType, RequireFields<QueryListingsArgs, 'take'>>;
  listingsByUser?: Resolver<ResolversTypes['ListingsResponse'], ParentType, ContextType, RequireFields<QueryListingsByUserArgs, 'take' | 'user_id'>>;
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  search?: Resolver<Array<ResolversTypes['Listing']>, ParentType, ContextType, Partial<QuerySearchArgs>>;
  user?: Resolver<ResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  auth_method?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  avatar_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Convo?: ConvoResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Error?: ErrorResolvers<ContextType>;
  Listing?: ListingResolvers<ContextType>;
  ListingsResponse?: ListingsResponseResolvers<ContextType>;
  LoginResponse?: LoginResponseResolvers<ContextType>;
  Message?: MessageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PaginatedMessages?: PaginatedMessagesResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

