import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { MissingFieldError, validateAsOrderEntry } from '../Shared/InputValidator'
import { addCorsHeader, generateRandomId, getEventBody } from '../Shared/Utils'

const TABLE_NAME = process.env.TABLE_NAME
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Response'
    }

		addCorsHeader(result)

    try {
        const item = getEventBody(event);
        item.orderId = generateRandomId();
        validateAsOrderEntry(item);

        await dbClient.put({
            TableName: TABLE_NAME!,
            Item: item
        }).promise()
        
				result.body = JSON.stringify({
					id: item.orderId
				})
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