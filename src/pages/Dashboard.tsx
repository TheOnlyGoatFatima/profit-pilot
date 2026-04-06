import { DollarSign, TrendingUp, TrendingDown, BarChart3, Package, AlertTriangle, Lightbulb, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getDashboardMetrics, mockProducts, getProductMetrics, revenueChartData } from "@/data/mockData";

const Dashboard = () => {
  const metrics = getDashboardMetrics();

  const topProducts = [...mockProducts]
    .map(p => ({ ...p, ...getProductMetrics(p) }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 3);

  const lowStock = mockProducts.filter(p => p.remainingQuantity < 20);

  const kpis = [
    { label: "Real Revenue", value: `$${metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, trend: "+12.5%", up: true, color: "text-success" },
    { label: "Real Cost", value: `$${metrics.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: BarChart3, trend: "+3.2%", up: true, color: "text-warning" },
    { label: "Net Profit", value: `$${metrics.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: TrendingUp, trend: "+18.7%", up: true, color: "text-primary" },
    { label: "ROI", value: `${metrics.roi.toFixed(1)}%`, icon: BarChart3, trend: "+5.1%", up: true, color: "text-info" },
  ];

  const insights = [
    { text: "Wireless Earbuds Pro is almost sold out — consider restocking soon.", type: "warning" },
    { text: "Organic Coffee Blend has barely moved. Try a discount or bundle it.", type: "alert" },
    { text: "Your best ROI product is Bamboo Water Bottle at 316%. Scale it up!", type: "success" },
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
          <div key={i} className="p-5 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-elevated transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl gradient-accent flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="w-4 h-4" />
              </div>
              <span className={`text-xs font-medium flex items-center gap-0.5 ${kpi.up ? "text-success" : "text-destructive"}`}>
                {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.trend}
              </span>
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
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueChartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(245, 58%, 51%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(245, 58%, 51%)" stopOpacity={0} />
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
              <Area type="monotone" dataKey="revenue" stroke="hsl(245, 58%, 51%)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
              <Area type="monotone" dataKey="profit" stroke="hsl(152, 60%, 42%)" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Smart Insights */}
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
        {/* Most Profitable */}
        <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">Most Profitable Products</h3>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.soldQuantity} sold</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-success">${p.profit.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">ROI {p.roi.toFixed(0)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock */}
        <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <h3 className="font-semibold text-foreground">Low Stock Alerts</h3>
          </div>
          {lowStock.length > 0 ? (
            <div className="space-y-3">
              {lowStock.map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-warning/5 border border-warning/10">
                  <Package className="w-5 h-5 text-warning" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">Only {p.remainingQuantity} left in stock</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">All products are well-stocked. 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
