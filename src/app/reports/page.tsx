"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Download, FileText, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface ProfitLossData {
  period: string;
  revenue: number;
  cogs: number;
  grossProfit: number;
  expenses: number;
  netProfit: number;
}

interface CashFlowData {
  period: string;
  operatingCash: number;
  investingCash: number;
  financingCash: number;
  netCash: number;
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState("2024");

  // Mock data for demonstration
  const [profitLossData, setProfitLossData] = useState<ProfitLossData[]>([]);
  const [cashFlowData, setCashFlowData] = useState<CashFlowData[]>([]);

  useEffect(() => {
    const mockProfitLoss: ProfitLossData[] = [
      {
        period: "Januari 2024",
        revenue: 500000000,
        cogs: 300000000,
        grossProfit: 200000000,
        expenses: 75000000,
        netProfit: 125000000,
      },
      {
        period: "Februari 2024",
        revenue: 650000000,
        cogs: 390000000,
        grossProfit: 260000000,
        expenses: 85000000,
        netProfit: 175000000,
      },
      {
        period: "Maret 2024",
        revenue: 720000000,
        cogs: 432000000,
        grossProfit: 288000000,
        expenses: 90000000,
        netProfit: 198000000,
      },
    ];

    const mockCashFlow: CashFlowData[] = [
      {
        period: "Januari 2024",
        operatingCash: 150000000,
        investingCash: -50000000,
        financingCash: 0,
        netCash: 100000000,
      },
      {
        period: "Februari 2024",
        operatingCash: 200000000,
        investingCash: -75000000,
        financingCash: 0,
        netCash: 125000000,
      },
      {
        period: "Maret 2024",
        operatingCash: 225000000,
        investingCash: -100000000,
        financingCash: 0,
        netCash: 125000000,
      },
    ];

    setTimeout(() => {
      setProfitLossData(mockProfitLoss);
      setCashFlowData(mockCashFlow);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleExport = (type: "excel" | "pdf", reportType: "profitloss" | "cashflow") => {
    toast.success(`Mengekspor laporan ${reportType === "profitloss" ? "Laba Rugi" : "Arus Kas"} ke ${type.toUpperCase()}`);
    // In a real app, this would trigger actual export functionality
  };

  // Calculate totals
  const totalRevenue = profitLossData.reduce((sum, item) => sum + item.revenue, 0);
  const totalCogs = profitLossData.reduce((sum, item) => sum + item.cogs, 0);
  const totalGrossProfit = profitLossData.reduce((sum, item) => sum + item.grossProfit, 0);
  const totalExpenses = profitLossData.reduce((sum, item) => sum + item.expenses, 0);
  const totalNetProfit = profitLossData.reduce((sum, item) => sum + item.netProfit, 0);

  const totalOperatingCash = cashFlowData.reduce((sum, item) => sum + item.operatingCash, 0);
  const totalInvestingCash = cashFlowData.reduce((sum, item) => sum + item.investingCash, 0);
  const totalNetCash = cashFlowData.reduce((sum, item) => sum + item.netCash, 0);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laporan Keuangan</h1>
          <p className="text-gray-600">Laporan Laba Rugi dan Arus Kas</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Bulanan</SelectItem>
              <SelectItem value="quarterly">Triwulanan</SelectItem>
              <SelectItem value="yearly">Tahunan</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Pendapatan
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Laba Kotor
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalGrossProfit)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Biaya
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Laba Bersih
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(totalNetProfit)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports */}
      <Tabs defaultValue="profitloss" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profitloss">Laba Rugi</TabsTrigger>
          <TabsTrigger value="cashflow">Arus Kas</TabsTrigger>
        </TabsList>

        <TabsContent value="profitloss" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Laporan Laba Rugi
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("excel", "profitloss")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Excel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("pdf", "profitloss")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Periode</TableHead>
                      <TableHead className="text-right">Pendapatan</TableHead>
                      <TableHead className="text-right">HPP</TableHead>
                      <TableHead className="text-right">Laba Kotor</TableHead>
                      <TableHead className="text-right">Biaya Operasional</TableHead>
                      <TableHead className="text-right">Laba Bersih</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profitLossData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.period}</TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(item.revenue)}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {formatCurrency(item.cogs)}
                        </TableCell>
                        <TableCell className="text-right text-blue-600">
                          {formatCurrency(item.grossProfit)}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {formatCurrency(item.expenses)}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-purple-600">
                          {formatCurrency(item.netProfit)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold bg-gray-50">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency(totalRevenue)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(totalCogs)}
                      </TableCell>
                      <TableCell className="text-right text-blue-600">
                        {formatCurrency(totalGrossProfit)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(totalExpenses)}
                      </TableCell>
                      <TableCell className="text-right text-purple-600">
                        {formatCurrency(totalNetProfit)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Laporan Arus Kas
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("excel", "cashflow")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Excel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("pdf", "cashflow")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Periode</TableHead>
                      <TableHead className="text-right">Arus Kas Operasional</TableHead>
                      <TableHead className="text-right">Arus Kas Investasi</TableHead>
                      <TableHead className="text-right">Arus Kas Pendanaan</TableHead>
                      <TableHead className="text-right">Netto Arus Kas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cashFlowData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.period}</TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(item.operatingCash)}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {formatCurrency(item.investingCash)}
                        </TableCell>
                        <TableCell className="text-right text-blue-600">
                          {formatCurrency(item.financingCash)}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-purple-600">
                          {formatCurrency(item.netCash)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold bg-gray-50">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency(totalOperatingCash)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(totalInvestingCash)}
                      </TableCell>
                      <TableCell className="text-right text-blue-600">-</TableCell>
                      <TableCell className="text-right text-purple-600">
                        {formatCurrency(totalNetCash)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Metode Akuntansi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Accrual Basis</span>
                <Badge variant="default">Aktif</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cash Basis</span>
                <Badge variant="outline">Tersedia</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Laporan saat ini menggunakan metode Accrual Basis. Anda dapat beralih ke Cash Basis di pengaturan.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Ekspor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>• Format Excel: Untuk analisis data lebih lanjut</p>
              <p>• Format PDF: Untuk pencetakan dan dokumentasi</p>
              <p>• Data akan diekspor sesuai periode yang dipilih</p>
              <p>• Laporan dapat disesuaikan di menu Pengaturan</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}