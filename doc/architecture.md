# NestJS Folder Structure

## Recommended Architecture: Feature-Based Modular Architecture

```text
src/
├── main.ts
├── app.module.ts
│
├── config/
│   ├── configuration.ts
│   └── validation.schema.ts
│
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   ├── filters/
│   ├── pipes/
│   ├── exceptions/
│   ├── constants/
│   └── utils/
│
├── database/
│   ├── prisma.module.ts
│   ├── prisma.service.ts
│   └── prisma.constants.ts
│
├── generated/
│   └── prisma/              # Auto-generated Prisma Client
│
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   ├── guards/
│   │   └── dto/
│   │
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.repository.ts
│   │   └── dto/
│   │
│   ├── products/
│   │   ├── products.module.ts
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   ├── products.repository.ts
│   │   └── dto/
│   │
│   └── orders/
│       ├── orders.module.ts
│       ├── orders.controller.ts
│       ├── orders.service.ts
│       ├── orders.repository.ts
│       └── dto/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├──prisma.config.ts
├──.env
│
...
```

## Request Flow

Client
↓
Controller
↓
Service
↓
Repository
↓
Database

## Layer Responsibilities

| Layer      | Responsibility              |
| ---------- | --------------------------- |
| Controller | HTTP requests and responses |
| Service    | Business logic              |
| Repository | Database queries            |
| Entity     | Database/domain model       |
| DTO        | Input validation            |
| Module     | Dependency injection        |

## Clean Architecture (For Large Projects)

```text
modules/
└── users/
    ├── users.module.ts
    │
    ├── presentation/
    │   ├── users.controller.ts
    │   └── dto/
    │
    ├── application/
    │   ├── use-cases/
    │   │   ├── create-user.use-case.ts
    │   │   ├── get-user.use-case.ts
    │   │   └── update-user.use-case.ts
    │   └── services/
    │
    ├── domain/
    │   ├── entities/
    │   ├── repositories/
    │   ├── value-objects/
    │   └── interfaces/
    │
    └── infrastructure/
        ├── persistence/
        │   ├── user.repository.ts
        │   └── user.schema.ts
        └── adapters/
```

## Best Practices

1. Keep controllers thin.
2. Put business logic in services or use cases.
3. Group code by business feature.
4. Separate DTOs from database entities.
5. Use dependency injection.
6. Avoid circular dependencies.
7. Keep common/ for cross-cutting concerns.
8. Avoid unnecessary abstractions.
9. Write unit and integration tests.

## Architecture Recommendation

| Project Size            | Architecture                 |
| ----------------------- | ---------------------------- |
| Small CRUD API          | Feature-based modules        |
| Medium application      | Feature-based + repositories |
| Large enterprise API    | Clean Architecture           |
| Complex business system | Clean Architecture + DDD     |

**Recommended:** Start with Feature-Based Modular Architecture and introduce Clean Architecture selectively when business logic becomes complex.
