# Setup Database Turso untuk Aplikasi Kayu LOG

Aplikasi ini mendukung dua jenis database:
1. **SQLite Local** (untuk development)
2. **Turso** (SQLite di cloud untuk production)

## Cara Setup Turso

### 1. Daftar dan Buat Database

1. Kunjungi [turso.tech](https://turso.tech) dan daftar akun
2. Buat database baru:
   ```bash
   # Install Turso CLI
   curl -sSfL https://get.tur.so/install.sh | bash
   
   # Login ke Turso
   turso auth login
   
   # Buat database
   turso db create kayu-log
   
   # Lihat database URL
   turso db show kayu-log --url
   
   # Lihat auth token
   turso db tokens create kayu-log
   ```

### 2. Konfigurasi Environment Variables

Edit file `.env.local` di root project:

```env
# Database Configuration
# Local SQLite (untuk development)
DATABASE_URL="file:./db/custom.db"

# Turso Database (untuk production)
# Uncomment dan isi dengan kredensial Anda
TURSO_DATABASE_URL="libsql://your-db-name.turso.io"
TURSO_AUTH_TOKEN="your-auth-token"

# Application Configuration
NEXTAUTH_SECRET="wood-log-app-secret-key-2024"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Push Schema ke Turso

Jalankan perintah berikut untuk migrasi schema ke Turso:

```bash
# Generate Prisma client
bun run db:generate

# Push schema ke database
bun run db:push
```

### 4. Verifikasi Koneksi

1. Restart aplikasi development server
2. Buka halaman Settings → Database
3. Pastikan status database menunjukkan "Healthy" dengan tipe "Turso"

## Fitur Turso yang Didukung

- ✅ Koneksi otomatis (local/Turso)
- ✅ Health check database
- ✅ CRUD operations via API
- ✅ Error handling dan fallback
- ✅ Status monitoring di dashboard

## Switching Database

### Dari Local ke Turso:
1. Setup database Turso (langkah 1-3)
2. Uncomment `TURSO_DATABASE_URL` dan `TURSO_AUTH_TOKEN` di `.env.local`
3. Restart aplikasi

### Dari Turso ke Local:
1. Comment `TURSO_DATABASE_URL` dan `TURSO_AUTH_TOKEN` di `.env.local`
2. Restart aplikasi

## Troubleshooting

### Error: "Database connection failed"
- Pastikan environment variables sudah benar
- Cek auth token masih valid
- Verifikasi database URL benar

### Error: "Failed to fetch dashboard data"
- Pastikan database sudah di-push dengan schema yang benar
- Cek koneksi internet (untuk Turso)
- Restart development server

### Schema Mismatch
- Jalankan `bun run db:push` untuk sync schema
- Pastikan Prisma client sudah di-generate

## Best Practices

1. **Development**: Gunakan SQLite local untuk kemudahan
2. **Staging**: Gunakan Turso dengan database terpisah
3. **Production**: Gunakan Turso dengan backup teratur
4. **Security**: Jangan share auth token di public repository
5. **Monitoring**: Gunakan health check API untuk monitoring

## API Endpoints

- `GET /api/database/health` - Check database status
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/inventory` - List inventory items
- `POST /api/inventory` - Create inventory items
- `GET /api/contacts` - List contacts
- `POST /api/contacts` - Create contact
- `GET /api/sales` - List sales
- `POST /api/sales` - Create sale
- `GET /api/expenses` - List expenses
- `POST /api/expenses` - Create expense

## Performance Tips

1. Gunakan connection pooling untuk production
2. Implement caching untuk frequently accessed data
3. Monitor query performance di Turso dashboard
4. Gunakan indexes untuk columns yang sering di-query

## Backup & Restore

Turso menyediakan backup otomatis. Untuk backup manual:

```bash
# Export data
turso db shell kayu-log ".dump" > backup.sql

# Import data (jika perlu)
turso db shell kayu-log < backup.sql
```