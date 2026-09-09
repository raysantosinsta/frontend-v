"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface ProductCardProps {
  product: Product;
  whatsappNumber: string;
}

export function ProductCard({ product, whatsappNumber }: ProductCardProps) {
  const message = `Oi, vi o ${product.name} de R$ ${product.price} no seu catálogo, ainda tem na loja?\n\nVeja a imagem do produto: ${product.imageUrl}`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.div 
      whileHover={{ y: -10, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative bg-white/70 backdrop-blur-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] rounded-[2rem] overflow-hidden flex flex-col"
    >
      <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100 relative">
        {/* Overlay gradient on hover for a premium look */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        
        <div className="absolute top-5 right-5 z-20">
          <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-gray-900 shadow-xl border border-gray-100/50">
            Novo
          </span>
        </div>
      </div>
      
      <div className="p-7 flex flex-col grow justify-between bg-gradient-to-b from-transparent to-white/60">
        <div>
          <h3 className="font-bold text-xl text-gray-900 line-clamp-2 leading-tight mb-3 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-3xl font-black text-gray-900 tracking-tighter mb-8">
            R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <Button 
          className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-primary text-white shadow-xl hover:shadow-primary/30 transition-all duration-300 group/btn"
          onClick={() => window.open(whatsappLink, '_blank')}
        >
          <MessageCircle className="w-5 h-5 mr-3 group-hover/btn:scale-110 transition-transform" />
          <span className="font-bold text-base tracking-wide">Eu Quero!</span>
          <ArrowRight className="w-5 h-5 ml-auto opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
        </Button>
      </div>
    </motion.div>
  );
}
