import { DollarSign, TrendingUp, BarChart3, Package, AlertTriangle, Lightbulb, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import api, { Product } from "@/lib/api";

function calcProfit(p: Product) {
  const sold = p.batch_quantity - p.remaining_quantity;
  const costPerUnit = p.batch_quantity > 0 ? p.batch_cost / p.batch_quantity : 0;
  return sold * p.selling_price - sold * costPerUnit;
}

const Dashboard = () => {
  const { data: summary } = useQuery({ queryKey: ["analytics", "summary"], queryFn: api.analytics.summary });
  const { data: topProducts = [] } = useQuery({ queryKey: ["analytics", "top-products"], queryFn: api.analytics.topProducts });
  const { data: cashflow = [] } = useQuery({ queryKey: ["analytics", "cashflow"], queryFn: api.analytics.cashflow });
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: api.products.list });

  const chartData = cashflow.map(m => ({
    month: new Date(m.month + "-01").toLocaleString("default", { month: "short" }),
    revenue: m.earned,
    profit: m.net,
  }));

  const lowStock = products.filter(p => p.remaining_quantity > 0 && p.remaining_quantity < p.batch_quantity * 0.15);

  const insights = useMemo(() => {
    const result: { text: string; type: string }[] = [];
    const almostOut = products.find(p => p.remaining_quantity > 0 && p.remaining_quantity < p.batch_quantity * 0.1);
    if (almostOut) result.push({ text: `${almostOut.name} is almost sold out — consider restocking soon.`, type: "warning" });
    const dead = products.find(p => p.status === "dead");
    if (dead) result.push({ text: `${dead.name} has barely moved. Try a discount or bundle it.`, type: "alert" });
    if (topProducts.length > 0) {
      const best = topProducts[0];
      result.push({ text: `Your best product is ${best.name} with ${best.roi.toFixed(0)}% ROI. Scale it up!`, type: "success" });
    }
    if (result.length === 0) result.push({ text: "Add products and record sales to see smart insights here.", type: "info" });
    return result.slice(0, 3);
  }, [products, topProducts]);

  const kpis = [
    { label: "Total Revenue", value: `$${(summary?.total_revenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, color: "text-success" },
    { label: "Total Cost", value: `$${(summary?.total_cost ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: BarChart3, color: "text-warning" },
    { label: "Net Profit", value: `$${(summary?.net_profit ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: TrendingUp, color: "text-primary" },
    { label: "ROI", value: `${(summary?.roi ?? 0).toFixed(1)}%`, icon: ArrowUpRight, color: "text-info" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's how your business is doing today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="p-5 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-elevated transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl gradient-accent flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border/50 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">Revenue & Profit</h3>
          {chartData.length === 0 ? (
            <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
              Record transactions to see the chart.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(234, 70%, 56%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(234, 70%, 56%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(152, 60%, 42%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(152, 60%, 42%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 15%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(225, 10%, 45%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(225, 10%, 45%)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(225, 15%, 90%)", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(234, 70%, 56%)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                <Area type="monotone" dataKey="profit" stroke="hsl(152, 60%, 42%)" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4 text-warning" />
            <h3 className="font-semibold text-foreground">Smart Insights</h3>
          </div>
          <div className="space-y-3">
            {insights.map((ins, i) => (
              <div key={i} className="p-3 rounded-xl bg-secondary/50 text-sm text-foreground leading-relaxed">
                {ins.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Widgets */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">Most Profitable Products</h3>
          {topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Record some sales to see top products.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.slice(0, 3).map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.units_sold} sold</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-success">${p.profit.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">ROI {p.roi.toFixed(0)}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <h3 className="font-semibold text-foreground">Low Stock Alerts</h3>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-muted-foreground">All products are well-stocked.</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-warning/5 border border-warning/10">
                  <Package className="w-5 h-5 text-warning" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">Only {p.remaining_quantity} left in stock</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
