import { useEffect, useState } from 'react';
import { Instagram, MessageCircle, Phone, X } from 'lucide-react';

export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const facebookUrl = import.meta.env.VITE_FACEBOOK_URL as string | undefined;

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  return <div className={`floating-contact ${open ? 'is-open' : ''}`}>
    <div className="floating-contact-options" aria-hidden={!open}>
      <a className="contact-option contact-option-instagram" href="https://instagram.com/diufloral" target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1} aria-label="Instagram @diufloral"><b>IG</b><span>Instagram</span></a>
      {facebookUrl && <a className="contact-option contact-option-facebook" href={facebookUrl} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1} aria-label="Facebook của Dịu"><b>FB</b><span>Facebook</span></a>}
      <a className="contact-option contact-option-zalo" href="https://zalo.me/0949075900" target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1} aria-label="Chat Zalo 0949 075 900"><b>Zalo</b><span>Chat Zalo</span></a>
      <a className="contact-option contact-option-phone" href="tel:0949075900" tabIndex={open ? 0 : -1} aria-label="Gọi 0949 075 900"><b><Phone size={19}/></b><span>0949 075 900</span></a>
    </div>
    <button className="floating-contact-trigger" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Đóng liên hệ' : 'Mở các kênh liên hệ'}>
      <span className="floating-contact-trigger-label">Liên hệ</span><span className="floating-contact-trigger-icon">{open ? <X size={20}/> : <MessageCircle size={20}/>}</span>
    </button>
  </div>;
}
