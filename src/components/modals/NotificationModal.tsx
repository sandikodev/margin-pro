import React from 'react';
import { Bell, CheckCircle2, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const notifications = [
    { id: 1, title: 'Top Up Berhasil', desc: 'Saldo 500 Credits telah ditambahkan.', type: 'success', time: '2 Jam lalu' },
    { id: 2, title: 'Update Sistem v2.1', desc: 'Fitur AI HPP Estimator kini tersedia.', type: 'info', time: '1 Hari lalu' },
    { id: 3, title: 'Peringatan Cashflow', desc: 'Burn rate operasional mendekati batas.', type: 'warning', time: '3 Hari lalu' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notifikasi"
      description="Update terbaru seputar akun Anda"
      icon={Bell}
    >
       <div className="p-4 space-y-3 min-h-[300px]">
          {notifications.map((n) => (
             <div key={n.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex gap-4 hover:shadow-sm transition-shadow">
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${n.type === 'success' ? 'bg-emerald-100 text-emerald-600' : n.type === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
                   {n.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : n.type === 'warning' ? <AlertCircle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                </div>
                <div>
                   <h4 className="font-bold text-slate-800 text-sm">{n.title}</h4>
                   <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.desc}</p>
                   <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2 block">{n.time}</span>
                </div>
             </div>
          ))}
       </div>
    </Modal>
  );
};