import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { AppSyncResolverHandler } from "aws-lambda";
import { MutationToggleTodoArgs, Todo } from "../graphql/generated/generated-types";

const dynamodb = DynamoDBDocument.from(new DynamoDBClient({ region: 'ap-northeast-1' }))

export const handler: AppSyncResolverHandler<MutationToggleTodoArgs, Todo | null> = async (event) => {
  const toggleTodoInput = event.arguments.toggleTodoInput

  try {
    if (!process.env.TODO_TABLE) {
      console.log("TODO_TABLE was not specified");
      return null;
    }

    const data = await dynamodb.update({
      TableName: process.env.TODO_TABLE,
      Key: {
        id: toggleTodoInput.id
      },
      UpdateExpression: 'set completed = :c',
      ExpressionAttributeValues: {
        ':c': toggleTodoInput.completed
      },
      ReturnValues: 'ALL_NEW'
    })

    return data.Attributes as Todo
  } catch (err) {
    console.error(`DynamoDB error: ${err}`);
    return null;
  }
}