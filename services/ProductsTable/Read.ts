import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { addCorsHeader } from "../Shared/Utils";

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;
const dbClient = new DynamoDB.DocumentClient();

async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: "Response",
  };
	
  addCorsHeader(result);

  try {
    if (event.queryStringParameters) {
      if (PRIMARY_KEY! in event.queryStringParameters) {
        const keyValue = event.queryStringParameters[PRIMARY_KEY!];
        const queryResponse = await dbClient
          .query({
            TableName: TABLE_NAME!,
            KeyConditionExpression: "#zz = :zzzz",
            ExpressionAttributeNames: {
              "#zz": PRIMARY_KEY!,
            },
            ExpressionAttributeValues: {
              ":zzzz": keyValue,
            },
          })
          .promise();
        result.body = JSON.stringify(queryResponse);
      }
    } else {
      const queryResponse = await dbClient
        .scan({
          TableName: TABLE_NAME!,
        })
        .promise();
      result.body = JSON.stringify(queryResponse);
    }
  } catch (error) {
    result.body = (error as Error).message;
  }

  return result;
}

export { handler };
