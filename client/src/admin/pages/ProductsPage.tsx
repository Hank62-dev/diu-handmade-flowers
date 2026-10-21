import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminProducts } from '../api';
import { AdminPagination } from '../components/AdminPagination';

const money = (value: number) => new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ';
export function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]); const [error, setError] = useState(''); const [page, setPage] = useState(1); const pageSize = 10;
  useEffect(() => { getAdminProducts().then(setProducts).catch((e) => setError(e.message)); }, []);
  const pageCount = Math.max(1, Math.ceil(products.length / pageSize)); const visible = products.slice((page - 1) * pageSize, page * pageSize);
  return <div className="admin-page"><Link to="/admin" className="back admin-back-top">← Về tổng quan</Link><div className="admin-topbar"><div><p className="eyebrow">CATALOG</p><h1>Sản phẩm</h1></div><span className="admin-chip">{products.length} sản phẩm</span></div>{error && <div className="admin-notice"><p>{error}</p></div>}<div className="admin-table">{visible.map((product) => <div key={product._id}><img src={product.image} alt={product.name}/><span><b>{product.name}</b><small>{product.category}</small></span><strong>{money(product.price)}</strong><em>{product.stock ? 'Đang bán' : 'Hết hàng'}</em></div>)}</div><AdminPagination page={page} totalPages={pageCount} onChange={setPage}/></div>;
}
