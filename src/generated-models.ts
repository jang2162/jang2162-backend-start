import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { ModuleContext } from '@/utils/apolloUtil';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
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
  Date: Date;
  Datetime: any;
  Timestamp: any;
};

export type CusorPageInfo = {
  __typename?: 'CusorPageInfo';
  hasMore: Scalars['Boolean'];
  next?: Maybe<Scalars['String']>;
  prev?: Maybe<Scalars['String']>;
  totalCount: Scalars['Int'];
};

export type CusorPageInput = {
  cursor?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addUser: User;
  authentication?: Maybe<Scalars['String']>;
  invalidate?: Maybe<Scalars['String']>;
  refreshToken?: Maybe<Scalars['String']>;
};


export type MutationAddUserArgs = {
  user: UserInput;
};


export type MutationAuthenticationArgs = {
  id: Scalars['String'];
  pw: Scalars['String'];
};

export type OffsetPageInput = {
  pageIndex?: InputMaybe<Scalars['Int']>;
  size?: InputMaybe<Scalars['Int']>;
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['ID'];
  subject: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  userById?: Maybe<User>;
  users: UserConnection;
};


export type QueryUserByIdArgs = {
  id: Scalars['ID'];
};


export type QueryUsersArgs = {
  page?: InputMaybe<CusorPageInput>;
  search?: InputMaybe<UserSearchInput>;
};

export type User = {
  __typename?: 'User';
  birthday?: Maybe<Scalars['Date']>;
  createDate: Scalars['Date'];
  id: Scalars['ID'];
  loginId: Scalars['String'];
  name: Scalars['String'];
  posts: Array<Post>;
};

export type UserConnection = {
  __typename?: 'UserConnection';
  list: Array<User>;
  pageInfo: CusorPageInfo;
};

export type UserInput = {
  birthday?: InputMaybe<Scalars['Date']>;
  loginId: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};

export type UserSearchInput = {
  searchLoginId?: InputMaybe<Scalars['String']>;
  searchName?: InputMaybe<Scalars['String']>;
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
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CusorPageInfo: ResolverTypeWrapper<CusorPageInfo>;
  CusorPageInput: CusorPageInput;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Datetime: ResolverTypeWrapper<Scalars['Datetime']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  OffsetPageInput: OffsetPageInput;
  Post: ResolverTypeWrapper<Post>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Timestamp: ResolverTypeWrapper<Scalars['Timestamp']>;
  User: ResolverTypeWrapper<User>;
  UserConnection: ResolverTypeWrapper<UserConnection>;
  UserInput: UserInput;
  UserSearchInput: UserSearchInput;
  accessToken: ResolverTypeWrapper<AccessToken>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  CusorPageInfo: CusorPageInfo;
  CusorPageInput: CusorPageInput;
  Date: Scalars['Date'];
  Datetime: Scalars['Datetime'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Mutation: {};
  OffsetPageInput: OffsetPageInput;
  Post: Post;
  Query: {};
  String: Scalars['String'];
  Timestamp: Scalars['Timestamp'];
  User: User;
  UserConnection: UserConnection;
  UserInput: UserInput;
  UserSearchInput: UserSearchInput;
  accessToken: AccessToken;
};

export type CusorPageInfoResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['CusorPageInfo'] = ResolversParentTypes['CusorPageInfo']> = {
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

export type MutationResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationAddUserArgs, 'user'>>;
  authentication?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationAuthenticationArgs, 'id' | 'pw'>>;
  invalidate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  refreshToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type PostResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  subject?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  userById?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserByIdArgs, 'id'>>;
  users?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType, Partial<QueryUsersArgs>>;
};

export interface TimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Timestamp'], any> {
  name: 'Timestamp';
}

export type UserResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  birthday?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  createDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  loginId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  posts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserConnectionResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['UserConnection'] = ResolversParentTypes['UserConnection']> = {
  list?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['CusorPageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AccessTokenResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['accessToken'] = ResolversParentTypes['accessToken']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = ModuleContext> = {
  CusorPageInfo?: CusorPageInfoResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Datetime?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Timestamp?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  UserConnection?: UserConnectionResolvers<ContextType>;
  accessToken?: AccessTokenResolvers<ContextType>;
};

