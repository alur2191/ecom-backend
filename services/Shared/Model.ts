export interface Product {
	productId: string,
	name: string,
	quantity: number,
	price: number,
}

export interface Order {
	orderId: string,
	name: string,
	quantity: number,
	price: number,
}

export interface OrderStatus {
	status: string
}

export interface OrderTracking {
	trackingCompany: string,
	trackingNumber: string,
}