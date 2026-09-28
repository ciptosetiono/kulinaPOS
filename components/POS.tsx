import React, { useState, useMemo } from 'react';
import { MenuItem, Order, OrderStatus, OrderItem, PaymentMethod, Discount, Table, SelectedOption, ProductOptionGroup, ProductOption } from '../types';

interface POSProps {
  onOrderSubmit: (order: Order) => void;
  onExit: () => void;
  menuItems: MenuItem[];
  categories: string[];
  promos: Discount[];
  tables: Table[];
  outletId: string;
  existingOrders?: Order[];
  outletName?: string;
  outletAddress?: string;
  outletPhone?: string;
  cashierName?: string;
}

const POS: React.FC<POSProps> = ({ onOrderSubmit, onExit, menuItems, categories, promos, tables, outletId, existingOrders = [], outletName, outletAddress, outletPhone, cashierName }) => {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | 'All'>('All');
  const [tableSelection, setTableSelection] = useState<string | 'Takeaway'>('Takeaway');
  const [customerName, setCustomerName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [cashGiven, setCashGiven] = useState<string>('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Customization Modal State
  const [activeCustomizingItem, setActiveCustomizingItem] = useState<MenuItem | null>(null);
  const [editingCartIndex, setEditingCartIndex] = useState<number | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const [itemNotes, setItemNotes] = useState<string>('');

  const formatNumber = (val: string | number) => {
    if (!val) return '0';
    const num = typeof val === 'string' ? val.replace(/\D/g, '') : Math.floor(Number(val)).toString();
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleOpenCustomize = (item: MenuItem, index?: number) => {
    const existing = typeof index === 'number' ? cart[index] : undefined;
    const groups = item.optionGroups || [];

    let opts: SelectedOption[] = existing?.selectedOptions ? [...existing.selectedOptions] : [];
    // Pastikan grup SINGLE selalu punya satu pilihan (default = opsi pertama)
    for (const g of groups) {
      if (g.type === 'SINGLE' && g.options.length > 0 && !opts.some(o => o.groupName === g.groupName)) {
        opts.push({ groupName: g.groupName, optionName: g.options[0].name, price: g.options[0].price });
      }
    }

    setActiveCustomizingItem(item);
    setEditingCartIndex(typeof index === 'number' ? index : null);
    setSelectedOptions(opts);
    setItemNotes(existing?.notes || '');
  };

  const handleProductClick = (item: MenuItem) => {
    const hasOptions = (item.optionGroups || []).some(g => g.options.length > 0);
    if (hasOptions) {
      handleOpenCustomize(item);
    } else {
      // Tanpa opsi: langsung tambahkan ke keranjang (gabung jika item plain yang sama sudah ada)
      setCart(prev => {
        const idx = prev.findIndex(i => i.menuItemId === item.id && !i.selectedOptions?.length && !i.notes);
        if (idx >= 0) {
          return prev.map((i, k) => (k === idx ? { ...i, quantity: i.quantity + 1 } : i));
        }
        return [...prev, {
          menuItemId: item.id,
          quantity: 1,
          priceAtOrder: item.price,
        }];
      });
    }
  };

  const selectSingleOption = (group: ProductOptionGroup, opt: ProductOption) => {
    setSelectedOptions(prev => [
      ...prev.filter(o => o.groupName !== group.groupName),
      { groupName: group.groupName, optionName: opt.name, price: opt.price },
    ]);
  };

  const toggleMultipleOption = (group: ProductOptionGroup, opt: ProductOption) => {
    setSelectedOptions(prev => {
      const exists = prev.some(o => o.groupName === group.groupName && o.optionName === opt.name);
      if (exists) return prev.filter(o => !(o.groupName === group.groupName && o.optionName === opt.name));
      return [...prev, { groupName: group.groupName, optionName: opt.name, price: opt.price }];
    });
  };

  const handleConfirmAddToCart = () => {
    if (!activeCustomizingItem) return;

    const optionsExtraPrice = selectedOptions.reduce((sum, o) => sum + o.price, 0);
    const itemTotalPrice = activeCustomizingItem.price + optionsExtraPrice;

    if (editingCartIndex !== null) {
      setCart(prev => prev.map((entry, idx) => idx === editingCartIndex ? {
        ...entry,
        priceAtOrder: itemTotalPrice,
        notes: itemNotes.trim() || undefined,
        selectedOptions: selectedOptions.length > 0 ? selectedOptions : undefined,
      } : entry));
      setEditingCartIndex(null);
    } else {
      setCart(prev => [
        ...prev,
        {
          menuItemId: activeCustomizingItem.id,
          quantity: 1,
          priceAtOrder: itemTotalPrice,
          notes: itemNotes.trim() || undefined,
          selectedOptions: selectedOptions.length > 0 ? selectedOptions : undefined,
        }
      ]);
    }

    setActiveCustomizingItem(null);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, idx) => idx !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    setCart(prev => prev.map((item, idx) => (idx === index ? { ...item, quantity: Math.max(1, quantity) } : item)));
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

  const cashGivenAmount = parseFloat(cashGiven.replace(/\D/g, '')) || 0;
  const cashChange = cashGivenAmount - grandTotal;

  const finalizeOrder = () => {
    const order: Order = {
      id: Math.random().toString(36).substr(2, 8).toUpperCase(),
      outletId: outletId,
      tableNumber: tableSelection === 'Takeaway' ? 'Bawa Pulang' : tables.find(t => t.id === tableSelection)?.number || '??',
      items: cart,
      status: OrderStatus.COMPLETED,
      timestamp: Date.now(),
      total: subtotal,
      tax: tax,
      discountTotal: 0,
      grandTotal: grandTotal,
      paymentMethod: selectedPaymentMethod,
      amountPaid: selectedPaymentMethod === PaymentMethod.CASH ? cashGivenAmount || undefined : undefined,
      changeDue: selectedPaymentMethod === PaymentMethod.CASH && cashGivenAmount > 0 ? Math.max(0, cashChange) : undefined,
      customerName: customerName.trim() || undefined,
    };
    setLastOrder(order);
    onOrderSubmit(order);
    setIsPaymentModalOpen(false);
    setShowReceipt(true);
    // Auto-buka dialog cetak struk (dalam satu alur klik kasir)
    setTimeout(() => window.print(), 400);
  };

  const openPrintDialog = () => {
    window.print();
  };

  const paymentLabel = (m: PaymentMethod) =>
    m === PaymentMethod.CASH ? 'TUNAI' : m === PaymentMethod.CARD ? 'KARTU' : 'E-WALLET / QRIS';

  const formatDateID = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) + ' ' +
      d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const resetTerminal = () => {
    setCart([]);
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
          <button 
            onClick={onExit} 
            title="Keluar dari halaman Kasir"
            className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 hover:border-fuchsia-200 transition-all cursor-pointer group shrink-0"
          >
            <span className="text-lg leading-none group-hover:-translate-x-0.5 transition-transform">←</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 group-hover:text-fuchsia-600">Kembali ke Dashboard</span>
          </button>
          <div className="relative flex-1 group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-fuchsia-500 transition-colors">🔍</span>
            <input 
              type="text"
              placeholder="Cari produk..."
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
            className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shrink-0 cursor-pointer ${selectedCategory === 'All' ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
          >
            Semua Produk
          </button>
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)} 
              className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shrink-0 cursor-pointer ${selectedCategory === cat ? 'bg-fuchsia-600 text-white shadow-xl shadow-fuchsia-100' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
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
                onClick={() => handleProductClick(item)} 
                className="group bg-white rounded-[2.5rem] border border-slate-100 p-4 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer flex flex-col active:scale-95"
              >
                <div className="aspect-square rounded-[2rem] overflow-hidden bg-slate-50 mb-4 relative">
                  <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-xl px-3 py-1.5 text-fuchsia-600 font-black text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shadow-md">
                    <span>{(item.optionGroups || []).some(g => g.options.length > 0) ? '+ Pilih Opsi' : '+ Tambah'}</span>
                  </div>
                </div>
                <div className="px-2 pb-2">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tighter truncate">{item.name}</h4>
                  <p className="text-[11px] font-black text-fuchsia-600 mt-2 tracking-wide">Rp {formatNumber(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Checkout Sidebar */}
      <div className="w-[520px] bg-white border-l border-slate-100 flex flex-col shadow-[-40px_0_60px_-15px_rgba(0,0,0,0.05)] relative z-10 font-sans">
        <div className="p-6 pb-5 border-b border-slate-50 shrink-0">
           <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-black text-slate-950 uppercase tracking-tighter">Keranjang</h3>
              <button onClick={() => setCart([])} className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] hover:text-red-500 transition-colors">Kosongkan</button>
           </div>
           
           <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 px-4 py-2.5 rounded-2xl">
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Pelanggan</p>
                 <input 
                  placeholder="UMUM" 
                  value={customerName} 
                  onChange={e => setCustomerName(e.target.value)} 
                  className="bg-transparent w-full text-xs font-black uppercase outline-none text-slate-800"
                 />
              </div>
              <div className="bg-slate-50 px-4 py-2.5 rounded-2xl relative group hover:bg-fuchsia-50 transition-colors">
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Tipe Pesanan</p>
                 <select 
                   value={tableSelection}
                   onChange={e => setTableSelection(e.target.value)}
                   className="bg-transparent w-full text-xs font-black uppercase outline-none text-slate-800 cursor-pointer appearance-none"
                 >
                   <option value="Takeaway">Bawa Pulang</option>
                   {tables.map(t => (
                     <option key={t.id} value={t.id}>Meja {t.number}</option>
                   ))}
                 </select>
                 <div className="absolute right-4 top-1/2 pointer-events-none text-slate-400 text-[8px] mt-1">▼</div>
              </div>
           </div>
        </div>

        {/* Line Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale scale-90">
              <div className="text-9xl mb-8">🧺</div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">Keranjang Kosong</p>
            </div>
          ) : (
            cart.map((item, index) => {
              const menu = menuItems.find(m => m.id === item.menuItemId);
              return (
                <div key={index} className="flex gap-4 group bg-slate-50/60 p-3 rounded-2xl border border-slate-100">
                  <div className="w-14 h-14 rounded-xl bg-white overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                    <img src={menu?.imageUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-0.5">
                      <h5 className="text-xs font-black text-slate-900 uppercase tracking-tight truncate pr-2">{menu?.name}</h5>
                      <span className="text-xs font-black text-slate-900">Rp {formatNumber(item.priceAtOrder * item.quantity)}</span>
                    </div>

                    {/* Render Selected Options & Notes */}
                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                      <div className="flex flex-wrap gap-1 my-1">
                        {item.selectedOptions.map((opt, oIdx) => (
                          <span key={oIdx} className="text-[9px] font-bold text-fuchsia-700 bg-fuchsia-50 px-2 py-0.5 rounded-md border border-fuchsia-100">
                            {opt.optionName} {opt.price > 0 ? `(+Rp ${formatNumber(opt.price)})` : ''}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.notes && (
                      <p className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 mt-1 italic">
                        ✎ {item.notes}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm shrink-0">
                        <button
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center text-sm font-black text-slate-500 hover:bg-slate-100 hover:text-fuchsia-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={e => {
                            const val = parseInt(e.target.value, 10);
                            updateQuantity(index, isNaN(val) || val < 1 ? 1 : val);
                          }}
                          onFocus={e => e.target.select()}
                          className="w-10 text-center text-xs font-black text-slate-900 outline-none bg-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <button
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-sm font-black text-slate-500 hover:bg-slate-100 hover:text-fuchsia-600 transition-all cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      {menu?.optionGroups && menu.optionGroups.some(g => g.options.length > 0) && (
                        <button onClick={() => handleOpenCustomize(menu, index)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-fuchsia-600 transition-all">Ubah Opsi</button>
                      )}
                      <button onClick={() => removeFromCart(index)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-all ml-auto">Hapus</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Totals & Primary Action */}
        <div className="p-6 bg-slate-50/50 space-y-4 border-t border-slate-100">
           <div className="space-y-2">
             <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest"><span>Subtotal</span><span>Rp {formatNumber(subtotal)}</span></div>
             <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest"><span>Pajak (10%)</span><span>Rp {formatNumber(tax)}</span></div>
           </div>
           <div className="pt-4 flex justify-between items-end border-t border-slate-200/50">
             <div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Total Tagihan</p>
               <h2 className="text-4xl font-black text-slate-950 tracking-tighter">Rp {formatNumber(grandTotal)}</h2>
             </div>
           </div>
           <button 
            onClick={() => { setCashGiven(''); setIsPaymentModalOpen(true); }} 
            disabled={cart.length === 0} 
            className="w-full h-20 bg-slate-950 text-white rounded-[2rem] flex flex-col items-center justify-center shadow-2xl hover:bg-fuchsia-600 transition-all disabled:opacity-30 disabled:grayscale group active:scale-95 cursor-pointer"
           >
             <span className="text-xs font-black uppercase tracking-[0.3em] mb-0.5 group-hover:scale-110 transition-transform">Bayar Sekarang</span>
             <span className="text-[9px] font-bold text-white/50 uppercase tracking-[0.2em]">Sistem Pembayaran Kulina</span>
           </button>
        </div>
      </div>

      {/* Product Options / Customization Modal */}
      {activeCustomizingItem && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
            <div className="flex justify-between items-start p-8 pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-4">
                <img src={activeCustomizingItem.imageUrl} className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm" alt="" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900 leading-tight">{activeCustomizingItem.name}</h3>
                    {editingCartIndex !== null && (
                      <span className="px-2 py-0.5 bg-fuchsia-50 text-fuchsia-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-fuchsia-100">Ubah</span>
                    )}
                  </div>
                  <p className="text-fuchsia-600 font-black text-sm mt-0.5">Rp {formatNumber(activeCustomizingItem.price)}</p>
                </div>
              </div>
              <button onClick={() => setActiveCustomizingItem(null)} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            {/* Scrollable Option Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
            {/* Dynamic Option Groups */}
            {(activeCustomizingItem.optionGroups || []).map((group, gIdx) => (
              <div key={gIdx} className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {group.type === 'MULTIPLE' ? '☑️' : '🔘'} {group.groupName || 'Opsi'} {group.type === 'MULTIPLE' ? '(Bisa Lebih Dari Satu)' : '(Pilih Satu)'}
                </label>

                {group.type === 'MULTIPLE' ? (
                  <div className="space-y-2">
                    {group.options.map(opt => {
                      const isChecked = selectedOptions.some(o => o.groupName === group.groupName && o.optionName === opt.name);
                      return (
                        <button
                          key={opt.name}
                          type="button"
                          onClick={() => toggleMultipleOption(group, opt)}
                          className={`w-full p-3.5 rounded-2xl text-left border text-xs font-bold transition-all flex justify-between items-center ${
                            isChecked
                              ? 'border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700 ring-2 ring-fuchsia-500'
                              : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-black ${isChecked ? 'bg-fuchsia-600 text-white' : 'border border-slate-300 bg-white'}`}>
                              {isChecked ? '✓' : ''}
                            </span>
                            <span>{opt.name}</span>
                          </div>
                          {opt.price > 0 && <span className="text-fuchsia-600 font-black text-xs">+Rp {formatNumber(opt.price)}</span>}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {group.options.map(opt => {
                      const isSelected = selectedOptions.some(o => o.groupName === group.groupName && o.optionName === opt.name);
                      return (
                        <button
                          key={opt.name}
                          type="button"
                          onClick={() => selectSingleOption(group, opt)}
                          className={`p-3 rounded-2xl text-left border text-xs font-bold transition-all flex justify-between items-center ${
                            isSelected
                              ? 'border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700 ring-2 ring-fuchsia-500'
                              : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-200'
                          }`}
                        >
                          <span>{opt.name}</span>
                          {opt.price > 0 && <span className="text-[10px] text-fuchsia-600 font-black">+Rp {formatNumber(opt.price)}</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Custom Notes Input */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">✎ Catatan Khusus Pelanggan:</label>
              <input
                type="text"
                placeholder="Contoh: Tanpa Bawang Goreng, Es Sedikit, Kuah Dipisah..."
                value={itemNotes}
                onChange={e => setItemNotes(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>
            </div>

            <div className="flex gap-3 p-8 pt-4 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => setActiveCustomizingItem(null)}
                className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddToCart}
                className="flex-[2] py-3.5 bg-fuchsia-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-fuchsia-700 transition-all shadow-lg shadow-fuchsia-200"
              >
                {editingCartIndex !== null ? '✓ Simpan Perubahan' : '+ Tambah ke Keranjang'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Interface Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#020617]/90 backdrop-blur-xl p-8">
          <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl overflow-hidden flex h-[600px] animate-in zoom-in duration-500">
            {/* Left Info Panel */}
            <div className="w-1/2 bg-slate-950 p-16 text-white flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-500 to-transparent" />
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-fuchsia-500 mb-4">Total Pembayaran</p>
                  <h2 className="text-7xl font-black tracking-tighter">Rp {formatNumber(grandTotal)}</h2>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between text-slate-500 font-black uppercase text-[10px] tracking-widest"><span>Jumlah Barang</span><span className="text-white">{cart.reduce((s,i)=>s+i.quantity,0)} Item</span></div>
                  <div className="flex justify-between text-slate-500 font-black uppercase text-[10px] tracking-widest"><span>ID Pos</span><span className="text-white">KLN-POS-X1</span></div>
               </div>
            </div>
            {/* Right Interactive Panel */}
            <div className="flex-1 p-12 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-8">Metode Pembayaran</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['TUNAI', 'KARTU', 'E-WALLET', 'QRIS'].map(m => (
                    <button 
                      key={m} 
                      onClick={() => setSelectedPaymentMethod(m === 'TUNAI' ? PaymentMethod.CASH : m === 'KARTU' ? PaymentMethod.CARD : PaymentMethod.E_WALLET)}
                      className={`p-6 rounded-[2rem] border-2 font-black text-[11px] uppercase tracking-widest transition-all ${
                        (selectedPaymentMethod === PaymentMethod.CASH && m === 'TUNAI') ||
                        (selectedPaymentMethod === PaymentMethod.CARD && m === 'KARTU') ||
                        (selectedPaymentMethod === PaymentMethod.E_WALLET && (m === 'E-WALLET' || m === 'QRIS'))
                          ? 'border-fuchsia-600 bg-fuchsia-50 text-fuchsia-600'
                          : 'border-slate-50 text-slate-300 hover:border-slate-200 hover:text-slate-600'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {/* Cash (TUNAI) Input & Change */}
                {selectedPaymentMethod === PaymentMethod.CASH && (
                  <div className="mt-6 space-y-3 animate-in fade-in duration-300">
                    <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">💵 Uang Diterima Dari Pelanggan</p>
                      <div className="flex items-center gap-4">
                        <input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          placeholder="0"
                          value={cashGiven}
                          onChange={e => setCashGiven(e.target.value)}
                          className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl text-3xl font-black text-slate-900 outline-none focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-50 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setCashGiven(String(Math.round(grandTotal)))}
                          className="px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-fuchsia-600 hover:border-fuchsia-300 hover:bg-fuchsia-50 transition-all shrink-0"
                        >
                          Uang Pas
                        </button>
                      </div>
                    </div>

                    <div className={`flex justify-between items-center rounded-[2rem] px-6 py-5 border transition-all ${
                      cashChange >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'
                    }`}>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Kembalian</p>
                        <p className={`text-[9px] font-black uppercase tracking-widest ${cashChange >= 0 ? 'text-emerald-500/70' : 'text-rose-500/70'}`}>
                          {cashChange >= 0 ? 'Uang cukup' : 'Uang kurang'}
                        </p>
                      </div>
                      <h4 className={`text-3xl font-black tracking-tighter ${cashChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {cashChange >= 0 ? `Rp ${formatNumber(cashChange)}` : `- Rp ${formatNumber(Math.abs(cashChange))}`}
                      </h4>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setIsPaymentModalOpen(false)} className="px-8 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100">Batal</button>
                <button 
                  onClick={finalizeOrder} 
                  disabled={selectedPaymentMethod === PaymentMethod.CASH && cashChange < 0}
                  className="flex-1 py-5 bg-fuchsia-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-fuchsia-200 hover:bg-fuchsia-700 active:scale-95 transition-all disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed"
                >
                  Proses Transaksi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && lastOrder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-fuchsia-600/90 backdrop-blur-2xl p-8">
           <div className="bg-white p-16 w-full max-w-lg rounded-[3rem] shadow-2xl relative animate-in slide-in-from-bottom-20 duration-700">
              <div className="text-center mb-12">
                 <div className="w-20 h-20 bg-fuchsia-100 text-fuchsia-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
                 <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Transaksi Berhasil</h2>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">ID Transaksi: {lastOrder.id}</p>
              </div>
              <div className="border-t border-dashed border-slate-200 py-8 space-y-4 max-h-60 overflow-y-auto">
                 {lastOrder.items.map((item, i) => (
                   <div key={i} className="space-y-1">
                     <div className="flex justify-between font-bold text-xs">
                       <span className="text-slate-500 font-black">{item.quantity}x {menuItems.find(mi => mi.id === item.menuItemId)?.name}</span>
                       <span className="text-slate-900 font-black">Rp {formatNumber(item.priceAtOrder * item.quantity)}</span>
                     </div>
                     {item.selectedOptions && item.selectedOptions.map((opt, oIdx) => (
                       <p key={oIdx} className="text-[10px] text-fuchsia-600 font-bold ml-4">+ {opt.optionName}</p>
                     ))}
                     {item.notes && <p className="text-[10px] text-amber-600 italic font-bold ml-4">✎ {item.notes}</p>}
                   </div>
                 ))}
              </div>
              <div className="pt-8 border-t-2 border-slate-900 flex justify-between items-end mb-12">
                 <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Dibayar</p>
                   <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Rp {formatNumber(lastOrder.grandTotal)}</h3>
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Status</p>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Lunas</span>
                 </div>
              </div>
              {lastOrder.amountPaid !== undefined && (
                <div className="pt-5 border-t border-dashed border-slate-200 space-y-2 mb-8">
                  <div className="flex justify-between text-xs font-black uppercase tracking-wider"><span className="text-slate-400">Uang Diterima</span><span className="text-slate-900">Rp {formatNumber(lastOrder.amountPaid)}</span></div>
                  <div className="flex justify-between text-xs font-black uppercase tracking-wider"><span className="text-slate-400">Kembalian</span><span className="text-emerald-600">Rp {formatNumber(lastOrder.changeDue || 0)}</span></div>
                </div>
              )}
              <div className="flex gap-3">
              <button onClick={openPrintDialog} className="flex-1 py-5 bg-white text-fuchsia-600 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl border-2 border-fuchsia-200 hover:bg-fuchsia-50 transition-all active:scale-95">🖨️ Cetak Struk</button>
              <button onClick={resetTerminal} className="flex-1 py-5 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-fuchsia-600 transition-all active:scale-95">Transaksi Baru</button>
            </div>
         </div>
        </div>
      )}

      {/* Print-only Struk (80mm) */}
      {showReceipt && lastOrder && (
        <div id="receipt-print">
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, textTransform: 'uppercase' }}>{outletName || 'KulinaPOS'}</div>
            {outletAddress && <div style={{ fontSize: '10px' }}>{outletAddress}</div>}
            {outletPhone && <div style={{ fontSize: '10px' }}>Telp: {outletPhone}</div>}
            <div style={{ fontSize: '12px', fontWeight: 700, marginTop: '6px' }}>STRUK PEMBAYARAN</div>
          </div>

          <div style={{ borderTop: '1px dashed #000', padding: '6px 0', fontSize: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>ID Transaksi</span>
              <span style={{ fontWeight: 700 }}>{lastOrder.id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Waktu</span>
              <span>{formatDateID(lastOrder.timestamp)}</span>
            </div>
            {cashierName && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Kasir</span>
                <span>{cashierName}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Pesanan</span>
              <span>{lastOrder.tableNumber === 'Bawa Pulang' ? 'Bawa Pulang' : `Meja ${lastOrder.tableNumber}`}</span>
            </div>
          </div>

          <div style={{ borderTop: '1px dashed #000', padding: '6px 0', fontSize: '10px' }}>
            {lastOrder.items.map((item, i) => {
              const mi = menuItems.find(m => m.id === item.menuItemId);
              return (
                <div key={i} style={{ marginBottom: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ flex: 1 }}>{item.quantity}x {mi?.name}</span>
                    <span>Rp {formatNumber(item.priceAtOrder * item.quantity)}</span>
                  </div>
                  {item.selectedOptions && item.selectedOptions.map((opt, oIdx) => (
                    <div key={oIdx} style={{ paddingLeft: '10px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>+ {opt.optionName}</span>
                      {opt.price > 0 && <span>+{formatNumber(opt.price)}</span>}
                    </div>
                  ))}
                  {item.notes && <div style={{ paddingLeft: '10px', fontStyle: 'italic' }}>✎ {item.notes}</div>}
                </div>
              );
            })}
          </div>

          <div style={{ borderTop: '1px dashed #000', padding: '6px 0', fontSize: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span>Rp {formatNumber(lastOrder.total)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Pajak (10%)</span>
              <span>Rp {formatNumber(lastOrder.tax)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '12px', borderTop: '1px solid #000', marginTop: '4px', paddingTop: '4px' }}>
              <span>TOTAL</span>
              <span>Rp {formatNumber(lastOrder.grandTotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
              <span>Metode</span>
              <span>{paymentLabel(lastOrder.paymentMethod || PaymentMethod.CASH)}</span>
            </div>
            {lastOrder.amountPaid !== undefined && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Uang Diterima</span>
                  <span>Rp {formatNumber(lastOrder.amountPaid)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Kembalian</span>
                  <span>Rp {formatNumber(lastOrder.changeDue || 0)}</span>
                </div>
              </>
            )}
          </div>

          <div style={{ textAlign: 'center', fontSize: '10px', borderTop: '1px dashed #000', paddingTop: '6px' }}>
            Terima kasih atas kunjungan Anda!<br />Silakan datang kembali.
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;
