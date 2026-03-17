"use client";
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ShoppingBag, 
  Image as ImageIcon, 
  Trash2, 
  Edit3, 
  Box, 
  Tag, 
  BarChart3,
  X,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import DemoModal from '@/components/DemoModal';

export default function ShopPage() {
  const { business, user } = useAuth();
  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [search, setSearch] = useState('');
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
    is_available: true
  });

  useEffect(() => {
    loadProducts();
  }, [business?.id]);

  async function loadProducts() {
    if (!business?.id) {
      // Demo data
      setProducts([
        { id: '1', name: 'Premium Hair Wax', price: 1200, stock: 15, is_available: true, image_url: 'https://images.unsplash.com/photo-1590159357421-46eb9014164b?auto=format&fit=crop&w=300&q=80' },
        { id: '2', name: 'Beard Oil (30ml)', price: 850, stock: 8, is_available: true, image_url: 'https://images.unsplash.com/photo-1552046122-03184de85e08?auto=format&fit=crop&w=300&q=80' },
        { id: '3', name: 'Face Mask Therapy', price: 4500, stock: 5, is_available: false, image_url: 'https://images.unsplash.com/photo-1596753106260-ca480d5d519b?auto=format&fit=crop&w=300&q=80' }
      ]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false });

    if (data) setProducts(data);
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setShowDemoModal(true); return; }
    if (!business?.id) return;

    setLoading(true);
    const productData = {
      ...formData,
      business_id: business.id,
      price: parseFloat(formData.price as string),
      stock: parseInt(formData.stock as string)
    };

    let error;
    if (formData.id) {
      const { error: err } = await supabase.from('products').update(productData).eq('id', formData.id);
      error = err;
    } else {
      const { id, ...newProduct } = productData;
      const { error: err } = await supabase.from('products').insert([newProduct]);
      error = err;
    }

    if (!error) {
      setIsModalOpen(false);
      loadProducts();
      setFormData({ id: '', name: '', description: '', price: '', stock: '', image_url: '', is_available: true });
    }
    setLoading(false);
  };

  const deleteProduct = async (id: string) => {
    if (!user) { setShowDemoModal(true); return; }
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) loadProducts();
  };

  const openEdit = (p: any) => {
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-10 px-4 font-sans animate-in fade-in slide-in-from-bottom-4 duration-700">
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200 dark:border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
            <ShoppingBag className="w-3 h-3" />
            {t.modules.shop}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t.shop.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm italic">
            {t.shop.subtitle}
          </p>
        </div>
        
        <button 
          onClick={() => { setFormData({id:'', name:'', description:'', price:'', stock:'', image_url:'', is_available: true}); setIsModalOpen(true); }}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {t.shop.add_product}
        </button>
      </div>

      {/* Search & Stats Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <div className="lg:col-span-3 premium-card flex items-center gap-4 px-6 !py-1 transition-all border-slate-200 dark:border-white/10 focus-within:ring-2 focus-within:ring-indigo-500/20">
            <Search className="w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder={t.common.search_placeholder} 
              className="flex-1 bg-transparent py-4 focus:outline-none text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <div className="premium-card !bg-indigo-600 text-white border-none flex items-center justify-between px-8">
            <div className="space-y-0.5">
               <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Total Skus</p>
               <p className="text-2xl font-black">{products.length}</p>
            </div>
            <Box className="w-10 h-10 text-indigo-400 opacity-50" />
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filtered.map((prod) => (
          <motion.div 
            key={prod.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="premium-card group relative overflow-hidden flex flex-col h-full border-slate-200 dark:border-white/10 hover:border-indigo-500/30 transition-all"
          >
            <div className="aspect-square w-full bg-slate-100 dark:bg-white/5 relative overflow-hidden rounded-xl mb-6">
              {prod.image_url ? (
                <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                 <div className={cn(
                   "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg border",
                   prod.is_available 
                    ? "bg-emerald-500 text-white border-emerald-400" 
                    : "bg-rose-500 text-white border-rose-400"
                 )}>
                   {prod.is_available ? t.shop.status_instock : t.shop.status_outofstock}
                 </div>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{prod.name}</h3>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                {prod.price.toLocaleString()} <span className="text-xs">{t.common.currency}</span>
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">
                 <Box className="w-3.5 h-3.5" />
                 {t.shop.product_stock}: {prod.stock}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
              <button 
                onClick={() => openEdit(prod)}
                className="flex-1 py-3 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all transition-colors flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                {t.shop.btn_edit}
              </button>
              <button 
                onClick={() => deleteProduct(prod.id)}
                className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
           <div className="col-span-full py-20 text-center space-y-4">
              <ShoppingBag className="w-16 h-16 text-slate-200 dark:text-white/5 mx-auto" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">{t.shop.no_products}</p>
           </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-[#111318] rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10"
            >
              <div className="px-8 py-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                  {formData.id ? t.shop.btn_edit : t.shop.add_product}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">{t.shop.product_name}</p>
                  <input 
                    required type="text" 
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">{t.shop.product_price}</p>
                    <input 
                      required type="number" 
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">{t.shop.product_stock}</p>
                    <input 
                      required type="number" 
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">{t.shop.product_desc}</p>
                  <textarea 
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 min-h-[100px]"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">{t.shop.product_img}</p>
                  <input 
                    type="url" 
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="https://..."
                    value={formData.image_url}
                    onChange={e => setFormData({...formData, image_url: e.target.value})}
                  />
                </div>

                <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-6 rounded-2xl">
                   <button 
                     type="button" 
                     onClick={() => setFormData({...formData, is_available: !formData.is_available})}
                     className={cn(
                       "w-14 h-8 rounded-full transition-all relative",
                       formData.is_available ? "bg-emerald-500" : "bg-slate-300 dark:bg-white/10"
                     )}
                   >
                     <div className={cn("absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm", formData.is_available ? "left-7" : "left-1")} />
                   </button>
                   <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{t.shop.status_instock}</p>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                >
                  {loading ? '...' : t.bot.save_btn}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
