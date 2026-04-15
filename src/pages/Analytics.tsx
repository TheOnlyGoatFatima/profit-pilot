import { BarChart3, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { mockProducts, getProductMetrics } from "@/data/mockData";

const Analytics = () => {
  const productsWithMetrics = mockProducts.map(p => ({ ...p, ...getProductMetrics(p) }));
  const sortedByProfit = [...productsWithMetrics].sort((a, b) => b.profit - a.profit);
  const sortedByROI = [...productsWithMetrics].sort((a, b) => b.roi - a.roi);
  const worst = [...productsWithMetrics].sort((a, b) => a.profit - b.profit).slice(0, 3);

  const barData = sortedByProfit.map(p => ({ name: p.name.split(" ").slice(0, 2).join(" "), profit: Number(p.profit.toFixed(2)), revenue: Number(p.revenue.toFixed(2)) }));

  const COLORS = ["hsl(217, 91%, 50%)", "hsl(199, 89%, 48%)", "hsl(152, 60%, 42%)", "hsl(210, 80%, 55%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)"];
  const pieData = productsWithMetrics.map(p => ({ name: p.name.split(" ").slice(0, 2).join(" "), value: Number(p.profit.toFixed(2)) }));

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Deep dive into your product performance.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profit by Product */}
        <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">Profit by Product</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 15%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(225, 10%, 45%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(225, 10%, 45%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(225, 15%, 90%)" }} />
              <Bar dataKey="profit" fill="hsl(234, 70%, 56%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Profit Distribution */}
        <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">Profit Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={3}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(225, 15%, 90%)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ROI Ranking */}
        <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">ROI Ranking</h3>
          <div className="space-y-3">
            {sortedByROI.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <p className="flex-1 text-sm text-foreground truncate">{p.name}</p>
                <span className="text-sm font-semibold text-primary">{p.roi.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">Top Products</h3>
          <div className="space-y-3">
            {sortedByProfit.slice(0, 4).map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                </div>
                <span className="text-sm font-semibold text-success">${p.profit.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Worst Performers */}
        <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">Underperformers</h3>
          <div className="space-y-3">
            {worst.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-destructive/5">
                <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.soldQuantity} sold of {p.batchQuantity}</p>
                </div>
                <span className="text-xs text-destructive font-medium">{p.roi.toFixed(0)}% ROI</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
