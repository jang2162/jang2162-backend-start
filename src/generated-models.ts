import { ResolveFn as ResolverFn } from './utils/gqlAppBuilder';
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export { ResolverFn };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: Date; output: Date; }
  Datetime: { input: Date; output: Date; }
  Timestamp: { input: Date; output: Date; }
  Void: { input: any; output: any; }
};

export type CursorPageInfo = {
  __typename?: 'CursorPageInfo';
  hasMore: Scalars['Boolean']['output'];
  next?: Maybe<Scalars['String']['output']>;
  prev?: Maybe<Scalars['String']['output']>;
  totalCount: Scalars['Int']['output'];
};

export type CursorPageInput = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  authentication?: Maybe<Scalars['String']['output']>;
  insertTempPost?: Maybe<Scalars['Void']['output']>;
  insertTempUser?: Maybe<Scalars['Void']['output']>;
  invalidate?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  updateSelectOptions?: Maybe<Scalars['Void']['output']>;
  vote?: Maybe<Scalars['Void']['output']>;
};


export type MutationAuthenticationArgs = {
  id: Scalars['String']['input'];
  pw: Scalars['String']['input'];
};


export type MutationInsertTempPostArgs = {
  content: Scalars['String']['input'];
  title: Scalars['String']['input'];
  writerId: Scalars['Int']['input'];
};


export type MutationInsertTempUserArgs = {
  birth: Scalars['Date']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdateSelectOptionsArgs = {
  options: Array<SelectOptionInput>;
  voteId: Scalars['String']['input'];
};


export type MutationVoteArgs = {
  voteData: VoteDataInput;
};

export type OffsetPageInput = {
  pageIndex?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  getVoteInfo?: Maybe<VoteInfoType>;
  nowDate?: Maybe<Scalars['Date']['output']>;
  nowDateArr?: Maybe<Array<Maybe<Scalars['Date']['output']>>>;
  nowDateArrNN: Array<Maybe<Scalars['Date']['output']>>;
  nowDateNN: Scalars['Date']['output'];
  nowDateNNArr?: Maybe<Array<Scalars['Date']['output']>>;
  nowDateNNArrNN: Array<Scalars['Date']['output']>;
  nowDatetime?: Maybe<Scalars['Datetime']['output']>;
  nowTimestamp?: Maybe<Scalars['Timestamp']['output']>;
  selectMyInfo: User;
  selectPostById: TempPost;
  selectPosts: Array<TempPost>;
  selectUserById: TempUser;
  selectUsers: Array<TempUser>;
};


export type QuerySelectPostByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QuerySelectUserByIdArgs = {
  id: Scalars['Int']['input'];
};

export type SelectOptionInput = {
  color: Scalars['String']['input'];
  label: Scalars['String']['input'];
};

export type SelectOptionType = {
  __typename?: 'SelectOptionType';
  color: Scalars['String']['output'];
  label: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  someoneVote?: Maybe<VoteDataType>;
  voteInfoChange?: Maybe<VoteInfoType>;
};

export type TempPost = {
  __typename?: 'TempPost';
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  postId: Scalars['Int']['output'];
  regDate: Scalars['Date']['output'];
  title: Scalars['String']['output'];
  writer: TempUser;
  writerId: Scalars['Int']['output'];
};

export type TempUser = {
  __typename?: 'TempUser';
  birth: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  posts: Array<TempPost>;
  userId: Scalars['Int']['output'];
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']['output']>;
  discordUserId: Scalars['String']['output'];
  discriminator: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type VoteDataInput = {
  idx: Scalars['Int']['input'];
  user: Scalars['String']['input'];
  voteId: Scalars['String']['input'];
};

export type VoteDataType = {
  __typename?: 'VoteDataType';
  idx: Scalars['Int']['output'];
  user: Scalars['String']['output'];
  voteId: Scalars['String']['output'];
};

export type VoteInfoType = {
  __typename?: 'VoteInfoType';
  selectOptions: Array<SelectOptionType>;
  voteId: Scalars['String']['output'];
};

export type AccessToken = {
  __typename?: 'accessToken';
  token: Scalars['String']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

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
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CursorPageInfo: ResolverTypeWrapper<CursorPageInfo>;
  CursorPageInput: CursorPageInput;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  Datetime: ResolverTypeWrapper<Scalars['Datetime']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  OffsetPageInput: OffsetPageInput;
  Query: ResolverTypeWrapper<{}>;
  SelectOptionInput: SelectOptionInput;
  SelectOptionType: ResolverTypeWrapper<SelectOptionType>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  TempPost: ResolverTypeWrapper<TempPost>;
  TempUser: ResolverTypeWrapper<TempUser>;
  Timestamp: ResolverTypeWrapper<Scalars['Timestamp']['output']>;
  User: ResolverTypeWrapper<User>;
  Void: ResolverTypeWrapper<Scalars['Void']['output']>;
  VoteDataInput: VoteDataInput;
  VoteDataType: ResolverTypeWrapper<VoteDataType>;
  VoteInfoType: ResolverTypeWrapper<VoteInfoType>;
  accessToken: ResolverTypeWrapper<AccessToken>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  CursorPageInfo: CursorPageInfo;
  CursorPageInput: CursorPageInput;
  Date: Scalars['Date']['output'];
  Datetime: Scalars['Datetime']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  OffsetPageInput: OffsetPageInput;
  Query: {};
  SelectOptionInput: SelectOptionInput;
  SelectOptionType: SelectOptionType;
  String: Scalars['String']['output'];
  Subscription: {};
  TempPost: TempPost;
  TempUser: TempUser;
  Timestamp: Scalars['Timestamp']['output'];
  User: User;
  Void: Scalars['Void']['output'];
  VoteDataInput: VoteDataInput;
  VoteDataType: VoteDataType;
  VoteInfoType: VoteInfoType;
  accessToken: AccessToken;
};

export type CursorPageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['CursorPageInfo'] = ResolversParentTypes['CursorPageInfo']> = {
  hasMore?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  next?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  prev?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DatetimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Datetime'], any> {
  name: 'Datetime';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  authentication?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationAuthenticationArgs, 'id' | 'pw'>>;
  insertTempPost?: Resolver<Maybe<ResolversTypes['Void']>, ParentType, ContextType, RequireFields<MutationInsertTempPostArgs, 'content' | 'title' | 'writerId'>>;
  insertTempUser?: Resolver<Maybe<ResolversTypes['Void']>, ParentType, ContextType, RequireFields<MutationInsertTempUserArgs, 'birth' | 'name'>>;
  invalidate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  refreshToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updateSelectOptions?: Resolver<Maybe<ResolversTypes['Void']>, ParentType, ContextType, RequireFields<MutationUpdateSelectOptionsArgs, 'options' | 'voteId'>>;
  vote?: Resolver<Maybe<ResolversTypes['Void']>, ParentType, ContextType, RequireFields<MutationVoteArgs, 'voteData'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getVoteInfo?: Resolver<Maybe<ResolversTypes['VoteInfoType']>, ParentType, ContextType>;
  nowDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  nowDateArr?: Resolver<Maybe<Array<Maybe<ResolversTypes['Date']>>>, ParentType, ContextType>;
  nowDateArrNN?: Resolver<Array<Maybe<ResolversTypes['Date']>>, ParentType, ContextType>;
  nowDateNN?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  nowDateNNArr?: Resolver<Maybe<Array<ResolversTypes['Date']>>, ParentType, ContextType>;
  nowDateNNArrNN?: Resolver<Array<ResolversTypes['Date']>, ParentType, ContextType>;
  nowDatetime?: Resolver<Maybe<ResolversTypes['Datetime']>, ParentType, ContextType>;
  nowTimestamp?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  selectMyInfo?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  selectPostById?: Resolver<ResolversTypes['TempPost'], ParentType, ContextType, RequireFields<QuerySelectPostByIdArgs, 'id'>>;
  selectPosts?: Resolver<Array<ResolversTypes['TempPost']>, ParentType, ContextType>;
  selectUserById?: Resolver<ResolversTypes['TempUser'], ParentType, ContextType, RequireFields<QuerySelectUserByIdArgs, 'id'>>;
  selectUsers?: Resolver<Array<ResolversTypes['TempUser']>, ParentType, ContextType>;
};

export type SelectOptionTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['SelectOptionType'] = ResolversParentTypes['SelectOptionType']> = {
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  someoneVote?: SubscriptionResolver<Maybe<ResolversTypes['VoteDataType']>, "someoneVote", ParentType, ContextType>;
  voteInfoChange?: SubscriptionResolver<Maybe<ResolversTypes['VoteInfoType']>, "voteInfoChange", ParentType, ContextType>;
};

export type TempPostResolvers<ContextType = any, ParentType extends ResolversParentTypes['TempPost'] = ResolversParentTypes['TempPost']> = {
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  postId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  regDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  writer?: Resolver<ResolversTypes['TempUser'], ParentType, ContextType>;
  writerId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TempUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['TempUser'] = ResolversParentTypes['TempUser']> = {
  birth?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  posts?: Resolver<Array<ResolversTypes['TempPost']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface TimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Timestamp'], any> {
  name: 'Timestamp';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  discordUserId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  discriminator?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface VoidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Void'], any> {
  name: 'Void';
}

export type VoteDataTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['VoteDataType'] = ResolversParentTypes['VoteDataType']> = {
  idx?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  voteId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VoteInfoTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['VoteInfoType'] = ResolversParentTypes['VoteInfoType']> = {
  selectOptions?: Resolver<Array<ResolversTypes['SelectOptionType']>, ParentType, ContextType>;
  voteId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AccessTokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['accessToken'] = ResolversParentTypes['accessToken']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  CursorPageInfo?: CursorPageInfoResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Datetime?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SelectOptionType?: SelectOptionTypeResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  TempPost?: TempPostResolvers<ContextType>;
  TempUser?: TempUserResolvers<ContextType>;
  Timestamp?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  Void?: GraphQLScalarType;
  VoteDataType?: VoteDataTypeResolvers<ContextType>;
  VoteInfoType?: VoteInfoTypeResolvers<ContextType>;
  accessToken?: AccessTokenResolvers<ContextType>;
};

