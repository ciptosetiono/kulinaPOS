
import React, { useState, useMemo } from 'react';
import { MenuItem, Order, OrderStatus, OrderItem, PaymentMethod, Discount, Table } from '../types';

interface POSProps {
  onOrderSubmit: (order: Order) => void;
  onExit: () => void;
  menuItems: MenuItem[];
  categories: string[];
  promos: Discount[];
  tables: Table[];
  outletId: string;
  existingOrders?: Order[];
}

const POS: React.FC<POSProps> = ({ onOrderSubmit, onExit, menuItems, categories, promos, tables, outletId, existingOrders = [] }) => {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | 'All'>('All');
  const [tableSelection, setTableSelection] = useState<string | 'Takeaway'>('Takeaway');
  const [customerName, setCustomerName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [amountTendered, setAmountTendered] = useState<string>('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const formatNumber = (val: string | number) => {
    if (!val) return '0';
    const num = typeof val === 'string' ? val.replace(/\D/g, '') : Math.floor(Number(val)).toString();
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) return prev.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { menuItemId: item.id, quantity: 1, priceAtOrder: item.price }];
    });
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(prev => prev.filter(i => i.menuItemId !== menuItemId));
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const subtotal = cart.reduce((sum, item) => sum + (item.priceAtOrder * item.quantity), 0);
  const tax = subtotal * 0.10;
  const grandTotal = subtotal + tax;

  const finalizeOrder = () => {
    const order: Order = {
      id: Math.random().toString(36).substr(2, 8).toUpperCase(),
      outletId: outletId,
      tableNumber: tableSelection === 'Takeaway' ? 'Takeaway' : tables.find(t => t.id === tableSelection)?.number || '??',
      items: cart,
      status: OrderStatus.COMPLETED,
      timestamp: Date.now(),
      total: subtotal,
      tax: tax,
      discountTotal: 0,
      grandTotal: grandTotal,
      paymentMethod: selectedPaymentMethod,
      customerName: customerName.trim() || undefined,
    };
    setLastOrder(order);
    onOrderSubmit(order);
    setIsPaymentModalOpen(false);
    setShowReceipt(true);
  };

  const resetTerminal = () => {
    setCart([]);
    setAmountTendered('');
    setCustomerName('');
    setTableSelection('Takeaway');
    setShowReceipt(false);
  };

  return (
    <div className="flex h-screen w-full bg-[#fafbfc] overflow-hidden fixed inset-0 z-[60] animate-in fade-in duration-500 font-sans">
      {/* Catalog Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Controls */}
        <header className="p-8 pb-4 flex justify-between items-center gap-8 shrink-0">
          <button onClick={onExit} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all">←</button>
          <div className="relative flex-1 group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-fuchsia-500 transition-colors">🔍</span>
            <input 
              type="text"
              placeholder="Search product identifiers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-white rounded-2xl shadow-sm border border-slate-100 focus:ring-4 focus:ring-fuchsia-50 focus:border-fuchsia-200 outline-none font-bold text-slate-800 transition-all"
            />
          </div>
        </header>

        {/* Category Belt */}
        <div className="px-8 flex gap-4 overflow-x-auto scrollbar-hide py-4 shrink-0">
          <button 
            onClick={() => setSelectedCategory('All')} 
            className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shrink-0 ${selectedCategory === 'All' ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
          >
            All Products
          </button>
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)} 
              className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shrink-0 ${selectedCategory === cat ? 'bg-fuchsia-600 text-white shadow-xl shadow-fuchsia-100' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bento Grid Menu */}
        <div className="flex-1 overflow-y-auto px-8 pb-10 pt-4 scrollbar-hide">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                onClick={() => addToCart(item)} 
                className="group bg-white rounded-[2.5rem] border border-slate-100 p-4 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer flex flex-col active:scale-95"
              >
                <div className="aspect-square rounded-[2rem] overflow-hidden bg-slate-50 mb-4 relative">
                  <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-fuchsia-600 font-black text-xl opacity-0 group-hover:opacity-100 transition-opacity">+</div>
                </div>
                <div className="px-2 pb-2">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tighter truncate">{item.name}</h4>
                  <p className="text-[11px] font-black text-fuchsia-600 mt-2 tracking-wide">IDR {formatNumber(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Checkout Sidebar */}
      <div className="w-[450px] bg-white border-l border-slate-100 flex flex-col shadow-[-40px_0_60px_-15px_rgba(0,0,0,0.05)] relative z-10">
        <div className="p-8 border-b border-slate-50">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-950 uppercase tracking-tighter">Basket</h3>
              <button onClick={() => setCart([])} className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] hover:text-red-500 transition-colors">Clear All</button>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</p>
                 <input 
                  placeholder="WALK-IN" 
                  value={customerName} 
                  onChange={e => setCustomerName(e.target.value)} 
                  className="bg-transparent w-full text-xs font-black uppercase outline-none text-slate-800"
                 />
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl relative group cursor-pointer hover:bg-fuchsia-50 transition-colors">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Station</p>
                 <div className="text-xs font-black uppercase text-slate-800">{tableSelection === 'Takeaway' ? 'Takeaway' : `Table ${tables.find(t=>t.id===tableSelection)?.number}`}</div>
              </div>
           </div>
        </div>

        {/* Line Items */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale scale-90">
              <div className="text-9xl mb-8">🧺</div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">Empty Stack</p>
            </div>
          ) : (
            cart.map(item => {
              const menu = menuItems.find(m => m.id === item.menuItemId);
              return (
                <div key={item.menuItemId} className="flex gap-4 group">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden shrink-0">
                    <img src={menu?.imageUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate pr-4">{menu?.name}</h5>
                      <span className="text-[11px] font-black text-slate-900">IDR {formatNumber(item.priceAtOrder * item.quantity)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-fuchsia-500">×{item.quantity}</span>
                      <button onClick={() => removeFromCart(item.menuItemId)} className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">Remove</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Totals & Primary Action */}
        <div className="p-8 bg-slate-50/50 space-y-4 border-t border-slate-100">
           <div className="space-y-2">
             <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest"><span>Subtotal</span><span>IDR {formatNumber(subtotal)}</span></div>
             <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest"><span>Global Tax (10%)</span><span>IDR {formatNumber(tax)}</span></div>
           </div>
           <div className="pt-4 flex justify-between items-end border-t border-slate-200/50">
             <div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Final Amount</p>
               <h2 className="text-4xl font-black text-slate-950 tracking-tighter">IDR {formatNumber(grandTotal)}</h2>
             </div>
           </div>
           <button 
            onClick={() => setIsPaymentModalOpen(true)} 
            disabled={cart.length === 0} 
            className="w-full h-24 bg-slate-950 text-white rounded-[2rem] flex flex-col items-center justify-center shadow-2xl hover:bg-fuchsia-600 transition-all disabled:opacity-30 disabled:grayscale group active:scale-95"
           >
             <span className="text-xs font-black uppercase tracking-[0.3em] mb-1 group-hover:scale-110 transition-transform">Initialize Payment</span>
             <span className="text-[9px] font-bold text-white/50 uppercase tracking-[0.2em]">Kulina Redline Engine</span>
           </button>
        </div>
      </div>

      {/* Payment Interface Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#020617]/90 backdrop-blur-xl p-8">
          <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl overflow-hidden flex h-[600px] animate-in zoom-in duration-500">
            {/* Left Info Panel */}
            <div className="w-1/2 bg-slate-950 p-16 text-white flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-500 to-transparent" />
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-fuchsia-500 mb-4">Total Telemetry</p>
                  <h2 className="text-7xl font-black tracking-tighter">IDR {formatNumber(grandTotal)}</h2>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between text-slate-500 font-black uppercase text-[10px] tracking-widest"><span>Items Count</span><span className="text-white">{cart.reduce((s,i)=>s+i.quantity,0)} Unit</span></div>
                  <div className="flex justify-between text-slate-500 font-black uppercase text-[10px] tracking-widest"><span>Network ID</span><span className="text-white">KLN-POS-X1</span></div>
               </div>
            </div>
            {/* Right Interactive Panel */}
            <div className="flex-1 p-16 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-10">Select Settlement</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['CASH', 'CARD', 'E_WALLET', 'CRYPTO'].map(m => (
                    <button 
                      key={m} 
                      onClick={() => setSelectedPaymentMethod(m as PaymentMethod)}
                      className={`p-6 rounded-[2rem] border-2 font-black text-[11px] uppercase tracking-widest transition-all ${selectedPaymentMethod === m ? 'border-fuchsia-600 bg-fuchsia-50 text-fuchsia-600' : 'border-slate-50 text-slate-300 hover:border-slate-200 hover:text-slate-600'}`}
                    >
                      {m.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setIsPaymentModalOpen(false)} className="px-8 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100">Cancel</button>
                <button onClick={finalizeOrder} className="flex-1 py-5 bg-fuchsia-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-fuchsia-200 hover:bg-fuchsia-700 active:scale-95 transition-all">Execute Transaction</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal (Unchanged structural logic, refined aesthetic) */}
      {showReceipt && lastOrder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-fuchsia-600/90 backdrop-blur-2xl p-8">
           <div className="bg-white p-16 w-full max-w-lg rounded-[3rem] shadow-2xl relative animate-in slide-in-from-bottom-20 duration-700">
              <div className="text-center mb-12">
                 <div className="w-20 h-20 bg-fuchsia-100 text-fuchsia-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
                 <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Journal Printed</h2>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">Transaction ID: {lastOrder.id}</p>
              </div>
              <div className="border-t border-dashed border-slate-200 py-8 space-y-4">
                 {lastOrder.items.map((item, i) => (
                   <div key={i} className="flex justify-between font-bold text-xs">
                     <span className="text-slate-500 font-black">{item.quantity}x {menuItems.find(mi => mi.id === item.menuItemId)?.name}</span>
                     <span className="text-slate-900 font-black">IDR {formatNumber(item.priceAtOrder * item.quantity)}</span>
                   </div>
                 ))}
              </div>
              <div className="pt-8 border-t-2 border-slate-900 flex justify-between items-end mb-12">
                 <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Paid</p>
                   <h3 className="text-3xl font-black text-slate-900 tracking-tighter">IDR {formatNumber(lastOrder.grandTotal)}</h3>
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Status</p>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Settled</span>
                 </div>
              </div>
              <button onClick={resetTerminal} className="w-full py-6 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-fuchsia-600 transition-all active:scale-95">Next Cycle</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default POS;
