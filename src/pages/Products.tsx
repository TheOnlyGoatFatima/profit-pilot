import { Package, MoreVertical, Edit, Copy, Archive, Trash2, TrendingUp, Flame, Minus, Skull, Plus, X, Upload, Link } from "lucide-react";
import { Product, getProductMetrics } from "@/data/mockData";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const statusConfig = {
  hot: { label: "Hot Seller", icon: Flame, className: "bg-destructive/10 text-destructive" },
  stable: { label: "Stable", icon: Minus, className: "bg-success/10 text-success" },
  dead: { label: "Dead Stock", icon: Skull, className: "bg-muted text-muted-foreground" },
};

const defaultProduct: Omit<Product, "id"> = {
  name: "",
  image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  batchQuantity: 100,
  remainingQuantity: 100,
  batchCost: 0,
  sellingPrice: 0,
  category: "General",
  status: "stable",
};

const Products = () => {
  const [view, setView] = useState<"default" | "roi">("default");
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("profitlens_products");
    if (saved) return JSON.parse(saved);
    // Default mock data
    return [
      { id: "1", name: "Wireless Earbuds Pro", image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop", batchQuantity: 100, remainingQuantity: 12, batchCost: 2000, sellingPrice: 49.99, category: "Electronics", status: "hot" as const },
      { id: "2", name: "Leather Notebook A5", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop", batchQuantity: 200, remainingQuantity: 80, batchCost: 600, sellingPrice: 12.99, category: "Stationery", status: "stable" as const },
      { id: "3", name: "Organic Coffee Blend", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop", batchQuantity: 150, remainingQuantity: 145, batchCost: 1500, sellingPrice: 18.99, category: "Food", status: "dead" as const },
      { id: "4", name: "Bamboo Water Bottle", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop", batchQuantity: 300, remainingQuantity: 50, batchCost: 1800, sellingPrice: 24.99, category: "Lifestyle", status: "hot" as const },
      { id: "5", name: "USB-C Hub 7-in-1", image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=400&fit=crop", batchQuantity: 80, remainingQuantity: 30, batchCost: 2400, sellingPrice: 59.99, category: "Electronics", status: "stable" as const },
      { id: "6", name: "Scented Candle Set", image: "https://images.unsplash.com/photo-1602607713284-69187d6e0572?w=400&h=400&fit=crop", batchQuantity: 120, remainingQuantity: 95, batchCost: 480, sellingPrice: 15.99, category: "Lifestyle", status: "dead" as const },
    ];
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(defaultProduct);
  const { toast } = useToast();

  const save = (updated: Product[]) => {
    setProducts(updated);
    localStorage.setItem("profitlens_products", JSON.stringify(updated));
  };

  const openAdd = () => {
    setEditingProduct(null);
    setForm(defaultProduct);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({ name: p.name, image: p.image, batchQuantity: p.batchQuantity, remainingQuantity: p.remainingQuantity, batchCost: p.batchCost, sellingPrice: p.sellingPrice, category: p.category, status: p.status });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast({ title: "Name required", description: "Please enter a product name.", variant: "destructive" });
      return;
    }
    if (editingProduct) {
      save(products.map(p => p.id === editingProduct.id ? { ...p, ...form } : p));
      toast({ title: "Product updated", description: `${form.name} has been updated.` });
    } else {
      const newProduct: Product = { ...form, id: crypto.randomUUID() };
      save([...products, newProduct]);
      toast({ title: "Product added", description: `${form.name} has been added.` });
    }
    setDialogOpen(false);
  };

  const handleDuplicate = (p: Product) => {
    const dup: Product = { ...p, id: crypto.randomUUID(), name: `${p.name} (Copy)` };
    save([...products, dup]);
    toast({ title: "Duplicated", description: `${p.name} has been duplicated.` });
  };

  const handleArchive = (p: Product) => {
    save(products.map(pr => pr.id === p.id ? { ...pr, status: "dead" as const } : pr));
    toast({ title: "Archived", description: `${p.name} has been archived.` });
  };

  const confirmDelete = (p: Product) => {
    setDeletingProduct(p);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!deletingProduct) return;
    save(products.filter(p => p.id !== deletingProduct.id));
    toast({ title: "Deleted", description: `${deletingProduct.name} has been removed.` });
    setDeleteDialogOpen(false);
    setDeletingProduct(null);
  };

  const updateForm = (field: string, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">{products.length} products across your inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-secondary p-1">
            <button onClick={() => setView("default")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === "default" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}>
              All Details
            </button>
            <button onClick={() => setView("roi")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === "roi" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}>
              ROI Focus
            </button>
          </div>
          <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No products yet</h3>
          <p className="text-muted-foreground text-sm mt-1 mb-6">Let's fix that — add your first product to get started.</p>
          <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map(product => {
            const m = getProductMetrics(product);
            const status = statusConfig[product.status];
            const StatusIcon = status.icon;

            return (
              <div key={product.id} className="group rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden hover:-translate-y-0.5">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${status.className}`}>
                      <StatusIcon className="w-3 h-3" /> {status.label}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>

                  {view === "default" ? (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-xl bg-secondary/50">
                        <p className="text-xs text-muted-foreground">Stock</p>
                        <p className="text-sm font-semibold text-foreground">{product.remainingQuantity}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-secondary/50">
                        <p className="text-xs text-muted-foreground">Sold</p>
                        <p className="text-sm font-semibold text-foreground">{m.soldQuantity}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-success/5">
                        <p className="text-xs text-muted-foreground">Profit</p>
                        <p className="text-sm font-semibold text-success">${m.profit.toFixed(2)}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-primary/5">
                        <p className="text-xs text-muted-foreground">ROI</p>
                        <p className="text-sm font-semibold text-primary">{m.roi.toFixed(1)}%</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5">
                      <div>
                        <p className="text-xs text-muted-foreground">ROI</p>
                        <p className="text-xl font-bold text-primary">{m.roi.toFixed(1)}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Profit</p>
                        <p className="text-lg font-bold text-success">${m.profit.toFixed(2)}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-1 pt-1">
                    <button onClick={() => openEdit(product)} className="flex-1 p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" title="Edit">
                      <Edit className="w-3.5 h-3.5 mx-auto" />
                    </button>
                    <button onClick={() => handleDuplicate(product)} className="flex-1 p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" title="Duplicate">
                      <Copy className="w-3.5 h-3.5 mx-auto" />
                    </button>
                    <button onClick={() => handleArchive(product)} className="flex-1 p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" title="Archive">
                      <Archive className="w-3.5 h-3.5 mx-auto" />
                    </button>
                    <button onClick={() => confirmDelete(product)} className="flex-1 p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors" title="Delete">
                      <Trash2 className="w-3.5 h-3.5 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input placeholder="e.g. Wireless Earbuds" value={form.name} onChange={e => updateForm("name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input placeholder="https://..." value={form.image} onChange={e => updateForm("image", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Batch Quantity</Label>
                <Input type="number" min={1} value={form.batchQuantity} onChange={e => updateForm("batchQuantity", Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Remaining Qty</Label>
                <Input type="number" min={0} value={form.remainingQuantity} onChange={e => updateForm("remainingQuantity", Number(e.target.value))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Batch Cost ($)</Label>
                <Input type="number" min={0} step={0.01} value={form.batchCost} onChange={e => updateForm("batchCost", Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Selling Price ($)</Label>
                <Input type="number" min={0} step={0.01} value={form.sellingPrice} onChange={e => updateForm("sellingPrice", Number(e.target.value))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input placeholder="e.g. Electronics" value={form.category} onChange={e => updateForm("category", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => updateForm("status", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hot">Hot Seller</SelectItem>
                    <SelectItem value="stable">Stable</SelectItem>
                    <SelectItem value="dead">Dead Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="px-5 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              {editingProduct ? "Save Changes" : "Add Product"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong className="text-foreground">{deletingProduct?.name}</strong>? This action cannot be undone.
          </p>
          <DialogFooter>
            <button onClick={() => setDeleteDialogOpen(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">
              Cancel
            </button>
            <button onClick={handleDelete} className="px-5 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
