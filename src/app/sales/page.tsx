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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Edit, Trash2, ShoppingCart, Package, Calculator } from "lucide-react";
import { PermissionGuard } from "@/components/permission-guard";
import { toast } from "sonner";

interface Sale {
  id: string;
  invoiceNumber: string;
  contactName: string;
  woodType?: string;
  netVolume?: number;
  unitPrice: number;
  totalPrice: number;
  status: string;
  notes?: string;
  createdAt: string;
  source: "inventory" | "manual";
  inventoryId?: string;
}

interface SaleFormData {
  invoiceNumber: string;
  contactId: string;
  source: "inventory" | "manual";
  inventoryId?: string;
  woodType?: string;
  length?: number;
  d1?: number;
  d2?: number;
  d3?: number;
  d4?: number;
  trim?: number;
  gr?: number;
  unitPrice: number;
  notes?: string;
}

interface InventoryItem {
  id: string;
  invoiceNumber: string;
  woodType: string;
  netVolume: number;
  unitPrice: number;
  status: string;
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

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [saleForm, setSaleForm] = useState<SaleFormData>({
    invoiceNumber: "",
    contactId: "",
    source: "inventory",
    unitPrice: 0,
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockSales: Sale[] = [
      {
        id: "1",
        invoiceNumber: "SJ-001",
        contactName: "CV. Mebel Jaya",
        woodType: "Jati",
        netVolume: 0.581,
        unitPrice: 3500000,
        totalPrice: 2033500,
        status: "completed",
        notes: "Pengiriman ke gudang Jakarta",
        createdAt: "2024-01-16",
        source: "inventory",
        inventoryId: "1",
      },
      {
        id: "2",
        invoiceNumber: "SJ-002",
        contactName: "PT. Furnitur Indah",
        woodType: "Mahoni",
        netVolume: 0.425,
        unitPrice: 2800000,
        totalPrice: 1190000,
        status: "pending",
        notes: "Menunggu konfirmasi pembayaran",
        createdAt: "2024-01-17",
        source: "manual",
      },
    ];

    const mockInventory: InventoryItem[] = [
      {
        id: "1",
        invoiceNumber: "NOTA-001",
        woodType: "Jati",
        netVolume: 0.581,
        unitPrice: 2500000,
        status: "available",
      },
      {
        id: "2",
        invoiceNumber: "NOTA-001",
        woodType: "Jati",
        netVolume: 0.495,
        unitPrice: 2500000,
        status: "available",
      },
      {
        id: "3",
        invoiceNumber: "NOTA-002",
        woodType: "Mahoni",
        netVolume: 0.750,
        unitPrice: 2000000,
        status: "available",
      },
    ];

    setTimeout(() => {
      setSales(mockSales);
      setInventory(mockInventory);
      setLoading(false);
    }, 1000);
  }, []);

  // Update preview when manual form values change
  const previewVolume = useMemo(() => {
    if (saleForm.source === "manual" && saleForm.length && saleForm.d1 && saleForm.d2 && saleForm.d3 && saleForm.d4) {
      const avgDiameter = calculateAvgDiameter(saleForm.d1, saleForm.d2, saleForm.d3, saleForm.d4);
      const effectiveLength = calculateEffectiveLength(saleForm.length, saleForm.trim || 0);
      const grossVolume = calculateGrossVolume(avgDiameter, effectiveLength);
      const grVolume = calculateGRVolume(saleForm.gr || 0, saleForm.length);
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
  }, [saleForm, saleForm.source]);

  const handleSourceChange = (source: "inventory" | "manual") => {
    setSaleForm({
      ...saleForm,
      source,
      inventoryId: source === "inventory" ? "" : undefined,
      woodType: source === "manual" ? "" : undefined,
      length: undefined,
      d1: undefined,
      d2: undefined,
      d3: undefined,
      d4: undefined,
      trim: undefined,
      gr: undefined,
    });
  };

  const handleInventorySelect = (inventoryId: string) => {
    const selectedItem = inventory.find(item => item.id === inventoryId);
    if (selectedItem) {
      setSaleForm({
        ...saleForm,
        inventoryId,
        woodType: selectedItem.woodType,
        unitPrice: selectedItem.unitPrice * 1.4, // 40% markup
      });
    }
  };

  const handleSubmit = () => {
    let netVolume = 0;
    let woodType = "";

    if (saleForm.source === "inventory") {
      const selectedItem = inventory.find(item => item.id === saleForm.inventoryId);
      if (selectedItem) {
        netVolume = selectedItem.netVolume;
        woodType = selectedItem.woodType;
      }
    } else {
      netVolume = previewVolume.netVolume;
      woodType = saleForm.woodType || "";
    }

    const newSale: Sale = {
      id: Date.now().toString(),
      invoiceNumber: saleForm.invoiceNumber,
      contactName: "CV. Mebel Jaya", // Mock contact
      woodType,
      netVolume,
      unitPrice: saleForm.unitPrice,
      totalPrice: netVolume * saleForm.unitPrice,
      status: "pending",
      notes: saleForm.notes,
      createdAt: new Date().toISOString().split("T")[0],
      source: saleForm.source,
      inventoryId: saleForm.inventoryId,
    };

    setSales([...sales, newSale]);
    setIsAddDialogOpen(false);
    toast.success("Penjualan berhasil ditambahkan");

    // Reset form
    setSaleForm({
      invoiceNumber: "",
      contactId: "",
      source: "inventory",
      unitPrice: 0,
    });
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
          <h1 className="text-3xl font-bold text-gray-900">Penjualan</h1>
          <p className="text-gray-600">Kelola penjualan kayu log</p>
        </div>
        <PermissionGuard permission="sales:add">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Penjualan
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Penjualan Kayu</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber">Nomor Surat Jalan</Label>
                  <Input
                    id="invoiceNumber"
                    value={saleForm.invoiceNumber}
                    onChange={(e) =>
                      setSaleForm({ ...saleForm, invoiceNumber: e.target.value })
                    }
                    placeholder="SJ-001"
                  />
                </div>
                <div>
                  <Label htmlFor="contact">Pelanggan</Label>
                  <Select
                    value={saleForm.contactId}
                    onValueChange={(value) =>
                      setSaleForm({ ...saleForm, contactId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih pelanggan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">CV. Mebel Jaya</SelectItem>
                      <SelectItem value="2">PT. Furnitur Indah</SelectItem>
                      <SelectItem value="3">UD. Kayu Makmur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Source Selection */}
              <div>
                <Label>Sumber Kayu</Label>
                <RadioGroup
                  value={saleForm.source}
                  onValueChange={(value) => handleSourceChange(value as "inventory" | "manual")}
                  className="flex space-x-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inventory" id="inventory" />
                    <Label htmlFor="inventory" className="flex items-center">
                      <Package className="mr-2 h-4 w-4" />
                      Dari Stok Inventory
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manual" id="manual" />
                    <Label htmlFor="manual" className="flex items-center">
                      <Calculator className="mr-2 h-4 w-4" />
                      Input Manual
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Inventory Selection */}
              {saleForm.source === "inventory" && (
                <div>
                  <Label htmlFor="inventorySelect">Pilih Kayu dari Stok</Label>
                  <Select
                    value={saleForm.inventoryId}
                    onValueChange={handleInventorySelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kayu dari stok" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventory
                        .filter(item => item.status === "available")
                        .map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.woodType} - {item.invoiceNumber} - {formatVolume(item.netVolume)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Manual Input */}
              {saleForm.source === "manual" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="woodType">Jenis Kayu</Label>
                    <Select
                      value={saleForm.woodType}
                      onValueChange={(value) =>
                        setSaleForm({ ...saleForm, woodType: value })
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

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="length">Panjang (P) cm</Label>
                      <Input
                        id="length"
                        type="number"
                        value={saleForm.length || 0}
                        onChange={(e) =>
                          setSaleForm({
                            ...saleForm,
                            length: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="d1">Diameter d1 (cm)</Label>
                      <Input
                        id="d1"
                        type="number"
                        value={saleForm.d1 || 0}
                        onChange={(e) =>
                          setSaleForm({
                            ...saleForm,
                            d1: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="d2">Diameter d2 (cm)</Label>
                      <Input
                        id="d2"
                        type="number"
                        value={saleForm.d2 || 0}
                        onChange={(e) =>
                          setSaleForm({
                            ...saleForm,
                            d2: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="d3">Diameter d3 (cm)</Label>
                      <Input
                        id="d3"
                        type="number"
                        value={saleForm.d3 || 0}
                        onChange={(e) =>
                          setSaleForm({
                            ...saleForm,
                            d3: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="d4">Diameter d4 (cm)</Label>
                      <Input
                        id="d4"
                        type="number"
                        value={saleForm.d4 || 0}
                        onChange={(e) =>
                          setSaleForm({
                            ...saleForm,
                            d4: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="trim">Trim (cm)</Label>
                      <Input
                        id="trim"
                        type="number"
                        value={saleForm.trim || 0}
                        onChange={(e) =>
                          setSaleForm({
                            ...saleForm,
                            trim: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="gr">GR (cm)</Label>
                      <Input
                        id="gr"
                        type="number"
                        value={saleForm.gr || 0}
                        onChange={(e) =>
                          setSaleForm({
                            ...saleForm,
                            gr: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Manual Input Preview */}
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
                </div>
              )}

              {/* Price and Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unitPrice">Harga Satuan per m³</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    value={saleForm.unitPrice}
                    onChange={(e) =>
                      setSaleForm({
                        ...saleForm,
                        unitPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Catatan</Label>
                  <Input
                    id="notes"
                    value={saleForm.notes || ""}
                    onChange={(e) =>
                      setSaleForm({ ...saleForm, notes: e.target.value })
                    }
                    placeholder="Catatan pengiriman"
                  />
                </div>
              </div>

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
                  onClick={handleSubmit}
                  disabled={
                    !saleForm.invoiceNumber ||
                    !saleForm.contactId ||
                    (saleForm.source === "inventory" && !saleForm.inventoryId) ||
                    (saleForm.source === "manual" && (!saleForm.woodType || !saleForm.unitPrice))
                  }
                >
                  Simpan Penjualan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </PermissionGuard>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Daftar Penjualan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Surat Jalan</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Jenis Kayu</TableHead>
                  <TableHead>Volume (m³)</TableHead>
                  <TableHead>Harga Satuan</TableHead>
                  <TableHead>Total Harga</TableHead>
                  <TableHead>Sumber</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.invoiceNumber}</TableCell>
                    <TableCell>{sale.contactName}</TableCell>
                    <TableCell>{sale.woodType || "-"}</TableCell>
                    <TableCell>{sale.netVolume ? formatVolume(sale.netVolume) : "-"}</TableCell>
                    <TableCell>{formatCurrency(sale.unitPrice)}</TableCell>
                    <TableCell>{formatCurrency(sale.totalPrice)}</TableCell>
                    <TableCell>
                      <Badge variant={sale.source === "inventory" ? "default" : "secondary"}>
                        {sale.source === "inventory" ? "Stok" : "Manual"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          sale.status === "completed"
                            ? "default"
                            : sale.status === "pending"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {sale.status === "completed"
                          ? "Selesai"
                          : sale.status === "pending"
                          ? "Menunggu"
                          : "Dibatalkan"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <PermissionGuard permission="sales:edit">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </PermissionGuard>
                      <PermissionGuard permission="sales:delete">
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