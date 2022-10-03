import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { RestApi } from 'aws-cdk-lib/aws-apigateway'
import { GenericTable } from './generic-table';

export class EcommerceStack extends Stack {

	private api = new RestApi(this, 'orderApi')
	private ordersTable = new GenericTable(this,{
		tableName: 'ordersTable',
		primaryKey: 'orderId',
		createLambdaPath: 'Create',		
		readLambdaPath: 'Read',
		updateLambdaPath: 'UpdateStatus',
		secondaryUpdateLambdaPath: 'UpdateTracking',
	})

	private productsTable = new GenericTable(this,{
		tableName: 'productsTable',
		primaryKey: 'productId',
		createLambdaPath: 'Create',		
		readLambdaPath: 'Read',
		updateLambdaPath: 'Update',
	})

	constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const queue = new sqs.Queue(this, 'EcommerceQueue', {
      visibilityTimeout: Duration.seconds(300)
    });

    const topic = new sns.Topic(this, 'EcommerceTopic');


		const orderResource = this.api.root.addResource('order');
		orderResource.addMethod('POST', this.ordersTable.createLambdaIntegration);
		orderResource.addMethod('GET', this.ordersTable.readLambdaIntegration);

		const orderStatusResource = orderResource.addResource('status');
		orderStatusResource.addMethod('PUT', this.ordersTable.updateLambdaIntegration);

		const orderTrackingResource = orderResource.addResource('tracking');
		orderTrackingResource.addMethod('PUT', this.ordersTable.secondaryUpdateLambdaIntegration);

		const productResource = this.api.root.addResource('product');
		productResource.addMethod('POST', this.productsTable.createLambdaIntegration);
		productResource.addMethod('GET', this.productsTable.readLambdaIntegration);
		productResource.addMethod('PUT', this.productsTable.updateLambdaIntegration);
		
    topic.addSubscription(new subs.SqsSubscription(queue))
  }
}
