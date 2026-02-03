"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trees, Package, DollarSign, TrendingUp, Users, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

interface DashboardStats {
  totalStockVolume: number;
  totalAssetValue: number;
  totalSupplierDebt: number;
  totalCustomerReceivable: number;
  totalInventory: number;
  totalSales: number;
  totalContacts: number;
  stockByType: Array<{
    woodType: string;
    volume: number;
    value: number;
    count: number;
  }>;
  recentActivity: {
    inventory: Array<{ type: string; description: string; timestamp: string }>;
    sales: Array<{ type: string; description: string; timestamp: string }>;
    expenses: Array<{ type: string; description: string; timestamp: string }>;
  };
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStockVolume: 0,
    totalAssetValue: 0,
    totalSupplierDebt: 0,
    totalCustomerReceivable: 0,
    totalInventory: 0,
    totalSales: 0,
    totalContacts: 0,
    stockByType: [],
    recentActivity: {
      inventory: [],
      sales: [],
      expenses: [],
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getDashboardStats();
        
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError(response.error || "Failed to fetch dashboard data");
        }
      } catch (err) {
        setError("Failed to connect to server");
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatVolume = (volume: number) => {
    return `${volume.toFixed(2)} m³`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} hari yang lalu`;
    } else if (diffHours > 0) {
      return `${diffHours} jam yang lalu`;
    } else {
      return "Baru saja";
    }
  };

  // Combine and sort recent activity
  const allRecentActivity = [
    ...stats.recentActivity.inventory,
    ...stats.recentActivity.sales,
    ...stats.recentActivity.expenses,
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Dashboard</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Volume Stok",
      value: formatVolume(stats.totalStockVolume),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Nilai Aset Kayu",
      value: formatCurrency(stats.totalAssetValue),
      icon: Trees,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Hutang Supplier",
      value: formatCurrency(stats.totalSupplierDebt),
      icon: DollarSign,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Total Piutang Pelanggan",
      value: formatCurrency(stats.totalCustomerReceivable),
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const quickStats = [
    {
      title: "Total Inventory",
      value: stats.totalInventory,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Total Penjualan",
      value: stats.totalSales,
      icon: ShoppingCart,
      color: "text-green-600",
    },
    {
      title: "Total Kontak",
      value: stats.totalContacts,
      icon: Users,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Ringkasan bisnis pengolahan kayu Anda</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terkini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allRecentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "inventory"
                        ? "bg-blue-500"
                        : activity.type === "sales"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stok per Jenis Kayu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.stockByType.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.woodType}</span>
                  <span className="text-sm text-gray-600">{formatVolume(item.volume)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}