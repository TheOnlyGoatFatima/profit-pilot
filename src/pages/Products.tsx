import { Edit, Archive, Trash2, Flame, Minus, Skull, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import api, { Product, ProductPayload, TransactionPayload } from "@/lib/api";

const statusConfig = {
  hot: { label: "Hot Seller", icon: Flame, className: "bg-destructive/10 text-destructive" },
  stable: { label: "Stable", icon: Minus, className: "bg-success/10 text-success" },
  dead: { label: "Dead Stock", icon: Skull, className: "bg-muted text-muted-foreground" },
};

type ProductForm = {
  name: string;
  image: string;
  batch_quantity: number;
  remaining_quantity: number;
  batch_cost: number;
  selling_price: number;
  category: string;
  status: "hot" | "stable" | "dead";
};

const defaultForm: ProductForm = {
  name: "",
  image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  batch_quantity: 100,
  remaining_quantity: 100,
  batch_cost: 0,
  selling_price: 0,
  category: "General",
  status: "stable",
};

function calcMetrics(p: Product) {
  const soldQuantity = p.batch_quantity - p.remaining_quantity;
  const costPerUnit = p.batch_quantity > 0 ? p.batch_cost / p.batch_quantity : 0;
  const revenue = soldQuantity * p.selling_price;
  const costUsed = soldQuantity * costPerUnit;
  const profit = revenue - costUsed;
  const roi = costUsed > 0 ? (profit / costUsed) * 100 : 0;
  return { soldQuantity, profit, roi };
}

const Products = () => {
  const [view, setView] = useState<"default" | "roi">("default");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(defaultForm);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [txnDialogOpen, setTxnDialogOpen] = useState(false);
  const [txnProduct, setTxnProduct] = useState<Product | null>(null);
  const [txnType, setTxnType] = useState<"sale" | "restock">("sale");
  const [txnQty, setTxnQty] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: api.products.list,
  });

  const createMutation = useMutation({
    mutationFn: (data: ProductPayload) => api.products.create(data),
    onSuccess: (p) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDialogOpen(false);
      toast({ title: "Product added", description: `${p.name} has been added.` });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductPayload> }) =>
      api.products.update(id, data),
    onSuccess: (p) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDialogOpen(false);
      toast({ title: "Product updated", description: `${p.name} has been updated.` });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.products.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeleteDialogOpen(false);
      toast({ title: "Deleted", description: `${deletingProduct?.name} has been removed.` });
      setDeletingProduct(null);
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const transactionMutation = useMutation({
    mutationFn: (data: TransactionPayload) => api.transactions.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      setTxnDialogOpen(false);
      setTxnQty(1);
      toast({ title: txnType === "sale" ? "Sale recorded" : "Restock recorded" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const openAdd = () => {
    setEditingProduct(null);
    setForm(defaultForm);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      image: p.image ?? defaultForm.image,
      batch_quantity: p.batch_quantity,
      remaining_quantity: p.remaining_quantity,
      batch_cost: p.batch_cost,
      selling_price: p.selling_price,
      category: p.category ?? "",
      status: p.status,
    });
    setDialogOpen(true);
  };

  const openTransaction = (p: Product) => {
    setTxnProduct(p);
    setTxnType("sale");
    setTxnQty(1);
    setTxnDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast({ title: "Name required", description: "Please enter a product name.", variant: "destructive" });
      return;
    }
    const payload: ProductPayload = {
      name: form.name,
      image: form.image || undefined,
      batch_quantity: Number(form.batch_quantity),
      remaining_quantity: Number(form.remaining_quantity),
      batch_cost: Number(form.batch_cost),
      selling_price: Number(form.selling_price),
      category: form.category || undefined,
      status: form.status,
    };
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleArchive = (p: Product) => {
    updateMutation.mutate({ id: p.id, data: { status: "dead" } });
    toast({ title: "Archived", description: `${p.name} has been archived.` });
  };

  const handleTransaction = () => {
    if (!txnProduct || txnQty <= 0) return;
    transactionMutation.mutate({ product_id: txnProduct.id, quantity: txnQty, type: txnType });
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

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

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border/50 shadow-card animate-pulse">
              <div className="aspect-[4/3] bg-secondary rounded-t-2xl" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-secondary rounded w-2/3" />
                <div className="h-3 bg-secondary rounded w-1/3" />
                <div className="grid grid-cols-2 gap-2">
                  {[...Array(4)].map((_, j) => <div key={j} className="h-12 bg-secondary rounded-xl" />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No products yet</h3>
          <p className="text-muted-foreground text-sm mt-1 mb-6">Add your first product to get started.</p>
          <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map(product => {
            const m = calcMetrics(product);
            const status = statusConfig[product.status];
            const StatusIcon = status.icon;

            return (
              <div key={product.id} className="group rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden hover:-translate-y-0.5">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={product.image ?? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop"} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                        <p className="text-sm font-semibold text-foreground">{product.remaining_quantity}</p>
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
                    <button onClick={() => openTransaction(product)} className="flex-1 p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" title="Record Sale / Restock">
                      <ShoppingCart className="w-3.5 h-3.5 mx-auto" />
                    </button>
                    <button onClick={() => handleArchive(product)} className="flex-1 p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" title="Archive">
                      <Archive className="w-3.5 h-3.5 mx-auto" />
                    </button>
                    <button onClick={() => { setDeletingProduct(product); setDeleteDialogOpen(true); }} className="flex-1 p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors" title="Delete">
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
              <Input placeholder="e.g. Wireless Earbuds" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input placeholder="https://..." value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Batch Quantity</Label>
                <Input type="number" min={1} value={form.batch_quantity} onChange={e => setForm(f => ({ ...f, batch_quantity: Number(e.target.value) }))} />
              </div>
              <div className="space-y-2">
                <Label>Remaining Qty</Label>
                <Input type="number" min={0} value={form.remaining_quantity} onChange={e => setForm(f => ({ ...f, remaining_quantity: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Batch Cost ($)</Label>
                <Input type="number" min={0} step={0.01} value={form.batch_cost} onChange={e => setForm(f => ({ ...f, batch_cost: Number(e.target.value) }))} />
              </div>
              <div className="space-y-2">
                <Label>Selling Price ($)</Label>
                <Input type="number" min={0} step={0.01} value={form.selling_price} onChange={e => setForm(f => ({ ...f, selling_price: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input placeholder="e.g. Electronics" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as ProductForm["status"] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
            <button onClick={handleSave} disabled={isSaving} className="px-5 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
              {isSaving ? "Saving…" : editingProduct ? "Save Changes" : "Add Product"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
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
            <button onClick={() => deletingProduct && deleteMutation.mutate(deletingProduct.id)} disabled={deleteMutation.isPending} className="px-5 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction Dialog */}
      <Dialog open={txnDialogOpen} onOpenChange={setTxnDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Record Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-1">
            <p className="text-sm text-muted-foreground">
              Product: <strong className="text-foreground">{txnProduct?.name}</strong>
              {txnType === "sale" && (
                <span className="ml-2 text-xs">({txnProduct?.remaining_quantity} in stock)</span>
              )}
            </p>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={txnType} onValueChange={v => setTxnType(v as "sale" | "restock")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Sale (reduce stock)</SelectItem>
                  <SelectItem value="restock">Restock (add stock)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                min={1}
                max={txnType === "sale" ? txnProduct?.remaining_quantity : undefined}
                value={txnQty}
                onChange={e => setTxnQty(Number(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setTxnDialogOpen(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">
              Cancel
            </button>
            <button onClick={handleTransaction} disabled={transactionMutation.isPending || txnQty <= 0} className="px-5 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
              {transactionMutation.isPending ? "Recording…" : "Confirm"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
