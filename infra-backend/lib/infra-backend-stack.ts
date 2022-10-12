import * as cdk from 'aws-cdk-lib';
import { CfnOutput, Duration, Expiration, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from "@aws-cdk/aws-appsync-alpha";
import * as path from "path";
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class InfraBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB
    const todoTable = new cdk.aws_dynamodb.Table(this, 'TodoTable', {
      billingMode: cdk.aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      partitionKey: {
        name: 'id',
        type: cdk.aws_dynamodb.AttributeType.STRING
      },
    })

    // AppSync
    const todoApi = new appsync.GraphqlApi(this, 'TodoGraphqlApi', {
      name: 'todo-graphql-api',
      schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: Expiration.after(Duration.days(365))
          }
        }
      }
    })

    const commonLambdaNodeJsProps: Omit<cdk.aws_lambda_nodejs.NodejsFunctionProps, 'entry'> = {
      handler: 'handler',
      environment: {
        TODO_TABLE: todoTable.tableName
      }
    }

    const getTodosLambda = new NodejsFunction(this, 'getTodosHandler', {
      entry: path.join(__dirname, '../lambda/getTodos.ts'),
      ...commonLambdaNodeJsProps
    })

    todoTable.grantReadData(getTodosLambda)

    const addTodoLambda = new NodejsFunction(this, 'addTodoHandler', {
      entry: path.join(__dirname, '../lambda/addTodo.ts'),
      ...commonLambdaNodeJsProps
    })

    todoTable.grantWriteData(addTodoLambda)

    const toggleTodoLambda = new NodejsFunction(this, 'toggleTodoHandler', {
      entry: path.join(__dirname, "../lambda/toggleTodo.ts"),
      ...commonLambdaNodeJsProps
    })

    todoTable.grantReadWriteData(toggleTodoLambda)

    const deleteTodoLambda = new NodejsFunction(this, 'deleteTodoHandler', {
      entry: path.join(__dirname, "../lambda/deleteTodo.ts"),
      ...commonLambdaNodeJsProps
    })

    todoTable.grantReadWriteData(deleteTodoLambda)

    // DataDource
    const getTodosDataSource = todoApi.addLambdaDataSource('getTodosDataSource', getTodosLambda)
    const addTodoDataSource = todoApi.addLambdaDataSource('addTodoDataSource', addTodoLambda)
    const toggleTodoDataSource = todoApi.addLambdaDataSource('toggleTodoDataSource', toggleTodoLambda)
    const deleteTodoDataSource = todoApi.addLambdaDataSource('deleteTodoDataSource', deleteTodoLambda)

    // Resolver
    getTodosDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getTodos'
    })
    addTodoDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'addTodo'
    })
    toggleTodoDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'toggleTodo'
    })
    deleteTodoDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'deleteTodo'
    })

    // CfnOutput
    new CfnOutput(this, 'GraphQlApiUrl', {
      value: todoApi.graphqlUrl
    })

    new CfnOutput(this, 'GraphQlApiKey', {
      value: todoApi.apiKey || ''
    })
  }
}
