import { ChevronLeft, ChevronRight } from 'lucide-react';

export function AdminPagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
  if (totalPages <= 1) return null;
  return <div className="admin-pagination"><button disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Trang trước"><ChevronLeft size={16}/></button><span>Trang <b>{page}</b> / {totalPages}</span><button disabled={page === totalPages} onClick={() => onChange(page + 1)} aria-label="Trang sau"><ChevronRight size={16}/></button></div>;
}
