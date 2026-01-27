# Entity Relationship Diagram (ERD) - [Nama Project]

Dokumen ini menjelaskan struktur data yang digunakan dalam aplikasi.

## 1. Current Implementation (Mock Data Strategy)

Saat ini, karena aplikasi berjalan dalam mode **Frontend-First (Development)**, kami menggunakan struktur data JSON yang disimpan di `localStorage` klien untuk mensimulasikan persistensi database.

### JSON Entities (Client-Side Storage)

#### User
*Key: `app_users`*
| Key | Type | Description |
| :--- | :--- | :--- |
| `id` | string | Unique identifier (e.g., `'usr1'`) |
| `name` | string | Nama lengkap user |
| `email` | string | Email login |
| `password` | string | Password (hashed in production) |
| `role` | enum | `'user' | 'admin' | 'partner'` |
| `createdAt` | string | Timestamp ISO |

#### [Entity 2]
*Key: `app_[entity_name]`*
| Key | Type | Description |
| :--- | :--- | :--- |
| `id` | string | Unique identifier |
| `[field1]` | type | Description |
| `[field2]` | type | Description |

## 2. Target Production Schema (SQLite/MySQL)

Untuk fase production, kami telah merancang schema database yang lebih robust.

### Schema Overview

```mermaid
erDiagram
    User ||--o{ [Entity2] : "relationship"
    User {
        string id PK
        string email UK
        string role
    }
    [Entity2] {
        string id PK
        string userId FK
        string status
    }
```

### SQL Definition

```sql
-- User Management
CREATE TABLE `User` (
  `id` varchar(191) NOT NULL PRIMARY KEY,
  `email` varchar(191) NOT NULL UNIQUE,
  `name` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `role` varchar(50) DEFAULT 'user',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
);

-- [Entity 2]
CREATE TABLE `[Entity2]` (
  `id` varchar(191) NOT NULL PRIMARY KEY,
  `userId` varchar(191) NOT NULL,
  `status` varchar(50) DEFAULT 'active',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
);
```

## Relationships

[Jelaskan relasi antar entity di sini]
