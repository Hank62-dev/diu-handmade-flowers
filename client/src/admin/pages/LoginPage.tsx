import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../api';

export function LoginPage({ onAuthenticated }: { onAuthenticated?: () => void }) {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setMessage('');
    try { const result = await adminLogin(password); sessionStorage.setItem('diu_admin_token', result.token); onAuthenticated?.(); navigate('/admin'); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Đăng nhập thất bại'); }
    finally { setLoading(false); }
  }
  return <main className="admin-login"><div className="admin-login-card"><div className="admin-brand">Dịu <small>ADMIN</small></div><p className="eyebrow">KHU VỰC QUẢN TRỊ</p><h1>Chào mừng<br /><em>trở lại.</em></h1><form onSubmit={submit}><label>Mật khẩu<div className="password-field"><LockKeyhole size={16}/><input autoFocus name="password" value={password} onChange={(event) => setPassword(event.target.value)} type={visible ? 'text' : 'password'} required /><button type="button" onClick={() => setVisible((current) => !current)} aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>{visible ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></label><button disabled={loading} className="button primary full">{loading ? 'Đang xác thực…' : 'Vào trang quản trị'}</button></form>{message && <p className="admin-warning">{message}</p>}<button className="admin-back" onClick={() => navigate('/')}>← Về website</button></div></main>;
}
