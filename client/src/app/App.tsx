import { useRoutes } from 'react-router-dom';
import { CartProvider } from '../user/state/CartContext';
import { userRoutes } from '../user/routes';
import { adminRoutes } from '../admin/routes';
import { ScrollToTop } from './ScrollToTop';

export default function App() {
  return <CartProvider><ScrollToTop/>{useRoutes([...userRoutes, ...adminRoutes])}</CartProvider>;
}
