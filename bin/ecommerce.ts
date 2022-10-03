#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EcommerceStack } from '../lib/ecommerce-stack';

const app = new cdk.App();
new EcommerceStack(app, 'EcommerceStack');
