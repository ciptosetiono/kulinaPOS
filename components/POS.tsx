
import React, { useState, useMemo } from 'react';
import { MenuItem, Order, OrderStatus, OrderItem, PaymentMethod, Discount, Table, TableStatus } from '../types';

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

type NavTab = 'favorites' | 'library' | 'custom';
type ViewMode = 'grid' | 'list';

const POS: React.FC<POSProps> = ({ onOrderSubmit, onExit, menuItems, categories, promos, tables, outletId, existingOrders = [] }) => {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | 'All'>('All');
  const [tableSelection, setTableSelection] = useState<string | 'Takeaway'>('Takeaway');
  const [customerName, setCustomerName] = useState('');
  
  const [activeTab, setActiveTab] = useState<NavTab>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<Discount | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [qrError, setQrError] = useState('');
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [amountTendered, setAmountTendered] = useState<string>('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const formatNumber = (val: string | number) => {
    if (!val) return '0';
    const num = typeof val === 'string' ? val.replace(/\D/g, '') : Math.floor(Number(val)).toString();
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseNumber = (val: string) => val.replace(/\D/g, '');

  const addToCart = (item: MenuItem | { id: string, name: string, price: number }) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) return prev.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { menuItemId: item.id, quantity: 1, priceAtOrder: item.price }];
    });
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(prev => prev.filter(i => i.menuItemId !== menuItemId));
  };

  const handleRetrieveOrder = () => {
    const code = qrCodeInput.toUpperCase().trim();
    const order = existingOrders.find(o => o.id === code || o.id === code.replace('#', ''));
    if (order) {
      setCart(order.items);
      setCustomerName(order.customerName || '');
      const matchedTable = tables.find(t => t.number === order.tableNumber);
      setTableSelection(matchedTable ? matchedTable.id : 'Takeaway');
      setIsQRModalOpen(false);
      setQrCodeInput('');
      setQrError('');
    } else {
      setQrError('Pesanan tidak ditemukan.');
    }
  };

  const filteredItems = useMemo(() => {
    let items = [...menuItems];
    if (activeTab === 'favorites') items = items.filter(i => i.isFavorite);
    if (selectedCategory !== 'All') items = items.filter(i => i.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(i => i.name.toLowerCase().includes(q));
    }
    return items;
  }, [menuItems, activeTab, selectedCategory, searchQuery]);

  const subtotal = cart.reduce((sum, item) => sum + (item.priceAtOrder * item.quantity), 0);
  const discountAmount = appliedPromo ? (appliedPromo.type === 'PERCENTAGE' ? subtotal * (appliedPromo.value / 100) : appliedPromo.value) : 0;
  const tax = (subtotal - discountAmount) * 0.10;
  const grandTotal = Math.max(0, subtotal - discountAmount + tax);
  
  const rawAmountTendered = parseFloat(parseNumber(amountTendered) || '0');
  const changeDue = Math.max(0, rawAmountTendered - grandTotal);

  const finalizeOrder = () => {
    const order: Order = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      outletId: outletId,
      tableNumber: tableSelection === 'Takeaway' ? 'Takeaway' : tables.find(t => t.id === tableSelection)?.number || '??',
      items: cart,
      status: OrderStatus.COMPLETED,
      timestamp: Date.now(),
      total: subtotal,
      tax: tax,
      discountTotal: discountAmount,
      grandTotal: grandTotal,
      paymentMethod: selectedPaymentMethod,
      amountPaid: selectedPaymentMethod === PaymentMethod.CASH ? rawAmountTendered : grandTotal,
      changeDue: selectedPaymentMethod === PaymentMethod.CASH ? changeDue : 0,
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
    setSelectedPaymentMethod(PaymentMethod.CASH);
    setShowReceipt(false);
    setLastOrder(null);
    setAppliedPromo(null);
  };

  return (
    <div className="flex h-screen w-full bg-[#fdf2f2] overflow-hidden fixed inset-0 z-[60] animate-in fade-in duration-300">
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="p-4 flex gap-4 items-center shrink-0">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-300">🔍</span>
            <input 
              type="text"
              placeholder="Search KulinaPOS Catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl shadow-sm border border-red-50 focus:ring-2 focus:ring-red-600 outline-none font-bold"
            />
          </div>
          <button 
            onClick={() => setIsQRModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-200 transition-all shadow-sm"
          >
            <span>Scan QR</span>
            <span className="text-lg">📷</span>
          </button>
        </div>

        <div className="flex px-4 pb-2 gap-3 shrink-0 overflow-x-auto scrollbar-hide">
          <button onClick={() => setSelectedCategory('All')} className={`rounded-xl border w-24 h-24 flex flex-col items-center justify-center transition-all shadow-sm ${selectedCategory === 'All' ? 'bg-red-600 text-white' : 'bg-white'}`}>
            <span className="text-3xl opacity-40">🍽️</span>
            <span className="text-[10px] font-bold mt-1 uppercase">ALL</span>
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`rounded-xl border w-24 h-24 flex flex-col items-center justify-center transition-all shadow-sm ${selectedCategory === cat ? 'bg-red-600 text-white' : 'bg-white'}`}>
              <span className="text-[10px] font-bold mt-1 uppercase text-center px-1">{cat}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide pt-2">
          <div className="grid grid-cols-4 gap-3">
            {filteredItems.map(item => (
              <div key={item.id} onClick={() => addToCart(item)} className="bg-white rounded-xl overflow-hidden shadow-sm border border-red-50 flex flex-col cursor-pointer hover:shadow-md active:scale-95 transition-all">
                <div className="aspect-square bg-slate-50"><img src={item.imageUrl} className="w-full h-full object-cover" /></div>
                <div className="p-3 bg-white text-center">
                  <p className="text-[10px] font-black text-slate-700 uppercase truncate">{item.name}</p>
                  <p className="text-[9px] font-bold text-red-600 mt-1">Rp {formatNumber(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-16 bg-red-600 flex items-center px-4 gap-4 shrink-0 shadow-[0_-4px_20px_rgba(220,38,38,0.2)]">
          <button onClick={onExit} className="text-white p-2 hover:bg-white/20 rounded-lg flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-widest">Back to Hub</span>
          </button>
        </div>
      </div>

      <div className="w-[420px] bg-white border-l border-red-50 flex flex-col shadow-2xl relative">
        <div className="p-4 border-b flex items-center gap-4 bg-white">
           <input placeholder="+ CUSTOMER NAME" value={customerName} onChange={e=>setCustomerName(e.target.value)} className="w-full font-black text-slate-800 outline-none uppercase tracking-tight" />
        </div>
        <div className="p-4 border-b bg-red-50/30 flex justify-center">
           <button onClick={() => {}} className="px-8 py-2 rounded-full font-black text-[10px] uppercase tracking-widest bg-red-600 text-white shadow-lg shadow-red-200">
             {tableSelection === 'Takeaway' ? '🥡 Takeaway' : `🪑 Table ${tables.find(t=>t.id===tableSelection)?.number}`} ▾
           </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? <div className="text-center py-20 text-red-100 flex flex-col items-center"><span className="text-6xl mb-4">🛒</span><p className="font-black uppercase text-xs tracking-widest">CART IS EMPTY</p></div> : cart.map(item => {
            const menu = menuItems.find(m => m.id === item.menuItemId);
            return (
              <div key={item.menuItemId} className="flex justify-between items-center text-sm font-bold border-b border-slate-50 pb-4">
                <div className="flex-1 pr-4"><p className="truncate text-slate-800 uppercase text-xs font-black">{menu?.name}</p><button onClick={()=>removeFromCart(item.menuItemId)} className="text-[9px] text-red-500 font-black uppercase tracking-widest">Remove</button></div>
                <span className="w-12 text-center text-red-600 font-black">x{item.quantity}</span>
                <span className="w-24 text-right">Rp {formatNumber(item.priceAtOrder * item.quantity)}</span>
              </div>
            );
          })}
        </div>
        <div className="p-6 bg-slate-50 border-t space-y-2 font-bold text-sm">
           <div className="flex justify-between"><span>Subtotal</span><span>Rp {formatNumber(subtotal)}</span></div>
           <div className="flex justify-between text-slate-400"><span>Tax (10%)</span><span>Rp {formatNumber(tax)}</span></div>
           <div className="flex justify-between text-2xl font-black pt-3 border-t"><span>TOTAL</span><span className="text-red-600">Rp {formatNumber(grandTotal)}</span></div>
        </div>
        <div className="p-4"><button onClick={() => setIsPaymentModalOpen(true)} disabled={cart.length === 0} className="w-full h-24 bg-red-600 text-white text-3xl font-black uppercase rounded-2xl shadow-xl shadow-red-200 hover:bg-red-700 transition-all">PAY NOW</button></div>
      </div>

      {/* QR Lookup Modal */}
      {isQRModalOpen && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in duration-300">
            <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight text-center">QR ORDER LOOKUP</h2>
            <div className="space-y-4">
               <input 
                autoFocus
                placeholder="#A1B2" 
                value={qrCodeInput}
                onChange={e => setQrCodeInput(e.target.value)}
                className="w-full p-8 bg-slate-50 rounded-2xl font-black text-4xl text-center uppercase tracking-[0.5em] outline-none border-4 border-transparent focus:border-red-600 text-red-600"
               />
               {qrError && <p className="text-xs font-black text-red-600 text-center uppercase tracking-widest">{qrError}</p>}
               <button onClick={handleRetrieveOrder} className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-100">FETCH DATA</button>
               <button onClick={() => setIsQRModalOpen(false)} className="w-full py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden p-12 space-y-8 animate-in zoom-in duration-300">
            <h2 className="text-2xl font-black uppercase text-red-600 text-center">SELECT PAYMENT</h2>
            <div className="bg-red-50 p-8 rounded-3xl border-4 border-red-100 flex justify-between items-center">
                <div><p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Grand Total</p><p className="text-5xl font-black text-red-600 tracking-tighter">Rp {formatNumber(grandTotal)}</p></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {['CASH', 'CARD', 'E_WALLET'].map(m => (
                <button key={m} onClick={() => setSelectedPaymentMethod(m as PaymentMethod)} className={`p-6 rounded-2xl border-4 font-black text-[10px] uppercase tracking-widest ${selectedPaymentMethod === m ? 'border-red-600 bg-red-50 text-red-600' : 'border-transparent bg-slate-50 text-slate-400'}`}>{m}</button>
              ))}
            </div>
            {selectedPaymentMethod === PaymentMethod.CASH && (
              <input type="text" value={amountTendered} onChange={e => setAmountTendered(formatNumber(e.target.value))} className="w-full p-8 bg-slate-50 rounded-2xl text-5xl font-black text-center outline-none border-4 border-red-600 text-red-600" placeholder="TENDER" />
            )}
            <button onClick={finalizeOrder} className="w-full py-8 bg-red-600 text-white rounded-3xl font-black text-2xl shadow-xl shadow-red-200 active:scale-95 transition-all">CONFIRM TRANSACTION</button>
          </div>
        </div>
      )}

      {/* Receipt View */}
      {showReceipt && lastOrder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-red-600/95 backdrop-blur-xl p-4">
          <div className="bg-white p-12 w-[420px] rounded-lg shadow-2xl font-mono text-xs border-t-8 border-red-600">
             <div className="text-center mb-10"><h1 className="text-3xl font-black text-red-600">KulinaPOS</h1><p className="text-[10px] font-bold text-slate-400">PREMIUM DINING EXPERIENCE</p></div>
             <div className="space-y-1 mb-8">
               <div className="flex justify-between"><span>ORDER ID:</span><span>#{lastOrder.id}</span></div>
               <div className="flex justify-between"><span>TABLE:</span><span>{lastOrder.tableNumber}</span></div>
               <div className="flex justify-between"><span>TIMESTAMP:</span><span>{new Date(lastOrder.timestamp).toLocaleString()}</span></div>
             </div>
             <div className="border-y border-dashed py-6 my-6 space-y-4">
               {lastOrder.items.map((item, i) => (
                 <div key={i} className="flex justify-between font-bold"><span>{item.quantity}x {menuItems.find(mi => mi.id === item.menuItemId)?.name}</span><span>Rp {formatNumber(item.priceAtOrder * item.quantity)}</span></div>
               ))}
             </div>
             <div className="text-right space-y-2 border-t pt-4">
               <div className="flex justify-between font-bold"><span>SUBTOTAL</span><span>Rp {formatNumber(lastOrder.total)}</span></div>
               <div className="flex justify-between text-xl font-black pt-4 border-t-2 border-black"><span>TOTAL</span><span>Rp {formatNumber(lastOrder.grandTotal)}</span></div>
               {lastOrder.paymentMethod === PaymentMethod.CASH && (
                 <div className="flex justify-between text-slate-500"><span>CHANGE</span><span>Rp {formatNumber(lastOrder.changeDue || 0)}</span></div>
               )}
             </div>
             <button onClick={resetTerminal} className="w-full mt-10 py-6 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-red-200">NEW ORDER</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;
