import { Router } from 'express';
import { products } from './product.data.js';

export const productRouter = Router();

productRouter.get('/', (req, res) => {
  const search = String(req.query.search || '').toLowerCase();
  const data = products.filter((product) => product.isPublished && (!search || product.name.toLowerCase().includes(search)));
  res.json({ data, meta: { page: 1, limit: data.length, total: data.length, totalPages: 1 } });
});

productRouter.get('/:slug', (req, res) => {
  const product = products.find((item) => item.slug === req.params.slug);
  if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  return res.json({ data: product });
});
