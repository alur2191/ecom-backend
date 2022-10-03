import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../services/OrdersTable/UpdateTracking';

const event: APIGatewayProxyEvent = {
	queryStringParameters: {
		orderId: '2bb362zo0kq'
	},
	body: {
		trackingCompany: 'RandomCompany',
		trackingNumber: 'NumberRandom',
	}
} as any;


const result = handler(event, {} as any).then((res)=>{
    const items = JSON.parse(res.body);
    console.log(123)
});