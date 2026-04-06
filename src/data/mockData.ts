export interface Product {
  id: string;
  name: string;
  image: string;
  batchQuantity: number;
  remainingQuantity: number;
  batchCost: number;
  sellingPrice: number;
  category: string;
  status: "hot" | "stable" | "dead";
}

export const mockProducts: Product[] = [
  { id: "1", name: "Wireless Earbuds Pro", image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop", batchQuantity: 100, remainingQuantity: 12, batchCost: 2000, sellingPrice: 49.99, category: "Electronics", status: "hot" },
  { id: "2", name: "Leather Notebook A5", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop", batchQuantity: 200, remainingQuantity: 80, batchCost: 600, sellingPrice: 12.99, category: "Stationery", status: "stable" },
  { id: "3", name: "Organic Coffee Blend", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop", batchQuantity: 150, remainingQuantity: 145, batchCost: 1500, sellingPrice: 18.99, category: "Food", status: "dead" },
  { id: "4", name: "Bamboo Water Bottle", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop", batchQuantity: 300, remainingQuantity: 50, batchCost: 1800, sellingPrice: 24.99, category: "Lifestyle", status: "hot" },
  { id: "5", name: "USB-C Hub 7-in-1", image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=400&fit=crop", batchQuantity: 80, remainingQuantity: 30, batchCost: 2400, sellingPrice: 59.99, category: "Electronics", status: "stable" },
  { id: "6", name: "Scented Candle Set", image: "https://images.unsplash.com/photo-1602607713284-69187d6e0572?w=400&h=400&fit=crop", batchQuantity: 120, remainingQuantity: 95, batchCost: 480, sellingPrice: 15.99, category: "Lifestyle", status: "dead" },
];

export function getProductMetrics(p: Product) {
  const soldQuantity = p.batchQuantity - p.remainingQuantity;
  const costPerUnit = p.batchCost / p.batchQuantity;
  const revenue = soldQuantity * p.sellingPrice;
  const costUsed = soldQuantity * costPerUnit;
  const profit = revenue - costUsed;
  const roi = costUsed > 0 ? (profit / costUsed) * 100 : 0;
  return { soldQuantity, costPerUnit, revenue, costUsed, profit, roi };
}

export function getDashboardMetrics() {
  let totalRevenue = 0, totalCost = 0, totalProfit = 0;
  mockProducts.forEach(p => {
    const m = getProductMetrics(p);
    totalRevenue += m.revenue;
    totalCost += m.costUsed;
    totalProfit += m.profit;
  });
  const roi = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
  return { totalRevenue, totalCost, totalProfit, roi };
}

export const revenueChartData = [
  { month: "Jan", revenue: 4200, profit: 1800 },
  { month: "Feb", revenue: 5100, profit: 2200 },
  { month: "Mar", revenue: 4800, profit: 1900 },
  { month: "Apr", revenue: 6200, profit: 2800 },
  { month: "May", revenue: 7100, profit: 3400 },
  { month: "Jun", revenue: 6800, profit: 3100 },
];
