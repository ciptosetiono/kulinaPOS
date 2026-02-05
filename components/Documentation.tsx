
import React from 'react';

const Documentation: React.FC = () => {
  const sections = [
    { id: 'intro', title: 'Persiapan Awal', icon: '🚀' },
    { id: 'pos', title: 'Terminal Kasir', icon: '🛒' },
    { id: 'inventory', title: 'Manajemen Stok', icon: '📦' },
    { id: 'crm', title: 'Loyalitas Pelanggan', icon: '👑' },
    { id: 'export', title: 'Ekspor & Laporan', icon: '📥' },
    { id: 'tech', title: 'Spesifikasi Teknis', icon: '🛠️' }
  ];

  return (
    <div className="flex gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Sticky Sub-Nav */}
      <div className="w-64 shrink-0 hidden lg:block">
        <div className="sticky top-10 space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Navigasi Hub</p>
          {sections.map(s => (
            <a 
              key={s.id} 
              href={`#doc-${s.id}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm text-sm font-bold text-slate-500 hover:text-fuchsia-600 transition-all group"
            >
              <span className="opacity-50 group-hover:opacity-100">{s.icon}</span>
              {s.title}
            </a>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 space-y-20 max-w-4xl pb-40">
        
        {/* Intro */}
        <section id="doc-intro" className="scroll-mt-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl">🚀</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Persiapan Awal</h2>
          </div>
          <div className="prose prose-slate max-w-none space-y-6">
            <p className="text-lg text-slate-600 leading-relaxed">
              Selamat datang di KulinaPOS Enterprise. Panduan ini dirancang untuk memastikan outlet Anda beroperasi dengan efisiensi maksimal sejak hari pertama.
            </p>
            <div className="bg-fuchsia-50 border-l-4 border-fuchsia-600 p-6 rounded-r-2xl">
              <p className="text-sm font-bold text-fuchsia-900 mb-2 uppercase tracking-tight">Penting untuk Diketahui:</p>
              <p className="text-sm text-fuchsia-700 leading-relaxed">KulinaPOS menggunakan teknologi <strong>Cloud-Native</strong>. Artinya, data Anda selalu aman di server kami, namun sistem tetap bisa beroperasi secara <strong>offline</strong> di terminal kasir Anda.</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">Langkah Konfigurasi:</h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-600 font-medium ml-4">
                <li>Daftarkan outlet fisik Anda di menu <strong>Ringkasan</strong>.</li>
                <li>Tambahkan kategori menu (Makanan, Minuman, dll).</li>
                <li>Input katalog produk beserta harga dan stok awal.</li>
                <li>Cetak QR Code meja melalui menu <strong>Denah Meja</strong>.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* POS */}
        <section id="doc-pos" className="scroll-mt-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl">🛒</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Terminal Kasir</h2>
          </div>
          <div className="space-y-6 text-slate-600 leading-relaxed font-medium">
            <p>Terminal POS adalah jantung dari operasional harian Anda. Antarmuka didesain untuk kecepatan sub-detik.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-3">Mode Meja</h4>
                <p className="text-xs">Pilih nomor meja pelanggan untuk sinkronisasi pesanan dari QR pelanggan ke kasir.</p>
              </div>
              <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-3">Quick Checkout</h4>
                <p className="text-xs">Gunakan tombol 'Pay Now' untuk akses cepat ke berbagai metode pembayaran: Tunai, Kartu, atau E-Wallet.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Inventory */}
        <section id="doc-inventory" className="scroll-mt-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl">📦</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Manajemen Stok</h2>
          </div>
          <div className="space-y-6">
            <p className="text-slate-600 font-medium">Lacak setiap gram bahan baku Anda secara presisi untuk mengurangi limbah (waste).</p>
            <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-600/20 blur-2xl rounded-full"></div>
               <h4 className="text-fuchsia-500 font-black text-xs uppercase tracking-widest mb-4">Threshold Alert</h4>
               <p className="text-slate-400 text-sm leading-relaxed italic">"Sistem akan otomatis memberikan peringatan '⚠️ Restock Required' jika jumlah stok berada di bawah batas minimum yang Anda tentukan."</p>
            </div>
          </div>
        </section>

        {/* Export */}
        <section id="doc-export" className="scroll-mt-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl">📥</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Ekspor & Laporan</h2>
          </div>
          <div className="space-y-6">
            <p className="text-slate-600 font-medium">KulinaPOS mendukung portabilitas data penuh. Anda bisa menarik data kapan saja untuk keperluan audit atau akuntansi.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border-2 border-slate-100 rounded-2xl group hover:border-fuchsia-100 transition-all">
                <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-lg text-lg">📄</div>
                <div>
                  <h5 className="font-black text-slate-900 text-xs uppercase">Format CSV</h5>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Compatible with Microsoft Excel, Google Sheets, & Numbers</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border-2 border-slate-100 rounded-2xl group hover:border-fuchsia-100 transition-all">
                <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-lg text-lg">📁</div>
                <div>
                  <h5 className="font-black text-slate-900 text-xs uppercase">Modul Tersedia</h5>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Riwayat Sales, Database Pelanggan, Daftar Suplier, PO History</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tech */}
        <section id="doc-tech" className="scroll-mt-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl">🛠️</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Spesifikasi Teknis</h2>
          </div>
          <div className="bg-slate-50 p-10 rounded-[3rem] space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stack</p>
                  <p className="text-sm font-black text-slate-900">Next.js 15.1 (Turbo)</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Database</p>
                  <p className="text-sm font-black text-slate-900">MongoDB + LocalStorage</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">UI Framework</p>
                  <p className="text-sm font-black text-slate-900">Tailwind CSS v3.4</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Runtime</p>
                  <p className="text-sm font-black text-slate-900">Node.js / Vercel Edge</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analytics</p>
                  <p className="text-sm font-black text-slate-900">Recharts.js</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Engine</p>
                  <p className="text-sm font-black text-slate-900">Google Gemini 3.0</p>
               </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Documentation;