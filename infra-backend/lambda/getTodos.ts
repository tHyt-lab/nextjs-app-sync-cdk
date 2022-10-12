import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"
import { AppSyncResolverHandler } from "aws-lambda"
import { Todo } from "../graphql/generated/generated-types";

const dynamodb = DynamoDBDocument.from(new DynamoDBClient({ region: 'ap-northeast-1' }))

export const handler: AppSyncResolverHandler<null, Todo[] | null> = async () => {
  try {
    console.log(process.env.TODO_TABLE);

    if (!process.env.TODO_TABLE) {
      console.error('TODO_TABLE was not specified')
      return null
    }

    const data = await dynamodb.scan({ TableName: process.env.TODO_TABLE })
    return data.Items as Todo[]
  } catch (err) {
    console.error(`DynamoDB error: ${err}`);
    return null;
  }
}