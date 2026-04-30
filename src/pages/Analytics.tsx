import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import api, { Product } from "@/lib/api";

const COLORS = ["hsl(234, 70%, 56%)", "hsl(234, 50%, 68%)", "hsl(220, 80%, 55%)", "hsl(234, 35%, 78%)", "hsl(220, 60%, 45%)", "hsl(234, 25%, 50%)"];

function calcMetrics(p: Product) {
  const sold = p.batch_quantity - p.remaining_quantity;
  const costPerUnit = p.batch_quantity > 0 ? p.batch_cost / p.batch_quantity : 0;
  const revenue = sold * p.selling_price;
  const cost = sold * costPerUnit;
  const profit = revenue - cost;
  const roi = cost > 0 ? (profit / cost) * 100 : 0;
  return { sold, profit, roi };
}

const Analytics = () => {
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: api.products.list });
  const { data: topProducts = [] } = useQuery({ queryKey: ["analytics", "top-products"], queryFn: api.analytics.topProducts });
  const { data: underperformers = [] } = useQuery({ queryKey: ["analytics", "underperformers"], queryFn: api.analytics.underperformers });

  const barData = topProducts.map(p => ({
    name: p.name.split(" ").slice(0, 2).join(" "),
    profit: Number(p.profit.toFixed(2)),
    revenue: Number(p.revenue.toFixed(2)),
  }));

  const pieData = topProducts.map(p => ({
    name: p.name.split(" ").slice(0, 2).join(" "),
    value: Number(p.profit.toFixed(2)),
  }));

  const roiRanking = [...products]
    .map(p => ({ ...p, ...calcMetrics(p) }))
    .sort((a, b) => b.roi - a.roi);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Deep dive into your product performance.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">Profit by Product</h3>
          {barData.length === 0 ? (
            <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">No sales data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 15%, 90%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(225, 10%, 45%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(225, 10%, 45%)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(225, 15%, 90%)" }} />
                <Bar dataKey="profit" fill="hsl(234, 70%, 56%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">Profit Distribution</h3>
          {pieData.length === 0 ? (
            <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">No sales data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(225, 15%, 90%)" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">ROI Ranking</h3>
          {roiRanking.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products yet.</p>
          ) : (
            <div className="space-y-3">
              {roiRanking.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <p className="flex-1 text-sm text-foreground truncate">{p.name}</p>
                  <span className="text-sm font-semibold text-primary">{p.roi.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">Top Products</h3>
          {topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Record some sales to see top products.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.slice(0, 4).map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-success/10 text-success text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <p className="flex-1 text-sm font-medium text-foreground truncate">{p.name}</p>
                  <span className="text-sm font-semibold text-success">${p.profit.toFixed(0)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">Underperformers</h3>
          {underperformers.length === 0 ? (
            <p className="text-sm text-muted-foreground">Record some sales to see underperformers.</p>
          ) : (
            <div className="space-y-3">
              {underperformers.map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-destructive/5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.units_sold} sold</p>
                  </div>
                  <span className="text-xs text-destructive font-medium">{p.roi.toFixed(0)}% ROI</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
