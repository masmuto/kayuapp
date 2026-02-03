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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Edit, Trash2, Users, UserCog, Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "cashier";
  status: "active" | "inactive";
  createdAt: string;
  lastLogin?: string;
}

interface UserFormData {
  email: string;
  name: string;
  role: "admin" | "cashier";
  password: string;
  status: "active" | "inactive";
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [userForm, setUserForm] = useState<UserFormData>({
    email: "",
    name: "",
    role: "cashier",
    password: "",
    status: "active",
  });

  const { user: currentUser, hasPermission } = useAuth();

  // Mock data for demonstration
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: "1",
        email: "admin@kayulog.com",
        name: "Administrator",
        role: "admin",
        status: "active",
        createdAt: "2024-01-01",
        lastLogin: "2024-01-17 10:30:00",
      },
      {
        id: "2",
        email: "kasir@kayulog.com",
        name: "Kasir",
        role: "cashier",
        status: "active",
        createdAt: "2024-01-05",
        lastLogin: "2024-01-17 09:15:00",
      },
      {
        id: "3",
        email: "manager@kayulog.com",
        name: "Manager",
        role: "admin",
        status: "inactive",
        createdAt: "2024-01-10",
        lastLogin: "2024-01-15 14:20:00",
      },
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // Check if user has permission to access this page
  if (!hasPermission("users:view")) {
    return (
      <div className="p-6">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Anda tidak memiliki akses ke halaman Manajemen User.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleSubmit = () => {
    const newUser: User = {
      id: Date.now().toString(),
      email: userForm.email,
      name: userForm.name,
      role: userForm.role,
      status: userForm.status,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setUsers([...users, newUser]);
    setIsAddDialogOpen(false);
    toast.success("User berhasil ditambahkan");

    // Reset form
    setUserForm({
      email: "",
      name: "",
      role: "cashier",
      password: "",
      status: "active",
    });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setUserForm({
      email: user.email,
      name: user.name,
      role: user.role,
      password: "",
      status: user.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingUser) return;

    const updatedUsers = users.map((user) =>
      user.id === editingUser.id
        ? {
            ...user,
            email: userForm.email,
            name: userForm.name,
            role: userForm.role,
            status: userForm.status,
          }
        : user
    );

    setUsers(updatedUsers);
    setIsEditDialogOpen(false);
    setEditingUser(null);
    toast.success("User berhasil diperbarui");

    // Reset form
    setUserForm({
      email: "",
      name: "",
      role: "cashier",
      password: "",
      status: "active",
    });
  };

  const handleDelete = (id: string) => {
    // Prevent deleting self
    if (id === currentUser?.id) {
      toast.error("Tidak dapat menghapus user yang sedang login");
      return;
    }

    setUsers(users.filter((user) => user.id !== id));
    toast.success("User berhasil dihapus");
  };

  const toggleUserStatus = (id: string) => {
    // Prevent deactivating self
    if (id === currentUser?.id) {
      toast.error("Tidak dapat menonaktifkan user yang sedang login");
      return;
    }

    const updatedUsers = users.map((user) =>
      user.id === id
        ? { ...user, status: user.status === "active" ? "inactive" : "active" }
        : user
    );

    setUsers(updatedUsers);
    toast.success("Status user berhasil diperbarui");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const activeUsers = users.filter((user) => user.status === "active").length;
  const adminUsers = users.filter((user) => user.role === "admin").length;
  const cashierUsers = users.filter((user) => user.role === "cashier").length;

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
          <h1 className="text-3xl font-bold text-gray-900">Manajemen User</h1>
          <p className="text-gray-600">Kelola pengguna sistem dan hak akses</p>
        </div>
        {hasPermission("users:add") && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tambah User Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={userForm.name}
                    onChange={(e) =>
                      setUserForm({ ...userForm, name: e.target.value })
                    }
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) =>
                      setUserForm({ ...userForm, email: e.target.value })
                    }
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={userForm.role}
                    onValueChange={(value) =>
                      setUserForm({ ...userForm, role: value as "admin" | "cashier" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="cashier">Kasir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={userForm.password}
                      onChange={(e) =>
                        setUserForm({ ...userForm, password: e.target.value })
                      }
                      placeholder="Masukkan password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={userForm.status}
                    onValueChange={(value) =>
                      setUserForm({ ...userForm, status: value as "active" | "inactive" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Tidak Aktif</SelectItem>
                    </SelectContent>
                  </Select>
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
                    disabled={!userForm.name || !userForm.email || !userForm.password}
                  >
                    Simpan
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total User
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{users.length}</div>
            <p className="text-xs text-gray-500">
              {activeUsers} aktif, {users.length - activeUsers} tidak aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Admin
            </CardTitle>
            <UserCog className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{adminUsers}</div>
            <p className="text-xs text-gray-500">Akses penuh sistem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Kasir
            </CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{cashierUsers}</div>
            <p className="text-xs text-gray-500">Akses terbatas</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Daftar User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead>Login Terakhir</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role === "admin" ? "default" : "secondary"}
                      >
                        {user.role === "admin" ? "Admin" : "Kasir"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === "active" ? "default" : "outline"}
                      >
                        {user.status === "active" ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>{user.lastLogin || "-"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {hasPermission("users:edit") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {hasPermission("users:edit") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleUserStatus(user.id)}
                          >
                            {user.status === "active" ? "🔴" : "🟢"}
                          </Button>
                        )}
                        {hasPermission("users:delete") && user.id !== currentUser?.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nama Lengkap</Label>
              <Input
                id="edit-name"
                value={userForm.name}
                onChange={(e) =>
                  setUserForm({ ...userForm, name: e.target.value })
                }
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={userForm.email}
                onChange={(e) =>
                  setUserForm({ ...userForm, email: e.target.value })
                }
                placeholder="email@example.com"
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={userForm.role}
                onValueChange={(value) =>
                  setUserForm({ ...userForm, role: value as "admin" | "cashier" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="cashier">Kasir</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-password">Password (kosongkan jika tidak diubah)</Label>
              <Input
                id="edit-password"
                type="password"
                value={userForm.password}
                onChange={(e) =>
                  setUserForm({ ...userForm, password: e.target.value })
                }
                placeholder="Kosongkan jika tidak diubah"
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={userForm.status}
                onValueChange={(value) =>
                  setUserForm({ ...userForm, status: value as "active" | "inactive" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={handleUpdate}
                disabled={!userForm.name || !userForm.email}
              >
                Perbarui
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}