"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, CreditCard, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Expense {
  id: string;
  category: string;
  amount: number;
  description?: string;
  date: string;
  createdAt: string;
}

interface ExpenseFormData {
  category: string;
  amount: number;
  description?: string;
  date: string;
}

const expenseCategories = [
  "Gaji Karyawan",
  "BBM",
  "Maintenance",
  "Listrik",
  "Air",
  "Asuransi",
  "Pajak",
  "Lainnya",
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState<ExpenseFormData>({
    category: "",
    amount: 0,
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockExpenses: Expense[] = [
      {
        id: "1",
        category: "Gaji Karyawan",
        amount: 15000000,
        description: "Gaji bulan Januari 2024",
        date: "2024-01-15",
        createdAt: "2024-01-15",
      },
      {
        id: "2",
        category: "BBM",
        amount: 2500000,
        description: "Solar untuk truk dan genset",
        date: "2024-01-10",
        createdAt: "2024-01-10",
      },
      {
        id: "3",
        category: "Maintenance",
        amount: 3500000,
        description: "Service mesin potong kayu",
        date: "2024-01-08",
        createdAt: "2024-01-08",
      },
      {
        id: "4",
        category: "Listrik",
        amount: 4500000,
        description: "Tagihan listrik bulan Januari",
        date: "2024-01-05",
        createdAt: "2024-01-05",
      },
    ];

    setTimeout(() => {
      setExpenses(mockExpenses);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = () => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      category: expenseForm.category,
      amount: expenseForm.amount,
      description: expenseForm.description,
      date: expenseForm.date,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setExpenses([...expenses, newExpense]);
    setIsAddDialogOpen(false);
    toast.success("Biaya berhasil ditambahkan");

    // Reset form
    setExpenseForm({
      category: "",
      amount: 0,
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
    toast.success("Biaya berhasil dihapus");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Calculate totals by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

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
          <h1 className="text-3xl font-bold text-gray-900">Biaya & Beban</h1>
          <p className="text-gray-600">Kelola pengeluaran operasional</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Biaya
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Biaya Operasional</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={expenseForm.category}
                  onValueChange={(value) =>
                    setExpenseForm({ ...expenseForm, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Jumlah</Label>
                <Input
                  id="amount"
                  type="number"
                  value={expenseForm.amount}
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="date">Tanggal</Label>
                <Input
                  id="date"
                  type="date"
                  value={expenseForm.date}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Input
                  id="description"
                  value={expenseForm.description || ""}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, description: e.target.value })
                  }
                  placeholder="Deskripsi biaya"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!expenseForm.category || expenseForm.amount <= 0}
                >
                  Simpan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Biaya Bulan Ini
            </CardTitle>
            <CreditCard className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </div>
          </CardContent>
        </Card>

        {Object.entries(categoryTotals).slice(0, 3).map(([category, total], index) => (
          <Card key={category}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {category}
              </CardTitle>
              <CreditCard className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(total)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Rincian Biaya per Kategori
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(categoryTotals)
                .sort(([, a], [, b]) => b - a)
                .map(([category, total]) => {
                  const percentage = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{category}</span>
                          <span className="text-sm text-gray-600">{formatCurrency(total)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="ml-4 text-sm text-gray-500 w-12 text-right">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Biaya Terkini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{expense.category}</p>
                      <p className="text-xs text-gray-500">{formatDate(expense.date)}</p>
                    </div>
                    <span className="text-sm font-semibold text-red-600">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Daftar Biaya Operasional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{formatDate(expense.date)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{expense.category}</Badge>
                      </TableCell>
                      <TableCell>{expense.description || "-"}</TableCell>
                      <TableCell className="font-semibold text-red-600">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(expense.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}