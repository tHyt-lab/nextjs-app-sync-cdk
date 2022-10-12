export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSTimestamp: any;
};

export type AddTodoInput = {
  title: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addTodo?: Maybe<Todo>;
  deleteTodo?: Maybe<Scalars['Boolean']>;
  toggleTodo?: Maybe<Todo>;
};


export type MutationAddTodoArgs = {
  addTodoInput: AddTodoInput;
};


export type MutationDeleteTodoArgs = {
  id: Scalars['ID'];
};


export type MutationToggleTodoArgs = {
  toggleTodoInput: ToggleTodoInput;
};

export type Query = {
  __typename?: 'Query';
  getTodos: Array<Todo>;
};

export type Todo = {
  __typename?: 'Todo';
  completed: Scalars['Boolean'];
  createdAt: Scalars['AWSTimestamp'];
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type ToggleTodoInput = {
  completed: Scalars['Boolean'];
  id: Scalars['ID'];
};
