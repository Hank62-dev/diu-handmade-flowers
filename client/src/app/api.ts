// App-local facade keeps UI imports independent from the shared HTTP client path.
export { getProducts, createOrder } from '../shared/api/client';
export type { Product } from '../shared/api/client';
