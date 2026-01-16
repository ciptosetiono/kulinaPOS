
import React, { useState, useMemo, useEffect } from 'react';
import { MenuItem, Order, OrderStatus, OrderItem, PaymentMethod, Table, Outlet } from '../types';
import { MOCK_OUTLETS } from '../constants';

interface CustomerPortalProps {
  menuItems: MenuItem[];
  categories: string[];
  tables: Table[];
  onOrderSubmit: (order: Order) => void;
  restaurantName: string;
  onBackToStaff: () => void;
}

const CustomerPortal: React.FC<CustomerPortalProps> = ({ 
  menuItems, 
  categories, 
  tables, 
  onOrderSubmit, 
  restaurantName,
  onBackToStaff
}) => {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  const [locationStatus, setLocationStatus] = useState<'checking' | 'allowed' | 'denied' | 'error'>('checking');
  const [distance, setDistance] = useState<number | null>(null);

  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }
    const currentOutlet = MOCK_OUTLETS.find(o => o.name === restaurantName) || MOCK_OUTLETS[0];
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        if (!currentOutlet.latitude || !currentOutlet.longitude) {
          setLocationStatus('allowed');
          return;
        }
        const dist = calculateDistance(userLat, userLon, currentOutlet.latitude, currentOutlet.longitude);
        setDistance(dist);
        if (dist <= 100) setLocationStatus('allowed');
        else setLocationStatus('denied');
      },
      () => setLocationStatus('error'),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, [restaurantName]);

  const formatPrice = (price: number) => `Rp ${price.toLocaleString('id-ID')}`;

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) return prev.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { menuItemId: item.id, quantity: 1, priceAtOrder: item.price }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.menuItemId === id) return { ...item, quantity: Math.max(0, item.quantity + delta) };
      return item;
    }).filter(i => i.quantity > 0));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.priceAtOrder * item.quantity), 0);
  const tax = subtotal * 0.1;
  const grandTotal = subtotal + tax;

  const finalizeOrder = () => {
    const newOrderId = Math.random().toString(36).substr(2, 6).toUpperCase();
    const order: Order = {
      id: newOrderId,
      outletId: 'customer-portal',
      tableNumber: tableNumber,
      items: cart,
      status: OrderStatus.PENDING,
      timestamp: Date.now(),
      total: subtotal,
      tax: tax,
      discountTotal: 0,
      grandTotal: grandTotal,
      customerName: customerName || 'Tamu',
    };

    onOrderSubmit(order);
    setPlacedOrderId(newOrderId);
    setOrderConfirmed(true);
    setIsCheckoutOpen(false);
    setCart([]);
  };

  if (locationStatus === 'denied' || locationStatus === 'error') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-xl shadow-red-50">📍</div>
        <h1 className="text-3xl font-black text-slate-900 mb-4 leading-tight">Akses Terbatas</h1>
        <p className="text-slate-500 font-medium mb-8 max-w-xs mx-auto leading-relaxed">
          {locationStatus === 'denied' 
            ? `Maaf, Anda berada ${Math.round(distance || 0)}m dari kafe. Silakan pesan langsung saat Anda sudah berada di lokasi kami.`
            : 'Sistem tidak dapat memverifikasi lokasi Anda. Silakan aktifkan GPS untuk memesan.'}
        </p>
        <button onClick={() => window.location.reload()} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs">Coba Lagi</button>
      </div>
    );
  }

  if (locationStatus === 'checking') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-[#3f51b5] rounded-full animate-spin mb-6"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Memverifikasi Lokasi...</p>
      </div>
    );
  }

  if (orderConfirmed) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${placedOrderId}`;
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden p-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mb-6">✓</div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Pesanan Dikirim!</h1>
          <p className="text-slate-500 text-sm font-medium mb-8">Silakan tunjukkan QR Code ini ke kasir untuk melakukan pembayaran.</p>
          
          <div className="bg-white p-4 rounded-3xl border-4 border-slate-50 shadow-inner mb-6">
            <img src={qrUrl} alt="Order QR Code" className="w-48 h-48" />
          </div>
          
          <div className="bg-slate-50 px-6 py-3 rounded-2xl mb-8">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Kode Pesanan</span>
            <span className="text-xl font-black text-[#3f51b5] tracking-widest">#{placedOrderId}</span>
          </div>

          <button 
            onClick={() => setOrderConfirmed(false)}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs"
          >
            Pesan Lagi
          </button>
        </div>
        <button onClick={onBackToStaff} className="mt-8 text-slate-300 font-bold text-[10px] uppercase">Kembali ke Dashboard</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-32">
      <header className="bg-white px-6 pt-12 pb-8 shadow-sm rounded-b-[3rem] relative z-10">
        <div className="flex justify-between items-start mb-6">
          <button onClick={onBackToStaff} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">←</button>
          <div className="text-right">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">{restaurantName}</h2>
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center justify-end gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Lokasi Terverifikasi
            </p>
          </div>
        </div>
        <div className="relative">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">🔍</span>
          <input 
            type="text" 
            placeholder="Cari menu favorit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-700 focus:ring-2 focus:ring-[#3f51b5]"
          />
        </div>
      </header>

      <div className="flex px-6 py-8 gap-3 overflow-x-auto scrollbar-hide">
        <button onClick={() => setSelectedCategory('All')} className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === 'All' ? 'bg-[#3f51b5] text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-100'}`}>Semua</button>
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-[#3f51b5] text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-100'}`}>{cat}</button>
        ))}
      </div>

      <div className="px-6 grid grid-cols-1 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-50 flex gap-4 animate-in fade-in duration-500">
            <div className="w-28 h-28 shrink-0 rounded-2xl overflow-hidden bg-slate-50"><img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} /></div>
            <div className="flex-1 flex flex-col justify-between py-1">
              <div><h3 className="text-base font-black text-slate-900 leading-tight">{item.name}</h3><p className="text-xs text-slate-400 font-medium line-clamp-2 mt-1">{item.description}</p></div>
              <div className="flex justify-between items-end"><span className="text-sm font-black text-[#3f51b5]">{formatPrice(item.price)}</span><button onClick={() => addToCart(item)} className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center text-xl font-bold active:scale-95">+</button></div>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-10 left-6 right-6 z-40 animate-in slide-in-from-bottom-10 duration-500">
           <button onClick={() => setIsCheckoutOpen(true)} className="w-full h-16 bg-[#3f51b5] rounded-3xl shadow-2xl flex items-center justify-between px-8 text-white">
             <div className="flex items-center gap-4"><span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-black text-xs">{cart.reduce((s,i)=>s+i.quantity, 0)}</span><span className="font-black text-xs uppercase tracking-widest">Keranjang</span></div>
             <span className="font-black text-sm">{formatPrice(grandTotal)}</span>
           </button>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
           <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-20 duration-500">
              <div className="p-8 border-b flex justify-between items-center bg-slate-50 shrink-0"><h3 className="text-xl font-black text-slate-900 uppercase">Konfirmasi Order</h3><button onClick={() => setIsCheckoutOpen(false)} className="text-2xl text-slate-400">&times;</button></div>
              <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-8 scrollbar-hide">
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daftar Menu</h4>
                    <div className="space-y-4">
                      {cart.map(item => {
                        const menu = menuItems.find(m => m.id === item.menuItemId);
                        return (
                          <div key={item.menuItemId} className="flex justify-between items-center">
                              <div className="flex-1 pr-4"><p className="font-bold text-slate-800 leading-tight">{menu?.name}</p><p className="text-[10px] font-black text-[#3f51b5] mt-1">{formatPrice(item.priceAtOrder)}</p></div>
                              <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-1 px-3">
                                <button onClick={() => updateQuantity(item.menuItemId, -1)} className="text-slate-400 font-bold">-</button>
                                <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.menuItemId, 1)} className="text-slate-900 font-bold">+</button>
                              </div>
                          </div>
                        );
                      })}
                    </div>
                 </div>
                 <div className="bg-slate-50 p-6 rounded-[2rem] space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase">Meja</label>
                          <select value={tableNumber} onChange={e => setTableNumber(e.target.value)} className="w-full p-4 bg-white border-none rounded-2xl font-bold text-sm outline-none">
                            <option value="">Pilih</option>
                            {tables.map(t => <option key={t.id} value={t.number}>Meja {t.number}</option>)}
                          </select>
                      </div>
                      <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase">Nama</label>
                          <input placeholder="Nama Anda" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full p-4 bg-white border-none rounded-2xl font-bold text-sm outline-none" />
                      </div>
                    </div>
                 </div>
              </div>
              <div className="p-8 bg-slate-900 text-white rounded-t-[3rem] space-y-4 shadow-2xl shrink-0">
                <div className="flex justify-between text-2xl font-black pt-4"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
                <button onClick={finalizeOrder} disabled={!tableNumber || cart.length === 0} className="w-full py-5 bg-[#3f51b5] text-white rounded-2xl font-black uppercase tracking-widest text-sm disabled:opacity-50">Selesaikan Pesanan</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPortal;
