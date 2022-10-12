import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { AppSyncResolverHandler } from "aws-lambda";
import { MutationDeleteTodoArgs } from "../graphql/generated/generated-types";

const dynamodb = DynamoDBDocument.from(new DynamoDBClient({ region: 'ap-northeast-1' }))

export const handler: AppSyncResolverHandler<MutationDeleteTodoArgs, Boolean | null> = async (event) => {
  const id = event.arguments.id

  try {
    if (!process.env.TODO_TABLE) {
      console.log("TODO_TABLE was not specified");
      return null;
    }

    await dynamodb.delete({
      TableName: process.env.TODO_TABLE,
      Key: {
        id: id
      }
    })

    return true
  } catch (err) {
    console.error(`DynamoDB error: ${err}`);
    return null;
  }
}