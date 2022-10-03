import { Order, Product } from './Model'


export class MissingFieldError extends Error {}

export function validateAsOrderEntry(arg: any){
    if(!(arg as Order).name){
        throw new MissingFieldError('Value for name required!')
    }
    if(!(arg as Order).quantity){
        throw new MissingFieldError('Value for quantity required!')
    }
    if(!(arg as Order).price){
        throw new MissingFieldError('Value for price required!')
    }
    if(!(arg as Order).orderId){
        throw new MissingFieldError('Value for orderId required!')
    }
}


export function validateAsProductEntry(arg: any){
	if(!(arg as Product).name){
			throw new MissingFieldError('Value for name required!')
	}
	if(!(arg as Product).quantity){
			throw new MissingFieldError('Value for quantity required!')
	}
	if(!(arg as Product).price){
			throw new MissingFieldError('Value for price required!')
	}
	if(!(arg as Product).productId){
			throw new MissingFieldError('Value for orderId required!')
	}
}