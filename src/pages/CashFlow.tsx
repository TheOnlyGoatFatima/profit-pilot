import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Package } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getDashboardMetrics, mockProducts, getProductMetrics } from "@/data/mockData";

const CashFlow = () => {
  const metrics = getDashboardMetrics();
  const inventoryValue = mockProducts.reduce((sum, p) => {
    const costPerUnit = p.batchCost / p.batchQuantity;
    return sum + (p.remainingQuantity * costPerUnit);
  }, 0);

  const cashData = [
    { month: "Jan", spent: 2800, earned: 4200 },
    { month: "Feb", spent: 1200, earned: 5100 },
    { month: "Mar", spent: 3500, earned: 4800 },
    { month: "Apr", spent: 900, earned: 6200 },
    { month: "May", spent: 1500, earned: 7100 },
    { month: "Jun", spent: 2000, earned: 6800 },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cash Flow</h1>
        <p className="text-muted-foreground text-sm mt-1">Track where your money goes and where it comes from.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border/50 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight className="w-4 h-4 text-success" />
            <p className="text-xs text-muted-foreground">Money Earned</p>
          </div>
          <p className="text-2xl font-bold text-foreground">${metrics.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="p-5 rounded-2xl bg-card border border-border/50 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownRight className="w-4 h-4 text-destructive" />
            <p className="text-xs text-muted-foreground">Money Spent</p>
          </div>
          <p className="text-2xl font-bold text-foreground">${metrics.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="p-5 rounded-2xl bg-card border border-border/50 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-info" />
            <p className="text-xs text-muted-foreground">Inventory Value</p>
          </div>
          <p className="text-2xl font-bold text-foreground">${inventoryValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
        <h3 className="font-semibold text-foreground mb-4">Spent vs Earned</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={cashData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 15%, 90%)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(225, 10%, 45%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(225, 10%, 45%)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(225, 15%, 90%)" }} />
            <Bar dataKey="spent" fill="hsl(234, 50%, 68%)" radius={[6, 6, 0, 0]} name="Spent" />
            <Bar dataKey="earned" fill="hsl(234, 70%, 56%)" radius={[6, 6, 0, 0]} name="Earned" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CashFlow;
