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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Users, Building, Phone, Mail, MapPin, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string;
  type: "supplier" | "customer";
  email?: string;
  phone?: string;
  address?: string;
  balance: number; // positive = receivable, negative = payable
  createdAt: string;
}

interface ContactFormData {
  name: string;
  type: "supplier" | "customer";
  email?: string;
  phone?: string;
  address?: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: "",
    type: "supplier",
    email: "",
    phone: "",
    address: "",
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockContacts: Contact[] = [
      {
        id: "1",
        name: "PT. Kayu Jaya Abadi",
        type: "supplier",
        email: "info@kayujaya.com",
        phone: "0812-3456-7890",
        address: "Jl. Industri No. 123, Jakarta",
        balance: -500000000, // Hutang
        createdAt: "2024-01-01",
      },
      {
        id: "2",
        name: "CV. Mebel Jaya",
        type: "customer",
        email: "order@mebeljaya.com",
        phone: "0813-9876-5432",
        address: "Jl. Furniture No. 45, Surabaya",
        balance: 750000000, // Piutang
        createdAt: "2024-01-05",
      },
      {
        id: "3",
        name: "PT. Furnitur Indah",
        type: "customer",
        email: "sales@furniturindah.com",
        phone: "0821-2345-6789",
        address: "Jl. Kayu No. 67, Bandung",
        balance: 150000000, // Piutang
        createdAt: "2024-01-10",
      },
      {
        id: "4",
        name: "UD. Kayu Makmur",
        type: "supplier",
        email: "udkayumakmur@email.com",
        phone: "0815-8765-4321",
        address: "Jl. Perkayuan No. 89, Semarang",
        balance: -200000000, // Hutang
        createdAt: "2024-01-12",
      },
    ];

    setTimeout(() => {
      setContacts(mockContacts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = () => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name: contactForm.name,
      type: contactForm.type,
      email: contactForm.email,
      phone: contactForm.phone,
      address: contactForm.address,
      balance: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setContacts([...contacts, newContact]);
    setIsAddDialogOpen(false);
    toast.success("Kontak berhasil ditambahkan");

    // Reset form
    setContactForm({
      name: "",
      type: "supplier",
      email: "",
      phone: "",
      address: "",
    });
  };

  const handleDelete = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
    toast.success("Kontak berhasil dihapus");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const suppliers = contacts.filter((contact) => contact.type === "supplier");
  const customers = contacts.filter((contact) => contact.type === "customer");
  
  const totalPayable = suppliers
    .filter((s) => s.balance < 0)
    .reduce((sum, supplier) => sum + Math.abs(supplier.balance), 0);
    
  const totalReceivable = customers
    .filter((c) => c.balance > 0)
    .reduce((sum, customer) => sum + customer.balance, 0);

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
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Kontak</h1>
          <p className="text-gray-600">Kelola data Supplier dan Pelanggan</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Kontak
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Kontak Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nama</Label>
                <Input
                  id="name"
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, name: e.target.value })
                  }
                  placeholder="Nama perusahaan atau individu"
                />
              </div>
              <div>
                <Label htmlFor="type">Tipe</Label>
                <Select
                  value={contactForm.type}
                  onValueChange={(value) =>
                    setContactForm({ ...contactForm, type: value as "supplier" | "customer" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe kontak" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplier">Supplier</SelectItem>
                    <SelectItem value="customer">Pelanggan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactForm.email || ""}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telepon</Label>
                <Input
                  id="phone"
                  value={contactForm.phone || ""}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, phone: e.target.value })
                  }
                  placeholder="08xx-xxxx-xxxx"
                />
              </div>
              <div>
                <Label htmlFor="address">Alamat</Label>
                <Input
                  id="address"
                  value={contactForm.address || ""}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, address: e.target.value })
                  }
                  placeholder="Alamat lengkap"
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
                  disabled={!contactForm.name || !contactForm.type}
                >
                  Simpan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Supplier
            </CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{suppliers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Pelanggan
            </CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{customers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Hutang
            </CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalPayable)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Piutang
            </CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(totalReceivable)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Daftar Kontak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Semua ({contacts.length})</TabsTrigger>
              <TabsTrigger value="suppliers">Supplier ({suppliers.length})</TabsTrigger>
              <TabsTrigger value="customers">Pelanggan ({customers.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <ContactTable contacts={contacts} onDelete={handleDelete} formatCurrency={formatCurrency} />
            </TabsContent>

            <TabsContent value="suppliers" className="mt-4">
              <ContactTable contacts={suppliers} onDelete={handleDelete} formatCurrency={formatCurrency} />
            </TabsContent>

            <TabsContent value="customers" className="mt-4">
              <ContactTable contacts={customers} onDelete={handleDelete} formatCurrency={formatCurrency} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

interface ContactTableProps {
  contacts: Contact[];
  onDelete: (id: string) => void;
  formatCurrency: (amount: number) => string;
}

function ContactTable({ contacts, onDelete, formatCurrency }: ContactTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Kontak</TableHead>
            <TableHead>Saldo</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{contact.name}</p>
                  {contact.address && (
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {contact.address}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={contact.type === "supplier" ? "default" : "secondary"}>
                  {contact.type === "supplier" ? "Supplier" : "Pelanggan"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {contact.email && (
                    <p className="text-sm flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {contact.email}
                    </p>
                  )}
                  {contact.phone && (
                    <p className="text-sm flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {contact.phone}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p
                    className={`font-semibold ${
                      contact.balance > 0 ? "text-purple-600" : "text-red-600"
                    }`}
                  >
                    {contact.balance > 0 ? "+" : "-"}
                    {formatCurrency(contact.balance)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {contact.balance > 0 ? "Piutang" : "Hutang"}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(contact.id)}
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
  );
}