
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model UserAccount
 * 
 */
export type UserAccount = $Result.DefaultSelection<Prisma.$UserAccountPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserProfile: {
  HOMEOWNER: 'HOMEOWNER',
  CLEANER: 'CLEANER',
  ADMIN: 'ADMIN',
  PLATFORM: 'PLATFORM'
};

export type UserProfile = (typeof UserProfile)[keyof typeof UserProfile]

}

export type UserProfile = $Enums.UserProfile

export const UserProfile: typeof $Enums.UserProfile

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more UserAccounts
 * const userAccounts = await prisma.userAccount.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more UserAccounts
   * const userAccounts = await prisma.userAccount.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.userAccount`: Exposes CRUD operations for the **UserAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserAccounts
    * const userAccounts = await prisma.userAccount.findMany()
    * ```
    */
  get userAccount(): Prisma.UserAccountDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    UserAccount: 'UserAccount'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "userAccount"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      UserAccount: {
        payload: Prisma.$UserAccountPayload<ExtArgs>
        fields: Prisma.UserAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>
          }
          findFirst: {
            args: Prisma.UserAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>
          }
          findMany: {
            args: Prisma.UserAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>[]
          }
          create: {
            args: Prisma.UserAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>
          }
          createMany: {
            args: Prisma.UserAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserAccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>[]
          }
          delete: {
            args: Prisma.UserAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>
          }
          update: {
            args: Prisma.UserAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>
          }
          deleteMany: {
            args: Prisma.UserAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserAccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>[]
          }
          upsert: {
            args: Prisma.UserAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>
          }
          aggregate: {
            args: Prisma.UserAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserAccount>
          }
          groupBy: {
            args: Prisma.UserAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserAccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserAccountCountArgs<ExtArgs>
            result: $Utils.Optional<UserAccountCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    userAccount?: UserAccountOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model UserAccount
   */

  export type AggregateUserAccount = {
    _count: UserAccountCountAggregateOutputType | null
    _min: UserAccountMinAggregateOutputType | null
    _max: UserAccountMaxAggregateOutputType | null
  }

  export type UserAccountMinAggregateOutputType = {
    username: string | null
    password: string | null
    userProfile: $Enums.UserProfile | null
  }

  export type UserAccountMaxAggregateOutputType = {
    username: string | null
    password: string | null
    userProfile: $Enums.UserProfile | null
  }

  export type UserAccountCountAggregateOutputType = {
    username: number
    password: number
    userProfile: number
    _all: number
  }


  export type UserAccountMinAggregateInputType = {
    username?: true
    password?: true
    userProfile?: true
  }

  export type UserAccountMaxAggregateInputType = {
    username?: true
    password?: true
    userProfile?: true
  }

  export type UserAccountCountAggregateInputType = {
    username?: true
    password?: true
    userProfile?: true
    _all?: true
  }

  export type UserAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserAccount to aggregate.
     */
    where?: UserAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAccounts to fetch.
     */
    orderBy?: UserAccountOrderByWithRelationInput | UserAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserAccounts
    **/
    _count?: true | UserAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserAccountMaxAggregateInputType
  }

  export type GetUserAccountAggregateType<T extends UserAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateUserAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserAccount[P]>
      : GetScalarType<T[P], AggregateUserAccount[P]>
  }




  export type UserAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserAccountWhereInput
    orderBy?: UserAccountOrderByWithAggregationInput | UserAccountOrderByWithAggregationInput[]
    by: UserAccountScalarFieldEnum[] | UserAccountScalarFieldEnum
    having?: UserAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserAccountCountAggregateInputType | true
    _min?: UserAccountMinAggregateInputType
    _max?: UserAccountMaxAggregateInputType
  }

  export type UserAccountGroupByOutputType = {
    username: string
    password: string
    userProfile: $Enums.UserProfile
    _count: UserAccountCountAggregateOutputType | null
    _min: UserAccountMinAggregateOutputType | null
    _max: UserAccountMaxAggregateOutputType | null
  }

  type GetUserAccountGroupByPayload<T extends UserAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserAccountGroupByOutputType[P]>
            : GetScalarType<T[P], UserAccountGroupByOutputType[P]>
        }
      >
    >


  export type UserAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    username?: boolean
    password?: boolean
    userProfile?: boolean
  }, ExtArgs["result"]["userAccount"]>

  export type UserAccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    username?: boolean
    password?: boolean
    userProfile?: boolean
  }, ExtArgs["result"]["userAccount"]>

  export type UserAccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    username?: boolean
    password?: boolean
    userProfile?: boolean
  }, ExtArgs["result"]["userAccount"]>

  export type UserAccountSelectScalar = {
    username?: boolean
    password?: boolean
    userProfile?: boolean
  }

  export type UserAccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"username" | "password" | "userProfile", ExtArgs["result"]["userAccount"]>

  export type $UserAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserAccount"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      username: string
      password: string
      userProfile: $Enums.UserProfile
    }, ExtArgs["result"]["userAccount"]>
    composites: {}
  }

  type UserAccountGetPayload<S extends boolean | null | undefined | UserAccountDefaultArgs> = $Result.GetResult<Prisma.$UserAccountPayload, S>

  type UserAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserAccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserAccountCountAggregateInputType | true
    }

  export interface UserAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserAccount'], meta: { name: 'UserAccount' } }
    /**
     * Find zero or one UserAccount that matches the filter.
     * @param {UserAccountFindUniqueArgs} args - Arguments to find a UserAccount
     * @example
     * // Get one UserAccount
     * const userAccount = await prisma.userAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserAccountFindUniqueArgs>(args: SelectSubset<T, UserAccountFindUniqueArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserAccount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserAccountFindUniqueOrThrowArgs} args - Arguments to find a UserAccount
     * @example
     * // Get one UserAccount
     * const userAccount = await prisma.userAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, UserAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccountFindFirstArgs} args - Arguments to find a UserAccount
     * @example
     * // Get one UserAccount
     * const userAccount = await prisma.userAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserAccountFindFirstArgs>(args?: SelectSubset<T, UserAccountFindFirstArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccountFindFirstOrThrowArgs} args - Arguments to find a UserAccount
     * @example
     * // Get one UserAccount
     * const userAccount = await prisma.userAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, UserAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserAccounts
     * const userAccounts = await prisma.userAccount.findMany()
     * 
     * // Get first 10 UserAccounts
     * const userAccounts = await prisma.userAccount.findMany({ take: 10 })
     * 
     * // Only select the `username`
     * const userAccountWithUsernameOnly = await prisma.userAccount.findMany({ select: { username: true } })
     * 
     */
    findMany<T extends UserAccountFindManyArgs>(args?: SelectSubset<T, UserAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserAccount.
     * @param {UserAccountCreateArgs} args - Arguments to create a UserAccount.
     * @example
     * // Create one UserAccount
     * const UserAccount = await prisma.userAccount.create({
     *   data: {
     *     // ... data to create a UserAccount
     *   }
     * })
     * 
     */
    create<T extends UserAccountCreateArgs>(args: SelectSubset<T, UserAccountCreateArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserAccounts.
     * @param {UserAccountCreateManyArgs} args - Arguments to create many UserAccounts.
     * @example
     * // Create many UserAccounts
     * const userAccount = await prisma.userAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserAccountCreateManyArgs>(args?: SelectSubset<T, UserAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserAccounts and returns the data saved in the database.
     * @param {UserAccountCreateManyAndReturnArgs} args - Arguments to create many UserAccounts.
     * @example
     * // Create many UserAccounts
     * const userAccount = await prisma.userAccount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserAccounts and only return the `username`
     * const userAccountWithUsernameOnly = await prisma.userAccount.createManyAndReturn({
     *   select: { username: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserAccountCreateManyAndReturnArgs>(args?: SelectSubset<T, UserAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserAccount.
     * @param {UserAccountDeleteArgs} args - Arguments to delete one UserAccount.
     * @example
     * // Delete one UserAccount
     * const UserAccount = await prisma.userAccount.delete({
     *   where: {
     *     // ... filter to delete one UserAccount
     *   }
     * })
     * 
     */
    delete<T extends UserAccountDeleteArgs>(args: SelectSubset<T, UserAccountDeleteArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserAccount.
     * @param {UserAccountUpdateArgs} args - Arguments to update one UserAccount.
     * @example
     * // Update one UserAccount
     * const userAccount = await prisma.userAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserAccountUpdateArgs>(args: SelectSubset<T, UserAccountUpdateArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserAccounts.
     * @param {UserAccountDeleteManyArgs} args - Arguments to filter UserAccounts to delete.
     * @example
     * // Delete a few UserAccounts
     * const { count } = await prisma.userAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserAccountDeleteManyArgs>(args?: SelectSubset<T, UserAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserAccounts
     * const userAccount = await prisma.userAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserAccountUpdateManyArgs>(args: SelectSubset<T, UserAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserAccounts and returns the data updated in the database.
     * @param {UserAccountUpdateManyAndReturnArgs} args - Arguments to update many UserAccounts.
     * @example
     * // Update many UserAccounts
     * const userAccount = await prisma.userAccount.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserAccounts and only return the `username`
     * const userAccountWithUsernameOnly = await prisma.userAccount.updateManyAndReturn({
     *   select: { username: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserAccountUpdateManyAndReturnArgs>(args: SelectSubset<T, UserAccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserAccount.
     * @param {UserAccountUpsertArgs} args - Arguments to update or create a UserAccount.
     * @example
     * // Update or create a UserAccount
     * const userAccount = await prisma.userAccount.upsert({
     *   create: {
     *     // ... data to create a UserAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserAccount we want to update
     *   }
     * })
     */
    upsert<T extends UserAccountUpsertArgs>(args: SelectSubset<T, UserAccountUpsertArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccountCountArgs} args - Arguments to filter UserAccounts to count.
     * @example
     * // Count the number of UserAccounts
     * const count = await prisma.userAccount.count({
     *   where: {
     *     // ... the filter for the UserAccounts we want to count
     *   }
     * })
    **/
    count<T extends UserAccountCountArgs>(
      args?: Subset<T, UserAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAccountAggregateArgs>(args: Subset<T, UserAccountAggregateArgs>): Prisma.PrismaPromise<GetUserAccountAggregateType<T>>

    /**
     * Group by UserAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserAccountGroupByArgs['orderBy'] }
        : { orderBy?: UserAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserAccount model
   */
  readonly fields: UserAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserAccount model
   */
  interface UserAccountFieldRefs {
    readonly username: FieldRef<"UserAccount", 'String'>
    readonly password: FieldRef<"UserAccount", 'String'>
    readonly userProfile: FieldRef<"UserAccount", 'UserProfile'>
  }
    

  // Custom InputTypes
  /**
   * UserAccount findUnique
   */
  export type UserAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * Filter, which UserAccount to fetch.
     */
    where: UserAccountWhereUniqueInput
  }

  /**
   * UserAccount findUniqueOrThrow
   */
  export type UserAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * Filter, which UserAccount to fetch.
     */
    where: UserAccountWhereUniqueInput
  }

  /**
   * UserAccount findFirst
   */
  export type UserAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * Filter, which UserAccount to fetch.
     */
    where?: UserAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAccounts to fetch.
     */
    orderBy?: UserAccountOrderByWithRelationInput | UserAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserAccounts.
     */
    cursor?: UserAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserAccounts.
     */
    distinct?: UserAccountScalarFieldEnum | UserAccountScalarFieldEnum[]
  }

  /**
   * UserAccount findFirstOrThrow
   */
  export type UserAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * Filter, which UserAccount to fetch.
     */
    where?: UserAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAccounts to fetch.
     */
    orderBy?: UserAccountOrderByWithRelationInput | UserAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserAccounts.
     */
    cursor?: UserAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserAccounts.
     */
    distinct?: UserAccountScalarFieldEnum | UserAccountScalarFieldEnum[]
  }

  /**
   * UserAccount findMany
   */
  export type UserAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * Filter, which UserAccounts to fetch.
     */
    where?: UserAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAccounts to fetch.
     */
    orderBy?: UserAccountOrderByWithRelationInput | UserAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserAccounts.
     */
    cursor?: UserAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAccounts.
     */
    skip?: number
    distinct?: UserAccountScalarFieldEnum | UserAccountScalarFieldEnum[]
  }

  /**
   * UserAccount create
   */
  export type UserAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * The data needed to create a UserAccount.
     */
    data: XOR<UserAccountCreateInput, UserAccountUncheckedCreateInput>
  }

  /**
   * UserAccount createMany
   */
  export type UserAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserAccounts.
     */
    data: UserAccountCreateManyInput | UserAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserAccount createManyAndReturn
   */
  export type UserAccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * The data used to create many UserAccounts.
     */
    data: UserAccountCreateManyInput | UserAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserAccount update
   */
  export type UserAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * The data needed to update a UserAccount.
     */
    data: XOR<UserAccountUpdateInput, UserAccountUncheckedUpdateInput>
    /**
     * Choose, which UserAccount to update.
     */
    where: UserAccountWhereUniqueInput
  }

  /**
   * UserAccount updateMany
   */
  export type UserAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserAccounts.
     */
    data: XOR<UserAccountUpdateManyMutationInput, UserAccountUncheckedUpdateManyInput>
    /**
     * Filter which UserAccounts to update
     */
    where?: UserAccountWhereInput
    /**
     * Limit how many UserAccounts to update.
     */
    limit?: number
  }

  /**
   * UserAccount updateManyAndReturn
   */
  export type UserAccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * The data used to update UserAccounts.
     */
    data: XOR<UserAccountUpdateManyMutationInput, UserAccountUncheckedUpdateManyInput>
    /**
     * Filter which UserAccounts to update
     */
    where?: UserAccountWhereInput
    /**
     * Limit how many UserAccounts to update.
     */
    limit?: number
  }

  /**
   * UserAccount upsert
   */
  export type UserAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * The filter to search for the UserAccount to update in case it exists.
     */
    where: UserAccountWhereUniqueInput
    /**
     * In case the UserAccount found by the `where` argument doesn't exist, create a new UserAccount with this data.
     */
    create: XOR<UserAccountCreateInput, UserAccountUncheckedCreateInput>
    /**
     * In case the UserAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserAccountUpdateInput, UserAccountUncheckedUpdateInput>
  }

  /**
   * UserAccount delete
   */
  export type UserAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * Filter which UserAccount to delete.
     */
    where: UserAccountWhereUniqueInput
  }

  /**
   * UserAccount deleteMany
   */
  export type UserAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserAccounts to delete
     */
    where?: UserAccountWhereInput
    /**
     * Limit how many UserAccounts to delete.
     */
    limit?: number
  }

  /**
   * UserAccount without action
   */
  export type UserAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserAccountScalarFieldEnum: {
    username: 'username',
    password: 'password',
    userProfile: 'userProfile'
  };

  export type UserAccountScalarFieldEnum = (typeof UserAccountScalarFieldEnum)[keyof typeof UserAccountScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserProfile'
   */
  export type EnumUserProfileFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserProfile'>
    


  /**
   * Reference to a field of type 'UserProfile[]'
   */
  export type ListEnumUserProfileFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserProfile[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type UserAccountWhereInput = {
    AND?: UserAccountWhereInput | UserAccountWhereInput[]
    OR?: UserAccountWhereInput[]
    NOT?: UserAccountWhereInput | UserAccountWhereInput[]
    username?: StringFilter<"UserAccount"> | string
    password?: StringFilter<"UserAccount"> | string
    userProfile?: EnumUserProfileFilter<"UserAccount"> | $Enums.UserProfile
  }

  export type UserAccountOrderByWithRelationInput = {
    username?: SortOrder
    password?: SortOrder
    userProfile?: SortOrder
  }

  export type UserAccountWhereUniqueInput = Prisma.AtLeast<{
    username?: string
    AND?: UserAccountWhereInput | UserAccountWhereInput[]
    OR?: UserAccountWhereInput[]
    NOT?: UserAccountWhereInput | UserAccountWhereInput[]
    password?: StringFilter<"UserAccount"> | string
    userProfile?: EnumUserProfileFilter<"UserAccount"> | $Enums.UserProfile
  }, "username">

  export type UserAccountOrderByWithAggregationInput = {
    username?: SortOrder
    password?: SortOrder
    userProfile?: SortOrder
    _count?: UserAccountCountOrderByAggregateInput
    _max?: UserAccountMaxOrderByAggregateInput
    _min?: UserAccountMinOrderByAggregateInput
  }

  export type UserAccountScalarWhereWithAggregatesInput = {
    AND?: UserAccountScalarWhereWithAggregatesInput | UserAccountScalarWhereWithAggregatesInput[]
    OR?: UserAccountScalarWhereWithAggregatesInput[]
    NOT?: UserAccountScalarWhereWithAggregatesInput | UserAccountScalarWhereWithAggregatesInput[]
    username?: StringWithAggregatesFilter<"UserAccount"> | string
    password?: StringWithAggregatesFilter<"UserAccount"> | string
    userProfile?: EnumUserProfileWithAggregatesFilter<"UserAccount"> | $Enums.UserProfile
  }

  export type UserAccountCreateInput = {
    username: string
    password: string
    userProfile?: $Enums.UserProfile
  }

  export type UserAccountUncheckedCreateInput = {
    username: string
    password: string
    userProfile?: $Enums.UserProfile
  }

  export type UserAccountUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    userProfile?: EnumUserProfileFieldUpdateOperationsInput | $Enums.UserProfile
  }

  export type UserAccountUncheckedUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    userProfile?: EnumUserProfileFieldUpdateOperationsInput | $Enums.UserProfile
  }

  export type UserAccountCreateManyInput = {
    username: string
    password: string
    userProfile?: $Enums.UserProfile
  }

  export type UserAccountUpdateManyMutationInput = {
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    userProfile?: EnumUserProfileFieldUpdateOperationsInput | $Enums.UserProfile
  }

  export type UserAccountUncheckedUpdateManyInput = {
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    userProfile?: EnumUserProfileFieldUpdateOperationsInput | $Enums.UserProfile
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumUserProfileFilter<$PrismaModel = never> = {
    equals?: $Enums.UserProfile | EnumUserProfileFieldRefInput<$PrismaModel>
    in?: $Enums.UserProfile[] | ListEnumUserProfileFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserProfile[] | ListEnumUserProfileFieldRefInput<$PrismaModel>
    not?: NestedEnumUserProfileFilter<$PrismaModel> | $Enums.UserProfile
  }

  export type UserAccountCountOrderByAggregateInput = {
    username?: SortOrder
    password?: SortOrder
    userProfile?: SortOrder
  }

  export type UserAccountMaxOrderByAggregateInput = {
    username?: SortOrder
    password?: SortOrder
    userProfile?: SortOrder
  }

  export type UserAccountMinOrderByAggregateInput = {
    username?: SortOrder
    password?: SortOrder
    userProfile?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumUserProfileWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserProfile | EnumUserProfileFieldRefInput<$PrismaModel>
    in?: $Enums.UserProfile[] | ListEnumUserProfileFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserProfile[] | ListEnumUserProfileFieldRefInput<$PrismaModel>
    not?: NestedEnumUserProfileWithAggregatesFilter<$PrismaModel> | $Enums.UserProfile
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserProfileFilter<$PrismaModel>
    _max?: NestedEnumUserProfileFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumUserProfileFieldUpdateOperationsInput = {
    set?: $Enums.UserProfile
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumUserProfileFilter<$PrismaModel = never> = {
    equals?: $Enums.UserProfile | EnumUserProfileFieldRefInput<$PrismaModel>
    in?: $Enums.UserProfile[] | ListEnumUserProfileFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserProfile[] | ListEnumUserProfileFieldRefInput<$PrismaModel>
    not?: NestedEnumUserProfileFilter<$PrismaModel> | $Enums.UserProfile
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumUserProfileWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserProfile | EnumUserProfileFieldRefInput<$PrismaModel>
    in?: $Enums.UserProfile[] | ListEnumUserProfileFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserProfile[] | ListEnumUserProfileFieldRefInput<$PrismaModel>
    not?: NestedEnumUserProfileWithAggregatesFilter<$PrismaModel> | $Enums.UserProfile
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserProfileFilter<$PrismaModel>
    _max?: NestedEnumUserProfileFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}