/**
 * Vitest setup file
 * Runs before all test suites
 *
 * Includes mocks for NestJS, Vendure, and TypeORM dependencies
 */

import { vi } from 'vitest';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_HOST = 'localhost';
process.env.DATABASE_NAME = 'jade_marketplace_test';
process.env.REDIS_HOST = 'localhost';
process.env.JWT_SECRET = 'test-secret';

// ========================================
// Mock @nestjs/common
// ========================================
vi.mock('@nestjs/common', () => ({
  Injectable: () => (target: any) => target,
  Inject: () => () => {},
  Module: () => () => {},
  Logger: class {
    log = vi.fn();
    error = vi.fn();
    warn = vi.fn();
    debug = vi.fn();
    verbose = vi.fn();
    static log = vi.fn();
    static error = vi.fn();
    static warn = vi.fn();
    static debug = vi.fn();
    static verbose = vi.fn();
  },
  HttpException: class extends Error {
    constructor(response: string | object, status: number) {
      super(typeof response === 'string' ? response : JSON.stringify(response));
    }
  },
  BadRequestException: class extends Error {},
  NotFoundException: class extends Error {},
  UnauthorizedException: class extends Error {},
  ForbiddenException: class extends Error {},
  ConflictException: class extends Error {},
}));

// ========================================
// Mock @nestjs/typeorm
// ========================================
vi.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => {},
  TypeOrmModule: {
    forFeature: () => ({}),
    forRoot: () => ({}),
    forRootAsync: () => ({}),
  },
  getRepositoryToken: (entity: any) => `${entity.name}Repository`,
}));

// ========================================
// Mock @vendure/core
// ========================================
vi.mock('@vendure/core', () => ({
  RequestContext: class {
    static deserialize = vi.fn();
    static empty = () => ({});
    channelId: string = 'test-channel';
    languageCode: string = 'en';
    apiType: string = 'admin';
    isAuthorized: boolean = true;
    authorizedAsOwnerOnly: boolean = false;
    session: any = null;
  },
  PluginCommonModule: {},
  VendurePlugin: () => () => {},
  LanguageCode: {
    en: 'en',
    es: 'es',
    fr: 'fr',
  },
  ID: String,
  Permission: {
    CreateProduct: 'CreateProduct',
    ReadProduct: 'ReadProduct',
    UpdateProduct: 'UpdateProduct',
    DeleteProduct: 'DeleteProduct',
    Authenticated: 'Authenticated',
    Public: 'Public',
    Owner: 'Owner',
    SuperAdmin: 'SuperAdmin',
  },
  Allow: () => () => {},
  Ctx: () => () => {},
  Transaction: () => () => {},
  TransactionalConnection: class {
    getRepository = vi.fn();
    transaction = vi.fn();
    rawConnection: any = {};
  },
  Logger: class {
    info = vi.fn();
    error = vi.fn();
    warn = vi.fn();
    debug = vi.fn();
    verbose = vi.fn();
    static info = vi.fn();
    static error = vi.fn();
    static warn = vi.fn();
    static debug = vi.fn();
    static verbose = vi.fn();
  },
  Resolver: () => () => {},
  Query: () => () => {},
  Mutation: () => () => {},
  Args: () => () => {},
  VendureEntity: class {},
  DeepPartial: {},
}));

// ========================================
// Mock typeorm decorators and utilities
// ========================================
vi.mock('typeorm', async (importOriginal) => {
  const original = await importOriginal<typeof import('typeorm')>();
  return {
    ...original,
    // Entity decorators
    Entity: () => () => {},
    Column: () => () => {},
    PrimaryGeneratedColumn: () => () => {},
    PrimaryColumn: () => () => {},
    ManyToOne: () => () => {},
    OneToMany: () => () => {},
    ManyToMany: () => () => {},
    OneToOne: () => () => {},
    JoinColumn: () => () => {},
    JoinTable: () => () => {},
    CreateDateColumn: () => () => {},
    UpdateDateColumn: () => () => {},
    DeleteDateColumn: () => () => {},
    Index: () => () => {},
    Unique: () => () => {},
    Check: () => () => {},
    BeforeInsert: () => () => {},
    BeforeUpdate: () => () => {},
    AfterInsert: () => () => {},
    AfterUpdate: () => () => {},
    AfterLoad: () => () => {},
    // Keep functional utilities
    In: original.In,
    Not: original.Not,
    Like: original.Like,
    ILike: original.ILike,
    Between: original.Between,
    LessThan: original.LessThan,
    LessThanOrEqual: original.LessThanOrEqual,
    MoreThan: original.MoreThan,
    MoreThanOrEqual: original.MoreThanOrEqual,
    IsNull: original.IsNull,
    // Mock classes
    Repository: class {
      find = vi.fn().mockResolvedValue([]);
      findOne = vi.fn().mockResolvedValue(null);
      findOneBy = vi.fn().mockResolvedValue(null);
      save = vi.fn().mockImplementation((entity) => Promise.resolve(entity));
      create = vi.fn().mockImplementation((data) => data);
      delete = vi.fn().mockResolvedValue({ affected: 1 });
      update = vi.fn().mockResolvedValue({ affected: 1 });
      createQueryBuilder = vi.fn().mockReturnValue({
        where: vi.fn().mockReturnThis(),
        andWhere: vi.fn().mockReturnThis(),
        orWhere: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        addSelect: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        leftJoinAndSelect: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        innerJoinAndSelect: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        addOrderBy: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        take: vi.fn().mockReturnThis(),
        groupBy: vi.fn().mockReturnThis(),
        having: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue([]),
        getOne: vi.fn().mockResolvedValue(null),
        getCount: vi.fn().mockResolvedValue(0),
        getManyAndCount: vi.fn().mockResolvedValue([[], 0]),
        getRawMany: vi.fn().mockResolvedValue([]),
        getRawOne: vi.fn().mockResolvedValue(null),
        execute: vi.fn().mockResolvedValue({}),
      });
    },
    DataSource: class {
      initialize = vi.fn().mockResolvedValue(this);
      destroy = vi.fn().mockResolvedValue(undefined);
      getRepository = vi.fn();
      transaction = vi.fn();
      createQueryRunner = vi.fn().mockReturnValue({
        connect: vi.fn(),
        startTransaction: vi.fn(),
        commitTransaction: vi.fn(),
        rollbackTransaction: vi.fn(),
        release: vi.fn(),
        manager: {
          save: vi.fn(),
          find: vi.fn(),
          findOne: vi.fn(),
        },
      });
    },
    EntityManager: class {
      save = vi.fn();
      find = vi.fn();
      findOne = vi.fn();
      delete = vi.fn();
      update = vi.fn();
      transaction = vi.fn();
    },
  };
});

// ========================================
// Mock @nestjs/graphql
// ========================================
vi.mock('@nestjs/graphql', () => ({
  Resolver: () => () => {},
  Query: () => () => {},
  Mutation: () => () => {},
  Args: () => () => {},
  ResolveField: () => () => {},
  Parent: () => () => {},
  Context: () => () => {},
  ObjectType: () => () => {},
  Field: () => () => {},
  InputType: () => () => {},
  Int: () => () => {},
  Float: () => () => {},
  ID: () => () => {},
  registerEnumType: () => {},
}));

// ========================================
// Global test utilities
// ========================================
global.console = {
  ...console,
  // Suppress logs during tests unless explicitly needed
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: console.warn,
  error: console.error,
};

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
