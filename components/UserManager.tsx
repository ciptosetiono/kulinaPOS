import React, { useState } from 'react';
import { UserAccount, Outlet, UserRole } from '../types';
import { createUser, updateUser, deleteUser, toggleUserActive } from '../actions';

interface UserManagerProps {
  users: UserAccount[];
  setUsers: React.Dispatch<React.SetStateAction<UserAccount[]>>;
  outlets: Outlet[];
}

const ROLE_CONFIGS: Record<string, { label: string; color: string; icon: string; desc: string }> = {
  OWNER: {
    label: 'Owner / Super Admin',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: '👑',
    desc: 'Full system access, billing, & staff permissions',
  },
  MANAGER: {
    label: 'Store Manager',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: '👔',
    desc: 'Menu, inventory, reports, & staff oversight',
  },
  CASHIER: {
    label: 'Cashier / Kasir',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: '💵',
    desc: 'POS transactions, orders, & tables only',
  },
  KITCHEN: {
    label: 'Kitchen Staff / Dapur',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: '🍳',
    desc: 'Kitchen Order Display (KDS) & order status',
  },
};

const UserManager: React.FC<UserManagerProps> = ({ users, setUsers, outlets }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CASHIER',
    outletId: '',
  });

  const [loading, setLoading] = useState(false);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'CASHIER',
      outletId: outlets[0]?.id || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserAccount) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // leave empty unless changing
      role: user.role,
      outletId: user.outletId || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setLoading(true);
    try {
      if (editingUser) {
        // Update user
        await updateUser(editingUser.id, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          outletId: formData.outletId || undefined,
          ...(formData.password ? { password: formData.password } : {}),
        });

        setUsers(prev => prev.map(u => u.id === editingUser.id ? {
          ...u,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          outletId: formData.outletId || undefined,
        } : u));
      } else {
        // Create user
        const newU = await createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password || 'password123',
          role: formData.role,
          outletId: formData.outletId || undefined,
        });

        setUsers(prev => [{
          id: newU.id,
          tenantId: newU.tenantId,
          email: newU.email,
          name: newU.name || formData.name,
          role: newU.role,
          outletId: newU.outletId || undefined,
          isActive: true,
          createdAt: new Date().toISOString(),
        }, ...prev]);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      alert('Error saving user: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (user: UserAccount) => {
    try {
      await toggleUserActive(user.id, user.isActive);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
    } catch (err: any) {
      alert('Failed to toggle status: ' + err.message);
    }
  };

  const handleDelete = async (user: UserAccount) => {
    if (!confirm(`Are you sure you want to delete user ${user.name}?`)) return;
    try {
      await deleteUser(user.id);
      setUsers(prev => prev.filter(u => u.id !== user.id));
    } catch (err: any) {
      alert('Failed to delete user: ' + err.message);
    }
  };

  const ownerCount = users.filter(u => u.role === 'OWNER').length;
  const managerCount = users.filter(u => u.role === 'MANAGER').length;
  const cashierCount = users.filter(u => u.role === 'CASHIER').length;
  const kitchenCount = users.filter(u => u.role === 'KITCHEN').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-xl">👑</div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Pemilik</p>
            <p className="text-2xl font-black text-slate-900">{ownerCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-xl">👔</div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Manajer</p>
            <p className="text-2xl font-black text-slate-900">{managerCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-xl">💵</div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Kasir</p>
            <p className="text-2xl font-black text-slate-900">{cashierCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-xl">🍳</div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Staf Dapur</p>
            <p className="text-2xl font-black text-slate-900">{kitchenCount}</p>
          </div>
        </div>
      </div>

      {/* Main Users Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Akun & Hak Akses</h2>
            <p className="text-xs text-slate-400 font-medium">Kelola akun staf, tentukan peran (Role), dan batasan outlet dalam organisasi Anda.</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-6 py-3.5 bg-fuchsia-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-fuchsia-700 transition-all shadow-lg shadow-fuchsia-200 flex items-center gap-2"
          >
            <span>✨</span> Tambah Pengguna Baru
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pengguna</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role (Hak Akses)</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Outlet Restriksi</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(user => {
                const roleConfig = ROLE_CONFIGS[user.role] || ROLE_CONFIGS.CASHIER;
                const assignedOutlet = outlets.find(o => o.id === user.outletId);

                return (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-fuchsia-50 text-fuchsia-600 font-black flex items-center justify-center text-sm border border-fuchsia-100">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">ID: {user.id.slice(0, 8)}</p>
                      </div>
                    </td>

                    <td className="px-8 py-6 font-mono text-xs text-slate-600">
                      {user.email}
                    </td>

                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${roleConfig.color}`}>
                        <span>{roleConfig.icon}</span> {user.role}
                      </span>
                    </td>

                    <td className="px-8 py-6 text-xs text-slate-600 font-medium">
                      {assignedOutlet ? (
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold">
                          📍 {assignedOutlet.name}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Semua Outlet</span>
                      )}
                    </td>

                    <td className="px-8 py-6">
                      <button
                        onClick={() => handleToggleActive(user)}
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {user.isActive ? '● Aktif' : '○ Nonaktif'}
                      </button>
                    </td>

                    <td className="px-8 py-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                      >
                        🗑️ Hapus
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">
                {editingUser ? 'Edit Hak Akses Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Andi Kasir"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  required
                  placeholder="andi@maqpos.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">
                  Password {editingUser && '(Kosongkan jika tidak diubah)'}
                </label>
                <input
                  type="password"
                  placeholder={editingUser ? '••••••••' : 'Password default: password123'}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Peran (Role Access)</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(ROLE_CONFIGS).map(([key, config]) => (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setFormData({ ...formData, role: key })}
                      className={`p-3 rounded-2xl text-left border text-xs transition-all flex flex-col justify-between ${
                        formData.role === key
                          ? 'border-fuchsia-600 bg-fuchsia-50/50 ring-2 ring-fuchsia-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-black text-slate-900 mb-1">
                        <span>{config.icon}</span> {key}
                      </div>
                      <p className="text-[9px] text-slate-400 font-medium leading-tight">{config.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Akses Outlet</label>
                <select
                  value={formData.outletId}
                  onChange={e => setFormData({ ...formData, outletId: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                >
                  <option value="">Semua Outlet (Tanpa Batasan)</option>
                  {outlets.map(o => (
                    <option key={o.id} value={o.id}>
                      📍 {o.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 bg-fuchsia-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-fuchsia-700 transition-all shadow-lg shadow-fuchsia-200 disabled:opacity-50"
                >
                  {loading ? 'Simpan...' : 'Simpan User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
