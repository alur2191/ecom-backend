import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { getEventBody } from '../Shared/Utils'


const TABLE_NAME = process.env.TABLE_NAME as string;
const PRIMARY_KEY = process.env.PRIMARY_KEY as string;
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from DYnamoDb'
    }

		try {
			const requestBody = getEventBody(event)
			const orderId = event.queryStringParameters?.[PRIMARY_KEY]

			if (requestBody && orderId) {
					const requestBodyKey = Object.keys(requestBody)[0];
					const requestBodyValue = requestBody[requestBodyKey];

					const updateResult = await dbClient.update({
							TableName: TABLE_NAME,
							Key: {
									[PRIMARY_KEY]: orderId
							},
							UpdateExpression: 'set #zzzNew = :new, #trackingNumberKey = :tracking',
							ExpressionAttributeValues:{
									':new': requestBodyValue,
									':tracking': requestBody[Object.keys(requestBody)[1]]
							},
							ExpressionAttributeNames:{
									'#zzzNew': requestBodyKey,
									'#trackingNumberKey': Object.keys(requestBody)[1]
							},
							ReturnValues: 'UPDATED_NEW'
					}).promise();

					result.body = JSON.stringify(updateResult)
			}
		} catch (error) {
				result.body = (error as Error).message
		}


    return result

}

export { handler } 