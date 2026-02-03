"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PermissionGuard } from "@/components/permission-guard";
import { Plus, Edit, Trash2, Calculator, Package } from "lucide-react";
import { toast } from "sonner";

interface WoodLog {
  id: string;
  invoiceNumber: string;
  woodType: string;
  length: number;
  d1: number;
  d2: number;
  d3: number;
  d4: number;
  trim: number;
  gr: number;
  avgDiameter: number;
  effectiveLength: number;
  grossVolume: number;
  grVolume: number;
  netVolume: number;
  unitPrice: number;
  totalValue: number;
  status: string;
  contactName: string;
  createdAt: string;
}

interface BatchFormData {
  invoiceNumber: string;
  contactId: string;
  woodType: string;
  totalInvoicePrice: number;
  logs: Array<{
    length: number;
    d1: number;
    d2: number;
    d3: number;
    d4: number;
    trim: number;
    gr: number;
  }>;
}

const woodTypes = ["Jati", "Mahoni", "Meranti", "Kamper", "Sengon", "Akasia"];

// Wood calculation functions
const calculateAvgDiameter = (d1: number, d2: number, d3: number, d4: number) => {
  return (d1 + d2 + d3 + d4) / 4;
};

const calculateEffectiveLength = (length: number, trim: number) => {
  return length - trim;
};

const calculateGrossVolume = (avgDiameter: number, effectiveLength: number) => {
  return (0.7854 * Math.pow(avgDiameter, 2) * effectiveLength) / 10000;
};

const calculateGRVolume = (gr: number, originalLength: number) => {
  if (gr === 0) return 0;
  return (0.7854 * Math.pow(gr, 2) * originalLength) / 10000;
};

const calculateNetVolume = (grossVolume: number, grVolume: number) => {
  return grossVolume - grVolume;
};

export default function InventoryPage() {
  const [logs, setLogs] = useState<WoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [batchForm, setBatchForm] = useState<BatchFormData>({
    invoiceNumber: "",
    contactId: "",
    woodType: "",
    totalInvoicePrice: 0,
    logs: [{ length: 0, d1: 0, d2: 0, d3: 0, d4: 0, trim: 0, gr: 0 }],
  });

  const [currentLogIndex, setCurrentLogIndex] = useState(0);

  // Mock data for demonstration
  useEffect(() => {
    const mockLogs: WoodLog[] = [
      {
        id: "1",
        invoiceNumber: "NOTA-001",
        woodType: "Jati",
        length: 400,
        d1: 45,
        d2: 43,
        d3: 44,
        d4: 42,
        trim: 10,
        gr: 0,
        avgDiameter: 43.5,
        effectiveLength: 390,
        grossVolume: 0.581,
        grVolume: 0,
        netVolume: 0.581,
        unitPrice: 2500000,
        totalValue: 1452500,
        status: "available",
        contactName: "PT. Kayu Jaya Abadi",
        createdAt: "2024-01-15",
      },
      {
        id: "2",
        invoiceNumber: "NOTA-001",
        woodType: "Jati",
        length: 380,
        d1: 42,
        d2: 41,
        d3: 43,
        d4: 40,
        trim: 8,
        gr: 5,
        avgDiameter: 41.5,
        effectiveLength: 372,
        grossVolume: 0.503,
        grVolume: 0.008,
        netVolume: 0.495,
        unitPrice: 2500000,
        totalValue: 1237500,
        status: "available",
        contactName: "PT. Kayu Jaya Abadi",
        createdAt: "2024-01-15",
      },
    ];

    setTimeout(() => {
      setLogs(mockLogs);
      setLoading(false);
    }, 1000);
  }, []);

  // Update preview when current log values change
  const previewVolume = useMemo(() => {
    if (batchForm.logs[currentLogIndex]) {
      const log = batchForm.logs[currentLogIndex];
      const avgDiameter = calculateAvgDiameter(log.d1, log.d2, log.d3, log.d4);
      const effectiveLength = calculateEffectiveLength(log.length, log.trim);
      const grossVolume = calculateGrossVolume(avgDiameter, effectiveLength);
      const grVolume = calculateGRVolume(log.gr, log.length);
      const netVolume = calculateNetVolume(grossVolume, grVolume);

      return {
        avgDiameter,
        effectiveLength,
        grossVolume,
        grVolume,
        netVolume,
      };
    }
    return {
      avgDiameter: 0,
      effectiveLength: 0,
      grossVolume: 0,
      grVolume: 0,
      netVolume: 0,
    };
  }, [batchForm.logs, currentLogIndex]);

  const updateCurrentLog = (field: string, value: number) => {
    const updatedLogs = [...batchForm.logs];
    updatedLogs[currentLogIndex] = {
      ...updatedLogs[currentLogIndex],
      [field]: value,
    };
    setBatchForm({ ...batchForm, logs: updatedLogs });
  };

  const addLogToBatch = () => {
    setBatchForm({
      ...batchForm,
      logs: [
        ...batchForm.logs,
        { length: 0, d1: 0, d2: 0, d3: 0, d4: 0, trim: 0, gr: 0 },
      ],
    });
    setCurrentLogIndex(batchForm.logs.length);
  };

  const removeLogFromBatch = (index: number) => {
    if (batchForm.logs.length > 1) {
      const updatedLogs = batchForm.logs.filter((_, i) => i !== index);
      setBatchForm({ ...batchForm, logs: updatedLogs });
      if (currentLogIndex >= updatedLogs.length) {
        setCurrentLogIndex(updatedLogs.length - 1);
      }
    }
  };

  const selectLog = (index: number) => {
    setCurrentLogIndex(index);
  };

  const handleBatchSubmit = () => {
    // Calculate total volume for all logs
    const totalVolume = batchForm.logs.reduce((sum, log) => {
      const avgDiameter = calculateAvgDiameter(log.d1, log.d2, log.d3, log.d4);
      const effectiveLength = calculateEffectiveLength(log.length, log.trim);
      const grossVolume = calculateGrossVolume(avgDiameter, effectiveLength);
      const grVolume = calculateGRVolume(log.gr, log.length);
      const netVolume = calculateNetVolume(grossVolume, grVolume);
      return sum + netVolume;
    }, 0);

    // Calculate unit price
    const unitPrice = totalVolume > 0 ? batchForm.totalInvoicePrice / totalVolume : 0;

    // Create new logs with calculated values
    const newLogs: WoodLog[] = batchForm.logs.map((log, index) => {
      const avgDiameter = calculateAvgDiameter(log.d1, log.d2, log.d3, log.d4);
      const effectiveLength = calculateEffectiveLength(log.length, log.trim);
      const grossVolume = calculateGrossVolume(avgDiameter, effectiveLength);
      const grVolume = calculateGRVolume(log.gr, log.length);
      const netVolume = calculateNetVolume(grossVolume, grVolume);

      return {
        id: Date.now().toString() + index,
        invoiceNumber: batchForm.invoiceNumber,
        woodType: batchForm.woodType,
        length: log.length,
        d1: log.d1,
        d2: log.d2,
        d3: log.d3,
        d4: log.d4,
        trim: log.trim,
        gr: log.gr,
        avgDiameter,
        effectiveLength,
        grossVolume,
        grVolume,
        netVolume,
        unitPrice,
        totalValue: netVolume * unitPrice,
        status: "available",
        contactName: "PT. Kayu Jaya Abadi", // Mock contact
        createdAt: new Date().toISOString().split("T")[0],
      };
    });

    setLogs([...logs, ...newLogs]);
    setIsAddDialogOpen(false);
    toast.success(`${newLogs.length} kayu log berhasil ditambahkan`);

    // Reset form
    setBatchForm({
      invoiceNumber: "",
      contactId: "",
      woodType: "",
      totalInvoicePrice: 0,
      logs: [{ length: 0, d1: 0, d2: 0, d3: 0, d4: 0, trim: 0, gr: 0 }],
    });
    setCurrentLogIndex(0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatVolume = (volume: number) => {
    return `${volume.toFixed(3)} m³`;
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Stok</h1>
          <p className="text-gray-600">Kelola inventory kayu log Anda</p>
        </div>
        <PermissionGuard permission="inventory:add">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Batch
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Kayu Log (Batch)</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Batch Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber">Nomor Nota</Label>
                  <Input
                    id="invoiceNumber"
                    value={batchForm.invoiceNumber}
                    onChange={(e) =>
                      setBatchForm({ ...batchForm, invoiceNumber: e.target.value })
                    }
                    placeholder="NOTA-001"
                  />
                </div>
                <div>
                  <Label htmlFor="woodType">Jenis Kayu</Label>
                  <Select
                    value={batchForm.woodType}
                    onValueChange={(value) =>
                      setBatchForm({ ...batchForm, woodType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kayu" />
                    </SelectTrigger>
                    <SelectContent>
                      {woodTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="totalPrice">Total Harga Nota</Label>
                  <Input
                    id="totalPrice"
                    type="number"
                    value={batchForm.totalInvoicePrice}
                    onChange={(e) =>
                      setBatchForm({
                        ...batchForm,
                        totalInvoicePrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Log Selection Tabs */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Pilih Kayu Log:</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLogToBatch}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Log
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {batchForm.logs.map((_, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant={currentLogIndex === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => selectLog(index)}
                      className="relative"
                    >
                      Log {index + 1}
                      {batchForm.logs.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-4 w-4 p-0 hover:bg-red-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeLogFromBatch(index);
                          }}
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Current Log Form */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="length">Panjang (P) cm</Label>
                  <Input
                    id="length"
                    type="number"
                    value={batchForm.logs[currentLogIndex]?.length || 0}
                    onChange={(e) =>
                      updateCurrentLog("length", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="d1">Diameter d1 (cm)</Label>
                  <Input
                    id="d1"
                    type="number"
                    value={batchForm.logs[currentLogIndex]?.d1 || 0}
                    onChange={(e) =>
                      updateCurrentLog("d1", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="d2">Diameter d2 (cm)</Label>
                  <Input
                    id="d2"
                    type="number"
                    value={batchForm.logs[currentLogIndex]?.d2 || 0}
                    onChange={(e) =>
                      updateCurrentLog("d2", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="d3">Diameter d3 (cm)</Label>
                  <Input
                    id="d3"
                    type="number"
                    value={batchForm.logs[currentLogIndex]?.d3 || 0}
                    onChange={(e) =>
                      updateCurrentLog("d3", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="d4">Diameter d4 (cm)</Label>
                  <Input
                    id="d4"
                    type="number"
                    value={batchForm.logs[currentLogIndex]?.d4 || 0}
                    onChange={(e) =>
                      updateCurrentLog("d4", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="trim">Trim (cm)</Label>
                  <Input
                    id="trim"
                    type="number"
                    value={batchForm.logs[currentLogIndex]?.trim || 0}
                    onChange={(e) =>
                      updateCurrentLog("trim", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="gr">GR (cm)</Label>
                  <Input
                    id="gr"
                    type="number"
                    value={batchForm.logs[currentLogIndex]?.gr || 0}
                    onChange={(e) =>
                      updateCurrentLog("gr", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              {/* Live Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Calculator className="mr-2 h-5 w-5" />
                    Preview Perhitungan Volume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Diameter Rata-rata</p>
                      <p className="font-semibold">{previewVolume.avgDiameter.toFixed(2)} cm</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Panjang Efektif</p>
                      <p className="font-semibold">{previewVolume.effectiveLength.toFixed(2)} cm</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Volume Bruto</p>
                      <p className="font-semibold">{formatVolume(previewVolume.grossVolume)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Volume GR</p>
                      <p className="font-semibold">{formatVolume(previewVolume.grVolume)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Volume Neto</p>
                      <p className="font-semibold text-blue-600">{formatVolume(previewVolume.netVolume)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
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
                  onClick={handleBatchSubmit}
                  disabled={!batchForm.invoiceNumber || !batchForm.woodType || batchForm.totalInvoicePrice <= 0}
                >
                  Simpan {batchForm.logs.length} Log
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </PermissionGuard>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Daftar Inventory Kayu Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nota</TableHead>
                  <TableHead>Jenis Kayu</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Volume (m³)</TableHead>
                  <TableHead>Harga Satuan</TableHead>
                  <TableHead>Total Nilai</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.invoiceNumber}</TableCell>
                    <TableCell>{log.woodType}</TableCell>
                    <TableCell>{log.contactName}</TableCell>
                    <TableCell>{formatVolume(log.netVolume)}</TableCell>
                    <TableCell>{formatCurrency(log.unitPrice)}</TableCell>
                    <TableCell>{formatCurrency(log.totalValue)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          log.status === "available"
                            ? "default"
                            : log.status === "sold"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {log.status === "available"
                          ? "Tersedia"
                          : log.status === "sold"
                          ? "Terjual"
                          : "Diproses"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <PermissionGuard permission="inventory:edit">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </PermissionGuard>
                      <PermissionGuard permission="inventory:delete">
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </PermissionGuard>
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