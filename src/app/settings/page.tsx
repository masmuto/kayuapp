"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PermissionGuard } from "@/components/permission-guard";
import { DatabaseStatus } from "@/components/database-status";
import { Building, Download, Upload, Database, Settings as SettingsIcon, Save } from "lucide-react";
import { toast } from "sonner";

interface CompanySettings {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  taxId: string;
  currency: string;
  dateFormat: string;
  backupEnabled: boolean;
  lastBackup?: string;
}

interface SystemSettings {
  accountingMethod: "accrual" | "cash";
  autoBackup: boolean;
  backupFrequency: "daily" | "weekly" | "monthly";
  language: string;
  theme: string;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    companyName: "PT. Pengolahan Kayu Log",
    address: "Jl. Industri No. 123, Jakarta, Indonesia",
    phone: "+62 21 1234 5678",
    email: "info@kayulog.com",
    taxId: "12.345.678.9-012.000",
    currency: "IDR",
    dateFormat: "dd/MM/yyyy",
    backupEnabled: true,
    lastBackup: "2024-01-17 10:30:00",
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    accountingMethod: "accrual",
    autoBackup: true,
    backupFrequency: "daily",
    language: "id",
    theme: "light",
  });

  useEffect(() => {
    // Simulate loading settings from API
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleCompanySave = () => {
    // Simulate saving company settings
    toast.success("Pengaturan perusahaan berhasil disimpan");
  };

  const handleSystemSave = () => {
    // Simulate saving system settings
    toast.success("Pengaturan sistem berhasil disimpan");
  };

  const handleBackup = () => {
    // Simulate backup process
    toast.success("Backup database sedang diproses...");
    setTimeout(() => {
      const now = new Date().toLocaleString("id-ID");
      setCompanySettings({
        ...companySettings,
        lastBackup: now,
      });
      toast.success("Backup database berhasil diselesaikan");
    }, 2000);
  };

  const handleRestore = () => {
    // Simulate restore process
    toast.success("Fitur restore akan segera tersedia");
  };

  const handleExportData = () => {
    // Simulate data export
    toast.success("Mengekspor data ke format JSON...");
    setTimeout(() => {
      toast.success("Data berhasil diekspor");
    }, 1500);
  };

  const handleImportData = () => {
    // Simulate data import
    toast.success("Fitur import data akan segera tersedia");
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-gray-600">Kelola profil perusahaan dan pengaturan sistem</p>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company">Profil Perusahaan</TabsTrigger>
          <TabsTrigger value="system">Pengaturan Sistem</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="info">Informasi</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Informasi Perusahaan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Nama Perusahaan</Label>
                  <Input
                    id="companyName"
                    value={companySettings.companyName}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        companyName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="taxId">NPWP</Label>
                  <Input
                    id="taxId"
                    value={companySettings.taxId}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        taxId: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={companySettings.email}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telepon</Label>
                  <Input
                    id="phone"
                    value={companySettings.phone}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Input
                    id="address"
                    value={companySettings.address}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Mata Uang</Label>
                  <Select
                    value={companySettings.currency}
                    onValueChange={(value) =>
                      setCompanySettings({
                        ...companySettings,
                        currency: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR">Indonesian Rupiah (IDR)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateFormat">Format Tanggal</Label>
                  <Select
                    value={companySettings.dateFormat}
                    onValueChange={(value) =>
                      setCompanySettings({
                        ...companySettings,
                        dateFormat: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                      <SelectItem value="dd MMM yyyy">DD MMM YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <PermissionGuard permission="settings:edit">
                  <Button onClick={handleCompanySave}>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </Button>
                </PermissionGuard>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="mr-2 h-5 w-5" />
                Pengaturan Sistem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="accountingMethod">Metode Akuntansi</Label>
                    <Select
                      value={systemSettings.accountingMethod}
                      onValueChange={(value) =>
                        setSystemSettings({
                          ...systemSettings,
                          accountingMethod: value as "accrual" | "cash",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accrual">Accrual Basis</SelectItem>
                        <SelectItem value="cash">Cash Basis</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      {systemSettings.accountingMethod === "accrual"
                        ? "Pendapatan dan biaya dicatat saat terjadi"
                        : "Pendapatan dan biaya dicatat saat kas diterima/dibayarkan"}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="language">Bahasa</Label>
                    <Select
                      value={systemSettings.language}
                      onValueChange={(value) =>
                        setSystemSettings({
                          ...systemSettings,
                          language: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">Bahasa Indonesia</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="theme">Tema</Label>
                    <Select
                      value={systemSettings.theme}
                      onValueChange={(value) =>
                        setSystemSettings({
                          ...systemSettings,
                          theme: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Terang</SelectItem>
                        <SelectItem value="dark">Gelap</SelectItem>
                        <SelectItem value="auto">Otomatis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Backup</Label>
                      <p className="text-xs text-gray-500">Backup otomatis database</p>
                    </div>
                    <Switch
                      checked={systemSettings.autoBackup}
                      onCheckedChange={(checked) =>
                        setSystemSettings({
                          ...systemSettings,
                          autoBackup: checked,
                        })
                      }
                    />
                  </div>

                  {systemSettings.autoBackup && (
                    <div>
                      <Label htmlFor="backupFrequency">Frekuensi Backup</Label>
                      <Select
                        value={systemSettings.backupFrequency}
                        onValueChange={(value) =>
                          setSystemSettings({
                            ...systemSettings,
                            backupFrequency: value as "daily" | "weekly" | "monthly",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Harian</SelectItem>
                          <SelectItem value="weekly">Mingguan</SelectItem>
                          <SelectItem value="monthly">Bulanan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Backup Enabled</Label>
                      <p className="text-xs text-gray-500">Aktifkan fitur backup</p>
                    </div>
                    <Switch
                      checked={companySettings.backupEnabled}
                      onCheckedChange={(checked) =>
                        setCompanySettings({
                          ...companySettings,
                          backupEnabled: checked,
                        })
                      }
                    />
                  </div>

                  {companySettings.backupEnabled && companySettings.lastBackup && (
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium">Backup Terakhir:</p>
                      <p className="text-xs text-gray-600">{companySettings.lastBackup}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <PermissionGuard permission="settings:edit">
                  <Button onClick={handleSystemSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </Button>
                </PermissionGuard>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  Backup & Restore
                </CardTitle>
              </CardHeader>
              <CardContent>
              <DatabaseStatus />
              
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Backup Database</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Buat backup lengkap database untuk keamanan data
                  </p>
                  <Button onClick={handleBackup} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Backup Sekarang
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Restore Database</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Kembalikan database dari file backup
                  </p>
                  <Button variant="outline" onClick={handleRestore} className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Restore dari Backup
                  </Button>
                </div>

                {companySettings.lastBackup && (
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="text-sm font-medium text-blue-800">Status Backup</p>
                    <p className="text-xs text-blue-600">
                      Backup terakhir: {companySettings.lastBackup}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <SettingsIcon className="mr-2 h-5 w-5" />
                  Import & Export Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Export Data</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Export semua data ke format JSON untuk backup atau migrasi
                  </p>
                  <Button variant="outline" onClick={handleExportData} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Export ke JSON
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Import Data</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Import data dari file JSON (hanya dari backup sistem ini)
                  </p>
                  <Button variant="outline" onClick={handleImportData} className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Import dari JSON
                  </Button>
                </div>

                <div className="p-3 bg-yellow-50 rounded">
                  <p className="text-sm font-medium text-yellow-800">⚠️ Perhatian</p>
                  <p className="text-xs text-yellow-600">
                    Import data akan menimpa data yang ada. Pastikan Anda memiliki backup sebelum melakukan import.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Informasi Database</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Database Engine</p>
                  <p className="font-medium">SQLite</p>
                </div>
                <div>
                  <p className="text-gray-600">Lokasi Database</p>
                  <p className="font-medium">/db/custom.db</p>
                </div>
                <div>
                  <p className="text-gray-600">Versi Sistem</p>
                  <p className="font-medium">v1.0.0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Sistem</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Versi Aplikasi</span>
                    <span className="font-medium">v1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Framework</span>
                    <span className="font-medium">Next.js 16</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Database Engine</span>
                    <span className="font-medium">SQLite/Turso</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ORM</span>
                    <span className="font-medium">Prisma</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">UI Library</span>
                    <span className="font-medium">shadcn/ui</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Styling</span>
                    <span className="font-medium">Tailwind CSS</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cara Menggunakan Turso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium mb-1">1. Buat Database Turso</h4>
                    <p className="text-gray-600">Daftar ke <a href="https://turso.tech" target="_blank" className="text-blue-600 hover:underline">turso.tech</a> dan buat database baru</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">2. Dapatkan Kredensial</h4>
                    <p className="text-gray-600">Copy database URL dan auth token dari dashboard Turso</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">3. Update Environment</h4>
                    <p className="text-gray-600">Tambahkan variabel berikut ke .env.local:</p>
                    <div className="mt-1 p-2 bg-gray-100 rounded text-xs font-mono">
                      TURSO_DATABASE_URL="libsql://your-db.turso.io"<br/>
                      TURSO_AUTH_TOKEN="your-auth-token"
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">4. Push Schema</h4>
                    <p className="text-gray-600">Jalankan <code className="bg-gray-100 px-1 rounded">bun run db:push</code> untuk migrasi schema</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>• <strong>Local Development:</strong> Menggunakan SQLite local file</p>
                <p>• <strong>Production:</strong> Menggunakan Turso cloud database</p>
                <p>• <strong>Switch:</strong> Uncomment TURSO variables di .env.local untuk menggunakan Turso</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}