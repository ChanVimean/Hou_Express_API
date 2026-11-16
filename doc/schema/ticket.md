# Ticket & Expense Request Database Schema

Documentation for the Ticket Management, Approval Workflow, and Payment Tracking domain in **Hou_Express_API**.

## Schema Location (Prisma Multi-File Setup)

The models and enums for this domain are modularized across the following schema files:

- **Models:**
  - `prisma/schema/models/ticket.prisma`
  - `prisma/schema/models/ticket-category.prisma`
  - `prisma/schema/models/ticket-attachment.prisma`
  - `prisma/schema/models/ticket-payment.prisma`
  - `prisma/schema/models/ticket-status-history.prisma`
- **Enums:**
  - `prisma/schema/enums/` (contains `TicketStatus`, `TicketPriority`, `PaymentStatus`, `TicketHistoryAction`)

---

## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    TicketCategory ||--o{ Ticket : "categories"
    Ticket ||--o{ TicketAttachment : "contains"
    Ticket ||--o{ TicketStatusHistory : "logs"
    Ticket ||--o| TicketPayment : "has payment"

    Ticket {
        int id PK
        varchar(50) ticket_number UK
        int category_id FK
        text description
        decimal(12,2) estimate_amount
        enum priority
        enum status
        datetime(0) deadline
        char(36) requested_by
        datetime created_at
        datetime updated_at
    }

    TicketCategory {
        int id PK
        varchar(100) name UK
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    TicketAttachment {
        int id PK
        int ticket_id FK
        varchar(255) file_name
        varchar(500) file_path
        varchar(100) mime_type
        int file_size
        datetime created_at
    }

    TicketPayment {
        int id PK
        int ticket_id UK, FK
        enum status
        char(36) paid_by
        datetime paid_at
        datetime created_at
        datetime updated_at
    }

    TicketStatusHistory {
        int id PK
        int ticket_id FK
        enum action
        char(36) action_by
        text comment
        datetime created_at
    }
```

---

## Enum Definitions

| Enum Name             | Values                                         | Usage                                                   |
| :-------------------- | :--------------------------------------------- | :------------------------------------------------------ |
| `TicketStatus`        | `PENDING`, `APPROVED`, `REJECTED`              | Current approval state of a ticket.                     |
| `TicketPriority`      | `NORMAL`, `URGENT`                             | Urgency level of the ticket request.                    |
| `PaymentStatus`       | `UNPAID`, `PAID`                               | Disbursement/settlement state of an approved ticket.    |
| `TicketHistoryAction` | `SUBMITTED`, `PENDING`, `APPROVED`, `REJECTED` | Audit trail action recorded in `ticket_status_history`. |

---

## Table Specifications

### 1. `tickets` (`Ticket`)

Core table storing expense/request tickets, financial estimates, and current workflow status.

| Prisma Field     | DB Column         | Type             | Constraints                | Description                                           |
| :--------------- | :---------------- | :--------------- | :------------------------- | :---------------------------------------------------- |
| `id`             | `id`              | `INT`            | `PK`, `AUTO_INCREMENT`     | Unique ticket identifier.                             |
| `ticketNumber`   | `ticket_number`   | `VARCHAR(50)`    | `UNIQUE`, `NOT NULL`       | Human-readable tracking code (e.g., `TKT-2026-0001`). |
| `categoryId`     | `category_id`     | `INT`            | `FK`, `NOT NULL`           | References `ticket_categories.id`.                    |
| `description`    | `description`     | `TEXT`           | `NOT NULL`                 | Detailed justification or scope of the request.       |
| `estimateAmount` | `estimate_amount` | `DECIMAL(12, 2)` | `NOT NULL`                 | Requested budget/cost amount.                         |
| `priority`       | `priority`        | `ENUM`           | `DEFAULT NORMAL`, `INDEX`  | `TicketPriority` (`NORMAL` or `URGENT`).              |
| `status`         | `status`          | `ENUM`           | `DEFAULT PENDING`, `INDEX` | `TicketStatus` (`PENDING`, `APPROVED`, `REJECTED`).   |
| `deadline`       | `deadline`        | `DATETIME(0)`    | `NOT NULL`, `INDEX`        | Target completion or payment due date.                |
| `requestedBy`    | `requested_by`    | `CHAR(36)`       | `NOT NULL`, `INDEX`        | Plain reference to `users.id` (requester).            |
| `createdAt`      | `created_at`      | `DATETIME`       | `DEFAULT now()`, `INDEX`   | Record creation timestamp.                            |
| `updatedAt`      | `updated_at`      | `DATETIME`       | `@updatedAt`               | Last modification timestamp.                          |

---

### 2. `ticket_categories` (`TicketCategory`)

Lookup table defining available ticket/expense classifications.

| Prisma Field | DB Column    | Type           | Constraints            | Description                                                    |
| :----------- | :----------- | :------------- | :--------------------- | :------------------------------------------------------------- |
| `id`         | `id`         | `INT`          | `PK`, `AUTO_INCREMENT` | Unique category identifier.                                    |
| `name`       | `name`       | `VARCHAR(100)` | `UNIQUE`, `NOT NULL`   | Category title (e.g., `Hardware`, `Travel`, `Operations`).     |
| `isActive`   | `is_active`  | `BOOLEAN`      | `DEFAULT true`         | Soft-toggle for hiding deprecated categories from new tickets. |
| `createdAt`  | `created_at` | `DATETIME`     | `DEFAULT now()`        | Record creation timestamp.                                     |
| `updatedAt`  | `updated_at` | `DATETIME`     | `@updatedAt`           | Last modification timestamp.                                   |

---

### 3. `ticket_attachments` (`TicketAttachment`)

Stores metadata for supporting documents, quotes, or receipts uploaded to a ticket.

| Prisma Field | DB Column    | Type           | Constraints            | Description                                            |
| :----------- | :----------- | :------------- | :--------------------- | :----------------------------------------------------- |
| `id`         | `id`         | `INT`          | `PK`, `AUTO_INCREMENT` | Unique attachment identifier.                          |
| `ticketId`   | `ticket_id`  | `INT`          | `FK`, `INDEX`          | References `tickets.id`.                               |
| `fileName`   | `file_name`  | `VARCHAR(255)` | `NOT NULL`             | Original uploaded filename.                            |
| `filePath`   | `file_path`  | `VARCHAR(500)` | `NOT NULL`             | Storage path or object key.                            |
| `mimeType`   | `mime_type`  | `VARCHAR(100)` | `NULLABLE`             | File MIME type (e.g., `application/pdf`, `image/png`). |
| `fileSize`   | `file_size`  | `INT`          | `NULLABLE`             | File size in bytes.                                    |
| `createdAt`  | `created_at` | `DATETIME`     | `DEFAULT now()`        | Upload timestamp.                                      |

---

### 4. `ticket_payments` (`TicketPayment`)

Tracks the 1-to-1 financial settlement state for a ticket.

| Prisma Field | DB Column    | Type       | Constraints            | Description                                                          |
| :----------- | :----------- | :--------- | :--------------------- | :------------------------------------------------------------------- |
| `id`         | `id`         | `INT`      | `PK`, `AUTO_INCREMENT` | Unique payment record identifier.                                    |
| `ticketId`   | `ticket_id`  | `INT`      | `UNIQUE`, `FK`         | Enforces 1-to-1 relation with `tickets.id`.                          |
| `status`     | `status`     | `ENUM`     | `DEFAULT UNPAID`       | `PaymentStatus` (`UNPAID` or `PAID`).                                |
| `paidBy`     | `paid_by`    | `CHAR(36)` | `NULLABLE`             | Plain reference to `users.id` (finance/admin who processed payment). |
| `paidAt`     | `paid_at`    | `DATETIME` | `NULLABLE`             | Timestamp when payment was marked `PAID`.                            |
| `createdAt`  | `created_at` | `DATETIME` | `DEFAULT now()`        | Record creation timestamp.                                           |
| `updatedAt`  | `updated_at` | `DATETIME` | `@updatedAt`           | Last modification timestamp.                                         |

---

### 5. `ticket_status_history` (`TicketStatusHistory`)

Append-only audit log tracking every state transition and reviewer comment on a ticket.

| Prisma Field | DB Column    | Type       | Constraints              | Description                                                             |
| :----------- | :----------- | :--------- | :----------------------- | :---------------------------------------------------------------------- |
| `id`         | `id`         | `INT`      | `PK`, `AUTO_INCREMENT`   | Unique history log identifier.                                          |
| `ticketId`   | `ticket_id`  | `INT`      | `FK`, `INDEX`            | References `tickets.id`.                                                |
| `action`     | `action`     | `ENUM`     | `NOT NULL`, `INDEX`      | `TicketHistoryAction` (`SUBMITTED`, `PENDING`, `APPROVED`, `REJECTED`). |
| `actionBy`   | `action_by`  | `CHAR(36)` | `NOT NULL`               | Plain reference to `users.id` (actor who triggered the action).         |
| `comment`    | `comment`    | `TEXT`     | `NULLABLE`               | Optional approval notes or rejection reason.                            |
| `createdAt`  | `created_at` | `DATETIME` | `DEFAULT now()`, `INDEX` | Timestamp when the action occurred.                                     |

---

## Referential Integrity & Design Notes

- **Decoupled User References:** `requested_by`, `paid_by`, and `action_by` store `CHAR(36)` UUIDs referencing `users.id` without database-level foreign key constraints, keeping the Ticket domain loosely coupled from the User domain.
- **Ticket Deletion (`Cascade`):** Deleting a `Ticket` automatically deletes its child records across `ticket_attachments`, `ticket_status_history`, and `ticket_payments` (`onDelete: Cascade`).
- **Category Protection (Default `Restrict`):** Deleting a `TicketCategory` is blocked if any `Ticket` references it. Use `is_active = false` to archive categories safely.
- **Indexing Strategy:** `tickets` is indexed on `status`, `priority`, `created_at`, `deadline`, and `requested_by` to optimize dashboard filtering, SLA/deadline sorting, and per-user ticket lookups.
