import { Package, MoreVertical, Edit, Copy, Archive, Trash2, TrendingUp, Flame, Minus, Skull } from "lucide-react";
import { mockProducts, getProductMetrics } from "@/data/mockData";
import { useState } from "react";

const statusConfig = {
  hot: { label: "Hot Seller", icon: Flame, className: "bg-destructive/10 text-destructive" },
  stable: { label: "Stable", icon: Minus, className: "bg-success/10 text-success" },
  dead: { label: "Dead Stock", icon: Skull, className: "bg-muted text-muted-foreground" },
};

const Products = () => {
  const [view, setView] = useState<"default" | "roi">("default");

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">{mockProducts.length} products across your inventory.</p>
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
          <button className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            + Add Product
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockProducts.map(product => {
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
                <button className="absolute top-3 right-3 w-8 h-8 rounded-lg glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-foreground">
                  <MoreVertical className="w-4 h-4" />
                </button>
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
                  {[
                    { icon: Edit, label: "Edit" },
                    { icon: Copy, label: "Duplicate" },
                    { icon: Archive, label: "Archive" },
                    { icon: Trash2, label: "Delete" },
                  ].map((action, i) => (
                    <button key={i} className="flex-1 p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" title={action.label}>
                      <action.icon className="w-3.5 h-3.5 mx-auto" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Products;
