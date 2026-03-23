// @ts-nocheck
import { gql } from '@apollo/client';
import * as ApolloReactCommon from '@apollo/client/react';
import * as ApolloReactHooks from '@apollo/client/react';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTimeISO: { input: any; output: any; }
};

export type AdminCounts = {
  __typename?: 'AdminCounts';
  childrenCount: Scalars['Int']['output'];
  parentCount: Scalars['Int']['output'];
  staffCount: Scalars['Int']['output'];
};

export type ChangePasswordInput = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type Child = {
  __typename?: 'Child';
  birthDate: Scalars['DateTimeISO']['output'];
  firstName: Scalars['String']['output'];
  group: Group;
  healthRecord?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  lastName: Scalars['String']['output'];
  parents: Array<User>;
  picture: Scalars['String']['output'];
  reports: Array<Report>;
};

export type Conversation = {
  __typename?: 'Conversation';
  creationDate: Scalars['DateTimeISO']['output'];
  id: Scalars['Int']['output'];
  initiator: User;
  messages: Array<Message>;
  participant: User;
};

export type CreateMessageInput = {
  content: Scalars['String']['input'];
  conversationId: Scalars['Int']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  first_name: Scalars['String']['input'];
  group_id?: InputMaybe<Scalars['Int']['input']>;
  last_name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  role: Scalars['String']['input'];
};

export type Group = {
  __typename?: 'Group';
  capacity: Scalars['Int']['output'];
  children?: Maybe<Array<Child>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  plannings?: Maybe<Array<Planning>>;
  staff: Array<User>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Message = {
  __typename?: 'Message';
  author: User;
  content: Scalars['String']['output'];
  conversation: Conversation;
  date: Scalars['DateTimeISO']['output'];
  id: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: Scalars['Boolean']['output'];
  createChild: Child;
  createConversation: Conversation;
  createGroup: Group;
  createMessage: Message;
  createPlanning: Planning;
  createReport: Report;
  createUser: User;
  deleteChild: Scalars['String']['output'];
  deleteGroup: Scalars['Boolean']['output'];
  deletePlanning: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  login: Scalars['String']['output'];
  logout: Scalars['Boolean']['output'];
  updateChild: Child;
  updateGroup: Group;
  updatePlanning: Planning;
  updateReport: Report;
  updateUser: User;
};


export type MutationChangePasswordArgs = {
  data: ChangePasswordInput;
};


export type MutationCreateChildArgs = {
  data: NewChildInput;
};


export type MutationCreateConversationArgs = {
  initiatorId: Scalars['Int']['input'];
  participantId: Scalars['Int']['input'];
};


export type MutationCreateGroupArgs = {
  capacity: Scalars['Int']['input'];
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};


export type MutationCreateMessageArgs = {
  data: CreateMessageInput;
};


export type MutationCreatePlanningArgs = {
  data: PlanningInput;
};


export type MutationCreateReportArgs = {
  data: NewReportInput;
};


export type MutationCreateUserArgs = {
  data: CreateUserInput;
};


export type MutationDeleteChildArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteGroupArgs = {
  group_id: Scalars['Int']['input'];
};


export type MutationDeletePlanningArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['Int']['input'];
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationUpdateChildArgs = {
  data: UpdateChildInput;
  id: Scalars['Int']['input'];
};


export type MutationUpdateGroupArgs = {
  capacity?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdatePlanningArgs = {
  data: UpdatePlanningInput;
  id: Scalars['Int']['input'];
};


export type MutationUpdateReportArgs = {
  data: UpdateReportInput;
  id: Scalars['Int']['input'];
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
};

export type NewChildInput = {
  birthDate: Scalars['DateTimeISO']['input'];
  firstName: Scalars['String']['input'];
  group: ObjectId;
  healthRecord?: InputMaybe<Scalars['String']['input']>;
  lastName: Scalars['String']['input'];
  parents: Array<ObjectId>;
  picture: Scalars['String']['input'];
};

export type NewReportInput = {
  baby_mood?: Scalars['String']['input'];
  child?: InputMaybe<ObjectId>;
  date: Scalars['DateTimeISO']['input'];
  isPresent: Scalars['Boolean']['input'];
  picture?: InputMaybe<Scalars['String']['input']>;
  staff_comment?: InputMaybe<Scalars['String']['input']>;
};

export type ObjectId = {
  id: Scalars['Int']['input'];
};

export type Planning = {
  __typename?: 'Planning';
  afternoon_activities?: Maybe<Scalars['String']['output']>;
  afternoon_nap?: Maybe<Scalars['String']['output']>;
  date: Scalars['DateTimeISO']['output'];
  group: Group;
  id: Scalars['ID']['output'];
  meal?: Maybe<Scalars['String']['output']>;
  morning_activities?: Maybe<Scalars['String']['output']>;
  morning_nap?: Maybe<Scalars['String']['output']>;
  snack?: Maybe<Scalars['String']['output']>;
};

export type PlanningInput = {
  afternoon_activities: Scalars['String']['input'];
  afternoon_nap: Scalars['String']['input'];
  date: Scalars['DateTimeISO']['input'];
  groupId: Scalars['Int']['input'];
  meal: Scalars['String']['input'];
  morning_activities: Scalars['String']['input'];
  morning_nap: Scalars['String']['input'];
  snack: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  adminCounts: AdminCounts;
  allParents: Array<User>;
  child: Child;
  children: Array<Child>;
  childrenByGroup: Array<Child>;
  conversation?: Maybe<Conversation>;
  getAdminUser: User;
  getAllGroups: Array<Group>;
  getAllPlannings: Array<Planning>;
  getAllPlanningsByGroup: Array<Planning>;
  getGroupById?: Maybe<Group>;
  getPlanningByGroupIdAndDate: Planning;
  getPlanningById: Planning;
  getStaffUser: User;
  me?: Maybe<User>;
  messagesFromConversation: Array<Message>;
  myConversations: Array<Conversation>;
  report?: Maybe<Report>;
  reports: Array<Report>;
  users: Array<User>;
};


export type QueryChildArgs = {
  id: Scalars['Int']['input'];
};


export type QueryChildrenByGroupArgs = {
  groupId: Scalars['Int']['input'];
};


export type QueryConversationArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetAllGroupsArgs = {
  skip?: Scalars['Int']['input'];
  take?: Scalars['Int']['input'];
};


export type QueryGetAllPlanningsByGroupArgs = {
  groupId: Scalars['Int']['input'];
};


export type QueryGetGroupByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetPlanningByGroupIdAndDateArgs = {
  date: Scalars['DateTimeISO']['input'];
  id: Scalars['Int']['input'];
};


export type QueryGetPlanningByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetStaffUserArgs = {
  groupId: Scalars['Int']['input'];
};


export type QueryMessagesFromConversationArgs = {
  conversationId: Scalars['Int']['input'];
};


export type QueryReportArgs = {
  id: Scalars['Int']['input'];
};

export type Report = {
  __typename?: 'Report';
  baby_mood: Scalars['String']['output'];
  child: Child;
  date: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  isPresent: Scalars['Boolean']['output'];
  picture?: Maybe<Scalars['String']['output']>;
  staff_comment?: Maybe<Scalars['String']['output']>;
};

export type UpdateChildInput = {
  birthDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  group?: InputMaybe<ObjectId>;
  healthRecord?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  parents?: InputMaybe<Array<ObjectId>>;
  picture?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePlanningInput = {
  afternoon_activities?: InputMaybe<Scalars['String']['input']>;
  afternoon_nap?: InputMaybe<Scalars['String']['input']>;
  meal?: InputMaybe<Scalars['String']['input']>;
  morning_activities?: InputMaybe<Scalars['String']['input']>;
  morning_nap?: InputMaybe<Scalars['String']['input']>;
  snack?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateReportInput = {
  baby_mood: Scalars['String']['input'];
  child?: InputMaybe<ObjectId>;
  date: Scalars['DateTimeISO']['input'];
  isPresent: Scalars['Boolean']['input'];
  picture?: InputMaybe<Scalars['String']['input']>;
  staff_comment?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  group_id?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['Int']['input'];
  last_name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']['output']>;
  children?: Maybe<Array<Child>>;
  creation_date: Scalars['DateTimeISO']['output'];
  email: Scalars['String']['output'];
  first_name: Scalars['String']['output'];
  group?: Maybe<Group>;
  id: Scalars['Int']['output'];
  last_name: Scalars['String']['output'];
  messages: Array<Message>;
  participatedConversations?: Maybe<Array<Conversation>>;
  phone: Scalars['String']['output'];
  role: Scalars['String']['output'];
  startedConversations?: Maybe<Array<Conversation>>;
};

export type AdminChildDetailQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type AdminChildDetailQuery = { __typename?: 'Query', child: { __typename?: 'Child', id: number, firstName: string, lastName: string, birthDate: any, picture: string, healthRecord?: string | null, group: { __typename?: 'Group', id: string, name: string }, parents: Array<{ __typename?: 'User', id: number, first_name: string, last_name: string, email: string, phone: string, avatar?: string | null }> } };

export type AdminCountsQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminCountsQuery = { __typename?: 'Query', adminCounts: { __typename?: 'AdminCounts', childrenCount: number, staffCount: number, parentCount: number } };

export type AdminChildrenQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminChildrenQuery = { __typename?: 'Query', children: Array<{ __typename?: 'Child', id: number, firstName: string, lastName: string, birthDate: any, picture: string, healthRecord?: string | null, group: { __typename?: 'Group', id: string, name: string }, parents: Array<{ __typename?: 'User', id: number, first_name: string, last_name: string, email: string, phone: string, avatar?: string | null }> }> };

export type DeleteChildMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteChildMutation = { __typename?: 'Mutation', deleteChild: string };

export type AdminUpdateUserMutationVariables = Exact<{
  data: UpdateUserInput;
}>;


export type AdminUpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: number, first_name: string, last_name: string, email: string, phone: string, avatar?: string | null } };

export type AllChildrenQueryVariables = Exact<{ [key: string]: never; }>;


export type AllChildrenQuery = { __typename?: 'Query', children: Array<{ __typename?: 'Child', id: number, firstName: string, lastName: string, parents: Array<{ __typename?: 'User', id: number }> }> };

export type AllGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllGroupsQuery = { __typename?: 'Query', getAllGroups: Array<{ __typename?: 'Group', id: string, name: string }> };

export type AllParentsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllParentsQuery = { __typename?: 'Query', allParents: Array<{ __typename?: 'User', id: number, first_name: string, last_name: string, email: string, phone: string, avatar?: string | null, children?: Array<{ __typename?: 'Child', id: number, firstName: string, lastName: string, picture: string, birthDate: any, group: { __typename?: 'Group', id: string, name: string }, parents: Array<{ __typename?: 'User', id: number }> }> | null }> };

export type CreateChildMutationVariables = Exact<{
  data: NewChildInput;
}>;


export type CreateChildMutation = { __typename?: 'Mutation', createChild: { __typename?: 'Child', id: number, firstName: string, lastName: string, birthDate: any, picture: string, healthRecord?: string | null, group: { __typename?: 'Group', id: string, name: string } } };

export type CreateUserMutationVariables = Exact<{
  data: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: number, email: string, first_name: string, last_name: string, phone: string, role: string } };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: boolean };

export type LinkParentToChildMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  data: UpdateChildInput;
}>;


export type LinkParentToChildMutation = { __typename?: 'Mutation', updateChild: { __typename?: 'Child', id: number, parents: Array<{ __typename?: 'User', id: number }> } };

export type UpdateChildMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  data: UpdateChildInput;
}>;


export type UpdateChildMutation = { __typename?: 'Mutation', updateChild: { __typename?: 'Child', id: number, firstName: string, lastName: string, birthDate: any, picture: string, healthRecord?: string | null, group: { __typename?: 'Group', id: string, name: string } } };

export type GetAllPlanningsByGroupQueryVariables = Exact<{
  groupId: Scalars['Int']['input'];
}>;


export type GetAllPlanningsByGroupQuery = { __typename?: 'Query', getAllPlanningsByGroup: Array<{ __typename?: 'Planning', id: string, date: any, morning_activities?: string | null, morning_nap?: string | null, meal?: string | null, afternoon_activities?: string | null, afternoon_nap?: string | null, snack?: string | null }> };

export type ChangePasswordMutationVariables = Exact<{
  data: ChangePasswordInput;
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: boolean };

export type ChildByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type ChildByIdQuery = { __typename?: 'Query', child: { __typename?: 'Child', id: number, firstName: string, lastName: string, birthDate: any, picture: string, group: { __typename?: 'Group', name: string } } };

export type ChildWithGroupAndPlanningsQueryVariables = Exact<{
  childId: Scalars['Int']['input'];
}>;


export type ChildWithGroupAndPlanningsQuery = { __typename?: 'Query', child: { __typename?: 'Child', id: number, firstName: string, birthDate: any, lastName: string, picture: string, reports: Array<{ __typename?: 'Report', id: string, date: any }>, group: { __typename?: 'Group', id: string, name: string, plannings?: Array<{ __typename?: 'Planning', id: string, date: any }> | null } } };

export type ChildrenQueryVariables = Exact<{ [key: string]: never; }>;


export type ChildrenQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, children?: Array<{ __typename?: 'Child', id: number, firstName: string, lastName: string, birthDate: any, picture: string, healthRecord?: string | null, group: { __typename?: 'Group', name: string } }> | null } | null };

export type ChildrenByGroupQueryVariables = Exact<{
  groupId: Scalars['Int']['input'];
}>;


export type ChildrenByGroupQuery = { __typename?: 'Query', childrenByGroup: Array<{ __typename?: 'Child', firstName: string, lastName: string, parents: Array<{ __typename?: 'User', id: number, first_name: string, last_name: string, participatedConversations?: Array<{ __typename?: 'Conversation', initiator: { __typename?: 'User', id: number } }> | null, startedConversations?: Array<{ __typename?: 'Conversation', participant: { __typename?: 'User', id: number } }> | null }> }> };

export type CreateConversationMutationVariables = Exact<{
  initiatorId: Scalars['Int']['input'];
  participantId: Scalars['Int']['input'];
}>;


export type CreateConversationMutation = { __typename?: 'Mutation', createConversation: { __typename?: 'Conversation', id: number } };

export type CreateMessageMutationVariables = Exact<{
  data: CreateMessageInput;
}>;


export type CreateMessageMutation = { __typename?: 'Mutation', createMessage: { __typename?: 'Message', id: number } };

export type CreatePlanningMutationVariables = Exact<{
  data: PlanningInput;
}>;


export type CreatePlanningMutation = { __typename?: 'Mutation', createPlanning: { __typename?: 'Planning', id: string } };

export type CreateReportMutationVariables = Exact<{
  data: NewReportInput;
}>;


export type CreateReportMutation = { __typename?: 'Mutation', createReport: { __typename?: 'Report', id: string } };

export type CurrentUserConversationsQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserConversationsQuery = { __typename?: 'Query', myConversations: Array<{ __typename?: 'Conversation', id: number, creationDate: any, initiator: { __typename?: 'User', id: number, first_name: string, last_name: string, role: string, group?: { __typename?: 'Group', id: string } | null, children?: Array<{ __typename?: 'Child', firstName: string, lastName: string, group: { __typename?: 'Group', id: string } }> | null }, participant: { __typename?: 'User', id: number, first_name: string, last_name: string, role: string, group?: { __typename?: 'Group', id: string } | null, children?: Array<{ __typename?: 'Child', firstName: string, lastName: string, group: { __typename?: 'Group', id: string } }> | null }, messages: Array<{ __typename?: 'Message', date: any, content: string, author: { __typename?: 'User', id: number, first_name: string, last_name: string } }> }> };

export type GetAdminUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminUserQuery = { __typename?: 'Query', getAdminUser: { __typename?: 'User', id: number } };

export type GetConversationQueryVariables = Exact<{
  conversationId: Scalars['Int']['input'];
}>;


export type GetConversationQuery = { __typename?: 'Query', conversation?: { __typename?: 'Conversation', creationDate: any, id: number, initiator: { __typename?: 'User', id: number, first_name: string, last_name: string, children?: Array<{ __typename?: 'Child', firstName: string, lastName: string, group: { __typename?: 'Group', id: string } }> | null }, participant: { __typename?: 'User', id: number, first_name: string, last_name: string, children?: Array<{ __typename?: 'Child', firstName: string, lastName: string, group: { __typename?: 'Group', id: string } }> | null }, messages: Array<{ __typename?: 'Message', date: any, content: string, author: { __typename?: 'User', id: number, first_name: string, last_name: string } }> } | null };

export type GetMessagesFromConversationQueryVariables = Exact<{
  conversationId: Scalars['Int']['input'];
}>;


export type GetMessagesFromConversationQuery = { __typename?: 'Query', messagesFromConversation: Array<{ __typename?: 'Message', content: string, date: any, author: { __typename?: 'User', id: number } }> };

export type GetPlanningByGroupIdAndDateQueryVariables = Exact<{
  date: Scalars['DateTimeISO']['input'];
  groupId: Scalars['Int']['input'];
}>;


export type GetPlanningByGroupIdAndDateQuery = { __typename?: 'Query', getPlanningByGroupIdAndDate: { __typename?: 'Planning', id: string, meal?: string | null, morning_activities?: string | null, morning_nap?: string | null, snack?: string | null, date: any, afternoon_nap?: string | null, afternoon_activities?: string | null } };

export type GetStaffUserQueryVariables = Exact<{
  groupId: Scalars['Int']['input'];
}>;


export type GetStaffUserQuery = { __typename?: 'Query', getStaffUser: { __typename?: 'User', id: number } };

export type LoginMutationVariables = Exact<{
  data: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: string };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type GetPlanningByIdQueryVariables = Exact<{
  getPlanningById: Scalars['Int']['input'];
}>;


export type GetPlanningByIdQuery = { __typename?: 'Query', getPlanningById: { __typename?: 'Planning', id: string, date: any, morning_activities?: string | null, morning_nap?: string | null, meal?: string | null, afternoon_activities?: string | null, afternoon_nap?: string | null, snack?: string | null, group: { __typename?: 'Group', name: string } } };

export type ProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, first_name: string, last_name: string, avatar?: string | null, creation_date: any, email: string, phone: string, role: string, children?: Array<{ __typename?: 'Child', id: number, firstName: string, lastName: string, birthDate: any, picture: string, group: { __typename?: 'Group', id: string, name: string } }> | null, group?: { __typename?: 'Group', id: string, name: string, children?: Array<{ __typename?: 'Child', id: number, firstName: string, lastName: string, picture: string }> | null } | null } | null };

export type ReportByChildQueryVariables = Exact<{
  childId: Scalars['Int']['input'];
}>;


export type ReportByChildQuery = { __typename?: 'Query', child: { __typename?: 'Child', id: number, reports: Array<{ __typename?: 'Report', id: string, date: any, baby_mood: string, isPresent: boolean, picture?: string | null, staff_comment?: string | null }> } };

export type ReportByIdQueryVariables = Exact<{
  reportId: Scalars['Int']['input'];
}>;


export type ReportByIdQuery = { __typename?: 'Query', report?: { __typename?: 'Report', baby_mood: string, isPresent: boolean, picture?: string | null, staff_comment?: string | null, date: any, child: { __typename?: 'Child', id: number, picture: string, firstName: string, lastName: string, birthDate: any, group: { __typename?: 'Group', id: string, name: string, plannings?: Array<{ __typename?: 'Planning', id: string, date: any }> | null } } } | null };

export type UpdatePlanningMutationVariables = Exact<{
  data: UpdatePlanningInput;
  updatePlanningId: Scalars['Int']['input'];
}>;


export type UpdatePlanningMutation = { __typename?: 'Mutation', updatePlanning: { __typename?: 'Planning', id: string } };

export type UpdateProfileMutationVariables = Exact<{
  data: UpdateUserInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: number, first_name: string, last_name: string, phone: string, avatar?: string | null } };

export type UpdateReportMutationVariables = Exact<{
  updateReportId: Scalars['Int']['input'];
  data: UpdateReportInput;
}>;


export type UpdateReportMutation = { __typename?: 'Mutation', updateReport: { __typename?: 'Report', id: string } };

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, email: string, role: string, first_name: string, last_name: string, phone: string, avatar?: string | null, creation_date: any, group?: { __typename?: 'Group', id: string, name: string } | null } | null };


export const AdminChildDetailDocument = gql`
    query AdminChildDetail($id: Int!) {
  child(id: $id) {
    id
    firstName
    lastName
    birthDate
    picture
    healthRecord
    group {
      id
      name
    }
    parents {
      id
      first_name
      last_name
      email
      phone
      avatar
    }
  }
}
    `;

/**
 * __useAdminChildDetailQuery__
 *
 * To run a query within a React component, call `useAdminChildDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminChildDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminChildDetailQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAdminChildDetailQuery(baseOptions: ApolloReactHooks.QueryHookOptions<AdminChildDetailQuery, AdminChildDetailQueryVariables> & ({ variables: AdminChildDetailQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<AdminChildDetailQuery, AdminChildDetailQueryVariables>(AdminChildDetailDocument, options);
      }
export function useAdminChildDetailLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AdminChildDetailQuery, AdminChildDetailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<AdminChildDetailQuery, AdminChildDetailQueryVariables>(AdminChildDetailDocument, options);
        }
export function useAdminChildDetailSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<AdminChildDetailQuery, AdminChildDetailQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<AdminChildDetailQuery, AdminChildDetailQueryVariables>(AdminChildDetailDocument, options);
        }
export type AdminChildDetailQueryHookResult = ReturnType<typeof useAdminChildDetailQuery>;
export type AdminChildDetailLazyQueryHookResult = ReturnType<typeof useAdminChildDetailLazyQuery>;
export type AdminChildDetailSuspenseQueryHookResult = ReturnType<typeof useAdminChildDetailSuspenseQuery>;
export type AdminChildDetailQueryResult = ApolloReactCommon.QueryResult<AdminChildDetailQuery, AdminChildDetailQueryVariables>;
export const AdminCountsDocument = gql`
    query AdminCounts {
  adminCounts {
    childrenCount
    staffCount
    parentCount
  }
}
    `;

/**
 * __useAdminCountsQuery__
 *
 * To run a query within a React component, call `useAdminCountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminCountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminCountsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAdminCountsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AdminCountsQuery, AdminCountsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<AdminCountsQuery, AdminCountsQueryVariables>(AdminCountsDocument, options);
      }
export function useAdminCountsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AdminCountsQuery, AdminCountsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<AdminCountsQuery, AdminCountsQueryVariables>(AdminCountsDocument, options);
        }
export function useAdminCountsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<AdminCountsQuery, AdminCountsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<AdminCountsQuery, AdminCountsQueryVariables>(AdminCountsDocument, options);
        }
export type AdminCountsQueryHookResult = ReturnType<typeof useAdminCountsQuery>;
export type AdminCountsLazyQueryHookResult = ReturnType<typeof useAdminCountsLazyQuery>;
export type AdminCountsSuspenseQueryHookResult = ReturnType<typeof useAdminCountsSuspenseQuery>;
export type AdminCountsQueryResult = ApolloReactCommon.QueryResult<AdminCountsQuery, AdminCountsQueryVariables>;
export const AdminChildrenDocument = gql`
    query AdminChildren {
  children {
    id
    firstName
    lastName
    birthDate
    picture
    healthRecord
    group {
      id
      name
    }
    parents {
      id
      first_name
      last_name
      email
      phone
      avatar
    }
  }
}
    `;

/**
 * __useAdminChildrenQuery__
 *
 * To run a query within a React component, call `useAdminChildrenQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminChildrenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminChildrenQuery({
 *   variables: {
 *   },
 * });
 */
export function useAdminChildrenQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AdminChildrenQuery, AdminChildrenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<AdminChildrenQuery, AdminChildrenQueryVariables>(AdminChildrenDocument, options);
      }
export function useAdminChildrenLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AdminChildrenQuery, AdminChildrenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<AdminChildrenQuery, AdminChildrenQueryVariables>(AdminChildrenDocument, options);
        }
export function useAdminChildrenSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<AdminChildrenQuery, AdminChildrenQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<AdminChildrenQuery, AdminChildrenQueryVariables>(AdminChildrenDocument, options);
        }
export type AdminChildrenQueryHookResult = ReturnType<typeof useAdminChildrenQuery>;
export type AdminChildrenLazyQueryHookResult = ReturnType<typeof useAdminChildrenLazyQuery>;
export type AdminChildrenSuspenseQueryHookResult = ReturnType<typeof useAdminChildrenSuspenseQuery>;
export type AdminChildrenQueryResult = ApolloReactCommon.QueryResult<AdminChildrenQuery, AdminChildrenQueryVariables>;
export const DeleteChildDocument = gql`
    mutation DeleteChild($id: Int!) {
  deleteChild(id: $id)
}
    `;
export type DeleteChildMutationFn = ApolloReactCommon.MutationFunction<DeleteChildMutation, DeleteChildMutationVariables>;

/**
 * __useDeleteChildMutation__
 *
 * To run a mutation, you first call `useDeleteChildMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteChildMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteChildMutation, { data, loading, error }] = useDeleteChildMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteChildMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteChildMutation, DeleteChildMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteChildMutation, DeleteChildMutationVariables>(DeleteChildDocument, options);
      }
export type DeleteChildMutationHookResult = ReturnType<typeof useDeleteChildMutation>;
export type DeleteChildMutationResult = ApolloReactCommon.MutationResult<DeleteChildMutation>;
export type DeleteChildMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteChildMutation, DeleteChildMutationVariables>;
export const AdminUpdateUserDocument = gql`
    mutation AdminUpdateUser($data: UpdateUserInput!) {
  updateUser(data: $data) {
    id
    first_name
    last_name
    email
    phone
    avatar
  }
}
    `;
export type AdminUpdateUserMutationFn = ApolloReactCommon.MutationFunction<AdminUpdateUserMutation, AdminUpdateUserMutationVariables>;

/**
 * __useAdminUpdateUserMutation__
 *
 * To run a mutation, you first call `useAdminUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateUserMutation, { data, loading, error }] = useAdminUpdateUserMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useAdminUpdateUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AdminUpdateUserMutation, AdminUpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AdminUpdateUserMutation, AdminUpdateUserMutationVariables>(AdminUpdateUserDocument, options);
      }
export type AdminUpdateUserMutationHookResult = ReturnType<typeof useAdminUpdateUserMutation>;
export type AdminUpdateUserMutationResult = ApolloReactCommon.MutationResult<AdminUpdateUserMutation>;
export type AdminUpdateUserMutationOptions = ApolloReactCommon.BaseMutationOptions<AdminUpdateUserMutation, AdminUpdateUserMutationVariables>;
export const AllChildrenDocument = gql`
    query AllChildren {
  children {
    id
    firstName
    lastName
    parents {
      id
    }
  }
}
    `;

/**
 * __useAllChildrenQuery__
 *
 * To run a query within a React component, call `useAllChildrenQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllChildrenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllChildrenQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllChildrenQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AllChildrenQuery, AllChildrenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<AllChildrenQuery, AllChildrenQueryVariables>(AllChildrenDocument, options);
      }
export function useAllChildrenLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AllChildrenQuery, AllChildrenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<AllChildrenQuery, AllChildrenQueryVariables>(AllChildrenDocument, options);
        }
export function useAllChildrenSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<AllChildrenQuery, AllChildrenQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<AllChildrenQuery, AllChildrenQueryVariables>(AllChildrenDocument, options);
        }
export type AllChildrenQueryHookResult = ReturnType<typeof useAllChildrenQuery>;
export type AllChildrenLazyQueryHookResult = ReturnType<typeof useAllChildrenLazyQuery>;
export type AllChildrenSuspenseQueryHookResult = ReturnType<typeof useAllChildrenSuspenseQuery>;
export type AllChildrenQueryResult = ApolloReactCommon.QueryResult<AllChildrenQuery, AllChildrenQueryVariables>;
export const AllGroupsDocument = gql`
    query AllGroups {
  getAllGroups(take: 100) {
    id
    name
  }
}
    `;

/**
 * __useAllGroupsQuery__
 *
 * To run a query within a React component, call `useAllGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllGroupsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllGroupsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AllGroupsQuery, AllGroupsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<AllGroupsQuery, AllGroupsQueryVariables>(AllGroupsDocument, options);
      }
export function useAllGroupsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AllGroupsQuery, AllGroupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<AllGroupsQuery, AllGroupsQueryVariables>(AllGroupsDocument, options);
        }
export function useAllGroupsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<AllGroupsQuery, AllGroupsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<AllGroupsQuery, AllGroupsQueryVariables>(AllGroupsDocument, options);
        }
export type AllGroupsQueryHookResult = ReturnType<typeof useAllGroupsQuery>;
export type AllGroupsLazyQueryHookResult = ReturnType<typeof useAllGroupsLazyQuery>;
export type AllGroupsSuspenseQueryHookResult = ReturnType<typeof useAllGroupsSuspenseQuery>;
export type AllGroupsQueryResult = ApolloReactCommon.QueryResult<AllGroupsQuery, AllGroupsQueryVariables>;
export const AllParentsDocument = gql`
    query AllParents {
  allParents {
    id
    first_name
    last_name
    email
    phone
    avatar
    children {
      id
      firstName
      lastName
      picture
      birthDate
      group {
        id
        name
      }
      parents {
        id
      }
    }
  }
}
    `;

/**
 * __useAllParentsQuery__
 *
 * To run a query within a React component, call `useAllParentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllParentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllParentsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllParentsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AllParentsQuery, AllParentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<AllParentsQuery, AllParentsQueryVariables>(AllParentsDocument, options);
      }
export function useAllParentsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AllParentsQuery, AllParentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<AllParentsQuery, AllParentsQueryVariables>(AllParentsDocument, options);
        }
export function useAllParentsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<AllParentsQuery, AllParentsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<AllParentsQuery, AllParentsQueryVariables>(AllParentsDocument, options);
        }
export type AllParentsQueryHookResult = ReturnType<typeof useAllParentsQuery>;
export type AllParentsLazyQueryHookResult = ReturnType<typeof useAllParentsLazyQuery>;
export type AllParentsSuspenseQueryHookResult = ReturnType<typeof useAllParentsSuspenseQuery>;
export type AllParentsQueryResult = ApolloReactCommon.QueryResult<AllParentsQuery, AllParentsQueryVariables>;
export const CreateChildDocument = gql`
    mutation CreateChild($data: NewChildInput!) {
  createChild(data: $data) {
    id
    firstName
    lastName
    birthDate
    picture
    healthRecord
    group {
      id
      name
    }
  }
}
    `;
export type CreateChildMutationFn = ApolloReactCommon.MutationFunction<CreateChildMutation, CreateChildMutationVariables>;

/**
 * __useCreateChildMutation__
 *
 * To run a mutation, you first call `useCreateChildMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateChildMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createChildMutation, { data, loading, error }] = useCreateChildMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateChildMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateChildMutation, CreateChildMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateChildMutation, CreateChildMutationVariables>(CreateChildDocument, options);
      }
export type CreateChildMutationHookResult = ReturnType<typeof useCreateChildMutation>;
export type CreateChildMutationResult = ApolloReactCommon.MutationResult<CreateChildMutation>;
export type CreateChildMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateChildMutation, CreateChildMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($data: CreateUserInput!) {
  createUser(data: $data) {
    id
    email
    first_name
    last_name
    phone
    role
  }
}
    `;
export type CreateUserMutationFn = ApolloReactCommon.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = ApolloReactCommon.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser($id: Int!) {
  deleteUser(id: $id)
}
    `;
export type DeleteUserMutationFn = ApolloReactCommon.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = ApolloReactCommon.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const LinkParentToChildDocument = gql`
    mutation LinkParentToChild($id: Int!, $data: UpdateChildInput!) {
  updateChild(id: $id, data: $data) {
    id
    parents {
      id
    }
  }
}
    `;
export type LinkParentToChildMutationFn = ApolloReactCommon.MutationFunction<LinkParentToChildMutation, LinkParentToChildMutationVariables>;

/**
 * __useLinkParentToChildMutation__
 *
 * To run a mutation, you first call `useLinkParentToChildMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLinkParentToChildMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [linkParentToChildMutation, { data, loading, error }] = useLinkParentToChildMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useLinkParentToChildMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LinkParentToChildMutation, LinkParentToChildMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<LinkParentToChildMutation, LinkParentToChildMutationVariables>(LinkParentToChildDocument, options);
      }
export type LinkParentToChildMutationHookResult = ReturnType<typeof useLinkParentToChildMutation>;
export type LinkParentToChildMutationResult = ApolloReactCommon.MutationResult<LinkParentToChildMutation>;
export type LinkParentToChildMutationOptions = ApolloReactCommon.BaseMutationOptions<LinkParentToChildMutation, LinkParentToChildMutationVariables>;
export const UpdateChildDocument = gql`
    mutation UpdateChild($id: Int!, $data: UpdateChildInput!) {
  updateChild(id: $id, data: $data) {
    id
    firstName
    lastName
    birthDate
    picture
    healthRecord
    group {
      id
      name
    }
  }
}
    `;
export type UpdateChildMutationFn = ApolloReactCommon.MutationFunction<UpdateChildMutation, UpdateChildMutationVariables>;

/**
 * __useUpdateChildMutation__
 *
 * To run a mutation, you first call `useUpdateChildMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateChildMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateChildMutation, { data, loading, error }] = useUpdateChildMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateChildMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateChildMutation, UpdateChildMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateChildMutation, UpdateChildMutationVariables>(UpdateChildDocument, options);
      }
export type UpdateChildMutationHookResult = ReturnType<typeof useUpdateChildMutation>;
export type UpdateChildMutationResult = ApolloReactCommon.MutationResult<UpdateChildMutation>;
export type UpdateChildMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateChildMutation, UpdateChildMutationVariables>;
export const GetAllPlanningsByGroupDocument = gql`
    query getAllPlanningsByGroup($groupId: Int!) {
  getAllPlanningsByGroup(groupId: $groupId) {
    id
    date
    morning_activities
    morning_nap
    meal
    afternoon_activities
    afternoon_nap
    snack
  }
}
    `;

/**
 * __useGetAllPlanningsByGroupQuery__
 *
 * To run a query within a React component, call `useGetAllPlanningsByGroupQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllPlanningsByGroupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllPlanningsByGroupQuery({
 *   variables: {
 *      groupId: // value for 'groupId'
 *   },
 * });
 */
export function useGetAllPlanningsByGroupQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetAllPlanningsByGroupQuery, GetAllPlanningsByGroupQueryVariables> & ({ variables: GetAllPlanningsByGroupQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetAllPlanningsByGroupQuery, GetAllPlanningsByGroupQueryVariables>(GetAllPlanningsByGroupDocument, options);
      }
export function useGetAllPlanningsByGroupLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAllPlanningsByGroupQuery, GetAllPlanningsByGroupQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetAllPlanningsByGroupQuery, GetAllPlanningsByGroupQueryVariables>(GetAllPlanningsByGroupDocument, options);
        }
export function useGetAllPlanningsByGroupSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetAllPlanningsByGroupQuery, GetAllPlanningsByGroupQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetAllPlanningsByGroupQuery, GetAllPlanningsByGroupQueryVariables>(GetAllPlanningsByGroupDocument, options);
        }
export type GetAllPlanningsByGroupQueryHookResult = ReturnType<typeof useGetAllPlanningsByGroupQuery>;
export type GetAllPlanningsByGroupLazyQueryHookResult = ReturnType<typeof useGetAllPlanningsByGroupLazyQuery>;
export type GetAllPlanningsByGroupSuspenseQueryHookResult = ReturnType<typeof useGetAllPlanningsByGroupSuspenseQuery>;
export type GetAllPlanningsByGroupQueryResult = ApolloReactCommon.QueryResult<GetAllPlanningsByGroupQuery, GetAllPlanningsByGroupQueryVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($data: ChangePasswordInput!) {
  changePassword(data: $data)
}
    `;
export type ChangePasswordMutationFn = ApolloReactCommon.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = ApolloReactCommon.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = ApolloReactCommon.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const ChildByIdDocument = gql`
    query childById($id: Int!) {
  child(id: $id) {
    id
    firstName
    lastName
    birthDate
    picture
    group {
      name
    }
  }
}
    `;

/**
 * __useChildByIdQuery__
 *
 * To run a query within a React component, call `useChildByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useChildByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChildByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useChildByIdQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ChildByIdQuery, ChildByIdQueryVariables> & ({ variables: ChildByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ChildByIdQuery, ChildByIdQueryVariables>(ChildByIdDocument, options);
      }
export function useChildByIdLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ChildByIdQuery, ChildByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ChildByIdQuery, ChildByIdQueryVariables>(ChildByIdDocument, options);
        }
export function useChildByIdSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ChildByIdQuery, ChildByIdQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ChildByIdQuery, ChildByIdQueryVariables>(ChildByIdDocument, options);
        }
export type ChildByIdQueryHookResult = ReturnType<typeof useChildByIdQuery>;
export type ChildByIdLazyQueryHookResult = ReturnType<typeof useChildByIdLazyQuery>;
export type ChildByIdSuspenseQueryHookResult = ReturnType<typeof useChildByIdSuspenseQuery>;
export type ChildByIdQueryResult = ApolloReactCommon.QueryResult<ChildByIdQuery, ChildByIdQueryVariables>;
export const ChildWithGroupAndPlanningsDocument = gql`
    query ChildWithGroupAndPlannings($childId: Int!) {
  child(id: $childId) {
    id
    firstName
    birthDate
    lastName
    picture
    reports {
      id
      date
    }
    group {
      id
      name
      plannings {
        id
        date
      }
    }
  }
}
    `;

/**
 * __useChildWithGroupAndPlanningsQuery__
 *
 * To run a query within a React component, call `useChildWithGroupAndPlanningsQuery` and pass it any options that fit your needs.
 * When your component renders, `useChildWithGroupAndPlanningsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChildWithGroupAndPlanningsQuery({
 *   variables: {
 *      childId: // value for 'childId'
 *   },
 * });
 */
export function useChildWithGroupAndPlanningsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ChildWithGroupAndPlanningsQuery, ChildWithGroupAndPlanningsQueryVariables> & ({ variables: ChildWithGroupAndPlanningsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ChildWithGroupAndPlanningsQuery, ChildWithGroupAndPlanningsQueryVariables>(ChildWithGroupAndPlanningsDocument, options);
      }
export function useChildWithGroupAndPlanningsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ChildWithGroupAndPlanningsQuery, ChildWithGroupAndPlanningsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ChildWithGroupAndPlanningsQuery, ChildWithGroupAndPlanningsQueryVariables>(ChildWithGroupAndPlanningsDocument, options);
        }
export function useChildWithGroupAndPlanningsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ChildWithGroupAndPlanningsQuery, ChildWithGroupAndPlanningsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ChildWithGroupAndPlanningsQuery, ChildWithGroupAndPlanningsQueryVariables>(ChildWithGroupAndPlanningsDocument, options);
        }
export type ChildWithGroupAndPlanningsQueryHookResult = ReturnType<typeof useChildWithGroupAndPlanningsQuery>;
export type ChildWithGroupAndPlanningsLazyQueryHookResult = ReturnType<typeof useChildWithGroupAndPlanningsLazyQuery>;
export type ChildWithGroupAndPlanningsSuspenseQueryHookResult = ReturnType<typeof useChildWithGroupAndPlanningsSuspenseQuery>;
export type ChildWithGroupAndPlanningsQueryResult = ApolloReactCommon.QueryResult<ChildWithGroupAndPlanningsQuery, ChildWithGroupAndPlanningsQueryVariables>;
export const ChildrenDocument = gql`
    query children {
  me {
    id
    children {
      id
      firstName
      lastName
      birthDate
      picture
      healthRecord
      group {
        name
      }
    }
  }
}
    `;

/**
 * __useChildrenQuery__
 *
 * To run a query within a React component, call `useChildrenQuery` and pass it any options that fit your needs.
 * When your component renders, `useChildrenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChildrenQuery({
 *   variables: {
 *   },
 * });
 */
export function useChildrenQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ChildrenQuery, ChildrenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ChildrenQuery, ChildrenQueryVariables>(ChildrenDocument, options);
      }
export function useChildrenLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ChildrenQuery, ChildrenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ChildrenQuery, ChildrenQueryVariables>(ChildrenDocument, options);
        }
export function useChildrenSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ChildrenQuery, ChildrenQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ChildrenQuery, ChildrenQueryVariables>(ChildrenDocument, options);
        }
export type ChildrenQueryHookResult = ReturnType<typeof useChildrenQuery>;
export type ChildrenLazyQueryHookResult = ReturnType<typeof useChildrenLazyQuery>;
export type ChildrenSuspenseQueryHookResult = ReturnType<typeof useChildrenSuspenseQuery>;
export type ChildrenQueryResult = ApolloReactCommon.QueryResult<ChildrenQuery, ChildrenQueryVariables>;
export const ChildrenByGroupDocument = gql`
    query ChildrenByGroup($groupId: Int!) {
  childrenByGroup(groupId: $groupId) {
    firstName
    lastName
    parents {
      id
      first_name
      last_name
      participatedConversations {
        initiator {
          id
        }
      }
      startedConversations {
        participant {
          id
        }
      }
    }
  }
}
    `;

/**
 * __useChildrenByGroupQuery__
 *
 * To run a query within a React component, call `useChildrenByGroupQuery` and pass it any options that fit your needs.
 * When your component renders, `useChildrenByGroupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChildrenByGroupQuery({
 *   variables: {
 *      groupId: // value for 'groupId'
 *   },
 * });
 */
export function useChildrenByGroupQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ChildrenByGroupQuery, ChildrenByGroupQueryVariables> & ({ variables: ChildrenByGroupQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ChildrenByGroupQuery, ChildrenByGroupQueryVariables>(ChildrenByGroupDocument, options);
      }
export function useChildrenByGroupLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ChildrenByGroupQuery, ChildrenByGroupQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ChildrenByGroupQuery, ChildrenByGroupQueryVariables>(ChildrenByGroupDocument, options);
        }
export function useChildrenByGroupSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ChildrenByGroupQuery, ChildrenByGroupQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ChildrenByGroupQuery, ChildrenByGroupQueryVariables>(ChildrenByGroupDocument, options);
        }
export type ChildrenByGroupQueryHookResult = ReturnType<typeof useChildrenByGroupQuery>;
export type ChildrenByGroupLazyQueryHookResult = ReturnType<typeof useChildrenByGroupLazyQuery>;
export type ChildrenByGroupSuspenseQueryHookResult = ReturnType<typeof useChildrenByGroupSuspenseQuery>;
export type ChildrenByGroupQueryResult = ApolloReactCommon.QueryResult<ChildrenByGroupQuery, ChildrenByGroupQueryVariables>;
export const CreateConversationDocument = gql`
    mutation CreateConversation($initiatorId: Int!, $participantId: Int!) {
  createConversation(initiatorId: $initiatorId, participantId: $participantId) {
    id
  }
}
    `;
export type CreateConversationMutationFn = ApolloReactCommon.MutationFunction<CreateConversationMutation, CreateConversationMutationVariables>;

/**
 * __useCreateConversationMutation__
 *
 * To run a mutation, you first call `useCreateConversationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateConversationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createConversationMutation, { data, loading, error }] = useCreateConversationMutation({
 *   variables: {
 *      initiatorId: // value for 'initiatorId'
 *      participantId: // value for 'participantId'
 *   },
 * });
 */
export function useCreateConversationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateConversationMutation, CreateConversationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateConversationMutation, CreateConversationMutationVariables>(CreateConversationDocument, options);
      }
export type CreateConversationMutationHookResult = ReturnType<typeof useCreateConversationMutation>;
export type CreateConversationMutationResult = ApolloReactCommon.MutationResult<CreateConversationMutation>;
export type CreateConversationMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateConversationMutation, CreateConversationMutationVariables>;
export const CreateMessageDocument = gql`
    mutation CreateMessage($data: CreateMessageInput!) {
  createMessage(data: $data) {
    id
  }
}
    `;
export type CreateMessageMutationFn = ApolloReactCommon.MutationFunction<CreateMessageMutation, CreateMessageMutationVariables>;

/**
 * __useCreateMessageMutation__
 *
 * To run a mutation, you first call `useCreateMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMessageMutation, { data, loading, error }] = useCreateMessageMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateMessageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateMessageMutation, CreateMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateMessageMutation, CreateMessageMutationVariables>(CreateMessageDocument, options);
      }
export type CreateMessageMutationHookResult = ReturnType<typeof useCreateMessageMutation>;
export type CreateMessageMutationResult = ApolloReactCommon.MutationResult<CreateMessageMutation>;
export type CreateMessageMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateMessageMutation, CreateMessageMutationVariables>;
export const CreatePlanningDocument = gql`
    mutation CreatePlanning($data: PlanningInput!) {
  createPlanning(data: $data) {
    id
  }
}
    `;
export type CreatePlanningMutationFn = ApolloReactCommon.MutationFunction<CreatePlanningMutation, CreatePlanningMutationVariables>;

/**
 * __useCreatePlanningMutation__
 *
 * To run a mutation, you first call `useCreatePlanningMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePlanningMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPlanningMutation, { data, loading, error }] = useCreatePlanningMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreatePlanningMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreatePlanningMutation, CreatePlanningMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreatePlanningMutation, CreatePlanningMutationVariables>(CreatePlanningDocument, options);
      }
export type CreatePlanningMutationHookResult = ReturnType<typeof useCreatePlanningMutation>;
export type CreatePlanningMutationResult = ApolloReactCommon.MutationResult<CreatePlanningMutation>;
export type CreatePlanningMutationOptions = ApolloReactCommon.BaseMutationOptions<CreatePlanningMutation, CreatePlanningMutationVariables>;
export const CreateReportDocument = gql`
    mutation CreateReport($data: NewReportInput!) {
  createReport(data: $data) {
    id
  }
}
    `;
export type CreateReportMutationFn = ApolloReactCommon.MutationFunction<CreateReportMutation, CreateReportMutationVariables>;

/**
 * __useCreateReportMutation__
 *
 * To run a mutation, you first call `useCreateReportMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReportMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReportMutation, { data, loading, error }] = useCreateReportMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateReportMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateReportMutation, CreateReportMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateReportMutation, CreateReportMutationVariables>(CreateReportDocument, options);
      }
export type CreateReportMutationHookResult = ReturnType<typeof useCreateReportMutation>;
export type CreateReportMutationResult = ApolloReactCommon.MutationResult<CreateReportMutation>;
export type CreateReportMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateReportMutation, CreateReportMutationVariables>;
export const CurrentUserConversationsDocument = gql`
    query CurrentUserConversations {
  myConversations {
    id
    creationDate
    initiator {
      id
      first_name
      last_name
      role
      group {
        id
      }
      children {
        firstName
        lastName
        group {
          id
        }
      }
    }
    participant {
      id
      first_name
      last_name
      role
      group {
        id
      }
      children {
        firstName
        lastName
        group {
          id
        }
      }
    }
    messages {
      date
      content
      author {
        id
        first_name
        last_name
      }
    }
  }
}
    `;

/**
 * __useCurrentUserConversationsQuery__
 *
 * To run a query within a React component, call `useCurrentUserConversationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserConversationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserConversationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserConversationsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CurrentUserConversationsQuery, CurrentUserConversationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<CurrentUserConversationsQuery, CurrentUserConversationsQueryVariables>(CurrentUserConversationsDocument, options);
      }
export function useCurrentUserConversationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CurrentUserConversationsQuery, CurrentUserConversationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<CurrentUserConversationsQuery, CurrentUserConversationsQueryVariables>(CurrentUserConversationsDocument, options);
        }
export function useCurrentUserConversationsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<CurrentUserConversationsQuery, CurrentUserConversationsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<CurrentUserConversationsQuery, CurrentUserConversationsQueryVariables>(CurrentUserConversationsDocument, options);
        }
export type CurrentUserConversationsQueryHookResult = ReturnType<typeof useCurrentUserConversationsQuery>;
export type CurrentUserConversationsLazyQueryHookResult = ReturnType<typeof useCurrentUserConversationsLazyQuery>;
export type CurrentUserConversationsSuspenseQueryHookResult = ReturnType<typeof useCurrentUserConversationsSuspenseQuery>;
export type CurrentUserConversationsQueryResult = ApolloReactCommon.QueryResult<CurrentUserConversationsQuery, CurrentUserConversationsQueryVariables>;
export const GetAdminUserDocument = gql`
    query GetAdminUser {
  getAdminUser {
    id
  }
}
    `;

/**
 * __useGetAdminUserQuery__
 *
 * To run a query within a React component, call `useGetAdminUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAdminUserQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAdminUserQuery, GetAdminUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetAdminUserQuery, GetAdminUserQueryVariables>(GetAdminUserDocument, options);
      }
export function useGetAdminUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAdminUserQuery, GetAdminUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetAdminUserQuery, GetAdminUserQueryVariables>(GetAdminUserDocument, options);
        }
export function useGetAdminUserSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetAdminUserQuery, GetAdminUserQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetAdminUserQuery, GetAdminUserQueryVariables>(GetAdminUserDocument, options);
        }
export type GetAdminUserQueryHookResult = ReturnType<typeof useGetAdminUserQuery>;
export type GetAdminUserLazyQueryHookResult = ReturnType<typeof useGetAdminUserLazyQuery>;
export type GetAdminUserSuspenseQueryHookResult = ReturnType<typeof useGetAdminUserSuspenseQuery>;
export type GetAdminUserQueryResult = ApolloReactCommon.QueryResult<GetAdminUserQuery, GetAdminUserQueryVariables>;
export const GetConversationDocument = gql`
    query GetConversation($conversationId: Int!) {
  conversation(id: $conversationId) {
    creationDate
    id
    initiator {
      id
      first_name
      last_name
      children {
        firstName
        lastName
        group {
          id
        }
      }
    }
    participant {
      id
      first_name
      last_name
      children {
        firstName
        lastName
        group {
          id
        }
      }
    }
    messages {
      date
      content
      author {
        id
        first_name
        last_name
      }
    }
  }
}
    `;

/**
 * __useGetConversationQuery__
 *
 * To run a query within a React component, call `useGetConversationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetConversationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetConversationQuery({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *   },
 * });
 */
export function useGetConversationQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetConversationQuery, GetConversationQueryVariables> & ({ variables: GetConversationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetConversationQuery, GetConversationQueryVariables>(GetConversationDocument, options);
      }
export function useGetConversationLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetConversationQuery, GetConversationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetConversationQuery, GetConversationQueryVariables>(GetConversationDocument, options);
        }
export function useGetConversationSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetConversationQuery, GetConversationQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetConversationQuery, GetConversationQueryVariables>(GetConversationDocument, options);
        }
export type GetConversationQueryHookResult = ReturnType<typeof useGetConversationQuery>;
export type GetConversationLazyQueryHookResult = ReturnType<typeof useGetConversationLazyQuery>;
export type GetConversationSuspenseQueryHookResult = ReturnType<typeof useGetConversationSuspenseQuery>;
export type GetConversationQueryResult = ApolloReactCommon.QueryResult<GetConversationQuery, GetConversationQueryVariables>;
export const GetMessagesFromConversationDocument = gql`
    query GetMessagesFromConversation($conversationId: Int!) {
  messagesFromConversation(conversationId: $conversationId) {
    author {
      id
    }
    content
    date
  }
}
    `;

/**
 * __useGetMessagesFromConversationQuery__
 *
 * To run a query within a React component, call `useGetMessagesFromConversationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessagesFromConversationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessagesFromConversationQuery({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *   },
 * });
 */
export function useGetMessagesFromConversationQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetMessagesFromConversationQuery, GetMessagesFromConversationQueryVariables> & ({ variables: GetMessagesFromConversationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetMessagesFromConversationQuery, GetMessagesFromConversationQueryVariables>(GetMessagesFromConversationDocument, options);
      }
export function useGetMessagesFromConversationLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMessagesFromConversationQuery, GetMessagesFromConversationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetMessagesFromConversationQuery, GetMessagesFromConversationQueryVariables>(GetMessagesFromConversationDocument, options);
        }
export function useGetMessagesFromConversationSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetMessagesFromConversationQuery, GetMessagesFromConversationQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetMessagesFromConversationQuery, GetMessagesFromConversationQueryVariables>(GetMessagesFromConversationDocument, options);
        }
export type GetMessagesFromConversationQueryHookResult = ReturnType<typeof useGetMessagesFromConversationQuery>;
export type GetMessagesFromConversationLazyQueryHookResult = ReturnType<typeof useGetMessagesFromConversationLazyQuery>;
export type GetMessagesFromConversationSuspenseQueryHookResult = ReturnType<typeof useGetMessagesFromConversationSuspenseQuery>;
export type GetMessagesFromConversationQueryResult = ApolloReactCommon.QueryResult<GetMessagesFromConversationQuery, GetMessagesFromConversationQueryVariables>;
export const GetPlanningByGroupIdAndDateDocument = gql`
    query GetPlanningByGroupIdAndDate($date: DateTimeISO!, $groupId: Int!) {
  getPlanningByGroupIdAndDate(date: $date, id: $groupId) {
    id
    meal
    morning_activities
    morning_nap
    snack
    date
    afternoon_nap
    afternoon_activities
  }
}
    `;

/**
 * __useGetPlanningByGroupIdAndDateQuery__
 *
 * To run a query within a React component, call `useGetPlanningByGroupIdAndDateQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPlanningByGroupIdAndDateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPlanningByGroupIdAndDateQuery({
 *   variables: {
 *      date: // value for 'date'
 *      groupId: // value for 'groupId'
 *   },
 * });
 */
export function useGetPlanningByGroupIdAndDateQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetPlanningByGroupIdAndDateQuery, GetPlanningByGroupIdAndDateQueryVariables> & ({ variables: GetPlanningByGroupIdAndDateQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetPlanningByGroupIdAndDateQuery, GetPlanningByGroupIdAndDateQueryVariables>(GetPlanningByGroupIdAndDateDocument, options);
      }
export function useGetPlanningByGroupIdAndDateLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPlanningByGroupIdAndDateQuery, GetPlanningByGroupIdAndDateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetPlanningByGroupIdAndDateQuery, GetPlanningByGroupIdAndDateQueryVariables>(GetPlanningByGroupIdAndDateDocument, options);
        }
export function useGetPlanningByGroupIdAndDateSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPlanningByGroupIdAndDateQuery, GetPlanningByGroupIdAndDateQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetPlanningByGroupIdAndDateQuery, GetPlanningByGroupIdAndDateQueryVariables>(GetPlanningByGroupIdAndDateDocument, options);
        }
export type GetPlanningByGroupIdAndDateQueryHookResult = ReturnType<typeof useGetPlanningByGroupIdAndDateQuery>;
export type GetPlanningByGroupIdAndDateLazyQueryHookResult = ReturnType<typeof useGetPlanningByGroupIdAndDateLazyQuery>;
export type GetPlanningByGroupIdAndDateSuspenseQueryHookResult = ReturnType<typeof useGetPlanningByGroupIdAndDateSuspenseQuery>;
export type GetPlanningByGroupIdAndDateQueryResult = ApolloReactCommon.QueryResult<GetPlanningByGroupIdAndDateQuery, GetPlanningByGroupIdAndDateQueryVariables>;
export const GetStaffUserDocument = gql`
    query GetStaffUser($groupId: Int!) {
  getStaffUser(groupId: $groupId) {
    id
  }
}
    `;

/**
 * __useGetStaffUserQuery__
 *
 * To run a query within a React component, call `useGetStaffUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStaffUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStaffUserQuery({
 *   variables: {
 *      groupId: // value for 'groupId'
 *   },
 * });
 */
export function useGetStaffUserQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetStaffUserQuery, GetStaffUserQueryVariables> & ({ variables: GetStaffUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetStaffUserQuery, GetStaffUserQueryVariables>(GetStaffUserDocument, options);
      }
export function useGetStaffUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetStaffUserQuery, GetStaffUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetStaffUserQuery, GetStaffUserQueryVariables>(GetStaffUserDocument, options);
        }
export function useGetStaffUserSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetStaffUserQuery, GetStaffUserQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetStaffUserQuery, GetStaffUserQueryVariables>(GetStaffUserDocument, options);
        }
export type GetStaffUserQueryHookResult = ReturnType<typeof useGetStaffUserQuery>;
export type GetStaffUserLazyQueryHookResult = ReturnType<typeof useGetStaffUserLazyQuery>;
export type GetStaffUserSuspenseQueryHookResult = ReturnType<typeof useGetStaffUserSuspenseQuery>;
export type GetStaffUserQueryResult = ApolloReactCommon.QueryResult<GetStaffUserQuery, GetStaffUserQueryVariables>;
export const LoginDocument = gql`
    mutation Login($data: LoginInput!) {
  login(data: $data)
}
    `;
export type LoginMutationFn = ApolloReactCommon.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = ApolloReactCommon.MutationResult<LoginMutation>;
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = ApolloReactCommon.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = ApolloReactCommon.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = ApolloReactCommon.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const GetPlanningByIdDocument = gql`
    query GetPlanningById($getPlanningById: Int!) {
  getPlanningById(id: $getPlanningById) {
    id
    date
    morning_activities
    morning_nap
    meal
    afternoon_activities
    afternoon_nap
    snack
    group {
      name
    }
  }
}
    `;

/**
 * __useGetPlanningByIdQuery__
 *
 * To run a query within a React component, call `useGetPlanningByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPlanningByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPlanningByIdQuery({
 *   variables: {
 *      getPlanningById: // value for 'getPlanningById'
 *   },
 * });
 */
export function useGetPlanningByIdQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetPlanningByIdQuery, GetPlanningByIdQueryVariables> & ({ variables: GetPlanningByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetPlanningByIdQuery, GetPlanningByIdQueryVariables>(GetPlanningByIdDocument, options);
      }
export function useGetPlanningByIdLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPlanningByIdQuery, GetPlanningByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetPlanningByIdQuery, GetPlanningByIdQueryVariables>(GetPlanningByIdDocument, options);
        }
export function useGetPlanningByIdSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPlanningByIdQuery, GetPlanningByIdQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetPlanningByIdQuery, GetPlanningByIdQueryVariables>(GetPlanningByIdDocument, options);
        }
export type GetPlanningByIdQueryHookResult = ReturnType<typeof useGetPlanningByIdQuery>;
export type GetPlanningByIdLazyQueryHookResult = ReturnType<typeof useGetPlanningByIdLazyQuery>;
export type GetPlanningByIdSuspenseQueryHookResult = ReturnType<typeof useGetPlanningByIdSuspenseQuery>;
export type GetPlanningByIdQueryResult = ApolloReactCommon.QueryResult<GetPlanningByIdQuery, GetPlanningByIdQueryVariables>;
export const ProfileDocument = gql`
    query Profile {
  me {
    id
    first_name
    last_name
    avatar
    creation_date
    email
    phone
    role
    children {
      id
      firstName
      lastName
      birthDate
      picture
      group {
        id
        name
      }
    }
    group {
      id
      name
      children {
        id
        firstName
        lastName
        picture
      }
    }
  }
}
    `;

/**
 * __useProfileQuery__
 *
 * To run a query within a React component, call `useProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useProfileQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ProfileQuery, ProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ProfileQuery, ProfileQueryVariables>(ProfileDocument, options);
      }
export function useProfileLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ProfileQuery, ProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ProfileQuery, ProfileQueryVariables>(ProfileDocument, options);
        }
export function useProfileSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ProfileQuery, ProfileQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ProfileQuery, ProfileQueryVariables>(ProfileDocument, options);
        }
export type ProfileQueryHookResult = ReturnType<typeof useProfileQuery>;
export type ProfileLazyQueryHookResult = ReturnType<typeof useProfileLazyQuery>;
export type ProfileSuspenseQueryHookResult = ReturnType<typeof useProfileSuspenseQuery>;
export type ProfileQueryResult = ApolloReactCommon.QueryResult<ProfileQuery, ProfileQueryVariables>;
export const ReportByChildDocument = gql`
    query ReportByChild($childId: Int!) {
  child(id: $childId) {
    id
    reports {
      id
      date
      baby_mood
      isPresent
      picture
      staff_comment
    }
  }
}
    `;

/**
 * __useReportByChildQuery__
 *
 * To run a query within a React component, call `useReportByChildQuery` and pass it any options that fit your needs.
 * When your component renders, `useReportByChildQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReportByChildQuery({
 *   variables: {
 *      childId: // value for 'childId'
 *   },
 * });
 */
export function useReportByChildQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ReportByChildQuery, ReportByChildQueryVariables> & ({ variables: ReportByChildQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ReportByChildQuery, ReportByChildQueryVariables>(ReportByChildDocument, options);
      }
export function useReportByChildLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ReportByChildQuery, ReportByChildQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ReportByChildQuery, ReportByChildQueryVariables>(ReportByChildDocument, options);
        }
export function useReportByChildSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ReportByChildQuery, ReportByChildQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ReportByChildQuery, ReportByChildQueryVariables>(ReportByChildDocument, options);
        }
export type ReportByChildQueryHookResult = ReturnType<typeof useReportByChildQuery>;
export type ReportByChildLazyQueryHookResult = ReturnType<typeof useReportByChildLazyQuery>;
export type ReportByChildSuspenseQueryHookResult = ReturnType<typeof useReportByChildSuspenseQuery>;
export type ReportByChildQueryResult = ApolloReactCommon.QueryResult<ReportByChildQuery, ReportByChildQueryVariables>;
export const ReportByIdDocument = gql`
    query ReportById($reportId: Int!) {
  report(id: $reportId) {
    baby_mood
    child {
      id
      picture
      firstName
      lastName
      birthDate
      picture
      group {
        id
        name
        plannings {
          id
          date
        }
      }
    }
    isPresent
    picture
    staff_comment
    date
  }
}
    `;

/**
 * __useReportByIdQuery__
 *
 * To run a query within a React component, call `useReportByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useReportByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReportByIdQuery({
 *   variables: {
 *      reportId: // value for 'reportId'
 *   },
 * });
 */
export function useReportByIdQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ReportByIdQuery, ReportByIdQueryVariables> & ({ variables: ReportByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ReportByIdQuery, ReportByIdQueryVariables>(ReportByIdDocument, options);
      }
export function useReportByIdLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ReportByIdQuery, ReportByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ReportByIdQuery, ReportByIdQueryVariables>(ReportByIdDocument, options);
        }
export function useReportByIdSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ReportByIdQuery, ReportByIdQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ReportByIdQuery, ReportByIdQueryVariables>(ReportByIdDocument, options);
        }
export type ReportByIdQueryHookResult = ReturnType<typeof useReportByIdQuery>;
export type ReportByIdLazyQueryHookResult = ReturnType<typeof useReportByIdLazyQuery>;
export type ReportByIdSuspenseQueryHookResult = ReturnType<typeof useReportByIdSuspenseQuery>;
export type ReportByIdQueryResult = ApolloReactCommon.QueryResult<ReportByIdQuery, ReportByIdQueryVariables>;
export const UpdatePlanningDocument = gql`
    mutation UpdatePlanning($data: UpdatePlanningInput!, $updatePlanningId: Int!) {
  updatePlanning(data: $data, id: $updatePlanningId) {
    id
  }
}
    `;
export type UpdatePlanningMutationFn = ApolloReactCommon.MutationFunction<UpdatePlanningMutation, UpdatePlanningMutationVariables>;

/**
 * __useUpdatePlanningMutation__
 *
 * To run a mutation, you first call `useUpdatePlanningMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePlanningMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePlanningMutation, { data, loading, error }] = useUpdatePlanningMutation({
 *   variables: {
 *      data: // value for 'data'
 *      updatePlanningId: // value for 'updatePlanningId'
 *   },
 * });
 */
export function useUpdatePlanningMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePlanningMutation, UpdatePlanningMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePlanningMutation, UpdatePlanningMutationVariables>(UpdatePlanningDocument, options);
      }
export type UpdatePlanningMutationHookResult = ReturnType<typeof useUpdatePlanningMutation>;
export type UpdatePlanningMutationResult = ApolloReactCommon.MutationResult<UpdatePlanningMutation>;
export type UpdatePlanningMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePlanningMutation, UpdatePlanningMutationVariables>;
export const UpdateProfileDocument = gql`
    mutation UpdateProfile($data: UpdateUserInput!) {
  updateUser(data: $data) {
    id
    first_name
    last_name
    phone
    avatar
  }
}
    `;
export type UpdateProfileMutationFn = ApolloReactCommon.MutationFunction<UpdateProfileMutation, UpdateProfileMutationVariables>;

/**
 * __useUpdateProfileMutation__
 *
 * To run a mutation, you first call `useUpdateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileMutation, { data, loading, error }] = useUpdateProfileMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateProfileMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateProfileMutation, UpdateProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(UpdateProfileDocument, options);
      }
export type UpdateProfileMutationHookResult = ReturnType<typeof useUpdateProfileMutation>;
export type UpdateProfileMutationResult = ApolloReactCommon.MutationResult<UpdateProfileMutation>;
export type UpdateProfileMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const UpdateReportDocument = gql`
    mutation updateReport($updateReportId: Int!, $data: UpdateReportInput!) {
  updateReport(id: $updateReportId, data: $data) {
    id
  }
}
    `;
export type UpdateReportMutationFn = ApolloReactCommon.MutationFunction<UpdateReportMutation, UpdateReportMutationVariables>;

/**
 * __useUpdateReportMutation__
 *
 * To run a mutation, you first call `useUpdateReportMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateReportMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateReportMutation, { data, loading, error }] = useUpdateReportMutation({
 *   variables: {
 *      updateReportId: // value for 'updateReportId'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateReportMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateReportMutation, UpdateReportMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateReportMutation, UpdateReportMutationVariables>(UpdateReportDocument, options);
      }
export type UpdateReportMutationHookResult = ReturnType<typeof useUpdateReportMutation>;
export type UpdateReportMutationResult = ApolloReactCommon.MutationResult<UpdateReportMutation>;
export type UpdateReportMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateReportMutation, UpdateReportMutationVariables>;
export const UserDocument = gql`
    query user {
  me {
    id
    email
    role
    first_name
    last_name
    phone
    avatar
    creation_date
    group {
      id
      name
    }
  }
}
    `;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserQuery, UserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export function useUserSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserSuspenseQueryHookResult = ReturnType<typeof useUserSuspenseQuery>;
export type UserQueryResult = ApolloReactCommon.QueryResult<UserQuery, UserQueryVariables>;