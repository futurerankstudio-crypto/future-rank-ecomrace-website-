import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { BarChart3, Download, TrendingUp, ShoppingBag, CheckCircle, PieChart, Layers } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const { formatPrice } = useStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleExportCSV = async () => {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) return;
      const { orders } = await res.json();

      let csv = 'Order ID,Date,Customer,Email,Phone,City,Items Count,Total PKR,Payment,Status\n';
      orders.forEach((o: any) => {
        csv += `"${o.id}","${o.createdAt}","${o.customerName}","${o.customerEmail}","${o.customerPhone}","${o.city}",${o.items.length},${o.total},"${o.paymentMethod}","${o.status}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `novacart_orders_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // ignore
    }
  };

  const totalSales = data?.totalSales || 0;
  const ordersCount = data?.ordersCount || 0;
  const topProducts = data?.topProducts || [];
  const statusCounts = data?.statusCounts || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#E7E2DA] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#8A7D6B] font-semibold">
            <BarChart3 className="w-4 h-4 text-[#B89758]" />
            <span>Store Telemetry & Reporting</span>
          </div>
          <h2 className="font-serif text-2xl font-medium text-[#1C1C1F] mt-0.5">
            Business Analytics
          </h2>
          <p className="text-xs text-[#7A7875]">
            Strictly computed from actual stored orders and product records. No fabricated vanity metrics.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-[#1C1C1F] text-white text-xs font-medium rounded-lg hover:bg-[#2D2D32] transition-colors flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Orders CSV</span>
        </button>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E7E2DA] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#7A7875]">
            <span>Net Recorded Revenue</span>
            <TrendingUp className="w-4 h-4 text-[#B89758]" />
          </div>
          <p className="font-serif text-3xl font-bold text-[#1C1C1F] mt-2 font-mono tabular-nums">
            {formatPrice(totalSales)}
          </p>
          <span className="text-[11px] text-[#7A7875] mt-1 block">Excludes cancelled transactions</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E7E2DA] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#7A7875]">
            <span>Total Completed Transactions</span>
            <ShoppingBag className="w-4 h-4 text-[#1C1C1F]" />
          </div>
          <p className="font-serif text-3xl font-bold text-[#1C1C1F] mt-2 font-mono tabular-nums">
            {ordersCount}
          </p>
          <span className="text-[11px] text-[#7A7875] mt-1 block">Stored in local database</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E7E2DA] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#7A7875]">
            <span>Average Order Value</span>
            <span className="font-mono text-xs text-[#B89758] font-bold">AOV</span>
          </div>
          <p className="font-serif text-3xl font-bold text-[#1C1C1F] mt-2 font-mono tabular-nums">
            {ordersCount > 0 ? formatPrice(Math.round(totalSales / ordersCount)) : formatPrice(0)}
          </p>
          <span className="text-[11px] text-[#7A7875] mt-1 block">Across active categories</span>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Top Performing Garments */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E7E2DA] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F2EEE9] pb-3">
            <h3 className="font-serif text-lg font-medium text-[#1C1C1F]">Top Designs by Recorded Sales</h3>
            <span className="text-xs text-[#7A7875]">Ranked by Revenue</span>
          </div>

          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="py-6 text-center text-xs text-[#7A7875]">No order sales data yet.</p>
            ) : (
              topProducts.map((item: any, idx: number) => {
                const maxRevenue = topProducts[0]?.revenue || 1;
                const percent = Math.min(100, Math.round((item.revenue / maxRevenue) * 100));

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#1C1C1F]">{item.name}</span>
                      <span className="font-mono tabular-nums font-semibold text-[#1C1C1F]">
                        {formatPrice(item.revenue)} ({item.unitsSold} units)
                      </span>
                    </div>
                    <div className="w-full bg-[#FAF8F5] h-2 rounded-full overflow-hidden border border-[#E7E2DA]">
                      <div
                        className="bg-[#B89758] h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E7E2DA] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F2EEE9] pb-3">
            <h3 className="font-serif text-lg font-medium text-[#1C1C1F]">Fulfillment Pipeline</h3>
            <PieChart className="w-4 h-4 text-[#7A7875]" />
          </div>

          <div className="space-y-2.5 text-xs">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA]">
                <span className="capitalize font-medium text-[#1C1C1F]">{status}</span>
                <span className="font-mono font-bold tabular-nums text-[#1C1C1F] bg-white px-2.5 py-0.5 rounded border border-[#DDD7CE]">
                  {count as number}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#F2EEE9] text-[11px] text-[#7A7875] leading-relaxed">
            Order lifecycle flows from pending verification &rarr; warehouse picking &rarr; express courier dispatch &rarr; delivery confirmation.
          </div>
        </div>
      </div>
    </div>
  );
};
