
import React from 'react';

export default function LandingPage() {
  const navigateToDashboard = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', '/dashboard');
    window.dispatchEvent(new CustomEvent('navigate'));
  };

  const navigateToHome = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new CustomEvent('navigate'));
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-red-100 selection:text-red-900 scroll-smooth">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={navigateToHome}>
            <span className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg shadow-red-200">K</span>
            <span className="text-xl font-black tracking-tighter uppercase">Kulina<span className="text-red-600">POS</span></span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-sm font-bold text-slate-500 hover:text-red-600 transition-colors">Fitur</a>
            <a href="#about" className="text-sm font-bold text-slate-500 hover:text-red-600 transition-colors">Tentang</a>
            <a href="#pricing" className="text-sm font-bold text-slate-500 hover:text-red-600 transition-colors">Harga</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={navigateToDashboard} className="text-sm font-bold text-slate-900 hover:text-red-600 transition-colors">Login</button>
            <button 
              onClick={navigateToDashboard} 
              className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-red-600 transition-all shadow-lg shadow-slate-200"
            >
              Coba Gratis 90 Hari
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full text-red-600 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="text-xs font-black uppercase tracking-widest text-red-700">Enterprise Point of Sale System</span>
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.9]">
            Solusi Kasir <br />
            <span className="text-red-600">Terpadu.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 font-medium mb-12 leading-relaxed">
            Kelola operasional restoran dan cafe Anda dengan sistem POS tercepat, manajemen stok presisi, dan ekosistem loyalitas pelanggan dalam satu dashboard.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button 
              onClick={navigateToDashboard} 
              className="w-full md:w-auto px-10 py-5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-red-700 transition-all shadow-2xl shadow-red-200 active:scale-95"
            >
              Mulai Trial 3 Bulan
            </button>
            <button className="w-full md:w-auto px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-50 transition-all active:scale-95">
              Hubungi Sales
            </button>
          </div>
          <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Offline-ready • Multi-outlet • Cloud-sync</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-8 leading-tight">
                Dirancang untuk <br />
                <span className="text-red-600">Efisiensi Total.</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8">
                KulinaPOS hadir untuk menghilangkan hambatan operasional. Kami menggabungkan kecepatan transaksi di depan dengan kekuatan manajemen data di belakang, memastikan setiap pesanan tersaji dengan sempurna.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <h4 className="font-black text-slate-900 uppercase tracking-tight">Visi Kami</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">Membangun ekosistem teknologi yang memudahkan setiap pengusaha kuliner untuk berkembang tanpa batas.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-slate-900 uppercase tracking-tight">Konektivitas</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">Sinkronisasi data real-time antar cabang, memungkinkan kontrol penuh dari manapun Anda berada.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-slate-900 rounded-[3rem] p-4 shadow-2xl border border-white/10 rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=800&h=600" 
                  alt="Restoran Professional" 
                  className="rounded-[2.5rem] w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-6">Fitur Unggulan.</h2>
            <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">Satu platform untuk semua kebutuhan manajemen kuliner Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: POS Terminal */}
            <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 group hover:bg-red-600 transition-all duration-500">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-sm group-hover:scale-110 transition-transform">🛒</div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-white transition-colors">Terminal Kasir</h3>
              <p className="text-slate-500 leading-relaxed group-hover:text-red-50 transition-colors">Proses transaksi secepat kilat dengan dukungan berbagai metode pembayaran, diskon, dan nota digital.</p>
            </div>

            {/* Feature 2: Smart Inventory */}
            <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 group hover:bg-red-600 transition-all duration-500">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-sm group-hover:scale-110 transition-transform">📦</div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-white transition-colors">Manajemen Stok</h3>
              <p className="text-slate-500 leading-relaxed group-hover:text-red-50 transition-colors">Pantau sediaan bahan baku secara real-time dengan sistem notifikasi otomatis saat stok mencapai batas minimum.</p>
            </div>

            {/* Feature 3: QR Table Ordering */}
            <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 group hover:bg-red-600 transition-all duration-500">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-sm group-hover:scale-110 transition-transform">📱</div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-white transition-colors">QR Order & Meja</h3>
              <p className="text-slate-500 leading-relaxed group-hover:text-red-50 transition-colors">Optimalkan layanan dengan pesanan mandiri lewat QR code di meja. Pelanggan pesan, dapur langsung terima.</p>
            </div>

            {/* Feature 4: Staff Dynamics */}
            <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 group hover:bg-red-600 transition-all duration-500">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-sm group-hover:scale-110 transition-transform">👥</div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-white transition-colors">Kelola Karyawan</h3>
              <p className="text-slate-500 leading-relaxed group-hover:text-red-50 transition-colors">Sistem absensi (Clock In/Out), pembagian peran staf, dan pantauan performa kerja harian dalam satu sistem.</p>
            </div>

            {/* Feature 5: CRM & Loyalty */}
            <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 group hover:bg-red-600 transition-all duration-500">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-sm group-hover:scale-110 transition-transform">👑</div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-white transition-colors">Loyalitas & CRM</h3>
              <p className="text-slate-500 leading-relaxed group-hover:text-red-50 transition-colors">Kelola database pelanggan, sistem poin reward, dan tingkatan member (Platinum/Gold) untuk meningkatkan retensi.</p>
            </div>

            {/* Feature 6: Supplier Hub */}
            <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 group hover:bg-red-600 transition-all duration-500">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-sm group-hover:scale-110 transition-transform">🚚</div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-white transition-colors">Manajemen Suplier</h3>
              <p className="text-slate-500 leading-relaxed group-hover:text-red-50 transition-colors">Buat Purchase Order (PO) langsung ke suplier terdaftar dan kelola rantai pasok Anda secara lebih terstruktur.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-12">
                <h2 className="text-5xl font-black tracking-tighter leading-tight">Teknologi untuk <br /><span className="text-red-600">Skala Besar.</span></h2>
                <div className="space-y-8">
                   <div className="flex gap-6">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-xl shrink-0">⚡</div>
                      <div>
                        <h4 className="text-xl font-bold mb-2">Sinkronisasi Instan</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">Data pesanan dari meja langsung muncul di dapur dan terminal kasir dalam hitungan milidetik.</p>
                      </div>
                   </div>
                   <div className="flex gap-6">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-xl shrink-0">🌐</div>
                      <div>
                        <h4 className="text-xl font-bold mb-2">Offline-Ready</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">Internet putus? Kasir tetap bisa beroperasi. Data akan otomatis tersinkronisasi saat koneksi kembali stabil.</p>
                      </div>
                   </div>
                   <div className="flex gap-6">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-xl shrink-0">🛡️</div>
                      <div>
                        <h4 className="text-xl font-bold mb-2">Keamanan Berlapis</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">Enkripsi data transaksi tingkat tinggi dan akses berbasis peran (Role-based access) untuk keamanan data bisnis Anda.</p>
                      </div>
                   </div>
                </div>
             </div>
             <div className="bg-gradient-to-br from-red-600 to-red-900 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full"></div>
                <p className="text-6xl font-black mb-4">25%</p>
                <p className="text-xl font-bold mb-8">Peningkatan Kecepatan Layanan</p>
                <p className="text-slate-200 text-sm leading-relaxed italic opacity-80">"Sejak menggunakan KulinaPOS, antrean di kasir berkurang drastis dan koordinasi dengan dapur menjadi jauh lebih rapi."</p>
                <div className="mt-12 pt-8 border-t border-white/20">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em]">Kulina Impact Report 2024</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-20">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Testimoni Pengguna</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 flex flex-col justify-between">
                 <p className="text-lg font-medium text-slate-700 leading-relaxed italic mb-8">"Sistemnya sangat user-friendly. Staf saya hanya butuh 15 menit untuk belajar cara pakainya. Sangat direkomendasikan untuk pemilik cafe."</p>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden"><img src="https://picsum.photos/seed/chef1/100/100" /></div>
                    <div>
                       <p className="font-black text-slate-900 text-sm">Chef Marco</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">The Red Kitchen</p>
                    </div>
                 </div>
              </div>
              <div className="p-10 bg-slate-50 rounded-[3rem] border-4 border-red-100 flex flex-col justify-between scale-105 relative z-10 shadow-xl shadow-red-50">
                 <p className="text-lg font-medium text-slate-700 leading-relaxed italic mb-8">"Fitur manajemen stoknya luar biasa. Sekarang saya bisa memantau bahan baku yang mau habis langsung dari HP, di mana saja."</p>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden"><img src="https://picsum.photos/seed/owner2/100/100" /></div>
                    <div>
                       <p className="font-black text-slate-900 text-sm">Sara Jenkins</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CEO, Bloom Group</p>
                    </div>
                 </div>
              </div>
              <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 flex flex-col justify-between">
                 <p className="text-lg font-medium text-slate-700 leading-relaxed italic mb-8">"QR ordering benar-benar membantu saat weekend. Pelanggan bisa langsung pesan tanpa menunggu pelayan datang."</p>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden"><img src="https://picsum.photos/seed/manager3/100/100" /></div>
                    <div>
                       <p className="font-black text-slate-900 text-sm">Hendra Wijaya</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manager, JKT Prime</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-4">Pilih Paket Anda.</h2>
            <p className="text-slate-500 font-medium text-lg">Setiap paket dimulai dengan <span className="text-red-600">Trial 3 Bulan Gratis</span>.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* STARTER */}
            <div className="bg-white p-12 rounded-[3rem] border border-slate-100 flex flex-col h-full hover:shadow-xl transition-all">
              <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest mb-4">Starter</h3>
              <div className="text-4xl font-black text-slate-900 mb-2">Rp 0 <span className="text-xs font-bold text-slate-400">/ 90 hari</span></div>
              <div className="text-xs font-bold text-slate-400 mb-8">kemudian Rp 499rb / bln</div>
              <ul className="space-y-4 mb-12 flex-1">
                <li className="flex items-center gap-3 text-sm font-bold text-slate-600"><span className="text-red-600">✓</span> 1 Cabang</li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-600"><span className="text-red-600">✓</span> Manajemen Stok</li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-600"><span className="text-red-600">✓</span> Terminal Kasir</li>
              </ul>
              <button onClick={navigateToDashboard} className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-600 hover:text-white transition-all">Mulai Trial</button>
            </div>
            
            {/* PREMIUM */}
            <div className="bg-slate-900 p-12 rounded-[3rem] border-4 border-red-600 shadow-2xl shadow-red-200 flex flex-col h-full scale-105 relative z-10">
              <div className="absolute top-0 right-12 -translate-y-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Populer</div>
              <h3 className="text-lg font-black text-red-600 uppercase tracking-widest mb-4">Premium</h3>
              <div className="text-4xl font-black text-white mb-2">Rp 0 <span className="text-xs font-bold text-slate-500">/ 90 hari</span></div>
              <div className="text-xs font-bold text-slate-500 mb-8">kemudian Rp 1.299rb / bln</div>
              <ul className="space-y-4 mb-12 flex-1">
                <li className="flex items-center gap-3 text-sm font-bold text-red-50"><span className="text-red-600 text-lg">★</span> 5 Cabang</li>
                <li className="flex items-center gap-3 text-sm font-bold text-red-50"><span className="text-red-600 text-lg">★</span> Analitik Bisnis</li>
                <li className="flex items-center gap-3 text-sm font-bold text-red-50"><span className="text-red-600 text-lg">★</span> QR Menu Ordering</li>
                <li className="flex items-center gap-3 text-sm font-bold text-red-50"><span className="text-red-600 text-lg">★</span> Loyalitas Pelanggan</li>
              </ul>
              <button onClick={navigateToDashboard} className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-red-900/40 hover:bg-red-700 transition-all">Mulai 3 Bln Gratis</button>
            </div>

            {/* ENTERPRISE */}
            <div className="bg-white p-12 rounded-[3rem] border border-slate-100 flex flex-col h-full hover:shadow-xl transition-all">
              <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest mb-4">Enterprise</h3>
              <div className="text-4xl font-black text-slate-900 mb-8">Kustom</div>
              <ul className="space-y-4 mb-12 flex-1">
                <li className="flex items-center gap-3 text-sm font-bold text-slate-600"><span className="text-red-600">✓</span> Cabang Tak Terbatas</li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-600"><span className="text-red-600">✓</span> Full API Access</li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-600"><span className="text-red-600">✓</span> Dedicated Manager</li>
              </ul>
              <button className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-600 hover:text-white transition-all">Hubungi Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-40 bg-white px-6">
         <div className="max-w-5xl mx-auto bg-slate-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-red-200">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-600/20 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
               <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 leading-tight">Siap Memajukan <br />Bisnis Kuliner Anda?</h2>
               <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto">Bergabunglah dengan jaringan restoran berperforma tinggi. Daftar hari ini tanpa biaya komitmen.</p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button onClick={navigateToDashboard} className="px-12 py-5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-red-900/40 hover:bg-red-700 transition-all active:scale-95">Daftar Trial Gratis</button>
                  <button className="px-12 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">Jadwalkan Demo</button>
               </div>
               <p className="mt-10 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">90 Hari gratis • Tidak butuh kartu kredit • Batalkan kapan saja</p>
            </div>
         </div>
      </section>

      <footer className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
             <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-sm">K</span>
                  <span className="text-xl font-black tracking-tighter uppercase">Kulina<span className="text-red-600">POS</span></span>
                </div>
                <p className="text-slate-500 text-sm max-w-xs font-medium leading-relaxed">Sistem POS modern untuk restoran dan cafe berperforma tinggi di Indonesia.</p>
             </div>
             <div>
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-6">Produk</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-400">
                   <li><a href="#" className="hover:text-red-600 transition-colors">Kasir (POS)</a></li>
                   <li><a href="#" className="hover:text-red-600 transition-colors">Stok Barang</a></li>
                   <li><a href="#" className="hover:text-red-600 transition-colors">Loyalitas Member</a></li>
                   <li><a href="#" className="hover:text-red-600 transition-colors">Order via QR</a></li>
                </ul>
             </div>
             <div>
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-6">Bantuan</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-400">
                   <li><a href="#" className="hover:text-red-600 transition-colors">Dokumentasi</a></li>
                   <li><a href="#" className="hover:text-red-600 transition-colors">Harga Paket</a></li>
                   <li><a href="#" className="hover:text-red-600 transition-colors">Pusat Bantuan</a></li>
                </ul>
             </div>
          </div>
          <div className="pt-10 border-t border-slate-200 text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">© 2025 KulinaPOS Enterprise. Bagian dari ekosistem Kulina Group.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
