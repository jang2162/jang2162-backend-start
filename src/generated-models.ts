/* tslint:ignore */
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { ModuleContext } from '@graphql-modules/core';
export type Maybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: Date;
  DateTime: Date;
};



export type Query = {
  __typename?: 'Query';
  sampleUsers: SampleUserConnection;
  sampleUserById?: Maybe<SampleUser>;
  samplePosts: SamplePostConnection;
  samplePostById?: Maybe<SamplePost>;
  users: UserConnection;
  userById?: Maybe<User>;
};


export type QuerySampleUsersArgs = {
  form?: Maybe<SampleUserForm>;
};


export type QuerySampleUserByIdArgs = {
  id: Scalars['ID'];
};


export type QuerySamplePostsArgs = {
  form?: Maybe<SamplePostForm>;
};


export type QuerySamplePostByIdArgs = {
  id: Scalars['ID'];
};


export type QueryUsersArgs = {
  form?: Maybe<UserForm>;
};


export type QueryUserByIdArgs = {
  id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  authentication?: Maybe<Scalars['String']>;
  refreshToken?: Maybe<Scalars['String']>;
  invalidate?: Maybe<Scalars['String']>;
  addSampleUser?: Maybe<SampleUser>;
  addUser: User;
};


export type MutationAuthenticationArgs = {
  id: Scalars['String'];
  pw: Scalars['String'];
};


export type MutationAddSampleUserArgs = {
  user: SampleUserInput;
};


export type MutationAddUserArgs = {
  user: UserInput;
};

export type AccessToken = {
  __typename?: 'accessToken';
  token: Scalars['String'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  totalCount: Scalars['Int'];
  next?: Maybe<Scalars['String']>;
  prev?: Maybe<Scalars['String']>;
  hasNext: Scalars['Boolean'];
  hasPrev: Scalars['Boolean'];
  sortBy: Scalars['String'];
  sort: Sort_Type;
  direction: Direction_Type;
};

export type PageInput = {
  cursor?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['Int']>;
  sortBy?: Maybe<Scalars['String']>;
  sort?: Maybe<Sort_Type>;
  direction?: Maybe<Direction_Type>;
};

export enum Sort_Type {
  Asc = 'ASC',
  Desc = 'DESC'
}

export enum Direction_Type {
  Next = 'NEXT',
  Prev = 'PREV'
}

export type SampleUser = {
  __typename?: 'SampleUser';
  id: Scalars['ID'];
  name: Scalars['String'];
  birthday?: Maybe<Scalars['Date']>;
  posts?: Maybe<SamplePostConnection>;
};


export type SampleUserPostsArgs = {
  page?: Maybe<PageInput>;
};

export type SampleUserForm = {
  page?: Maybe<PageInput>;
  name?: Maybe<Scalars['String']>;
};

export type SampleUserInput = {
  name: Scalars['String'];
  birthday?: Maybe<Scalars['Date']>;
};

export type SampleUserConnection = {
  __typename?: 'SampleUserConnection';
  pageInfo: PageInfo;
  list?: Maybe<Array<SampleUser>>;
};

export type SamplePost = {
  __typename?: 'SamplePost';
  id: Scalars['ID'];
  subject: Scalars['String'];
  content?: Maybe<Scalars['String']>;
  writer: SampleUser;
  writer_id: Scalars['ID'];
};

export type SamplePostForm = {
  page?: Maybe<PageInput>;
  searchKeyword?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
};

export type SamplePostConnection = {
  __typename?: 'SamplePostConnection';
  pageInfo: PageInfo;
  list: Array<SamplePost>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  loginId: Scalars['String'];
  name: Scalars['String'];
  birthday?: Maybe<Scalars['Date']>;
  createDate: Scalars['Date'];
};

export type UserForm = {
  page?: Maybe<PageInput>;
  name?: Maybe<Scalars['String']>;
};

export type UserInput = {
  name: Scalars['String'];
  loginId: Scalars['String'];
  password: Scalars['String'];
  birthday?: Maybe<Scalars['Date']>;
};

export type UserConnection = {
  __typename?: 'UserConnection';
  pageInfo: PageInfo;
  list?: Maybe<Array<User>>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

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
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

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

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

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
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Query: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Mutation: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  accessToken: ResolverTypeWrapper<AccessToken>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  PageInput: PageInput;
  SORT_TYPE: Sort_Type;
  DIRECTION_TYPE: Direction_Type;
  SampleUser: ResolverTypeWrapper<SampleUser>;
  SampleUserForm: SampleUserForm;
  SampleUserInput: SampleUserInput;
  SampleUserConnection: ResolverTypeWrapper<SampleUserConnection>;
  SamplePost: ResolverTypeWrapper<SamplePost>;
  SamplePostForm: SamplePostForm;
  SamplePostConnection: ResolverTypeWrapper<SamplePostConnection>;
  User: ResolverTypeWrapper<User>;
  UserForm: UserForm;
  UserInput: UserInput;
  UserConnection: ResolverTypeWrapper<UserConnection>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Date: Scalars['Date'];
  DateTime: Scalars['DateTime'];
  Query: {};
  ID: Scalars['ID'];
  Mutation: {};
  String: Scalars['String'];
  accessToken: AccessToken;
  PageInfo: PageInfo;
  Int: Scalars['Int'];
  Boolean: Scalars['Boolean'];
  PageInput: PageInput;
  SampleUser: SampleUser;
  SampleUserForm: SampleUserForm;
  SampleUserInput: SampleUserInput;
  SampleUserConnection: SampleUserConnection;
  SamplePost: SamplePost;
  SamplePostForm: SamplePostForm;
  SamplePostConnection: SamplePostConnection;
  User: User;
  UserForm: UserForm;
  UserInput: UserInput;
  UserConnection: UserConnection;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type QueryResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  sampleUsers?: Resolver<ResolversTypes['SampleUserConnection'], ParentType, ContextType, RequireFields<QuerySampleUsersArgs, 'form'>>;
  sampleUserById?: Resolver<Maybe<ResolversTypes['SampleUser']>, ParentType, ContextType, RequireFields<QuerySampleUserByIdArgs, 'id'>>;
  samplePosts?: Resolver<ResolversTypes['SamplePostConnection'], ParentType, ContextType, RequireFields<QuerySamplePostsArgs, 'form'>>;
  samplePostById?: Resolver<Maybe<ResolversTypes['SamplePost']>, ParentType, ContextType, RequireFields<QuerySamplePostByIdArgs, 'id'>>;
  users?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType, RequireFields<QueryUsersArgs, 'form'>>;
  userById?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserByIdArgs, 'id'>>;
};

export type MutationResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  authentication?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationAuthenticationArgs, 'id' | 'pw'>>;
  refreshToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  invalidate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  addSampleUser?: Resolver<Maybe<ResolversTypes['SampleUser']>, ParentType, ContextType, RequireFields<MutationAddSampleUserArgs, 'user'>>;
  addUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationAddUserArgs, 'user'>>;
};

export type AccessTokenResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['accessToken'] = ResolversParentTypes['accessToken']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type PageInfoResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  next?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  prev?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNext?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPrev?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  sortBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sort?: Resolver<ResolversTypes['SORT_TYPE'], ParentType, ContextType>;
  direction?: Resolver<ResolversTypes['DIRECTION_TYPE'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type SampleUserResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['SampleUser'] = ResolversParentTypes['SampleUser']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  birthday?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  posts?: Resolver<Maybe<ResolversTypes['SamplePostConnection']>, ParentType, ContextType, RequireFields<SampleUserPostsArgs, 'page'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type SampleUserConnectionResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['SampleUserConnection'] = ResolversParentTypes['SampleUserConnection']> = {
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  list?: Resolver<Maybe<Array<ResolversTypes['SampleUser']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type SamplePostResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['SamplePost'] = ResolversParentTypes['SamplePost']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  subject?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  writer?: Resolver<ResolversTypes['SampleUser'], ParentType, ContextType>;
  writer_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type SamplePostConnectionResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['SamplePostConnection'] = ResolversParentTypes['SamplePostConnection']> = {
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  list?: Resolver<Array<ResolversTypes['SamplePost']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type UserResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  loginId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  birthday?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  createDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type UserConnectionResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['UserConnection'] = ResolversParentTypes['UserConnection']> = {
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  list?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type Resolvers<ContextType = ModuleContext> = {
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  accessToken?: AccessTokenResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  SampleUser?: SampleUserResolvers<ContextType>;
  SampleUserConnection?: SampleUserConnectionResolvers<ContextType>;
  SamplePost?: SamplePostResolvers<ContextType>;
  SamplePostConnection?: SamplePostConnectionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserConnection?: UserConnectionResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = ModuleContext> = Resolvers<ContextType>;
