"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UploadCloud, CheckCircle2, Trash2, Edit } from "lucide-react";

export default function AdminPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/products`);
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || (!file && !editingId)) return alert("Preencha todos os campos e anexe uma foto!");

    setLoading(true);
    setSuccess(false);

    try {
      if (editingId) {
        // Edit mode (only updates name and price for MVP)
        await axios.patch(`${apiUrl}/products/${editingId}`, {
          name,
          price: parseFloat(price)
        });
        alert("Produto atualizado!");
      } else {
        // Create mode
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        if (file) formData.append("file", file);

        await axios.post(`${apiUrl}/products`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
      
      setName("");
      setPrice("");
      setFile(null);
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar produto.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja apagar este produto?")) return;
    try {
      await axios.delete(`${apiUrl}/products/${id}`);
      fetchProducts();
    } catch (error) {
      alert("Erro ao deletar produto.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setPrice("");
    setFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 flex flex-col items-center gap-10">
      <Card className="w-full max-w-2xl shadow-xl bg-white border-gray-100">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {editingId ? "Editar Produto" : "Nova Postagem"}
          </CardTitle>
          <CardDescription>
            {editingId ? "Atualize as informações do produto." : "Adicione um novo produto ao catálogo instantaneamente."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!editingId && (
              <div className="space-y-2">
                <Label htmlFor="photo" className="cursor-pointer group block">
                  <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-300 ${file ? 'border-primary bg-primary/5 text-primary' : 'border-gray-300 text-gray-500 hover:border-primary hover:bg-primary/5 hover:text-primary'}`}>
                    {file ? <CheckCircle2 className="w-8 h-8 mb-2" /> : <UploadCloud className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />}
                    <span className="text-sm font-medium text-center">
                      {file ? file.name : "Clique para anexar foto do produto"}
                    </span>
                  </div>
                  <Input 
                    id="photo" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </Label>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">Nome do Produto</Label>
                <Input 
                  id="name" 
                  placeholder="Ex: Vestido Floral" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-50 border-gray-200 focus-visible:ring-primary h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-gray-700">Preço (R$)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  step="0.01" 
                  placeholder="Ex: 129.90" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bg-gray-50 border-gray-200 focus-visible:ring-primary h-12"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                type="submit" 
                className={`flex-1 h-12 text-lg rounded-xl transition-all duration-300 ${success ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-900 hover:bg-primary'}`} 
                disabled={loading || success}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : success ? "Salvo!" : "Salvar Produto"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" className="h-12 px-6 rounded-xl" onClick={cancelEdit}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de Produtos */}
      <Card className="w-full max-w-4xl shadow-md bg-white border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Meus Produtos</CardTitle>
          <CardDescription>Gerencie os produtos que estão na vitrine.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingProducts ? (
            <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500 py-6">Nenhum produto cadastrado ainda.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {products.map((product: any) => (
                <div key={product.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 group gap-4">
                  <div className="flex items-center gap-4">
                    <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100 border border-gray-100" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{product.name}</h4>
                      <p className="text-gray-500 font-medium">R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-gray-200 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-200 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
