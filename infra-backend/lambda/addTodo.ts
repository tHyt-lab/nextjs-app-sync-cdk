import { AppSyncResolverHandler } from "aws-lambda";
import { MutationAddTodoArgs, Todo } from "../graphql/generated/generated-types";
import { v4 } from 'uuid'
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dynamodb = DynamoDBDocument.from(new DynamoDBClient({ region: 'ap-northeast-1' }))

export const handler: AppSyncResolverHandler<MutationAddTodoArgs, Todo | null> = async (event) => {
  const addTodoInput = event.arguments.addTodoInput
  const uuid = v4()

  try {
    if (!process.env.TODO_TABLE) {
      console.error('TODO_TABLE was not specified')
      return null
    }

    const newTodo: Todo = {
      id: uuid,
      ...addTodoInput,
      completed: false,
      createdAt: Date.now()
    }

    await dynamodb.put({
      TableName: process.env.TODO_TABLE,
      Item: newTodo
    })

    return newTodo
  } catch (err) {
    console.error(`DynamoDB error: ${err}`);
    return null;
  }
}