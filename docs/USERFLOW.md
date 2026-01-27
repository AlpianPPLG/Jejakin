# User Flow - [Nama Project]

Berikut adalah alur pengguna utama dalam aplikasi.

## 1. Discovery & Exploration
**Goal**: User menemukan konten/fitur yang sesuai dengan kebutuhan mereka.

1.  **Landing Page (`/`)**:
    *   User melihat hero section.
    *   User menggunakan fitur pencarian/filter.
    *   *Action*: Klik untuk melihat detail.

2.  **List Page (`/[feature]`)**:
    *   User melihat daftar item.
    *   User menggunakan filter dan sorting.
    *   *Action*: Klik item untuk melihat detail.

3.  **Detail Page (`/[feature]/[id]`)**:
    *   User membaca informasi lengkap.
    *   User melihat galeri/media.
    *   *Action*: Klik tombol aksi utama.

## 2. Main Action Flow
**Goal**: User melakukan aksi utama aplikasi.

1.  **Pre-Action Check**:
    *   Sistem mengecek apakah user sudah login.
    *   *Decision*:
        *   Jika **Belum Login**: Redirect ke halaman Login.
        *   Jika **Sudah Login**: Lanjut ke proses.

2.  **Action Page**:
    *   **Step 1**: User review informasi.
    *   **Step 2**: User input data yang diperlukan.
    *   **Step 3**: User konfirmasi.
    *   *System Action*: Data disimpan ke `Global Context` & `localStorage`.
    *   *Feedback*: Toast notification muncul.

3.  **Post-Action (Dashboard)**:
    *   **User Dashboard (`/dashboard/user`)**:
        *   User melihat hasil aksi mereka.
        *   *Action*: User bisa manage data mereka.
    *   **Admin Dashboard (`/dashboard/admin`)**:
        *   Admin melihat statistik dan data user.
        *   *Action*: Admin manage status dan data.

## 3. Authentication Flow

*   **Registration (`/register`)**: User baru mengisi form -> Auto Login -> Redirect ke Dashboard.
*   **Login (`/login`)**: User input kredensial -> Validasi -> Redirect ke Dashboard sesuai Role.
