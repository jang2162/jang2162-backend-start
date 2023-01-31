import { ResolveFn as ResolverFn } from './utils/gqlAppBuilder';
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export { ResolverFn };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: Date;
  Datetime: Date;
  Timestamp: Date;
  Void: any;
};

export type CursorPageInfo = {
  __typename?: 'CursorPageInfo';
  hasMore: Scalars['Boolean'];
  next?: Maybe<Scalars['String']>;
  prev?: Maybe<Scalars['String']>;
  totalCount: Scalars['Int'];
};

export type CursorPageInput = {
  cursor?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  authentication?: Maybe<Scalars['String']>;
  insertTempPost?: Maybe<Scalars['Void']>;
  insertTempUser?: Maybe<Scalars['Void']>;
  invalidate?: Maybe<Scalars['String']>;
  refreshToken?: Maybe<Scalars['String']>;
};


export type MutationAuthenticationArgs = {
  id: Scalars['String'];
  pw: Scalars['String'];
};


export type MutationInsertTempPostArgs = {
  content: Scalars['String'];
  title: Scalars['String'];
  writerId: Scalars['Int'];
};


export type MutationInsertTempUserArgs = {
  birth: Scalars['Date'];
  name: Scalars['String'];
};

export type OffsetPageInput = {
  pageIndex?: InputMaybe<Scalars['Int']>;
  size?: InputMaybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  nowDate?: Maybe<Scalars['Date']>;
  nowDateArr?: Maybe<Array<Maybe<Scalars['Date']>>>;
  nowDateArrNN: Array<Maybe<Scalars['Date']>>;
  nowDateNN: Scalars['Date'];
  nowDateNNArr?: Maybe<Array<Scalars['Date']>>;
  nowDateNNArrNN: Array<Scalars['Date']>;
  nowDatetime?: Maybe<Scalars['Datetime']>;
  nowTimestamp?: Maybe<Scalars['Timestamp']>;
  selectPostById: TempPost;
  selectPosts: Array<TempPost>;
  selectUserById: TempUser;
  selectUsers: Array<TempUser>;
};


export type QuerySelectPostByIdArgs = {
  id: Scalars['Int'];
};


export type QuerySelectUserByIdArgs = {
  id: Scalars['Int'];
};

export type TempPost = {
  __typename?: 'TempPost';
  content: Scalars['String'];
  id: Scalars['ID'];
  postId: Scalars['Int'];
  regDate: Scalars['Date'];
  title: Scalars['String'];
  writer: TempUser;
  writerId: Scalars['Int'];
};

export type TempUser = {
  __typename?: 'TempUser';
  birth: Scalars['Date'];
  id: Scalars['ID'];
  name: Scalars['String'];
  posts: Array<TempPost>;
  userId: Scalars['Int'];
};

export type AccessToken = {
  __typename?: 'accessToken';
  token: Scalars['String'];
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
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CursorPageInfo: ResolverTypeWrapper<CursorPageInfo>;
  CursorPageInput: CursorPageInput;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Datetime: ResolverTypeWrapper<Scalars['Datetime']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  OffsetPageInput: OffsetPageInput;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  TempPost: ResolverTypeWrapper<TempPost>;
  TempUser: ResolverTypeWrapper<TempUser>;
  Timestamp: ResolverTypeWrapper<Scalars['Timestamp']>;
  Void: ResolverTypeWrapper<Scalars['Void']>;
  accessToken: ResolverTypeWrapper<AccessToken>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  CursorPageInfo: CursorPageInfo;
  CursorPageInput: CursorPageInput;
  Date: Scalars['Date'];
  Datetime: Scalars['Datetime'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Mutation: {};
  OffsetPageInput: OffsetPageInput;
  Query: {};
  String: Scalars['String'];
  TempPost: TempPost;
  TempUser: TempUser;
  Timestamp: Scalars['Timestamp'];
  Void: Scalars['Void'];
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
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  nowDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  nowDateArr?: Resolver<Maybe<Array<Maybe<ResolversTypes['Date']>>>, ParentType, ContextType>;
  nowDateArrNN?: Resolver<Array<Maybe<ResolversTypes['Date']>>, ParentType, ContextType>;
  nowDateNN?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  nowDateNNArr?: Resolver<Maybe<Array<ResolversTypes['Date']>>, ParentType, ContextType>;
  nowDateNNArrNN?: Resolver<Array<ResolversTypes['Date']>, ParentType, ContextType>;
  nowDatetime?: Resolver<Maybe<ResolversTypes['Datetime']>, ParentType, ContextType>;
  nowTimestamp?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  selectPostById?: Resolver<ResolversTypes['TempPost'], ParentType, ContextType, RequireFields<QuerySelectPostByIdArgs, 'id'>>;
  selectPosts?: Resolver<Array<ResolversTypes['TempPost']>, ParentType, ContextType>;
  selectUserById?: Resolver<ResolversTypes['TempUser'], ParentType, ContextType, RequireFields<QuerySelectUserByIdArgs, 'id'>>;
  selectUsers?: Resolver<Array<ResolversTypes['TempUser']>, ParentType, ContextType>;
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

export interface VoidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Void'], any> {
  name: 'Void';
}

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
  TempPost?: TempPostResolvers<ContextType>;
  TempUser?: TempUserResolvers<ContextType>;
  Timestamp?: GraphQLScalarType;
  Void?: GraphQLScalarType;
  accessToken?: AccessTokenResolvers<ContextType>;
};

