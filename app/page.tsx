"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, Sparkles, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511999999999";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await axios.get(`${apiUrl}/products`);
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [apiUrl]);

  return (
    <main className="min-h-screen pb-20">
      {/* Header Premium */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-white/50 border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gray-900 p-2.5 rounded-2xl shadow-md">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">
              Catálogo<span className="text-primary font-light">Flash</span>
            </h1>
          </div>
          <div className="hidden sm:block text-xs font-semibold uppercase tracking-wider text-gray-500 px-5 py-2.5 bg-white/80 rounded-full shadow-sm border border-gray-100">
            Atualizado Hoje
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20 space-y-6"
        >
          <div className="inline-flex items-center justify-center px-5 py-2 mb-4 rounded-full bg-gray-900 text-white text-xs font-bold tracking-widest uppercase shadow-xl shadow-gray-900/20">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-400" /> Coleção Exclusiva
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 drop-shadow-sm">
            Novidades da Semana
          </h2>
          <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto font-light leading-relaxed">
            As peças mais desejadas acabaram de chegar. Garanta a sua antes que esgote!
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-gray-900" />
          </div>
        ) : products.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white/60 rounded-[3rem] backdrop-blur-2xl border border-white shadow-2xl max-w-2xl mx-auto"
          >
            <div className="bg-gray-100/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4 tracking-tight">A vitrine está sendo preparada</h3>
            <p className="text-gray-500 text-xl font-light">Nenhuma novidade postada ainda. Volte em breve!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {products.map((product: any, index: number) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <ProductCard 
                  product={product} 
                  whatsappNumber={whatsappNumber} 
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
