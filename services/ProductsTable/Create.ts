import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { MissingFieldError, validateAsProductEntry } from '../Shared/InputValidator'
import { generateRandomId, getEventBody } from '../Shared/Utils'

const TABLE_NAME = process.env.TABLE_NAME
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from DYnamoDb'
    }
    try {
        const item = getEventBody(event);
        item.productId = generateRandomId();
        validateAsProductEntry(item);
        await dbClient.put({
            TableName: TABLE_NAME!,
            Item: item
        }).promise()
        result.body = JSON.stringify(`Created item with id: ${item.productId}`)
    } catch (error) {
        if (error instanceof MissingFieldError) {
            result.statusCode = 403;
        } else {
            result.statusCode = 500;
        }
        result.body = (error as Error).message;

    }


    return result

}

export { handler }