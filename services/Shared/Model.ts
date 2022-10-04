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

export interface IOrderStatus {
  status: "pending" | "success" | "error";
}

export interface OrderTracking {
	trackingCompany: string,
	trackingNumber: string,
}