
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
 * Model UserProfile
 * 
 */
export type UserProfile = $Result.DefaultSelection<Prisma.$UserProfilePayload>
/**
 * Model ServiceListing
 * 
 */
export type ServiceListing = $Result.DefaultSelection<Prisma.$ServiceListingPayload>
/**
 * Model ProfileView
 * 
 */
export type ProfileView = $Result.DefaultSelection<Prisma.$ProfileViewPayload>
/**
 * Model Shortlist
 * 
 */
export type Shortlist = $Result.DefaultSelection<Prisma.$ShortlistPayload>
/**
 * Model ConfirmedMatch
 * 
 */
export type ConfirmedMatch = $Result.DefaultSelection<Prisma.$ConfirmedMatchPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Permission: {
  MANAGE_SERVICES: 'MANAGE_SERVICES',
  ADMIN_PRIVILEGES: 'ADMIN_PRIVILEGES',
  SEARCH_CLEANERS: 'SEARCH_CLEANERS',
  VIEW_REPORTS: 'VIEW_REPORTS'
};

export type Permission = (typeof Permission)[keyof typeof Permission]


export const UserProfileStatus: {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED'
};

export type UserProfileStatus = (typeof UserProfileStatus)[keyof typeof UserProfileStatus]


export const ServiceListingStatus: {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED'
};

export type ServiceListingStatus = (typeof ServiceListingStatus)[keyof typeof ServiceListingStatus]


export const UserStatus: {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  BANNED: 'BANNED'
};

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]

}

export type Permission = $Enums.Permission

export const Permission: typeof $Enums.Permission

export type UserProfileStatus = $Enums.UserProfileStatus

export const UserProfileStatus: typeof $Enums.UserProfileStatus

export type ServiceListingStatus = $Enums.ServiceListingStatus

export const ServiceListingStatus: typeof $Enums.ServiceListingStatus

export type UserStatus = $Enums.UserStatus

export const UserStatus: typeof $Enums.UserStatus

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

  /**
   * `prisma.userProfile`: Exposes CRUD operations for the **UserProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserProfiles
    * const userProfiles = await prisma.userProfile.findMany()
    * ```
    */
  get userProfile(): Prisma.UserProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.serviceListing`: Exposes CRUD operations for the **ServiceListing** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ServiceListings
    * const serviceListings = await prisma.serviceListing.findMany()
    * ```
    */
  get serviceListing(): Prisma.ServiceListingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.profileView`: Exposes CRUD operations for the **ProfileView** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProfileViews
    * const profileViews = await prisma.profileView.findMany()
    * ```
    */
  get profileView(): Prisma.ProfileViewDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.shortlist`: Exposes CRUD operations for the **Shortlist** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Shortlists
    * const shortlists = await prisma.shortlist.findMany()
    * ```
    */
  get shortlist(): Prisma.ShortlistDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.confirmedMatch`: Exposes CRUD operations for the **ConfirmedMatch** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConfirmedMatches
    * const confirmedMatches = await prisma.confirmedMatch.findMany()
    * ```
    */
  get confirmedMatch(): Prisma.ConfirmedMatchDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
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
    UserAccount: 'UserAccount',
    UserProfile: 'UserProfile',
    ServiceListing: 'ServiceListing',
    ProfileView: 'ProfileView',
    Shortlist: 'Shortlist',
    ConfirmedMatch: 'ConfirmedMatch'
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
      modelProps: "userAccount" | "userProfile" | "serviceListing" | "profileView" | "shortlist" | "confirmedMatch"
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
      UserProfile: {
        payload: Prisma.$UserProfilePayload<ExtArgs>
        fields: Prisma.UserProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          findFirst: {
            args: Prisma.UserProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          findMany: {
            args: Prisma.UserProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>[]
          }
          create: {
            args: Prisma.UserProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          createMany: {
            args: Prisma.UserProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>[]
          }
          delete: {
            args: Prisma.UserProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          update: {
            args: Prisma.UserProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          deleteMany: {
            args: Prisma.UserProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>[]
          }
          upsert: {
            args: Prisma.UserProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          aggregate: {
            args: Prisma.UserProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserProfile>
          }
          groupBy: {
            args: Prisma.UserProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserProfileCountArgs<ExtArgs>
            result: $Utils.Optional<UserProfileCountAggregateOutputType> | number
          }
        }
      }
      ServiceListing: {
        payload: Prisma.$ServiceListingPayload<ExtArgs>
        fields: Prisma.ServiceListingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ServiceListingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceListingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ServiceListingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceListingPayload>
          }
          findFirst: {
            args: Prisma.ServiceListingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceListingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ServiceListingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceListingPayload>
          }
          findMany: {
            args: Prisma.ServiceListingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceListingPayload>[]
          }
          create: {
            args: Prisma.ServiceListingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceListingPayload>
          }
          createMany: {
            args: Prisma.ServiceListingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ServiceListingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceListingPayload>[]
          }
          delete: {
            args: Prisma.ServiceListingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceListingPayload>
          }
          update: {
            args: Prisma.ServiceListingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceListingPayload>
          }
          deleteMany: {
            args: Prisma.ServiceListingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ServiceListingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ServiceListingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceListingPayload>[]
          }
          upsert: {
            args: Prisma.ServiceListingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceListingPayload>
          }
          aggregate: {
            args: Prisma.ServiceListingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateServiceListing>
          }
          groupBy: {
            args: Prisma.ServiceListingGroupByArgs<ExtArgs>
            result: $Utils.Optional<ServiceListingGroupByOutputType>[]
          }
          count: {
            args: Prisma.ServiceListingCountArgs<ExtArgs>
            result: $Utils.Optional<ServiceListingCountAggregateOutputType> | number
          }
        }
      }
      ProfileView: {
        payload: Prisma.$ProfileViewPayload<ExtArgs>
        fields: Prisma.ProfileViewFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfileViewFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileViewPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfileViewFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileViewPayload>
          }
          findFirst: {
            args: Prisma.ProfileViewFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileViewPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfileViewFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileViewPayload>
          }
          findMany: {
            args: Prisma.ProfileViewFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileViewPayload>[]
          }
          create: {
            args: Prisma.ProfileViewCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileViewPayload>
          }
          createMany: {
            args: Prisma.ProfileViewCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProfileViewCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileViewPayload>[]
          }
          delete: {
            args: Prisma.ProfileViewDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileViewPayload>
          }
          update: {
            args: Prisma.ProfileViewUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileViewPayload>
          }
          deleteMany: {
            args: Prisma.ProfileViewDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfileViewUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProfileViewUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileViewPayload>[]
          }
          upsert: {
            args: Prisma.ProfileViewUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileViewPayload>
          }
          aggregate: {
            args: Prisma.ProfileViewAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfileView>
          }
          groupBy: {
            args: Prisma.ProfileViewGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfileViewGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfileViewCountArgs<ExtArgs>
            result: $Utils.Optional<ProfileViewCountAggregateOutputType> | number
          }
        }
      }
      Shortlist: {
        payload: Prisma.$ShortlistPayload<ExtArgs>
        fields: Prisma.ShortlistFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ShortlistFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShortlistPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ShortlistFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShortlistPayload>
          }
          findFirst: {
            args: Prisma.ShortlistFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShortlistPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ShortlistFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShortlistPayload>
          }
          findMany: {
            args: Prisma.ShortlistFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShortlistPayload>[]
          }
          create: {
            args: Prisma.ShortlistCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShortlistPayload>
          }
          createMany: {
            args: Prisma.ShortlistCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ShortlistCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShortlistPayload>[]
          }
          delete: {
            args: Prisma.ShortlistDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShortlistPayload>
          }
          update: {
            args: Prisma.ShortlistUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShortlistPayload>
          }
          deleteMany: {
            args: Prisma.ShortlistDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ShortlistUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ShortlistUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShortlistPayload>[]
          }
          upsert: {
            args: Prisma.ShortlistUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShortlistPayload>
          }
          aggregate: {
            args: Prisma.ShortlistAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateShortlist>
          }
          groupBy: {
            args: Prisma.ShortlistGroupByArgs<ExtArgs>
            result: $Utils.Optional<ShortlistGroupByOutputType>[]
          }
          count: {
            args: Prisma.ShortlistCountArgs<ExtArgs>
            result: $Utils.Optional<ShortlistCountAggregateOutputType> | number
          }
        }
      }
      ConfirmedMatch: {
        payload: Prisma.$ConfirmedMatchPayload<ExtArgs>
        fields: Prisma.ConfirmedMatchFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConfirmedMatchFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfirmedMatchPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConfirmedMatchFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfirmedMatchPayload>
          }
          findFirst: {
            args: Prisma.ConfirmedMatchFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfirmedMatchPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConfirmedMatchFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfirmedMatchPayload>
          }
          findMany: {
            args: Prisma.ConfirmedMatchFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfirmedMatchPayload>[]
          }
          create: {
            args: Prisma.ConfirmedMatchCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfirmedMatchPayload>
          }
          createMany: {
            args: Prisma.ConfirmedMatchCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConfirmedMatchCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfirmedMatchPayload>[]
          }
          delete: {
            args: Prisma.ConfirmedMatchDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfirmedMatchPayload>
          }
          update: {
            args: Prisma.ConfirmedMatchUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfirmedMatchPayload>
          }
          deleteMany: {
            args: Prisma.ConfirmedMatchDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConfirmedMatchUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ConfirmedMatchUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfirmedMatchPayload>[]
          }
          upsert: {
            args: Prisma.ConfirmedMatchUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfirmedMatchPayload>
          }
          aggregate: {
            args: Prisma.ConfirmedMatchAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConfirmedMatch>
          }
          groupBy: {
            args: Prisma.ConfirmedMatchGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConfirmedMatchGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConfirmedMatchCountArgs<ExtArgs>
            result: $Utils.Optional<ConfirmedMatchCountAggregateOutputType> | number
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
    userProfile?: UserProfileOmit
    serviceListing?: ServiceListingOmit
    profileView?: ProfileViewOmit
    shortlist?: ShortlistOmit
    confirmedMatch?: ConfirmedMatchOmit
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
   * Count Type UserAccountCountOutputType
   */

  export type UserAccountCountOutputType = {
    serviceListings: number
    profileViews: number
    viewedOthers: number
    createdShortlists: number
    shortlistedIn: number
    confirmedMatchesAsHomeowner: number
  }

  export type UserAccountCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    serviceListings?: boolean | UserAccountCountOutputTypeCountServiceListingsArgs
    profileViews?: boolean | UserAccountCountOutputTypeCountProfileViewsArgs
    viewedOthers?: boolean | UserAccountCountOutputTypeCountViewedOthersArgs
    createdShortlists?: boolean | UserAccountCountOutputTypeCountCreatedShortlistsArgs
    shortlistedIn?: boolean | UserAccountCountOutputTypeCountShortlistedInArgs
    confirmedMatchesAsHomeowner?: boolean | UserAccountCountOutputTypeCountConfirmedMatchesAsHomeownerArgs
  }

  // Custom InputTypes
  /**
   * UserAccountCountOutputType without action
   */
  export type UserAccountCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccountCountOutputType
     */
    select?: UserAccountCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserAccountCountOutputType without action
   */
  export type UserAccountCountOutputTypeCountServiceListingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ServiceListingWhereInput
  }

  /**
   * UserAccountCountOutputType without action
   */
  export type UserAccountCountOutputTypeCountProfileViewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileViewWhereInput
  }

  /**
   * UserAccountCountOutputType without action
   */
  export type UserAccountCountOutputTypeCountViewedOthersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileViewWhereInput
  }

  /**
   * UserAccountCountOutputType without action
   */
  export type UserAccountCountOutputTypeCountCreatedShortlistsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShortlistWhereInput
  }

  /**
   * UserAccountCountOutputType without action
   */
  export type UserAccountCountOutputTypeCountShortlistedInArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShortlistWhereInput
  }

  /**
   * UserAccountCountOutputType without action
   */
  export type UserAccountCountOutputTypeCountConfirmedMatchesAsHomeownerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConfirmedMatchWhereInput
  }


  /**
   * Count Type UserProfileCountOutputType
   */

  export type UserProfileCountOutputType = {
    userAccounts: number
  }

  export type UserProfileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userAccounts?: boolean | UserProfileCountOutputTypeCountUserAccountsArgs
  }

  // Custom InputTypes
  /**
   * UserProfileCountOutputType without action
   */
  export type UserProfileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfileCountOutputType
     */
    select?: UserProfileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserProfileCountOutputType without action
   */
  export type UserProfileCountOutputTypeCountUserAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserAccountWhereInput
  }


  /**
   * Count Type ServiceListingCountOutputType
   */

  export type ServiceListingCountOutputType = {
    confirmedMatches: number
  }

  export type ServiceListingCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    confirmedMatches?: boolean | ServiceListingCountOutputTypeCountConfirmedMatchesArgs
  }

  // Custom InputTypes
  /**
   * ServiceListingCountOutputType without action
   */
  export type ServiceListingCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceListingCountOutputType
     */
    select?: ServiceListingCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ServiceListingCountOutputType without action
   */
  export type ServiceListingCountOutputTypeCountConfirmedMatchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConfirmedMatchWhereInput
  }


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
    id: string | null
    username: string | null
    email: string | null
    password: string | null
    status: $Enums.UserStatus | null
    createdAt: Date | null
    updatedAt: Date | null
    userProfileId: string | null
  }

  export type UserAccountMaxAggregateOutputType = {
    id: string | null
    username: string | null
    email: string | null
    password: string | null
    status: $Enums.UserStatus | null
    createdAt: Date | null
    updatedAt: Date | null
    userProfileId: string | null
  }

  export type UserAccountCountAggregateOutputType = {
    id: number
    username: number
    email: number
    password: number
    status: number
    createdAt: number
    updatedAt: number
    userProfileId: number
    _all: number
  }


  export type UserAccountMinAggregateInputType = {
    id?: true
    username?: true
    email?: true
    password?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    userProfileId?: true
  }

  export type UserAccountMaxAggregateInputType = {
    id?: true
    username?: true
    email?: true
    password?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    userProfileId?: true
  }

  export type UserAccountCountAggregateInputType = {
    id?: true
    username?: true
    email?: true
    password?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    userProfileId?: true
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
    id: string
    username: string
    email: string
    password: string
    status: $Enums.UserStatus
    createdAt: Date
    updatedAt: Date
    userProfileId: string | null
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
    id?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userProfileId?: boolean
    userProfile?: boolean | UserAccount$userProfileArgs<ExtArgs>
    serviceListings?: boolean | UserAccount$serviceListingsArgs<ExtArgs>
    profileViews?: boolean | UserAccount$profileViewsArgs<ExtArgs>
    viewedOthers?: boolean | UserAccount$viewedOthersArgs<ExtArgs>
    createdShortlists?: boolean | UserAccount$createdShortlistsArgs<ExtArgs>
    shortlistedIn?: boolean | UserAccount$shortlistedInArgs<ExtArgs>
    confirmedMatchesAsHomeowner?: boolean | UserAccount$confirmedMatchesAsHomeownerArgs<ExtArgs>
    _count?: boolean | UserAccountCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userAccount"]>

  export type UserAccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userProfileId?: boolean
    userProfile?: boolean | UserAccount$userProfileArgs<ExtArgs>
  }, ExtArgs["result"]["userAccount"]>

  export type UserAccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userProfileId?: boolean
    userProfile?: boolean | UserAccount$userProfileArgs<ExtArgs>
  }, ExtArgs["result"]["userAccount"]>

  export type UserAccountSelectScalar = {
    id?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userProfileId?: boolean
  }

  export type UserAccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "email" | "password" | "status" | "createdAt" | "updatedAt" | "userProfileId", ExtArgs["result"]["userAccount"]>
  export type UserAccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userProfile?: boolean | UserAccount$userProfileArgs<ExtArgs>
    serviceListings?: boolean | UserAccount$serviceListingsArgs<ExtArgs>
    profileViews?: boolean | UserAccount$profileViewsArgs<ExtArgs>
    viewedOthers?: boolean | UserAccount$viewedOthersArgs<ExtArgs>
    createdShortlists?: boolean | UserAccount$createdShortlistsArgs<ExtArgs>
    shortlistedIn?: boolean | UserAccount$shortlistedInArgs<ExtArgs>
    confirmedMatchesAsHomeowner?: boolean | UserAccount$confirmedMatchesAsHomeownerArgs<ExtArgs>
    _count?: boolean | UserAccountCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserAccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userProfile?: boolean | UserAccount$userProfileArgs<ExtArgs>
  }
  export type UserAccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userProfile?: boolean | UserAccount$userProfileArgs<ExtArgs>
  }

  export type $UserAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserAccount"
    objects: {
      userProfile: Prisma.$UserProfilePayload<ExtArgs> | null
      serviceListings: Prisma.$ServiceListingPayload<ExtArgs>[]
      profileViews: Prisma.$ProfileViewPayload<ExtArgs>[]
      viewedOthers: Prisma.$ProfileViewPayload<ExtArgs>[]
      createdShortlists: Prisma.$ShortlistPayload<ExtArgs>[]
      shortlistedIn: Prisma.$ShortlistPayload<ExtArgs>[]
      confirmedMatchesAsHomeowner: Prisma.$ConfirmedMatchPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      email: string
      password: string
      status: $Enums.UserStatus
      createdAt: Date
      updatedAt: Date
      userProfileId: string | null
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
     * // Only select the `id`
     * const userAccountWithIdOnly = await prisma.userAccount.findMany({ select: { id: true } })
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
     * // Create many UserAccounts and only return the `id`
     * const userAccountWithIdOnly = await prisma.userAccount.createManyAndReturn({
     *   select: { id: true },
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
     * // Update zero or more UserAccounts and only return the `id`
     * const userAccountWithIdOnly = await prisma.userAccount.updateManyAndReturn({
     *   select: { id: true },
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
    userProfile<T extends UserAccount$userProfileArgs<ExtArgs> = {}>(args?: Subset<T, UserAccount$userProfileArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    serviceListings<T extends UserAccount$serviceListingsArgs<ExtArgs> = {}>(args?: Subset<T, UserAccount$serviceListingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServiceListingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    profileViews<T extends UserAccount$profileViewsArgs<ExtArgs> = {}>(args?: Subset<T, UserAccount$profileViewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfileViewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    viewedOthers<T extends UserAccount$viewedOthersArgs<ExtArgs> = {}>(args?: Subset<T, UserAccount$viewedOthersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfileViewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    createdShortlists<T extends UserAccount$createdShortlistsArgs<ExtArgs> = {}>(args?: Subset<T, UserAccount$createdShortlistsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShortlistPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    shortlistedIn<T extends UserAccount$shortlistedInArgs<ExtArgs> = {}>(args?: Subset<T, UserAccount$shortlistedInArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShortlistPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    confirmedMatchesAsHomeowner<T extends UserAccount$confirmedMatchesAsHomeownerArgs<ExtArgs> = {}>(args?: Subset<T, UserAccount$confirmedMatchesAsHomeownerArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfirmedMatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly id: FieldRef<"UserAccount", 'String'>
    readonly username: FieldRef<"UserAccount", 'String'>
    readonly email: FieldRef<"UserAccount", 'String'>
    readonly password: FieldRef<"UserAccount", 'String'>
    readonly status: FieldRef<"UserAccount", 'UserStatus'>
    readonly createdAt: FieldRef<"UserAccount", 'DateTime'>
    readonly updatedAt: FieldRef<"UserAccount", 'DateTime'>
    readonly userProfileId: FieldRef<"UserAccount", 'String'>
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountIncludeCreateManyAndReturn<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountIncludeUpdateManyAndReturn<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
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
   * UserAccount.userProfile
   */
  export type UserAccount$userProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    where?: UserProfileWhereInput
  }

  /**
   * UserAccount.serviceListings
   */
  export type UserAccount$serviceListingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceListing
     */
    select?: ServiceListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceListing
     */
    omit?: ServiceListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceListingInclude<ExtArgs> | null
    where?: ServiceListingWhereInput
    orderBy?: ServiceListingOrderByWithRelationInput | ServiceListingOrderByWithRelationInput[]
    cursor?: ServiceListingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ServiceListingScalarFieldEnum | ServiceListingScalarFieldEnum[]
  }

  /**
   * UserAccount.profileViews
   */
  export type UserAccount$profileViewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileView
     */
    select?: ProfileViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileView
     */
    omit?: ProfileViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileViewInclude<ExtArgs> | null
    where?: ProfileViewWhereInput
    orderBy?: ProfileViewOrderByWithRelationInput | ProfileViewOrderByWithRelationInput[]
    cursor?: ProfileViewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProfileViewScalarFieldEnum | ProfileViewScalarFieldEnum[]
  }

  /**
   * UserAccount.viewedOthers
   */
  export type UserAccount$viewedOthersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileView
     */
    select?: ProfileViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileView
     */
    omit?: ProfileViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileViewInclude<ExtArgs> | null
    where?: ProfileViewWhereInput
    orderBy?: ProfileViewOrderByWithRelationInput | ProfileViewOrderByWithRelationInput[]
    cursor?: ProfileViewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProfileViewScalarFieldEnum | ProfileViewScalarFieldEnum[]
  }

  /**
   * UserAccount.createdShortlists
   */
  export type UserAccount$createdShortlistsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shortlist
     */
    select?: ShortlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shortlist
     */
    omit?: ShortlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShortlistInclude<ExtArgs> | null
    where?: ShortlistWhereInput
    orderBy?: ShortlistOrderByWithRelationInput | ShortlistOrderByWithRelationInput[]
    cursor?: ShortlistWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ShortlistScalarFieldEnum | ShortlistScalarFieldEnum[]
  }

  /**
   * UserAccount.shortlistedIn
   */
  export type UserAccount$shortlistedInArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shortlist
     */
    select?: ShortlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shortlist
     */
    omit?: ShortlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShortlistInclude<ExtArgs> | null
    where?: ShortlistWhereInput
    orderBy?: ShortlistOrderByWithRelationInput | ShortlistOrderByWithRelationInput[]
    cursor?: ShortlistWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ShortlistScalarFieldEnum | ShortlistScalarFieldEnum[]
  }

  /**
   * UserAccount.confirmedMatchesAsHomeowner
   */
  export type UserAccount$confirmedMatchesAsHomeownerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfirmedMatch
     */
    select?: ConfirmedMatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfirmedMatch
     */
    omit?: ConfirmedMatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmedMatchInclude<ExtArgs> | null
    where?: ConfirmedMatchWhereInput
    orderBy?: ConfirmedMatchOrderByWithRelationInput | ConfirmedMatchOrderByWithRelationInput[]
    cursor?: ConfirmedMatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConfirmedMatchScalarFieldEnum | ConfirmedMatchScalarFieldEnum[]
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
  }


  /**
   * Model UserProfile
   */

  export type AggregateUserProfile = {
    _count: UserProfileCountAggregateOutputType | null
    _min: UserProfileMinAggregateOutputType | null
    _max: UserProfileMaxAggregateOutputType | null
  }

  export type UserProfileMinAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
    status: $Enums.UserProfileStatus | null
  }

  export type UserProfileMaxAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
    status: $Enums.UserProfileStatus | null
  }

  export type UserProfileCountAggregateOutputType = {
    id: number
    name: number
    permissions: number
    createdAt: number
    updatedAt: number
    status: number
    _all: number
  }


  export type UserProfileMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    status?: true
  }

  export type UserProfileMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    status?: true
  }

  export type UserProfileCountAggregateInputType = {
    id?: true
    name?: true
    permissions?: true
    createdAt?: true
    updatedAt?: true
    status?: true
    _all?: true
  }

  export type UserProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProfile to aggregate.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserProfiles
    **/
    _count?: true | UserProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserProfileMaxAggregateInputType
  }

  export type GetUserProfileAggregateType<T extends UserProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateUserProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserProfile[P]>
      : GetScalarType<T[P], AggregateUserProfile[P]>
  }




  export type UserProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserProfileWhereInput
    orderBy?: UserProfileOrderByWithAggregationInput | UserProfileOrderByWithAggregationInput[]
    by: UserProfileScalarFieldEnum[] | UserProfileScalarFieldEnum
    having?: UserProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserProfileCountAggregateInputType | true
    _min?: UserProfileMinAggregateInputType
    _max?: UserProfileMaxAggregateInputType
  }

  export type UserProfileGroupByOutputType = {
    id: string
    name: string
    permissions: $Enums.Permission[]
    createdAt: Date
    updatedAt: Date
    status: $Enums.UserProfileStatus
    _count: UserProfileCountAggregateOutputType | null
    _min: UserProfileMinAggregateOutputType | null
    _max: UserProfileMaxAggregateOutputType | null
  }

  type GetUserProfileGroupByPayload<T extends UserProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserProfileGroupByOutputType[P]>
            : GetScalarType<T[P], UserProfileGroupByOutputType[P]>
        }
      >
    >


  export type UserProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    permissions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    status?: boolean
    userAccounts?: boolean | UserProfile$userAccountsArgs<ExtArgs>
    _count?: boolean | UserProfileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProfile"]>

  export type UserProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    permissions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    status?: boolean
  }, ExtArgs["result"]["userProfile"]>

  export type UserProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    permissions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    status?: boolean
  }, ExtArgs["result"]["userProfile"]>

  export type UserProfileSelectScalar = {
    id?: boolean
    name?: boolean
    permissions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    status?: boolean
  }

  export type UserProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "permissions" | "createdAt" | "updatedAt" | "status", ExtArgs["result"]["userProfile"]>
  export type UserProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userAccounts?: boolean | UserProfile$userAccountsArgs<ExtArgs>
    _count?: boolean | UserProfileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserProfile"
    objects: {
      userAccounts: Prisma.$UserAccountPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      permissions: $Enums.Permission[]
      createdAt: Date
      updatedAt: Date
      status: $Enums.UserProfileStatus
    }, ExtArgs["result"]["userProfile"]>
    composites: {}
  }

  type UserProfileGetPayload<S extends boolean | null | undefined | UserProfileDefaultArgs> = $Result.GetResult<Prisma.$UserProfilePayload, S>

  type UserProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserProfileCountAggregateInputType | true
    }

  export interface UserProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserProfile'], meta: { name: 'UserProfile' } }
    /**
     * Find zero or one UserProfile that matches the filter.
     * @param {UserProfileFindUniqueArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserProfileFindUniqueArgs>(args: SelectSubset<T, UserProfileFindUniqueArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserProfileFindUniqueOrThrowArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, UserProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindFirstArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserProfileFindFirstArgs>(args?: SelectSubset<T, UserProfileFindFirstArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindFirstOrThrowArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, UserProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserProfiles
     * const userProfiles = await prisma.userProfile.findMany()
     * 
     * // Get first 10 UserProfiles
     * const userProfiles = await prisma.userProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userProfileWithIdOnly = await prisma.userProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserProfileFindManyArgs>(args?: SelectSubset<T, UserProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserProfile.
     * @param {UserProfileCreateArgs} args - Arguments to create a UserProfile.
     * @example
     * // Create one UserProfile
     * const UserProfile = await prisma.userProfile.create({
     *   data: {
     *     // ... data to create a UserProfile
     *   }
     * })
     * 
     */
    create<T extends UserProfileCreateArgs>(args: SelectSubset<T, UserProfileCreateArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserProfiles.
     * @param {UserProfileCreateManyArgs} args - Arguments to create many UserProfiles.
     * @example
     * // Create many UserProfiles
     * const userProfile = await prisma.userProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserProfileCreateManyArgs>(args?: SelectSubset<T, UserProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserProfiles and returns the data saved in the database.
     * @param {UserProfileCreateManyAndReturnArgs} args - Arguments to create many UserProfiles.
     * @example
     * // Create many UserProfiles
     * const userProfile = await prisma.userProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserProfiles and only return the `id`
     * const userProfileWithIdOnly = await prisma.userProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, UserProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserProfile.
     * @param {UserProfileDeleteArgs} args - Arguments to delete one UserProfile.
     * @example
     * // Delete one UserProfile
     * const UserProfile = await prisma.userProfile.delete({
     *   where: {
     *     // ... filter to delete one UserProfile
     *   }
     * })
     * 
     */
    delete<T extends UserProfileDeleteArgs>(args: SelectSubset<T, UserProfileDeleteArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserProfile.
     * @param {UserProfileUpdateArgs} args - Arguments to update one UserProfile.
     * @example
     * // Update one UserProfile
     * const userProfile = await prisma.userProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserProfileUpdateArgs>(args: SelectSubset<T, UserProfileUpdateArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserProfiles.
     * @param {UserProfileDeleteManyArgs} args - Arguments to filter UserProfiles to delete.
     * @example
     * // Delete a few UserProfiles
     * const { count } = await prisma.userProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserProfileDeleteManyArgs>(args?: SelectSubset<T, UserProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserProfiles
     * const userProfile = await prisma.userProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserProfileUpdateManyArgs>(args: SelectSubset<T, UserProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserProfiles and returns the data updated in the database.
     * @param {UserProfileUpdateManyAndReturnArgs} args - Arguments to update many UserProfiles.
     * @example
     * // Update many UserProfiles
     * const userProfile = await prisma.userProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserProfiles and only return the `id`
     * const userProfileWithIdOnly = await prisma.userProfile.updateManyAndReturn({
     *   select: { id: true },
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
    updateManyAndReturn<T extends UserProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, UserProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserProfile.
     * @param {UserProfileUpsertArgs} args - Arguments to update or create a UserProfile.
     * @example
     * // Update or create a UserProfile
     * const userProfile = await prisma.userProfile.upsert({
     *   create: {
     *     // ... data to create a UserProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserProfile we want to update
     *   }
     * })
     */
    upsert<T extends UserProfileUpsertArgs>(args: SelectSubset<T, UserProfileUpsertArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileCountArgs} args - Arguments to filter UserProfiles to count.
     * @example
     * // Count the number of UserProfiles
     * const count = await prisma.userProfile.count({
     *   where: {
     *     // ... the filter for the UserProfiles we want to count
     *   }
     * })
    **/
    count<T extends UserProfileCountArgs>(
      args?: Subset<T, UserProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserProfileAggregateArgs>(args: Subset<T, UserProfileAggregateArgs>): Prisma.PrismaPromise<GetUserProfileAggregateType<T>>

    /**
     * Group by UserProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileGroupByArgs} args - Group by arguments.
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
      T extends UserProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserProfileGroupByArgs['orderBy'] }
        : { orderBy?: UserProfileGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserProfile model
   */
  readonly fields: UserProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    userAccounts<T extends UserProfile$userAccountsArgs<ExtArgs> = {}>(args?: Subset<T, UserProfile$userAccountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the UserProfile model
   */
  interface UserProfileFieldRefs {
    readonly id: FieldRef<"UserProfile", 'String'>
    readonly name: FieldRef<"UserProfile", 'String'>
    readonly permissions: FieldRef<"UserProfile", 'Permission[]'>
    readonly createdAt: FieldRef<"UserProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"UserProfile", 'DateTime'>
    readonly status: FieldRef<"UserProfile", 'UserProfileStatus'>
  }
    

  // Custom InputTypes
  /**
   * UserProfile findUnique
   */
  export type UserProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile findUniqueOrThrow
   */
  export type UserProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile findFirst
   */
  export type UserProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProfiles.
     */
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile findFirstOrThrow
   */
  export type UserProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProfiles.
     */
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile findMany
   */
  export type UserProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfiles to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile create
   */
  export type UserProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a UserProfile.
     */
    data: XOR<UserProfileCreateInput, UserProfileUncheckedCreateInput>
  }

  /**
   * UserProfile createMany
   */
  export type UserProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserProfiles.
     */
    data: UserProfileCreateManyInput | UserProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserProfile createManyAndReturn
   */
  export type UserProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * The data used to create many UserProfiles.
     */
    data: UserProfileCreateManyInput | UserProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserProfile update
   */
  export type UserProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a UserProfile.
     */
    data: XOR<UserProfileUpdateInput, UserProfileUncheckedUpdateInput>
    /**
     * Choose, which UserProfile to update.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile updateMany
   */
  export type UserProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserProfiles.
     */
    data: XOR<UserProfileUpdateManyMutationInput, UserProfileUncheckedUpdateManyInput>
    /**
     * Filter which UserProfiles to update
     */
    where?: UserProfileWhereInput
    /**
     * Limit how many UserProfiles to update.
     */
    limit?: number
  }

  /**
   * UserProfile updateManyAndReturn
   */
  export type UserProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * The data used to update UserProfiles.
     */
    data: XOR<UserProfileUpdateManyMutationInput, UserProfileUncheckedUpdateManyInput>
    /**
     * Filter which UserProfiles to update
     */
    where?: UserProfileWhereInput
    /**
     * Limit how many UserProfiles to update.
     */
    limit?: number
  }

  /**
   * UserProfile upsert
   */
  export type UserProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the UserProfile to update in case it exists.
     */
    where: UserProfileWhereUniqueInput
    /**
     * In case the UserProfile found by the `where` argument doesn't exist, create a new UserProfile with this data.
     */
    create: XOR<UserProfileCreateInput, UserProfileUncheckedCreateInput>
    /**
     * In case the UserProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserProfileUpdateInput, UserProfileUncheckedUpdateInput>
  }

  /**
   * UserProfile delete
   */
  export type UserProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter which UserProfile to delete.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile deleteMany
   */
  export type UserProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProfiles to delete
     */
    where?: UserProfileWhereInput
    /**
     * Limit how many UserProfiles to delete.
     */
    limit?: number
  }

  /**
   * UserProfile.userAccounts
   */
  export type UserProfile$userAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
    where?: UserAccountWhereInput
    orderBy?: UserAccountOrderByWithRelationInput | UserAccountOrderByWithRelationInput[]
    cursor?: UserAccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserAccountScalarFieldEnum | UserAccountScalarFieldEnum[]
  }

  /**
   * UserProfile without action
   */
  export type UserProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
  }


  /**
   * Model ServiceListing
   */

  export type AggregateServiceListing = {
    _count: ServiceListingCountAggregateOutputType | null
    _avg: ServiceListingAvgAggregateOutputType | null
    _sum: ServiceListingSumAggregateOutputType | null
    _min: ServiceListingMinAggregateOutputType | null
    _max: ServiceListingMaxAggregateOutputType | null
  }

  export type ServiceListingAvgAggregateOutputType = {
    ratePerHr: number | null
  }

  export type ServiceListingSumAggregateOutputType = {
    ratePerHr: number | null
  }

  export type ServiceListingMinAggregateOutputType = {
    id: string | null
    serviceType: string | null
    title: string | null
    description: string | null
    ratePerHr: number | null
    createdAt: Date | null
    updatedAt: Date | null
    cleanerId: string | null
    status: $Enums.ServiceListingStatus | null
  }

  export type ServiceListingMaxAggregateOutputType = {
    id: string | null
    serviceType: string | null
    title: string | null
    description: string | null
    ratePerHr: number | null
    createdAt: Date | null
    updatedAt: Date | null
    cleanerId: string | null
    status: $Enums.ServiceListingStatus | null
  }

  export type ServiceListingCountAggregateOutputType = {
    id: number
    serviceType: number
    title: number
    description: number
    ratePerHr: number
    createdAt: number
    updatedAt: number
    cleanerId: number
    status: number
    _all: number
  }


  export type ServiceListingAvgAggregateInputType = {
    ratePerHr?: true
  }

  export type ServiceListingSumAggregateInputType = {
    ratePerHr?: true
  }

  export type ServiceListingMinAggregateInputType = {
    id?: true
    serviceType?: true
    title?: true
    description?: true
    ratePerHr?: true
    createdAt?: true
    updatedAt?: true
    cleanerId?: true
    status?: true
  }

  export type ServiceListingMaxAggregateInputType = {
    id?: true
    serviceType?: true
    title?: true
    description?: true
    ratePerHr?: true
    createdAt?: true
    updatedAt?: true
    cleanerId?: true
    status?: true
  }

  export type ServiceListingCountAggregateInputType = {
    id?: true
    serviceType?: true
    title?: true
    description?: true
    ratePerHr?: true
    createdAt?: true
    updatedAt?: true
    cleanerId?: true
    status?: true
    _all?: true
  }

  export type ServiceListingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ServiceListing to aggregate.
     */
    where?: ServiceListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServiceListings to fetch.
     */
    orderBy?: ServiceListingOrderByWithRelationInput | ServiceListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ServiceListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServiceListings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServiceListings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ServiceListings
    **/
    _count?: true | ServiceListingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ServiceListingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ServiceListingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ServiceListingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ServiceListingMaxAggregateInputType
  }

  export type GetServiceListingAggregateType<T extends ServiceListingAggregateArgs> = {
        [P in keyof T & keyof AggregateServiceListing]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateServiceListing[P]>
      : GetScalarType<T[P], AggregateServiceListing[P]>
  }




  export type ServiceListingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ServiceListingWhereInput
    orderBy?: ServiceListingOrderByWithAggregationInput | ServiceListingOrderByWithAggregationInput[]
    by: ServiceListingScalarFieldEnum[] | ServiceListingScalarFieldEnum
    having?: ServiceListingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ServiceListingCountAggregateInputType | true
    _avg?: ServiceListingAvgAggregateInputType
    _sum?: ServiceListingSumAggregateInputType
    _min?: ServiceListingMinAggregateInputType
    _max?: ServiceListingMaxAggregateInputType
  }

  export type ServiceListingGroupByOutputType = {
    id: string
    serviceType: string
    title: string
    description: string
    ratePerHr: number
    createdAt: Date
    updatedAt: Date
    cleanerId: string
    status: $Enums.ServiceListingStatus
    _count: ServiceListingCountAggregateOutputType | null
    _avg: ServiceListingAvgAggregateOutputType | null
    _sum: ServiceListingSumAggregateOutputType | null
    _min: ServiceListingMinAggregateOutputType | null
    _max: ServiceListingMaxAggregateOutputType | null
  }

  type GetServiceListingGroupByPayload<T extends ServiceListingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ServiceListingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ServiceListingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ServiceListingGroupByOutputType[P]>
            : GetScalarType<T[P], ServiceListingGroupByOutputType[P]>
        }
      >
    >


  export type ServiceListingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    serviceType?: boolean
    title?: boolean
    description?: boolean
    ratePerHr?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cleanerId?: boolean
    status?: boolean
    cleaner?: boolean | UserAccountDefaultArgs<ExtArgs>
    confirmedMatches?: boolean | ServiceListing$confirmedMatchesArgs<ExtArgs>
    _count?: boolean | ServiceListingCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["serviceListing"]>

  export type ServiceListingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    serviceType?: boolean
    title?: boolean
    description?: boolean
    ratePerHr?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cleanerId?: boolean
    status?: boolean
    cleaner?: boolean | UserAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["serviceListing"]>

  export type ServiceListingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    serviceType?: boolean
    title?: boolean
    description?: boolean
    ratePerHr?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cleanerId?: boolean
    status?: boolean
    cleaner?: boolean | UserAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["serviceListing"]>

  export type ServiceListingSelectScalar = {
    id?: boolean
    serviceType?: boolean
    title?: boolean
    description?: boolean
    ratePerHr?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cleanerId?: boolean
    status?: boolean
  }

  export type ServiceListingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "serviceType" | "title" | "description" | "ratePerHr" | "createdAt" | "updatedAt" | "cleanerId" | "status", ExtArgs["result"]["serviceListing"]>
  export type ServiceListingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cleaner?: boolean | UserAccountDefaultArgs<ExtArgs>
    confirmedMatches?: boolean | ServiceListing$confirmedMatchesArgs<ExtArgs>
    _count?: boolean | ServiceListingCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ServiceListingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cleaner?: boolean | UserAccountDefaultArgs<ExtArgs>
  }
  export type ServiceListingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cleaner?: boolean | UserAccountDefaultArgs<ExtArgs>
  }

  export type $ServiceListingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ServiceListing"
    objects: {
      cleaner: Prisma.$UserAccountPayload<ExtArgs>
      confirmedMatches: Prisma.$ConfirmedMatchPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      serviceType: string
      title: string
      description: string
      ratePerHr: number
      createdAt: Date
      updatedAt: Date
      cleanerId: string
      status: $Enums.ServiceListingStatus
    }, ExtArgs["result"]["serviceListing"]>
    composites: {}
  }

  type ServiceListingGetPayload<S extends boolean | null | undefined | ServiceListingDefaultArgs> = $Result.GetResult<Prisma.$ServiceListingPayload, S>

  type ServiceListingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ServiceListingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ServiceListingCountAggregateInputType | true
    }

  export interface ServiceListingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ServiceListing'], meta: { name: 'ServiceListing' } }
    /**
     * Find zero or one ServiceListing that matches the filter.
     * @param {ServiceListingFindUniqueArgs} args - Arguments to find a ServiceListing
     * @example
     * // Get one ServiceListing
     * const serviceListing = await prisma.serviceListing.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ServiceListingFindUniqueArgs>(args: SelectSubset<T, ServiceListingFindUniqueArgs<ExtArgs>>): Prisma__ServiceListingClient<$Result.GetResult<Prisma.$ServiceListingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ServiceListing that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ServiceListingFindUniqueOrThrowArgs} args - Arguments to find a ServiceListing
     * @example
     * // Get one ServiceListing
     * const serviceListing = await prisma.serviceListing.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ServiceListingFindUniqueOrThrowArgs>(args: SelectSubset<T, ServiceListingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ServiceListingClient<$Result.GetResult<Prisma.$ServiceListingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ServiceListing that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceListingFindFirstArgs} args - Arguments to find a ServiceListing
     * @example
     * // Get one ServiceListing
     * const serviceListing = await prisma.serviceListing.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ServiceListingFindFirstArgs>(args?: SelectSubset<T, ServiceListingFindFirstArgs<ExtArgs>>): Prisma__ServiceListingClient<$Result.GetResult<Prisma.$ServiceListingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ServiceListing that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceListingFindFirstOrThrowArgs} args - Arguments to find a ServiceListing
     * @example
     * // Get one ServiceListing
     * const serviceListing = await prisma.serviceListing.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ServiceListingFindFirstOrThrowArgs>(args?: SelectSubset<T, ServiceListingFindFirstOrThrowArgs<ExtArgs>>): Prisma__ServiceListingClient<$Result.GetResult<Prisma.$ServiceListingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ServiceListings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceListingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ServiceListings
     * const serviceListings = await prisma.serviceListing.findMany()
     * 
     * // Get first 10 ServiceListings
     * const serviceListings = await prisma.serviceListing.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const serviceListingWithIdOnly = await prisma.serviceListing.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ServiceListingFindManyArgs>(args?: SelectSubset<T, ServiceListingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServiceListingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ServiceListing.
     * @param {ServiceListingCreateArgs} args - Arguments to create a ServiceListing.
     * @example
     * // Create one ServiceListing
     * const ServiceListing = await prisma.serviceListing.create({
     *   data: {
     *     // ... data to create a ServiceListing
     *   }
     * })
     * 
     */
    create<T extends ServiceListingCreateArgs>(args: SelectSubset<T, ServiceListingCreateArgs<ExtArgs>>): Prisma__ServiceListingClient<$Result.GetResult<Prisma.$ServiceListingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ServiceListings.
     * @param {ServiceListingCreateManyArgs} args - Arguments to create many ServiceListings.
     * @example
     * // Create many ServiceListings
     * const serviceListing = await prisma.serviceListing.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ServiceListingCreateManyArgs>(args?: SelectSubset<T, ServiceListingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ServiceListings and returns the data saved in the database.
     * @param {ServiceListingCreateManyAndReturnArgs} args - Arguments to create many ServiceListings.
     * @example
     * // Create many ServiceListings
     * const serviceListing = await prisma.serviceListing.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ServiceListings and only return the `id`
     * const serviceListingWithIdOnly = await prisma.serviceListing.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ServiceListingCreateManyAndReturnArgs>(args?: SelectSubset<T, ServiceListingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServiceListingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ServiceListing.
     * @param {ServiceListingDeleteArgs} args - Arguments to delete one ServiceListing.
     * @example
     * // Delete one ServiceListing
     * const ServiceListing = await prisma.serviceListing.delete({
     *   where: {
     *     // ... filter to delete one ServiceListing
     *   }
     * })
     * 
     */
    delete<T extends ServiceListingDeleteArgs>(args: SelectSubset<T, ServiceListingDeleteArgs<ExtArgs>>): Prisma__ServiceListingClient<$Result.GetResult<Prisma.$ServiceListingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ServiceListing.
     * @param {ServiceListingUpdateArgs} args - Arguments to update one ServiceListing.
     * @example
     * // Update one ServiceListing
     * const serviceListing = await prisma.serviceListing.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ServiceListingUpdateArgs>(args: SelectSubset<T, ServiceListingUpdateArgs<ExtArgs>>): Prisma__ServiceListingClient<$Result.GetResult<Prisma.$ServiceListingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ServiceListings.
     * @param {ServiceListingDeleteManyArgs} args - Arguments to filter ServiceListings to delete.
     * @example
     * // Delete a few ServiceListings
     * const { count } = await prisma.serviceListing.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ServiceListingDeleteManyArgs>(args?: SelectSubset<T, ServiceListingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ServiceListings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceListingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ServiceListings
     * const serviceListing = await prisma.serviceListing.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ServiceListingUpdateManyArgs>(args: SelectSubset<T, ServiceListingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ServiceListings and returns the data updated in the database.
     * @param {ServiceListingUpdateManyAndReturnArgs} args - Arguments to update many ServiceListings.
     * @example
     * // Update many ServiceListings
     * const serviceListing = await prisma.serviceListing.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ServiceListings and only return the `id`
     * const serviceListingWithIdOnly = await prisma.serviceListing.updateManyAndReturn({
     *   select: { id: true },
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
    updateManyAndReturn<T extends ServiceListingUpdateManyAndReturnArgs>(args: SelectSubset<T, ServiceListingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServiceListingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ServiceListing.
     * @param {ServiceListingUpsertArgs} args - Arguments to update or create a ServiceListing.
     * @example
     * // Update or create a ServiceListing
     * const serviceListing = await prisma.serviceListing.upsert({
     *   create: {
     *     // ... data to create a ServiceListing
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ServiceListing we want to update
     *   }
     * })
     */
    upsert<T extends ServiceListingUpsertArgs>(args: SelectSubset<T, ServiceListingUpsertArgs<ExtArgs>>): Prisma__ServiceListingClient<$Result.GetResult<Prisma.$ServiceListingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ServiceListings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceListingCountArgs} args - Arguments to filter ServiceListings to count.
     * @example
     * // Count the number of ServiceListings
     * const count = await prisma.serviceListing.count({
     *   where: {
     *     // ... the filter for the ServiceListings we want to count
     *   }
     * })
    **/
    count<T extends ServiceListingCountArgs>(
      args?: Subset<T, ServiceListingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ServiceListingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ServiceListing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceListingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ServiceListingAggregateArgs>(args: Subset<T, ServiceListingAggregateArgs>): Prisma.PrismaPromise<GetServiceListingAggregateType<T>>

    /**
     * Group by ServiceListing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceListingGroupByArgs} args - Group by arguments.
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
      T extends ServiceListingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ServiceListingGroupByArgs['orderBy'] }
        : { orderBy?: ServiceListingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ServiceListingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetServiceListingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ServiceListing model
   */
  readonly fields: ServiceListingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ServiceListing.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ServiceListingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cleaner<T extends UserAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserAccountDefaultArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    confirmedMatches<T extends ServiceListing$confirmedMatchesArgs<ExtArgs> = {}>(args?: Subset<T, ServiceListing$confirmedMatchesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfirmedMatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the ServiceListing model
   */
  interface ServiceListingFieldRefs {
    readonly id: FieldRef<"ServiceListing", 'String'>
    readonly serviceType: FieldRef<"ServiceListing", 'String'>
    readonly title: FieldRef<"ServiceListing", 'String'>
    readonly description: FieldRef<"ServiceListing", 'String'>
    readonly ratePerHr: FieldRef<"ServiceListing", 'Float'>
    readonly createdAt: FieldRef<"ServiceListing", 'DateTime'>
    readonly updatedAt: FieldRef<"ServiceListing", 'DateTime'>
    readonly cleanerId: FieldRef<"ServiceListing", 'String'>
    readonly status: FieldRef<"ServiceListing", 'ServiceListingStatus'>
  }
    

  // Custom InputTypes
  /**
   * ServiceListing findUnique
   */
  export type ServiceListingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceListing
     */
    select?: ServiceListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceListing
     */
    omit?: ServiceListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceListingInclude<ExtArgs> | null
    /**
     * Filter, which ServiceListing to fetch.
     */
    where: ServiceListingWhereUniqueInput
  }

  /**
   * ServiceListing findUniqueOrThrow
   */
  export type ServiceListingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceListing
     */
    select?: ServiceListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceListing
     */
    omit?: ServiceListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceListingInclude<ExtArgs> | null
    /**
     * Filter, which ServiceListing to fetch.
     */
    where: ServiceListingWhereUniqueInput
  }

  /**
   * ServiceListing findFirst
   */
  export type ServiceListingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceListing
     */
    select?: ServiceListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceListing
     */
    omit?: ServiceListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceListingInclude<ExtArgs> | null
    /**
     * Filter, which ServiceListing to fetch.
     */
    where?: ServiceListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServiceListings to fetch.
     */
    orderBy?: ServiceListingOrderByWithRelationInput | ServiceListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ServiceListings.
     */
    cursor?: ServiceListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServiceListings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServiceListings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ServiceListings.
     */
    distinct?: ServiceListingScalarFieldEnum | ServiceListingScalarFieldEnum[]
  }

  /**
   * ServiceListing findFirstOrThrow
   */
  export type ServiceListingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceListing
     */
    select?: ServiceListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceListing
     */
    omit?: ServiceListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceListingInclude<ExtArgs> | null
    /**
     * Filter, which ServiceListing to fetch.
     */
    where?: ServiceListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServiceListings to fetch.
     */
    orderBy?: ServiceListingOrderByWithRelationInput | ServiceListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ServiceListings.
     */
    cursor?: ServiceListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServiceListings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServiceListings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ServiceListings.
     */
    distinct?: ServiceListingScalarFieldEnum | ServiceListingScalarFieldEnum[]
  }

  /**
   * ServiceListing findMany
   */
  export type ServiceListingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceListing
     */
    select?: ServiceListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceListing
     */
    omit?: ServiceListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceListingInclude<ExtArgs> | null
    /**
     * Filter, which ServiceListings to fetch.
     */
    where?: ServiceListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServiceListings to fetch.
     */
    orderBy?: ServiceListingOrderByWithRelationInput | ServiceListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ServiceListings.
     */
    cursor?: ServiceListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServiceListings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServiceListings.
     */
    skip?: number
    distinct?: ServiceListingScalarFieldEnum | ServiceListingScalarFieldEnum[]
  }

  /**
   * ServiceListing create
   */
  export type ServiceListingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceListing
     */
    select?: ServiceListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceListing
     */
    omit?: ServiceListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceListingInclude<ExtArgs> | null
    /**
     * The data needed to create a ServiceListing.
     */
    data: XOR<ServiceListingCreateInput, ServiceListingUncheckedCreateInput>
  }

  /**
   * ServiceListing createMany
   */
  export type ServiceListingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ServiceListings.
     */
    data: ServiceListingCreateManyInput | ServiceListingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ServiceListing createManyAndReturn
   */
  export type ServiceListingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceListing
     */
    select?: ServiceListingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceListing
     */
    omit?: ServiceListingOmit<ExtArgs> | null
    /**
     * The data used to create many ServiceListings.
     */
    data: ServiceListingCreateManyInput | ServiceListingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceListingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ServiceListing update
   */
  export type ServiceListingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceListing
     */
    select?: ServiceListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceListing
     */
    omit?: ServiceListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceListingInclude<ExtArgs> | null
    /**
     * The data needed to update a ServiceListing.
     */
    data: XOR<ServiceListingUpdateInput, ServiceListingUncheckedUpdateInput>
    /**
     * Choose, which ServiceListing to update.
     */
    where: ServiceListingWhereUniqueInput
  }

  /**
   * ServiceListing updateMany
   */
  export type ServiceListingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ServiceListings.
     */
    data: XOR<ServiceListingUpdateManyMutationInput, ServiceListingUncheckedUpdateManyInput>
    /**
     * Filter which ServiceListings to update
     */
    where?: ServiceListingWhereInput
    /**
     * Limit how many ServiceListings to update.
     */
    limit?: number
  }

  /**
   * ServiceListing updateManyAndReturn
   */
  export type ServiceListingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceListing
     */
    select?: ServiceListingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceListing
     */
    omit?: ServiceListingOmit<ExtArgs> | null
    /**
     * The data used to update ServiceListings.
     */
    data: XOR<ServiceListingUpdateManyMutationInput, ServiceListingUncheckedUpdateManyInput>
    /**
     * Filter which ServiceListings to update
     */
    where?: ServiceListingWhereInput
    /**
     * Limit how many ServiceListings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceListingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ServiceListing upsert
   */
  export type ServiceListingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceListing
     */
    select?: ServiceListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceListing
     */
    omit?: ServiceListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceListingInclude<ExtArgs> | null
    /**
     * The filter to search for the ServiceListing to update in case it exists.
     */
    where: ServiceListingWhereUniqueInput
    /**
     * In case the ServiceListing found by the `where` argument doesn't exist, create a new ServiceListing with this data.
     */
    create: XOR<ServiceListingCreateInput, ServiceListingUncheckedCreateInput>
    /**
     * In case the ServiceListing was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ServiceListingUpdateInput, ServiceListingUncheckedUpdateInput>
  }

  /**
   * ServiceListing delete
   */
  export type ServiceListingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceListing
     */
    select?: ServiceListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceListing
     */
    omit?: ServiceListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceListingInclude<ExtArgs> | null
    /**
     * Filter which ServiceListing to delete.
     */
    where: ServiceListingWhereUniqueInput
  }

  /**
   * ServiceListing deleteMany
   */
  export type ServiceListingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ServiceListings to delete
     */
    where?: ServiceListingWhereInput
    /**
     * Limit how many ServiceListings to delete.
     */
    limit?: number
  }

  /**
   * ServiceListing.confirmedMatches
   */
  export type ServiceListing$confirmedMatchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfirmedMatch
     */
    select?: ConfirmedMatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfirmedMatch
     */
    omit?: ConfirmedMatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmedMatchInclude<ExtArgs> | null
    where?: ConfirmedMatchWhereInput
    orderBy?: ConfirmedMatchOrderByWithRelationInput | ConfirmedMatchOrderByWithRelationInput[]
    cursor?: ConfirmedMatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConfirmedMatchScalarFieldEnum | ConfirmedMatchScalarFieldEnum[]
  }

  /**
   * ServiceListing without action
   */
  export type ServiceListingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceListing
     */
    select?: ServiceListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceListing
     */
    omit?: ServiceListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceListingInclude<ExtArgs> | null
  }


  /**
   * Model ProfileView
   */

  export type AggregateProfileView = {
    _count: ProfileViewCountAggregateOutputType | null
    _min: ProfileViewMinAggregateOutputType | null
    _max: ProfileViewMaxAggregateOutputType | null
  }

  export type ProfileViewMinAggregateOutputType = {
    id: string | null
    viewedProfileId: string | null
    viewerId: string | null
    viewedAt: Date | null
  }

  export type ProfileViewMaxAggregateOutputType = {
    id: string | null
    viewedProfileId: string | null
    viewerId: string | null
    viewedAt: Date | null
  }

  export type ProfileViewCountAggregateOutputType = {
    id: number
    viewedProfileId: number
    viewerId: number
    viewedAt: number
    _all: number
  }


  export type ProfileViewMinAggregateInputType = {
    id?: true
    viewedProfileId?: true
    viewerId?: true
    viewedAt?: true
  }

  export type ProfileViewMaxAggregateInputType = {
    id?: true
    viewedProfileId?: true
    viewerId?: true
    viewedAt?: true
  }

  export type ProfileViewCountAggregateInputType = {
    id?: true
    viewedProfileId?: true
    viewerId?: true
    viewedAt?: true
    _all?: true
  }

  export type ProfileViewAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProfileView to aggregate.
     */
    where?: ProfileViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileViews to fetch.
     */
    orderBy?: ProfileViewOrderByWithRelationInput | ProfileViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProfileViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProfileViews
    **/
    _count?: true | ProfileViewCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfileViewMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfileViewMaxAggregateInputType
  }

  export type GetProfileViewAggregateType<T extends ProfileViewAggregateArgs> = {
        [P in keyof T & keyof AggregateProfileView]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfileView[P]>
      : GetScalarType<T[P], AggregateProfileView[P]>
  }




  export type ProfileViewGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileViewWhereInput
    orderBy?: ProfileViewOrderByWithAggregationInput | ProfileViewOrderByWithAggregationInput[]
    by: ProfileViewScalarFieldEnum[] | ProfileViewScalarFieldEnum
    having?: ProfileViewScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfileViewCountAggregateInputType | true
    _min?: ProfileViewMinAggregateInputType
    _max?: ProfileViewMaxAggregateInputType
  }

  export type ProfileViewGroupByOutputType = {
    id: string
    viewedProfileId: string
    viewerId: string | null
    viewedAt: Date
    _count: ProfileViewCountAggregateOutputType | null
    _min: ProfileViewMinAggregateOutputType | null
    _max: ProfileViewMaxAggregateOutputType | null
  }

  type GetProfileViewGroupByPayload<T extends ProfileViewGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfileViewGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfileViewGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfileViewGroupByOutputType[P]>
            : GetScalarType<T[P], ProfileViewGroupByOutputType[P]>
        }
      >
    >


  export type ProfileViewSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    viewedProfileId?: boolean
    viewerId?: boolean
    viewedAt?: boolean
    viewedProfile?: boolean | UserAccountDefaultArgs<ExtArgs>
    viewer?: boolean | ProfileView$viewerArgs<ExtArgs>
  }, ExtArgs["result"]["profileView"]>

  export type ProfileViewSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    viewedProfileId?: boolean
    viewerId?: boolean
    viewedAt?: boolean
    viewedProfile?: boolean | UserAccountDefaultArgs<ExtArgs>
    viewer?: boolean | ProfileView$viewerArgs<ExtArgs>
  }, ExtArgs["result"]["profileView"]>

  export type ProfileViewSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    viewedProfileId?: boolean
    viewerId?: boolean
    viewedAt?: boolean
    viewedProfile?: boolean | UserAccountDefaultArgs<ExtArgs>
    viewer?: boolean | ProfileView$viewerArgs<ExtArgs>
  }, ExtArgs["result"]["profileView"]>

  export type ProfileViewSelectScalar = {
    id?: boolean
    viewedProfileId?: boolean
    viewerId?: boolean
    viewedAt?: boolean
  }

  export type ProfileViewOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "viewedProfileId" | "viewerId" | "viewedAt", ExtArgs["result"]["profileView"]>
  export type ProfileViewInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    viewedProfile?: boolean | UserAccountDefaultArgs<ExtArgs>
    viewer?: boolean | ProfileView$viewerArgs<ExtArgs>
  }
  export type ProfileViewIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    viewedProfile?: boolean | UserAccountDefaultArgs<ExtArgs>
    viewer?: boolean | ProfileView$viewerArgs<ExtArgs>
  }
  export type ProfileViewIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    viewedProfile?: boolean | UserAccountDefaultArgs<ExtArgs>
    viewer?: boolean | ProfileView$viewerArgs<ExtArgs>
  }

  export type $ProfileViewPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProfileView"
    objects: {
      viewedProfile: Prisma.$UserAccountPayload<ExtArgs>
      viewer: Prisma.$UserAccountPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      viewedProfileId: string
      viewerId: string | null
      viewedAt: Date
    }, ExtArgs["result"]["profileView"]>
    composites: {}
  }

  type ProfileViewGetPayload<S extends boolean | null | undefined | ProfileViewDefaultArgs> = $Result.GetResult<Prisma.$ProfileViewPayload, S>

  type ProfileViewCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProfileViewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProfileViewCountAggregateInputType | true
    }

  export interface ProfileViewDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProfileView'], meta: { name: 'ProfileView' } }
    /**
     * Find zero or one ProfileView that matches the filter.
     * @param {ProfileViewFindUniqueArgs} args - Arguments to find a ProfileView
     * @example
     * // Get one ProfileView
     * const profileView = await prisma.profileView.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfileViewFindUniqueArgs>(args: SelectSubset<T, ProfileViewFindUniqueArgs<ExtArgs>>): Prisma__ProfileViewClient<$Result.GetResult<Prisma.$ProfileViewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProfileView that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProfileViewFindUniqueOrThrowArgs} args - Arguments to find a ProfileView
     * @example
     * // Get one ProfileView
     * const profileView = await prisma.profileView.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfileViewFindUniqueOrThrowArgs>(args: SelectSubset<T, ProfileViewFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProfileViewClient<$Result.GetResult<Prisma.$ProfileViewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProfileView that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileViewFindFirstArgs} args - Arguments to find a ProfileView
     * @example
     * // Get one ProfileView
     * const profileView = await prisma.profileView.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfileViewFindFirstArgs>(args?: SelectSubset<T, ProfileViewFindFirstArgs<ExtArgs>>): Prisma__ProfileViewClient<$Result.GetResult<Prisma.$ProfileViewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProfileView that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileViewFindFirstOrThrowArgs} args - Arguments to find a ProfileView
     * @example
     * // Get one ProfileView
     * const profileView = await prisma.profileView.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfileViewFindFirstOrThrowArgs>(args?: SelectSubset<T, ProfileViewFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProfileViewClient<$Result.GetResult<Prisma.$ProfileViewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProfileViews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileViewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProfileViews
     * const profileViews = await prisma.profileView.findMany()
     * 
     * // Get first 10 ProfileViews
     * const profileViews = await prisma.profileView.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const profileViewWithIdOnly = await prisma.profileView.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProfileViewFindManyArgs>(args?: SelectSubset<T, ProfileViewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfileViewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProfileView.
     * @param {ProfileViewCreateArgs} args - Arguments to create a ProfileView.
     * @example
     * // Create one ProfileView
     * const ProfileView = await prisma.profileView.create({
     *   data: {
     *     // ... data to create a ProfileView
     *   }
     * })
     * 
     */
    create<T extends ProfileViewCreateArgs>(args: SelectSubset<T, ProfileViewCreateArgs<ExtArgs>>): Prisma__ProfileViewClient<$Result.GetResult<Prisma.$ProfileViewPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProfileViews.
     * @param {ProfileViewCreateManyArgs} args - Arguments to create many ProfileViews.
     * @example
     * // Create many ProfileViews
     * const profileView = await prisma.profileView.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProfileViewCreateManyArgs>(args?: SelectSubset<T, ProfileViewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProfileViews and returns the data saved in the database.
     * @param {ProfileViewCreateManyAndReturnArgs} args - Arguments to create many ProfileViews.
     * @example
     * // Create many ProfileViews
     * const profileView = await prisma.profileView.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProfileViews and only return the `id`
     * const profileViewWithIdOnly = await prisma.profileView.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProfileViewCreateManyAndReturnArgs>(args?: SelectSubset<T, ProfileViewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfileViewPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProfileView.
     * @param {ProfileViewDeleteArgs} args - Arguments to delete one ProfileView.
     * @example
     * // Delete one ProfileView
     * const ProfileView = await prisma.profileView.delete({
     *   where: {
     *     // ... filter to delete one ProfileView
     *   }
     * })
     * 
     */
    delete<T extends ProfileViewDeleteArgs>(args: SelectSubset<T, ProfileViewDeleteArgs<ExtArgs>>): Prisma__ProfileViewClient<$Result.GetResult<Prisma.$ProfileViewPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProfileView.
     * @param {ProfileViewUpdateArgs} args - Arguments to update one ProfileView.
     * @example
     * // Update one ProfileView
     * const profileView = await prisma.profileView.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProfileViewUpdateArgs>(args: SelectSubset<T, ProfileViewUpdateArgs<ExtArgs>>): Prisma__ProfileViewClient<$Result.GetResult<Prisma.$ProfileViewPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProfileViews.
     * @param {ProfileViewDeleteManyArgs} args - Arguments to filter ProfileViews to delete.
     * @example
     * // Delete a few ProfileViews
     * const { count } = await prisma.profileView.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProfileViewDeleteManyArgs>(args?: SelectSubset<T, ProfileViewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProfileViews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileViewUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProfileViews
     * const profileView = await prisma.profileView.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProfileViewUpdateManyArgs>(args: SelectSubset<T, ProfileViewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProfileViews and returns the data updated in the database.
     * @param {ProfileViewUpdateManyAndReturnArgs} args - Arguments to update many ProfileViews.
     * @example
     * // Update many ProfileViews
     * const profileView = await prisma.profileView.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProfileViews and only return the `id`
     * const profileViewWithIdOnly = await prisma.profileView.updateManyAndReturn({
     *   select: { id: true },
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
    updateManyAndReturn<T extends ProfileViewUpdateManyAndReturnArgs>(args: SelectSubset<T, ProfileViewUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfileViewPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProfileView.
     * @param {ProfileViewUpsertArgs} args - Arguments to update or create a ProfileView.
     * @example
     * // Update or create a ProfileView
     * const profileView = await prisma.profileView.upsert({
     *   create: {
     *     // ... data to create a ProfileView
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProfileView we want to update
     *   }
     * })
     */
    upsert<T extends ProfileViewUpsertArgs>(args: SelectSubset<T, ProfileViewUpsertArgs<ExtArgs>>): Prisma__ProfileViewClient<$Result.GetResult<Prisma.$ProfileViewPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProfileViews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileViewCountArgs} args - Arguments to filter ProfileViews to count.
     * @example
     * // Count the number of ProfileViews
     * const count = await prisma.profileView.count({
     *   where: {
     *     // ... the filter for the ProfileViews we want to count
     *   }
     * })
    **/
    count<T extends ProfileViewCountArgs>(
      args?: Subset<T, ProfileViewCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfileViewCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProfileView.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileViewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProfileViewAggregateArgs>(args: Subset<T, ProfileViewAggregateArgs>): Prisma.PrismaPromise<GetProfileViewAggregateType<T>>

    /**
     * Group by ProfileView.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileViewGroupByArgs} args - Group by arguments.
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
      T extends ProfileViewGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfileViewGroupByArgs['orderBy'] }
        : { orderBy?: ProfileViewGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProfileViewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfileViewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProfileView model
   */
  readonly fields: ProfileViewFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProfileView.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfileViewClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    viewedProfile<T extends UserAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserAccountDefaultArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    viewer<T extends ProfileView$viewerArgs<ExtArgs> = {}>(args?: Subset<T, ProfileView$viewerArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ProfileView model
   */
  interface ProfileViewFieldRefs {
    readonly id: FieldRef<"ProfileView", 'String'>
    readonly viewedProfileId: FieldRef<"ProfileView", 'String'>
    readonly viewerId: FieldRef<"ProfileView", 'String'>
    readonly viewedAt: FieldRef<"ProfileView", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProfileView findUnique
   */
  export type ProfileViewFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileView
     */
    select?: ProfileViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileView
     */
    omit?: ProfileViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileViewInclude<ExtArgs> | null
    /**
     * Filter, which ProfileView to fetch.
     */
    where: ProfileViewWhereUniqueInput
  }

  /**
   * ProfileView findUniqueOrThrow
   */
  export type ProfileViewFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileView
     */
    select?: ProfileViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileView
     */
    omit?: ProfileViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileViewInclude<ExtArgs> | null
    /**
     * Filter, which ProfileView to fetch.
     */
    where: ProfileViewWhereUniqueInput
  }

  /**
   * ProfileView findFirst
   */
  export type ProfileViewFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileView
     */
    select?: ProfileViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileView
     */
    omit?: ProfileViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileViewInclude<ExtArgs> | null
    /**
     * Filter, which ProfileView to fetch.
     */
    where?: ProfileViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileViews to fetch.
     */
    orderBy?: ProfileViewOrderByWithRelationInput | ProfileViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProfileViews.
     */
    cursor?: ProfileViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfileViews.
     */
    distinct?: ProfileViewScalarFieldEnum | ProfileViewScalarFieldEnum[]
  }

  /**
   * ProfileView findFirstOrThrow
   */
  export type ProfileViewFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileView
     */
    select?: ProfileViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileView
     */
    omit?: ProfileViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileViewInclude<ExtArgs> | null
    /**
     * Filter, which ProfileView to fetch.
     */
    where?: ProfileViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileViews to fetch.
     */
    orderBy?: ProfileViewOrderByWithRelationInput | ProfileViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProfileViews.
     */
    cursor?: ProfileViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfileViews.
     */
    distinct?: ProfileViewScalarFieldEnum | ProfileViewScalarFieldEnum[]
  }

  /**
   * ProfileView findMany
   */
  export type ProfileViewFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileView
     */
    select?: ProfileViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileView
     */
    omit?: ProfileViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileViewInclude<ExtArgs> | null
    /**
     * Filter, which ProfileViews to fetch.
     */
    where?: ProfileViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileViews to fetch.
     */
    orderBy?: ProfileViewOrderByWithRelationInput | ProfileViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProfileViews.
     */
    cursor?: ProfileViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileViews.
     */
    skip?: number
    distinct?: ProfileViewScalarFieldEnum | ProfileViewScalarFieldEnum[]
  }

  /**
   * ProfileView create
   */
  export type ProfileViewCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileView
     */
    select?: ProfileViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileView
     */
    omit?: ProfileViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileViewInclude<ExtArgs> | null
    /**
     * The data needed to create a ProfileView.
     */
    data: XOR<ProfileViewCreateInput, ProfileViewUncheckedCreateInput>
  }

  /**
   * ProfileView createMany
   */
  export type ProfileViewCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProfileViews.
     */
    data: ProfileViewCreateManyInput | ProfileViewCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProfileView createManyAndReturn
   */
  export type ProfileViewCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileView
     */
    select?: ProfileViewSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileView
     */
    omit?: ProfileViewOmit<ExtArgs> | null
    /**
     * The data used to create many ProfileViews.
     */
    data: ProfileViewCreateManyInput | ProfileViewCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileViewIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProfileView update
   */
  export type ProfileViewUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileView
     */
    select?: ProfileViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileView
     */
    omit?: ProfileViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileViewInclude<ExtArgs> | null
    /**
     * The data needed to update a ProfileView.
     */
    data: XOR<ProfileViewUpdateInput, ProfileViewUncheckedUpdateInput>
    /**
     * Choose, which ProfileView to update.
     */
    where: ProfileViewWhereUniqueInput
  }

  /**
   * ProfileView updateMany
   */
  export type ProfileViewUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProfileViews.
     */
    data: XOR<ProfileViewUpdateManyMutationInput, ProfileViewUncheckedUpdateManyInput>
    /**
     * Filter which ProfileViews to update
     */
    where?: ProfileViewWhereInput
    /**
     * Limit how many ProfileViews to update.
     */
    limit?: number
  }

  /**
   * ProfileView updateManyAndReturn
   */
  export type ProfileViewUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileView
     */
    select?: ProfileViewSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileView
     */
    omit?: ProfileViewOmit<ExtArgs> | null
    /**
     * The data used to update ProfileViews.
     */
    data: XOR<ProfileViewUpdateManyMutationInput, ProfileViewUncheckedUpdateManyInput>
    /**
     * Filter which ProfileViews to update
     */
    where?: ProfileViewWhereInput
    /**
     * Limit how many ProfileViews to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileViewIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProfileView upsert
   */
  export type ProfileViewUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileView
     */
    select?: ProfileViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileView
     */
    omit?: ProfileViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileViewInclude<ExtArgs> | null
    /**
     * The filter to search for the ProfileView to update in case it exists.
     */
    where: ProfileViewWhereUniqueInput
    /**
     * In case the ProfileView found by the `where` argument doesn't exist, create a new ProfileView with this data.
     */
    create: XOR<ProfileViewCreateInput, ProfileViewUncheckedCreateInput>
    /**
     * In case the ProfileView was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfileViewUpdateInput, ProfileViewUncheckedUpdateInput>
  }

  /**
   * ProfileView delete
   */
  export type ProfileViewDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileView
     */
    select?: ProfileViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileView
     */
    omit?: ProfileViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileViewInclude<ExtArgs> | null
    /**
     * Filter which ProfileView to delete.
     */
    where: ProfileViewWhereUniqueInput
  }

  /**
   * ProfileView deleteMany
   */
  export type ProfileViewDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProfileViews to delete
     */
    where?: ProfileViewWhereInput
    /**
     * Limit how many ProfileViews to delete.
     */
    limit?: number
  }

  /**
   * ProfileView.viewer
   */
  export type ProfileView$viewerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
    where?: UserAccountWhereInput
  }

  /**
   * ProfileView without action
   */
  export type ProfileViewDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileView
     */
    select?: ProfileViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileView
     */
    omit?: ProfileViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileViewInclude<ExtArgs> | null
  }


  /**
   * Model Shortlist
   */

  export type AggregateShortlist = {
    _count: ShortlistCountAggregateOutputType | null
    _min: ShortlistMinAggregateOutputType | null
    _max: ShortlistMaxAggregateOutputType | null
  }

  export type ShortlistMinAggregateOutputType = {
    id: string | null
    homeownerId: string | null
    cleanerId: string | null
    createdAt: Date | null
  }

  export type ShortlistMaxAggregateOutputType = {
    id: string | null
    homeownerId: string | null
    cleanerId: string | null
    createdAt: Date | null
  }

  export type ShortlistCountAggregateOutputType = {
    id: number
    homeownerId: number
    cleanerId: number
    createdAt: number
    _all: number
  }


  export type ShortlistMinAggregateInputType = {
    id?: true
    homeownerId?: true
    cleanerId?: true
    createdAt?: true
  }

  export type ShortlistMaxAggregateInputType = {
    id?: true
    homeownerId?: true
    cleanerId?: true
    createdAt?: true
  }

  export type ShortlistCountAggregateInputType = {
    id?: true
    homeownerId?: true
    cleanerId?: true
    createdAt?: true
    _all?: true
  }

  export type ShortlistAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Shortlist to aggregate.
     */
    where?: ShortlistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shortlists to fetch.
     */
    orderBy?: ShortlistOrderByWithRelationInput | ShortlistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ShortlistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shortlists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shortlists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Shortlists
    **/
    _count?: true | ShortlistCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ShortlistMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ShortlistMaxAggregateInputType
  }

  export type GetShortlistAggregateType<T extends ShortlistAggregateArgs> = {
        [P in keyof T & keyof AggregateShortlist]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateShortlist[P]>
      : GetScalarType<T[P], AggregateShortlist[P]>
  }




  export type ShortlistGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShortlistWhereInput
    orderBy?: ShortlistOrderByWithAggregationInput | ShortlistOrderByWithAggregationInput[]
    by: ShortlistScalarFieldEnum[] | ShortlistScalarFieldEnum
    having?: ShortlistScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ShortlistCountAggregateInputType | true
    _min?: ShortlistMinAggregateInputType
    _max?: ShortlistMaxAggregateInputType
  }

  export type ShortlistGroupByOutputType = {
    id: string
    homeownerId: string
    cleanerId: string
    createdAt: Date
    _count: ShortlistCountAggregateOutputType | null
    _min: ShortlistMinAggregateOutputType | null
    _max: ShortlistMaxAggregateOutputType | null
  }

  type GetShortlistGroupByPayload<T extends ShortlistGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ShortlistGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ShortlistGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ShortlistGroupByOutputType[P]>
            : GetScalarType<T[P], ShortlistGroupByOutputType[P]>
        }
      >
    >


  export type ShortlistSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    homeownerId?: boolean
    cleanerId?: boolean
    createdAt?: boolean
    homeowner?: boolean | UserAccountDefaultArgs<ExtArgs>
    cleaner?: boolean | UserAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shortlist"]>

  export type ShortlistSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    homeownerId?: boolean
    cleanerId?: boolean
    createdAt?: boolean
    homeowner?: boolean | UserAccountDefaultArgs<ExtArgs>
    cleaner?: boolean | UserAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shortlist"]>

  export type ShortlistSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    homeownerId?: boolean
    cleanerId?: boolean
    createdAt?: boolean
    homeowner?: boolean | UserAccountDefaultArgs<ExtArgs>
    cleaner?: boolean | UserAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shortlist"]>

  export type ShortlistSelectScalar = {
    id?: boolean
    homeownerId?: boolean
    cleanerId?: boolean
    createdAt?: boolean
  }

  export type ShortlistOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "homeownerId" | "cleanerId" | "createdAt", ExtArgs["result"]["shortlist"]>
  export type ShortlistInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    homeowner?: boolean | UserAccountDefaultArgs<ExtArgs>
    cleaner?: boolean | UserAccountDefaultArgs<ExtArgs>
  }
  export type ShortlistIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    homeowner?: boolean | UserAccountDefaultArgs<ExtArgs>
    cleaner?: boolean | UserAccountDefaultArgs<ExtArgs>
  }
  export type ShortlistIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    homeowner?: boolean | UserAccountDefaultArgs<ExtArgs>
    cleaner?: boolean | UserAccountDefaultArgs<ExtArgs>
  }

  export type $ShortlistPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Shortlist"
    objects: {
      homeowner: Prisma.$UserAccountPayload<ExtArgs>
      cleaner: Prisma.$UserAccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      homeownerId: string
      cleanerId: string
      createdAt: Date
    }, ExtArgs["result"]["shortlist"]>
    composites: {}
  }

  type ShortlistGetPayload<S extends boolean | null | undefined | ShortlistDefaultArgs> = $Result.GetResult<Prisma.$ShortlistPayload, S>

  type ShortlistCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ShortlistFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ShortlistCountAggregateInputType | true
    }

  export interface ShortlistDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Shortlist'], meta: { name: 'Shortlist' } }
    /**
     * Find zero or one Shortlist that matches the filter.
     * @param {ShortlistFindUniqueArgs} args - Arguments to find a Shortlist
     * @example
     * // Get one Shortlist
     * const shortlist = await prisma.shortlist.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ShortlistFindUniqueArgs>(args: SelectSubset<T, ShortlistFindUniqueArgs<ExtArgs>>): Prisma__ShortlistClient<$Result.GetResult<Prisma.$ShortlistPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Shortlist that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ShortlistFindUniqueOrThrowArgs} args - Arguments to find a Shortlist
     * @example
     * // Get one Shortlist
     * const shortlist = await prisma.shortlist.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ShortlistFindUniqueOrThrowArgs>(args: SelectSubset<T, ShortlistFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ShortlistClient<$Result.GetResult<Prisma.$ShortlistPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Shortlist that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShortlistFindFirstArgs} args - Arguments to find a Shortlist
     * @example
     * // Get one Shortlist
     * const shortlist = await prisma.shortlist.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ShortlistFindFirstArgs>(args?: SelectSubset<T, ShortlistFindFirstArgs<ExtArgs>>): Prisma__ShortlistClient<$Result.GetResult<Prisma.$ShortlistPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Shortlist that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShortlistFindFirstOrThrowArgs} args - Arguments to find a Shortlist
     * @example
     * // Get one Shortlist
     * const shortlist = await prisma.shortlist.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ShortlistFindFirstOrThrowArgs>(args?: SelectSubset<T, ShortlistFindFirstOrThrowArgs<ExtArgs>>): Prisma__ShortlistClient<$Result.GetResult<Prisma.$ShortlistPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Shortlists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShortlistFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Shortlists
     * const shortlists = await prisma.shortlist.findMany()
     * 
     * // Get first 10 Shortlists
     * const shortlists = await prisma.shortlist.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const shortlistWithIdOnly = await prisma.shortlist.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ShortlistFindManyArgs>(args?: SelectSubset<T, ShortlistFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShortlistPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Shortlist.
     * @param {ShortlistCreateArgs} args - Arguments to create a Shortlist.
     * @example
     * // Create one Shortlist
     * const Shortlist = await prisma.shortlist.create({
     *   data: {
     *     // ... data to create a Shortlist
     *   }
     * })
     * 
     */
    create<T extends ShortlistCreateArgs>(args: SelectSubset<T, ShortlistCreateArgs<ExtArgs>>): Prisma__ShortlistClient<$Result.GetResult<Prisma.$ShortlistPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Shortlists.
     * @param {ShortlistCreateManyArgs} args - Arguments to create many Shortlists.
     * @example
     * // Create many Shortlists
     * const shortlist = await prisma.shortlist.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ShortlistCreateManyArgs>(args?: SelectSubset<T, ShortlistCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Shortlists and returns the data saved in the database.
     * @param {ShortlistCreateManyAndReturnArgs} args - Arguments to create many Shortlists.
     * @example
     * // Create many Shortlists
     * const shortlist = await prisma.shortlist.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Shortlists and only return the `id`
     * const shortlistWithIdOnly = await prisma.shortlist.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ShortlistCreateManyAndReturnArgs>(args?: SelectSubset<T, ShortlistCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShortlistPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Shortlist.
     * @param {ShortlistDeleteArgs} args - Arguments to delete one Shortlist.
     * @example
     * // Delete one Shortlist
     * const Shortlist = await prisma.shortlist.delete({
     *   where: {
     *     // ... filter to delete one Shortlist
     *   }
     * })
     * 
     */
    delete<T extends ShortlistDeleteArgs>(args: SelectSubset<T, ShortlistDeleteArgs<ExtArgs>>): Prisma__ShortlistClient<$Result.GetResult<Prisma.$ShortlistPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Shortlist.
     * @param {ShortlistUpdateArgs} args - Arguments to update one Shortlist.
     * @example
     * // Update one Shortlist
     * const shortlist = await prisma.shortlist.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ShortlistUpdateArgs>(args: SelectSubset<T, ShortlistUpdateArgs<ExtArgs>>): Prisma__ShortlistClient<$Result.GetResult<Prisma.$ShortlistPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Shortlists.
     * @param {ShortlistDeleteManyArgs} args - Arguments to filter Shortlists to delete.
     * @example
     * // Delete a few Shortlists
     * const { count } = await prisma.shortlist.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ShortlistDeleteManyArgs>(args?: SelectSubset<T, ShortlistDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Shortlists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShortlistUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Shortlists
     * const shortlist = await prisma.shortlist.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ShortlistUpdateManyArgs>(args: SelectSubset<T, ShortlistUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Shortlists and returns the data updated in the database.
     * @param {ShortlistUpdateManyAndReturnArgs} args - Arguments to update many Shortlists.
     * @example
     * // Update many Shortlists
     * const shortlist = await prisma.shortlist.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Shortlists and only return the `id`
     * const shortlistWithIdOnly = await prisma.shortlist.updateManyAndReturn({
     *   select: { id: true },
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
    updateManyAndReturn<T extends ShortlistUpdateManyAndReturnArgs>(args: SelectSubset<T, ShortlistUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShortlistPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Shortlist.
     * @param {ShortlistUpsertArgs} args - Arguments to update or create a Shortlist.
     * @example
     * // Update or create a Shortlist
     * const shortlist = await prisma.shortlist.upsert({
     *   create: {
     *     // ... data to create a Shortlist
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Shortlist we want to update
     *   }
     * })
     */
    upsert<T extends ShortlistUpsertArgs>(args: SelectSubset<T, ShortlistUpsertArgs<ExtArgs>>): Prisma__ShortlistClient<$Result.GetResult<Prisma.$ShortlistPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Shortlists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShortlistCountArgs} args - Arguments to filter Shortlists to count.
     * @example
     * // Count the number of Shortlists
     * const count = await prisma.shortlist.count({
     *   where: {
     *     // ... the filter for the Shortlists we want to count
     *   }
     * })
    **/
    count<T extends ShortlistCountArgs>(
      args?: Subset<T, ShortlistCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ShortlistCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Shortlist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShortlistAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ShortlistAggregateArgs>(args: Subset<T, ShortlistAggregateArgs>): Prisma.PrismaPromise<GetShortlistAggregateType<T>>

    /**
     * Group by Shortlist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShortlistGroupByArgs} args - Group by arguments.
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
      T extends ShortlistGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ShortlistGroupByArgs['orderBy'] }
        : { orderBy?: ShortlistGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ShortlistGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetShortlistGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Shortlist model
   */
  readonly fields: ShortlistFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Shortlist.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ShortlistClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    homeowner<T extends UserAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserAccountDefaultArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    cleaner<T extends UserAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserAccountDefaultArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Shortlist model
   */
  interface ShortlistFieldRefs {
    readonly id: FieldRef<"Shortlist", 'String'>
    readonly homeownerId: FieldRef<"Shortlist", 'String'>
    readonly cleanerId: FieldRef<"Shortlist", 'String'>
    readonly createdAt: FieldRef<"Shortlist", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Shortlist findUnique
   */
  export type ShortlistFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shortlist
     */
    select?: ShortlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shortlist
     */
    omit?: ShortlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShortlistInclude<ExtArgs> | null
    /**
     * Filter, which Shortlist to fetch.
     */
    where: ShortlistWhereUniqueInput
  }

  /**
   * Shortlist findUniqueOrThrow
   */
  export type ShortlistFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shortlist
     */
    select?: ShortlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shortlist
     */
    omit?: ShortlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShortlistInclude<ExtArgs> | null
    /**
     * Filter, which Shortlist to fetch.
     */
    where: ShortlistWhereUniqueInput
  }

  /**
   * Shortlist findFirst
   */
  export type ShortlistFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shortlist
     */
    select?: ShortlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shortlist
     */
    omit?: ShortlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShortlistInclude<ExtArgs> | null
    /**
     * Filter, which Shortlist to fetch.
     */
    where?: ShortlistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shortlists to fetch.
     */
    orderBy?: ShortlistOrderByWithRelationInput | ShortlistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Shortlists.
     */
    cursor?: ShortlistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shortlists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shortlists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Shortlists.
     */
    distinct?: ShortlistScalarFieldEnum | ShortlistScalarFieldEnum[]
  }

  /**
   * Shortlist findFirstOrThrow
   */
  export type ShortlistFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shortlist
     */
    select?: ShortlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shortlist
     */
    omit?: ShortlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShortlistInclude<ExtArgs> | null
    /**
     * Filter, which Shortlist to fetch.
     */
    where?: ShortlistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shortlists to fetch.
     */
    orderBy?: ShortlistOrderByWithRelationInput | ShortlistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Shortlists.
     */
    cursor?: ShortlistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shortlists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shortlists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Shortlists.
     */
    distinct?: ShortlistScalarFieldEnum | ShortlistScalarFieldEnum[]
  }

  /**
   * Shortlist findMany
   */
  export type ShortlistFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shortlist
     */
    select?: ShortlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shortlist
     */
    omit?: ShortlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShortlistInclude<ExtArgs> | null
    /**
     * Filter, which Shortlists to fetch.
     */
    where?: ShortlistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shortlists to fetch.
     */
    orderBy?: ShortlistOrderByWithRelationInput | ShortlistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Shortlists.
     */
    cursor?: ShortlistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shortlists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shortlists.
     */
    skip?: number
    distinct?: ShortlistScalarFieldEnum | ShortlistScalarFieldEnum[]
  }

  /**
   * Shortlist create
   */
  export type ShortlistCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shortlist
     */
    select?: ShortlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shortlist
     */
    omit?: ShortlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShortlistInclude<ExtArgs> | null
    /**
     * The data needed to create a Shortlist.
     */
    data: XOR<ShortlistCreateInput, ShortlistUncheckedCreateInput>
  }

  /**
   * Shortlist createMany
   */
  export type ShortlistCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Shortlists.
     */
    data: ShortlistCreateManyInput | ShortlistCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Shortlist createManyAndReturn
   */
  export type ShortlistCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shortlist
     */
    select?: ShortlistSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Shortlist
     */
    omit?: ShortlistOmit<ExtArgs> | null
    /**
     * The data used to create many Shortlists.
     */
    data: ShortlistCreateManyInput | ShortlistCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShortlistIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Shortlist update
   */
  export type ShortlistUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shortlist
     */
    select?: ShortlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shortlist
     */
    omit?: ShortlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShortlistInclude<ExtArgs> | null
    /**
     * The data needed to update a Shortlist.
     */
    data: XOR<ShortlistUpdateInput, ShortlistUncheckedUpdateInput>
    /**
     * Choose, which Shortlist to update.
     */
    where: ShortlistWhereUniqueInput
  }

  /**
   * Shortlist updateMany
   */
  export type ShortlistUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Shortlists.
     */
    data: XOR<ShortlistUpdateManyMutationInput, ShortlistUncheckedUpdateManyInput>
    /**
     * Filter which Shortlists to update
     */
    where?: ShortlistWhereInput
    /**
     * Limit how many Shortlists to update.
     */
    limit?: number
  }

  /**
   * Shortlist updateManyAndReturn
   */
  export type ShortlistUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shortlist
     */
    select?: ShortlistSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Shortlist
     */
    omit?: ShortlistOmit<ExtArgs> | null
    /**
     * The data used to update Shortlists.
     */
    data: XOR<ShortlistUpdateManyMutationInput, ShortlistUncheckedUpdateManyInput>
    /**
     * Filter which Shortlists to update
     */
    where?: ShortlistWhereInput
    /**
     * Limit how many Shortlists to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShortlistIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Shortlist upsert
   */
  export type ShortlistUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shortlist
     */
    select?: ShortlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shortlist
     */
    omit?: ShortlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShortlistInclude<ExtArgs> | null
    /**
     * The filter to search for the Shortlist to update in case it exists.
     */
    where: ShortlistWhereUniqueInput
    /**
     * In case the Shortlist found by the `where` argument doesn't exist, create a new Shortlist with this data.
     */
    create: XOR<ShortlistCreateInput, ShortlistUncheckedCreateInput>
    /**
     * In case the Shortlist was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ShortlistUpdateInput, ShortlistUncheckedUpdateInput>
  }

  /**
   * Shortlist delete
   */
  export type ShortlistDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shortlist
     */
    select?: ShortlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shortlist
     */
    omit?: ShortlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShortlistInclude<ExtArgs> | null
    /**
     * Filter which Shortlist to delete.
     */
    where: ShortlistWhereUniqueInput
  }

  /**
   * Shortlist deleteMany
   */
  export type ShortlistDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Shortlists to delete
     */
    where?: ShortlistWhereInput
    /**
     * Limit how many Shortlists to delete.
     */
    limit?: number
  }

  /**
   * Shortlist without action
   */
  export type ShortlistDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shortlist
     */
    select?: ShortlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shortlist
     */
    omit?: ShortlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShortlistInclude<ExtArgs> | null
  }


  /**
   * Model ConfirmedMatch
   */

  export type AggregateConfirmedMatch = {
    _count: ConfirmedMatchCountAggregateOutputType | null
    _min: ConfirmedMatchMinAggregateOutputType | null
    _max: ConfirmedMatchMaxAggregateOutputType | null
  }

  export type ConfirmedMatchMinAggregateOutputType = {
    id: string | null
    serviceListingId: string | null
    homeownerId: string | null
    confirmationDate: Date | null
  }

  export type ConfirmedMatchMaxAggregateOutputType = {
    id: string | null
    serviceListingId: string | null
    homeownerId: string | null
    confirmationDate: Date | null
  }

  export type ConfirmedMatchCountAggregateOutputType = {
    id: number
    serviceListingId: number
    homeownerId: number
    confirmationDate: number
    _all: number
  }


  export type ConfirmedMatchMinAggregateInputType = {
    id?: true
    serviceListingId?: true
    homeownerId?: true
    confirmationDate?: true
  }

  export type ConfirmedMatchMaxAggregateInputType = {
    id?: true
    serviceListingId?: true
    homeownerId?: true
    confirmationDate?: true
  }

  export type ConfirmedMatchCountAggregateInputType = {
    id?: true
    serviceListingId?: true
    homeownerId?: true
    confirmationDate?: true
    _all?: true
  }

  export type ConfirmedMatchAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConfirmedMatch to aggregate.
     */
    where?: ConfirmedMatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfirmedMatches to fetch.
     */
    orderBy?: ConfirmedMatchOrderByWithRelationInput | ConfirmedMatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConfirmedMatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfirmedMatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfirmedMatches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConfirmedMatches
    **/
    _count?: true | ConfirmedMatchCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConfirmedMatchMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConfirmedMatchMaxAggregateInputType
  }

  export type GetConfirmedMatchAggregateType<T extends ConfirmedMatchAggregateArgs> = {
        [P in keyof T & keyof AggregateConfirmedMatch]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConfirmedMatch[P]>
      : GetScalarType<T[P], AggregateConfirmedMatch[P]>
  }




  export type ConfirmedMatchGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConfirmedMatchWhereInput
    orderBy?: ConfirmedMatchOrderByWithAggregationInput | ConfirmedMatchOrderByWithAggregationInput[]
    by: ConfirmedMatchScalarFieldEnum[] | ConfirmedMatchScalarFieldEnum
    having?: ConfirmedMatchScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConfirmedMatchCountAggregateInputType | true
    _min?: ConfirmedMatchMinAggregateInputType
    _max?: ConfirmedMatchMaxAggregateInputType
  }

  export type ConfirmedMatchGroupByOutputType = {
    id: string
    serviceListingId: string
    homeownerId: string
    confirmationDate: Date
    _count: ConfirmedMatchCountAggregateOutputType | null
    _min: ConfirmedMatchMinAggregateOutputType | null
    _max: ConfirmedMatchMaxAggregateOutputType | null
  }

  type GetConfirmedMatchGroupByPayload<T extends ConfirmedMatchGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConfirmedMatchGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConfirmedMatchGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConfirmedMatchGroupByOutputType[P]>
            : GetScalarType<T[P], ConfirmedMatchGroupByOutputType[P]>
        }
      >
    >


  export type ConfirmedMatchSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    serviceListingId?: boolean
    homeownerId?: boolean
    confirmationDate?: boolean
    serviceListing?: boolean | ServiceListingDefaultArgs<ExtArgs>
    homeowner?: boolean | UserAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["confirmedMatch"]>

  export type ConfirmedMatchSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    serviceListingId?: boolean
    homeownerId?: boolean
    confirmationDate?: boolean
    serviceListing?: boolean | ServiceListingDefaultArgs<ExtArgs>
    homeowner?: boolean | UserAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["confirmedMatch"]>

  export type ConfirmedMatchSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    serviceListingId?: boolean
    homeownerId?: boolean
    confirmationDate?: boolean
    serviceListing?: boolean | ServiceListingDefaultArgs<ExtArgs>
    homeowner?: boolean | UserAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["confirmedMatch"]>

  export type ConfirmedMatchSelectScalar = {
    id?: boolean
    serviceListingId?: boolean
    homeownerId?: boolean
    confirmationDate?: boolean
  }

  export type ConfirmedMatchOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "serviceListingId" | "homeownerId" | "confirmationDate", ExtArgs["result"]["confirmedMatch"]>
  export type ConfirmedMatchInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    serviceListing?: boolean | ServiceListingDefaultArgs<ExtArgs>
    homeowner?: boolean | UserAccountDefaultArgs<ExtArgs>
  }
  export type ConfirmedMatchIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    serviceListing?: boolean | ServiceListingDefaultArgs<ExtArgs>
    homeowner?: boolean | UserAccountDefaultArgs<ExtArgs>
  }
  export type ConfirmedMatchIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    serviceListing?: boolean | ServiceListingDefaultArgs<ExtArgs>
    homeowner?: boolean | UserAccountDefaultArgs<ExtArgs>
  }

  export type $ConfirmedMatchPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConfirmedMatch"
    objects: {
      serviceListing: Prisma.$ServiceListingPayload<ExtArgs>
      homeowner: Prisma.$UserAccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      serviceListingId: string
      homeownerId: string
      confirmationDate: Date
    }, ExtArgs["result"]["confirmedMatch"]>
    composites: {}
  }

  type ConfirmedMatchGetPayload<S extends boolean | null | undefined | ConfirmedMatchDefaultArgs> = $Result.GetResult<Prisma.$ConfirmedMatchPayload, S>

  type ConfirmedMatchCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConfirmedMatchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConfirmedMatchCountAggregateInputType | true
    }

  export interface ConfirmedMatchDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConfirmedMatch'], meta: { name: 'ConfirmedMatch' } }
    /**
     * Find zero or one ConfirmedMatch that matches the filter.
     * @param {ConfirmedMatchFindUniqueArgs} args - Arguments to find a ConfirmedMatch
     * @example
     * // Get one ConfirmedMatch
     * const confirmedMatch = await prisma.confirmedMatch.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConfirmedMatchFindUniqueArgs>(args: SelectSubset<T, ConfirmedMatchFindUniqueArgs<ExtArgs>>): Prisma__ConfirmedMatchClient<$Result.GetResult<Prisma.$ConfirmedMatchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ConfirmedMatch that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConfirmedMatchFindUniqueOrThrowArgs} args - Arguments to find a ConfirmedMatch
     * @example
     * // Get one ConfirmedMatch
     * const confirmedMatch = await prisma.confirmedMatch.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConfirmedMatchFindUniqueOrThrowArgs>(args: SelectSubset<T, ConfirmedMatchFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConfirmedMatchClient<$Result.GetResult<Prisma.$ConfirmedMatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConfirmedMatch that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfirmedMatchFindFirstArgs} args - Arguments to find a ConfirmedMatch
     * @example
     * // Get one ConfirmedMatch
     * const confirmedMatch = await prisma.confirmedMatch.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConfirmedMatchFindFirstArgs>(args?: SelectSubset<T, ConfirmedMatchFindFirstArgs<ExtArgs>>): Prisma__ConfirmedMatchClient<$Result.GetResult<Prisma.$ConfirmedMatchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConfirmedMatch that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfirmedMatchFindFirstOrThrowArgs} args - Arguments to find a ConfirmedMatch
     * @example
     * // Get one ConfirmedMatch
     * const confirmedMatch = await prisma.confirmedMatch.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConfirmedMatchFindFirstOrThrowArgs>(args?: SelectSubset<T, ConfirmedMatchFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConfirmedMatchClient<$Result.GetResult<Prisma.$ConfirmedMatchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ConfirmedMatches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfirmedMatchFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConfirmedMatches
     * const confirmedMatches = await prisma.confirmedMatch.findMany()
     * 
     * // Get first 10 ConfirmedMatches
     * const confirmedMatches = await prisma.confirmedMatch.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const confirmedMatchWithIdOnly = await prisma.confirmedMatch.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConfirmedMatchFindManyArgs>(args?: SelectSubset<T, ConfirmedMatchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfirmedMatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ConfirmedMatch.
     * @param {ConfirmedMatchCreateArgs} args - Arguments to create a ConfirmedMatch.
     * @example
     * // Create one ConfirmedMatch
     * const ConfirmedMatch = await prisma.confirmedMatch.create({
     *   data: {
     *     // ... data to create a ConfirmedMatch
     *   }
     * })
     * 
     */
    create<T extends ConfirmedMatchCreateArgs>(args: SelectSubset<T, ConfirmedMatchCreateArgs<ExtArgs>>): Prisma__ConfirmedMatchClient<$Result.GetResult<Prisma.$ConfirmedMatchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ConfirmedMatches.
     * @param {ConfirmedMatchCreateManyArgs} args - Arguments to create many ConfirmedMatches.
     * @example
     * // Create many ConfirmedMatches
     * const confirmedMatch = await prisma.confirmedMatch.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConfirmedMatchCreateManyArgs>(args?: SelectSubset<T, ConfirmedMatchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ConfirmedMatches and returns the data saved in the database.
     * @param {ConfirmedMatchCreateManyAndReturnArgs} args - Arguments to create many ConfirmedMatches.
     * @example
     * // Create many ConfirmedMatches
     * const confirmedMatch = await prisma.confirmedMatch.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ConfirmedMatches and only return the `id`
     * const confirmedMatchWithIdOnly = await prisma.confirmedMatch.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConfirmedMatchCreateManyAndReturnArgs>(args?: SelectSubset<T, ConfirmedMatchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfirmedMatchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ConfirmedMatch.
     * @param {ConfirmedMatchDeleteArgs} args - Arguments to delete one ConfirmedMatch.
     * @example
     * // Delete one ConfirmedMatch
     * const ConfirmedMatch = await prisma.confirmedMatch.delete({
     *   where: {
     *     // ... filter to delete one ConfirmedMatch
     *   }
     * })
     * 
     */
    delete<T extends ConfirmedMatchDeleteArgs>(args: SelectSubset<T, ConfirmedMatchDeleteArgs<ExtArgs>>): Prisma__ConfirmedMatchClient<$Result.GetResult<Prisma.$ConfirmedMatchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ConfirmedMatch.
     * @param {ConfirmedMatchUpdateArgs} args - Arguments to update one ConfirmedMatch.
     * @example
     * // Update one ConfirmedMatch
     * const confirmedMatch = await prisma.confirmedMatch.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConfirmedMatchUpdateArgs>(args: SelectSubset<T, ConfirmedMatchUpdateArgs<ExtArgs>>): Prisma__ConfirmedMatchClient<$Result.GetResult<Prisma.$ConfirmedMatchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ConfirmedMatches.
     * @param {ConfirmedMatchDeleteManyArgs} args - Arguments to filter ConfirmedMatches to delete.
     * @example
     * // Delete a few ConfirmedMatches
     * const { count } = await prisma.confirmedMatch.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConfirmedMatchDeleteManyArgs>(args?: SelectSubset<T, ConfirmedMatchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConfirmedMatches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfirmedMatchUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConfirmedMatches
     * const confirmedMatch = await prisma.confirmedMatch.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConfirmedMatchUpdateManyArgs>(args: SelectSubset<T, ConfirmedMatchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConfirmedMatches and returns the data updated in the database.
     * @param {ConfirmedMatchUpdateManyAndReturnArgs} args - Arguments to update many ConfirmedMatches.
     * @example
     * // Update many ConfirmedMatches
     * const confirmedMatch = await prisma.confirmedMatch.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ConfirmedMatches and only return the `id`
     * const confirmedMatchWithIdOnly = await prisma.confirmedMatch.updateManyAndReturn({
     *   select: { id: true },
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
    updateManyAndReturn<T extends ConfirmedMatchUpdateManyAndReturnArgs>(args: SelectSubset<T, ConfirmedMatchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfirmedMatchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ConfirmedMatch.
     * @param {ConfirmedMatchUpsertArgs} args - Arguments to update or create a ConfirmedMatch.
     * @example
     * // Update or create a ConfirmedMatch
     * const confirmedMatch = await prisma.confirmedMatch.upsert({
     *   create: {
     *     // ... data to create a ConfirmedMatch
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConfirmedMatch we want to update
     *   }
     * })
     */
    upsert<T extends ConfirmedMatchUpsertArgs>(args: SelectSubset<T, ConfirmedMatchUpsertArgs<ExtArgs>>): Prisma__ConfirmedMatchClient<$Result.GetResult<Prisma.$ConfirmedMatchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ConfirmedMatches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfirmedMatchCountArgs} args - Arguments to filter ConfirmedMatches to count.
     * @example
     * // Count the number of ConfirmedMatches
     * const count = await prisma.confirmedMatch.count({
     *   where: {
     *     // ... the filter for the ConfirmedMatches we want to count
     *   }
     * })
    **/
    count<T extends ConfirmedMatchCountArgs>(
      args?: Subset<T, ConfirmedMatchCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConfirmedMatchCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConfirmedMatch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfirmedMatchAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ConfirmedMatchAggregateArgs>(args: Subset<T, ConfirmedMatchAggregateArgs>): Prisma.PrismaPromise<GetConfirmedMatchAggregateType<T>>

    /**
     * Group by ConfirmedMatch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfirmedMatchGroupByArgs} args - Group by arguments.
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
      T extends ConfirmedMatchGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConfirmedMatchGroupByArgs['orderBy'] }
        : { orderBy?: ConfirmedMatchGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ConfirmedMatchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConfirmedMatchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConfirmedMatch model
   */
  readonly fields: ConfirmedMatchFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConfirmedMatch.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConfirmedMatchClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    serviceListing<T extends ServiceListingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ServiceListingDefaultArgs<ExtArgs>>): Prisma__ServiceListingClient<$Result.GetResult<Prisma.$ServiceListingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    homeowner<T extends UserAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserAccountDefaultArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ConfirmedMatch model
   */
  interface ConfirmedMatchFieldRefs {
    readonly id: FieldRef<"ConfirmedMatch", 'String'>
    readonly serviceListingId: FieldRef<"ConfirmedMatch", 'String'>
    readonly homeownerId: FieldRef<"ConfirmedMatch", 'String'>
    readonly confirmationDate: FieldRef<"ConfirmedMatch", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ConfirmedMatch findUnique
   */
  export type ConfirmedMatchFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfirmedMatch
     */
    select?: ConfirmedMatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfirmedMatch
     */
    omit?: ConfirmedMatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmedMatchInclude<ExtArgs> | null
    /**
     * Filter, which ConfirmedMatch to fetch.
     */
    where: ConfirmedMatchWhereUniqueInput
  }

  /**
   * ConfirmedMatch findUniqueOrThrow
   */
  export type ConfirmedMatchFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfirmedMatch
     */
    select?: ConfirmedMatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfirmedMatch
     */
    omit?: ConfirmedMatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmedMatchInclude<ExtArgs> | null
    /**
     * Filter, which ConfirmedMatch to fetch.
     */
    where: ConfirmedMatchWhereUniqueInput
  }

  /**
   * ConfirmedMatch findFirst
   */
  export type ConfirmedMatchFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfirmedMatch
     */
    select?: ConfirmedMatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfirmedMatch
     */
    omit?: ConfirmedMatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmedMatchInclude<ExtArgs> | null
    /**
     * Filter, which ConfirmedMatch to fetch.
     */
    where?: ConfirmedMatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfirmedMatches to fetch.
     */
    orderBy?: ConfirmedMatchOrderByWithRelationInput | ConfirmedMatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConfirmedMatches.
     */
    cursor?: ConfirmedMatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfirmedMatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfirmedMatches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConfirmedMatches.
     */
    distinct?: ConfirmedMatchScalarFieldEnum | ConfirmedMatchScalarFieldEnum[]
  }

  /**
   * ConfirmedMatch findFirstOrThrow
   */
  export type ConfirmedMatchFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfirmedMatch
     */
    select?: ConfirmedMatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfirmedMatch
     */
    omit?: ConfirmedMatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmedMatchInclude<ExtArgs> | null
    /**
     * Filter, which ConfirmedMatch to fetch.
     */
    where?: ConfirmedMatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfirmedMatches to fetch.
     */
    orderBy?: ConfirmedMatchOrderByWithRelationInput | ConfirmedMatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConfirmedMatches.
     */
    cursor?: ConfirmedMatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfirmedMatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfirmedMatches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConfirmedMatches.
     */
    distinct?: ConfirmedMatchScalarFieldEnum | ConfirmedMatchScalarFieldEnum[]
  }

  /**
   * ConfirmedMatch findMany
   */
  export type ConfirmedMatchFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfirmedMatch
     */
    select?: ConfirmedMatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfirmedMatch
     */
    omit?: ConfirmedMatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmedMatchInclude<ExtArgs> | null
    /**
     * Filter, which ConfirmedMatches to fetch.
     */
    where?: ConfirmedMatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfirmedMatches to fetch.
     */
    orderBy?: ConfirmedMatchOrderByWithRelationInput | ConfirmedMatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConfirmedMatches.
     */
    cursor?: ConfirmedMatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfirmedMatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfirmedMatches.
     */
    skip?: number
    distinct?: ConfirmedMatchScalarFieldEnum | ConfirmedMatchScalarFieldEnum[]
  }

  /**
   * ConfirmedMatch create
   */
  export type ConfirmedMatchCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfirmedMatch
     */
    select?: ConfirmedMatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfirmedMatch
     */
    omit?: ConfirmedMatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmedMatchInclude<ExtArgs> | null
    /**
     * The data needed to create a ConfirmedMatch.
     */
    data: XOR<ConfirmedMatchCreateInput, ConfirmedMatchUncheckedCreateInput>
  }

  /**
   * ConfirmedMatch createMany
   */
  export type ConfirmedMatchCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConfirmedMatches.
     */
    data: ConfirmedMatchCreateManyInput | ConfirmedMatchCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConfirmedMatch createManyAndReturn
   */
  export type ConfirmedMatchCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfirmedMatch
     */
    select?: ConfirmedMatchSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConfirmedMatch
     */
    omit?: ConfirmedMatchOmit<ExtArgs> | null
    /**
     * The data used to create many ConfirmedMatches.
     */
    data: ConfirmedMatchCreateManyInput | ConfirmedMatchCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmedMatchIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ConfirmedMatch update
   */
  export type ConfirmedMatchUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfirmedMatch
     */
    select?: ConfirmedMatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfirmedMatch
     */
    omit?: ConfirmedMatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmedMatchInclude<ExtArgs> | null
    /**
     * The data needed to update a ConfirmedMatch.
     */
    data: XOR<ConfirmedMatchUpdateInput, ConfirmedMatchUncheckedUpdateInput>
    /**
     * Choose, which ConfirmedMatch to update.
     */
    where: ConfirmedMatchWhereUniqueInput
  }

  /**
   * ConfirmedMatch updateMany
   */
  export type ConfirmedMatchUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConfirmedMatches.
     */
    data: XOR<ConfirmedMatchUpdateManyMutationInput, ConfirmedMatchUncheckedUpdateManyInput>
    /**
     * Filter which ConfirmedMatches to update
     */
    where?: ConfirmedMatchWhereInput
    /**
     * Limit how many ConfirmedMatches to update.
     */
    limit?: number
  }

  /**
   * ConfirmedMatch updateManyAndReturn
   */
  export type ConfirmedMatchUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfirmedMatch
     */
    select?: ConfirmedMatchSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConfirmedMatch
     */
    omit?: ConfirmedMatchOmit<ExtArgs> | null
    /**
     * The data used to update ConfirmedMatches.
     */
    data: XOR<ConfirmedMatchUpdateManyMutationInput, ConfirmedMatchUncheckedUpdateManyInput>
    /**
     * Filter which ConfirmedMatches to update
     */
    where?: ConfirmedMatchWhereInput
    /**
     * Limit how many ConfirmedMatches to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmedMatchIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ConfirmedMatch upsert
   */
  export type ConfirmedMatchUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfirmedMatch
     */
    select?: ConfirmedMatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfirmedMatch
     */
    omit?: ConfirmedMatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmedMatchInclude<ExtArgs> | null
    /**
     * The filter to search for the ConfirmedMatch to update in case it exists.
     */
    where: ConfirmedMatchWhereUniqueInput
    /**
     * In case the ConfirmedMatch found by the `where` argument doesn't exist, create a new ConfirmedMatch with this data.
     */
    create: XOR<ConfirmedMatchCreateInput, ConfirmedMatchUncheckedCreateInput>
    /**
     * In case the ConfirmedMatch was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConfirmedMatchUpdateInput, ConfirmedMatchUncheckedUpdateInput>
  }

  /**
   * ConfirmedMatch delete
   */
  export type ConfirmedMatchDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfirmedMatch
     */
    select?: ConfirmedMatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfirmedMatch
     */
    omit?: ConfirmedMatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmedMatchInclude<ExtArgs> | null
    /**
     * Filter which ConfirmedMatch to delete.
     */
    where: ConfirmedMatchWhereUniqueInput
  }

  /**
   * ConfirmedMatch deleteMany
   */
  export type ConfirmedMatchDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConfirmedMatches to delete
     */
    where?: ConfirmedMatchWhereInput
    /**
     * Limit how many ConfirmedMatches to delete.
     */
    limit?: number
  }

  /**
   * ConfirmedMatch without action
   */
  export type ConfirmedMatchDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfirmedMatch
     */
    select?: ConfirmedMatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfirmedMatch
     */
    omit?: ConfirmedMatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmedMatchInclude<ExtArgs> | null
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
    id: 'id',
    username: 'username',
    email: 'email',
    password: 'password',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userProfileId: 'userProfileId'
  };

  export type UserAccountScalarFieldEnum = (typeof UserAccountScalarFieldEnum)[keyof typeof UserAccountScalarFieldEnum]


  export const UserProfileScalarFieldEnum: {
    id: 'id',
    name: 'name',
    permissions: 'permissions',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    status: 'status'
  };

  export type UserProfileScalarFieldEnum = (typeof UserProfileScalarFieldEnum)[keyof typeof UserProfileScalarFieldEnum]


  export const ServiceListingScalarFieldEnum: {
    id: 'id',
    serviceType: 'serviceType',
    title: 'title',
    description: 'description',
    ratePerHr: 'ratePerHr',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    cleanerId: 'cleanerId',
    status: 'status'
  };

  export type ServiceListingScalarFieldEnum = (typeof ServiceListingScalarFieldEnum)[keyof typeof ServiceListingScalarFieldEnum]


  export const ProfileViewScalarFieldEnum: {
    id: 'id',
    viewedProfileId: 'viewedProfileId',
    viewerId: 'viewerId',
    viewedAt: 'viewedAt'
  };

  export type ProfileViewScalarFieldEnum = (typeof ProfileViewScalarFieldEnum)[keyof typeof ProfileViewScalarFieldEnum]


  export const ShortlistScalarFieldEnum: {
    id: 'id',
    homeownerId: 'homeownerId',
    cleanerId: 'cleanerId',
    createdAt: 'createdAt'
  };

  export type ShortlistScalarFieldEnum = (typeof ShortlistScalarFieldEnum)[keyof typeof ShortlistScalarFieldEnum]


  export const ConfirmedMatchScalarFieldEnum: {
    id: 'id',
    serviceListingId: 'serviceListingId',
    homeownerId: 'homeownerId',
    confirmationDate: 'confirmationDate'
  };

  export type ConfirmedMatchScalarFieldEnum = (typeof ConfirmedMatchScalarFieldEnum)[keyof typeof ConfirmedMatchScalarFieldEnum]


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


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


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
   * Reference to a field of type 'UserStatus'
   */
  export type EnumUserStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserStatus'>
    


  /**
   * Reference to a field of type 'UserStatus[]'
   */
  export type ListEnumUserStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Permission[]'
   */
  export type ListEnumPermissionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Permission[]'>
    


  /**
   * Reference to a field of type 'Permission'
   */
  export type EnumPermissionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Permission'>
    


  /**
   * Reference to a field of type 'UserProfileStatus'
   */
  export type EnumUserProfileStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserProfileStatus'>
    


  /**
   * Reference to a field of type 'UserProfileStatus[]'
   */
  export type ListEnumUserProfileStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserProfileStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'ServiceListingStatus'
   */
  export type EnumServiceListingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ServiceListingStatus'>
    


  /**
   * Reference to a field of type 'ServiceListingStatus[]'
   */
  export type ListEnumServiceListingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ServiceListingStatus[]'>
    


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
    id?: StringFilter<"UserAccount"> | string
    username?: StringFilter<"UserAccount"> | string
    email?: StringFilter<"UserAccount"> | string
    password?: StringFilter<"UserAccount"> | string
    status?: EnumUserStatusFilter<"UserAccount"> | $Enums.UserStatus
    createdAt?: DateTimeFilter<"UserAccount"> | Date | string
    updatedAt?: DateTimeFilter<"UserAccount"> | Date | string
    userProfileId?: StringNullableFilter<"UserAccount"> | string | null
    userProfile?: XOR<UserProfileNullableScalarRelationFilter, UserProfileWhereInput> | null
    serviceListings?: ServiceListingListRelationFilter
    profileViews?: ProfileViewListRelationFilter
    viewedOthers?: ProfileViewListRelationFilter
    createdShortlists?: ShortlistListRelationFilter
    shortlistedIn?: ShortlistListRelationFilter
    confirmedMatchesAsHomeowner?: ConfirmedMatchListRelationFilter
  }

  export type UserAccountOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userProfileId?: SortOrderInput | SortOrder
    userProfile?: UserProfileOrderByWithRelationInput
    serviceListings?: ServiceListingOrderByRelationAggregateInput
    profileViews?: ProfileViewOrderByRelationAggregateInput
    viewedOthers?: ProfileViewOrderByRelationAggregateInput
    createdShortlists?: ShortlistOrderByRelationAggregateInput
    shortlistedIn?: ShortlistOrderByRelationAggregateInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchOrderByRelationAggregateInput
  }

  export type UserAccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    email?: string
    AND?: UserAccountWhereInput | UserAccountWhereInput[]
    OR?: UserAccountWhereInput[]
    NOT?: UserAccountWhereInput | UserAccountWhereInput[]
    password?: StringFilter<"UserAccount"> | string
    status?: EnumUserStatusFilter<"UserAccount"> | $Enums.UserStatus
    createdAt?: DateTimeFilter<"UserAccount"> | Date | string
    updatedAt?: DateTimeFilter<"UserAccount"> | Date | string
    userProfileId?: StringNullableFilter<"UserAccount"> | string | null
    userProfile?: XOR<UserProfileNullableScalarRelationFilter, UserProfileWhereInput> | null
    serviceListings?: ServiceListingListRelationFilter
    profileViews?: ProfileViewListRelationFilter
    viewedOthers?: ProfileViewListRelationFilter
    createdShortlists?: ShortlistListRelationFilter
    shortlistedIn?: ShortlistListRelationFilter
    confirmedMatchesAsHomeowner?: ConfirmedMatchListRelationFilter
  }, "id" | "username" | "email">

  export type UserAccountOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userProfileId?: SortOrderInput | SortOrder
    _count?: UserAccountCountOrderByAggregateInput
    _max?: UserAccountMaxOrderByAggregateInput
    _min?: UserAccountMinOrderByAggregateInput
  }

  export type UserAccountScalarWhereWithAggregatesInput = {
    AND?: UserAccountScalarWhereWithAggregatesInput | UserAccountScalarWhereWithAggregatesInput[]
    OR?: UserAccountScalarWhereWithAggregatesInput[]
    NOT?: UserAccountScalarWhereWithAggregatesInput | UserAccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserAccount"> | string
    username?: StringWithAggregatesFilter<"UserAccount"> | string
    email?: StringWithAggregatesFilter<"UserAccount"> | string
    password?: StringWithAggregatesFilter<"UserAccount"> | string
    status?: EnumUserStatusWithAggregatesFilter<"UserAccount"> | $Enums.UserStatus
    createdAt?: DateTimeWithAggregatesFilter<"UserAccount"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserAccount"> | Date | string
    userProfileId?: StringNullableWithAggregatesFilter<"UserAccount"> | string | null
  }

  export type UserProfileWhereInput = {
    AND?: UserProfileWhereInput | UserProfileWhereInput[]
    OR?: UserProfileWhereInput[]
    NOT?: UserProfileWhereInput | UserProfileWhereInput[]
    id?: StringFilter<"UserProfile"> | string
    name?: StringFilter<"UserProfile"> | string
    permissions?: EnumPermissionNullableListFilter<"UserProfile">
    createdAt?: DateTimeFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeFilter<"UserProfile"> | Date | string
    status?: EnumUserProfileStatusFilter<"UserProfile"> | $Enums.UserProfileStatus
    userAccounts?: UserAccountListRelationFilter
  }

  export type UserProfileOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    permissions?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    status?: SortOrder
    userAccounts?: UserAccountOrderByRelationAggregateInput
  }

  export type UserProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: UserProfileWhereInput | UserProfileWhereInput[]
    OR?: UserProfileWhereInput[]
    NOT?: UserProfileWhereInput | UserProfileWhereInput[]
    permissions?: EnumPermissionNullableListFilter<"UserProfile">
    createdAt?: DateTimeFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeFilter<"UserProfile"> | Date | string
    status?: EnumUserProfileStatusFilter<"UserProfile"> | $Enums.UserProfileStatus
    userAccounts?: UserAccountListRelationFilter
  }, "id" | "name">

  export type UserProfileOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    permissions?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    status?: SortOrder
    _count?: UserProfileCountOrderByAggregateInput
    _max?: UserProfileMaxOrderByAggregateInput
    _min?: UserProfileMinOrderByAggregateInput
  }

  export type UserProfileScalarWhereWithAggregatesInput = {
    AND?: UserProfileScalarWhereWithAggregatesInput | UserProfileScalarWhereWithAggregatesInput[]
    OR?: UserProfileScalarWhereWithAggregatesInput[]
    NOT?: UserProfileScalarWhereWithAggregatesInput | UserProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserProfile"> | string
    name?: StringWithAggregatesFilter<"UserProfile"> | string
    permissions?: EnumPermissionNullableListFilter<"UserProfile">
    createdAt?: DateTimeWithAggregatesFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserProfile"> | Date | string
    status?: EnumUserProfileStatusWithAggregatesFilter<"UserProfile"> | $Enums.UserProfileStatus
  }

  export type ServiceListingWhereInput = {
    AND?: ServiceListingWhereInput | ServiceListingWhereInput[]
    OR?: ServiceListingWhereInput[]
    NOT?: ServiceListingWhereInput | ServiceListingWhereInput[]
    id?: StringFilter<"ServiceListing"> | string
    serviceType?: StringFilter<"ServiceListing"> | string
    title?: StringFilter<"ServiceListing"> | string
    description?: StringFilter<"ServiceListing"> | string
    ratePerHr?: FloatFilter<"ServiceListing"> | number
    createdAt?: DateTimeFilter<"ServiceListing"> | Date | string
    updatedAt?: DateTimeFilter<"ServiceListing"> | Date | string
    cleanerId?: StringFilter<"ServiceListing"> | string
    status?: EnumServiceListingStatusFilter<"ServiceListing"> | $Enums.ServiceListingStatus
    cleaner?: XOR<UserAccountScalarRelationFilter, UserAccountWhereInput>
    confirmedMatches?: ConfirmedMatchListRelationFilter
  }

  export type ServiceListingOrderByWithRelationInput = {
    id?: SortOrder
    serviceType?: SortOrder
    title?: SortOrder
    description?: SortOrder
    ratePerHr?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    cleanerId?: SortOrder
    status?: SortOrder
    cleaner?: UserAccountOrderByWithRelationInput
    confirmedMatches?: ConfirmedMatchOrderByRelationAggregateInput
  }

  export type ServiceListingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ServiceListingWhereInput | ServiceListingWhereInput[]
    OR?: ServiceListingWhereInput[]
    NOT?: ServiceListingWhereInput | ServiceListingWhereInput[]
    serviceType?: StringFilter<"ServiceListing"> | string
    title?: StringFilter<"ServiceListing"> | string
    description?: StringFilter<"ServiceListing"> | string
    ratePerHr?: FloatFilter<"ServiceListing"> | number
    createdAt?: DateTimeFilter<"ServiceListing"> | Date | string
    updatedAt?: DateTimeFilter<"ServiceListing"> | Date | string
    cleanerId?: StringFilter<"ServiceListing"> | string
    status?: EnumServiceListingStatusFilter<"ServiceListing"> | $Enums.ServiceListingStatus
    cleaner?: XOR<UserAccountScalarRelationFilter, UserAccountWhereInput>
    confirmedMatches?: ConfirmedMatchListRelationFilter
  }, "id">

  export type ServiceListingOrderByWithAggregationInput = {
    id?: SortOrder
    serviceType?: SortOrder
    title?: SortOrder
    description?: SortOrder
    ratePerHr?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    cleanerId?: SortOrder
    status?: SortOrder
    _count?: ServiceListingCountOrderByAggregateInput
    _avg?: ServiceListingAvgOrderByAggregateInput
    _max?: ServiceListingMaxOrderByAggregateInput
    _min?: ServiceListingMinOrderByAggregateInput
    _sum?: ServiceListingSumOrderByAggregateInput
  }

  export type ServiceListingScalarWhereWithAggregatesInput = {
    AND?: ServiceListingScalarWhereWithAggregatesInput | ServiceListingScalarWhereWithAggregatesInput[]
    OR?: ServiceListingScalarWhereWithAggregatesInput[]
    NOT?: ServiceListingScalarWhereWithAggregatesInput | ServiceListingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ServiceListing"> | string
    serviceType?: StringWithAggregatesFilter<"ServiceListing"> | string
    title?: StringWithAggregatesFilter<"ServiceListing"> | string
    description?: StringWithAggregatesFilter<"ServiceListing"> | string
    ratePerHr?: FloatWithAggregatesFilter<"ServiceListing"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ServiceListing"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ServiceListing"> | Date | string
    cleanerId?: StringWithAggregatesFilter<"ServiceListing"> | string
    status?: EnumServiceListingStatusWithAggregatesFilter<"ServiceListing"> | $Enums.ServiceListingStatus
  }

  export type ProfileViewWhereInput = {
    AND?: ProfileViewWhereInput | ProfileViewWhereInput[]
    OR?: ProfileViewWhereInput[]
    NOT?: ProfileViewWhereInput | ProfileViewWhereInput[]
    id?: StringFilter<"ProfileView"> | string
    viewedProfileId?: StringFilter<"ProfileView"> | string
    viewerId?: StringNullableFilter<"ProfileView"> | string | null
    viewedAt?: DateTimeFilter<"ProfileView"> | Date | string
    viewedProfile?: XOR<UserAccountScalarRelationFilter, UserAccountWhereInput>
    viewer?: XOR<UserAccountNullableScalarRelationFilter, UserAccountWhereInput> | null
  }

  export type ProfileViewOrderByWithRelationInput = {
    id?: SortOrder
    viewedProfileId?: SortOrder
    viewerId?: SortOrderInput | SortOrder
    viewedAt?: SortOrder
    viewedProfile?: UserAccountOrderByWithRelationInput
    viewer?: UserAccountOrderByWithRelationInput
  }

  export type ProfileViewWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProfileViewWhereInput | ProfileViewWhereInput[]
    OR?: ProfileViewWhereInput[]
    NOT?: ProfileViewWhereInput | ProfileViewWhereInput[]
    viewedProfileId?: StringFilter<"ProfileView"> | string
    viewerId?: StringNullableFilter<"ProfileView"> | string | null
    viewedAt?: DateTimeFilter<"ProfileView"> | Date | string
    viewedProfile?: XOR<UserAccountScalarRelationFilter, UserAccountWhereInput>
    viewer?: XOR<UserAccountNullableScalarRelationFilter, UserAccountWhereInput> | null
  }, "id">

  export type ProfileViewOrderByWithAggregationInput = {
    id?: SortOrder
    viewedProfileId?: SortOrder
    viewerId?: SortOrderInput | SortOrder
    viewedAt?: SortOrder
    _count?: ProfileViewCountOrderByAggregateInput
    _max?: ProfileViewMaxOrderByAggregateInput
    _min?: ProfileViewMinOrderByAggregateInput
  }

  export type ProfileViewScalarWhereWithAggregatesInput = {
    AND?: ProfileViewScalarWhereWithAggregatesInput | ProfileViewScalarWhereWithAggregatesInput[]
    OR?: ProfileViewScalarWhereWithAggregatesInput[]
    NOT?: ProfileViewScalarWhereWithAggregatesInput | ProfileViewScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProfileView"> | string
    viewedProfileId?: StringWithAggregatesFilter<"ProfileView"> | string
    viewerId?: StringNullableWithAggregatesFilter<"ProfileView"> | string | null
    viewedAt?: DateTimeWithAggregatesFilter<"ProfileView"> | Date | string
  }

  export type ShortlistWhereInput = {
    AND?: ShortlistWhereInput | ShortlistWhereInput[]
    OR?: ShortlistWhereInput[]
    NOT?: ShortlistWhereInput | ShortlistWhereInput[]
    id?: StringFilter<"Shortlist"> | string
    homeownerId?: StringFilter<"Shortlist"> | string
    cleanerId?: StringFilter<"Shortlist"> | string
    createdAt?: DateTimeFilter<"Shortlist"> | Date | string
    homeowner?: XOR<UserAccountScalarRelationFilter, UserAccountWhereInput>
    cleaner?: XOR<UserAccountScalarRelationFilter, UserAccountWhereInput>
  }

  export type ShortlistOrderByWithRelationInput = {
    id?: SortOrder
    homeownerId?: SortOrder
    cleanerId?: SortOrder
    createdAt?: SortOrder
    homeowner?: UserAccountOrderByWithRelationInput
    cleaner?: UserAccountOrderByWithRelationInput
  }

  export type ShortlistWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    homeownerId_cleanerId?: ShortlistHomeownerIdCleanerIdCompoundUniqueInput
    AND?: ShortlistWhereInput | ShortlistWhereInput[]
    OR?: ShortlistWhereInput[]
    NOT?: ShortlistWhereInput | ShortlistWhereInput[]
    homeownerId?: StringFilter<"Shortlist"> | string
    cleanerId?: StringFilter<"Shortlist"> | string
    createdAt?: DateTimeFilter<"Shortlist"> | Date | string
    homeowner?: XOR<UserAccountScalarRelationFilter, UserAccountWhereInput>
    cleaner?: XOR<UserAccountScalarRelationFilter, UserAccountWhereInput>
  }, "id" | "homeownerId_cleanerId">

  export type ShortlistOrderByWithAggregationInput = {
    id?: SortOrder
    homeownerId?: SortOrder
    cleanerId?: SortOrder
    createdAt?: SortOrder
    _count?: ShortlistCountOrderByAggregateInput
    _max?: ShortlistMaxOrderByAggregateInput
    _min?: ShortlistMinOrderByAggregateInput
  }

  export type ShortlistScalarWhereWithAggregatesInput = {
    AND?: ShortlistScalarWhereWithAggregatesInput | ShortlistScalarWhereWithAggregatesInput[]
    OR?: ShortlistScalarWhereWithAggregatesInput[]
    NOT?: ShortlistScalarWhereWithAggregatesInput | ShortlistScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Shortlist"> | string
    homeownerId?: StringWithAggregatesFilter<"Shortlist"> | string
    cleanerId?: StringWithAggregatesFilter<"Shortlist"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Shortlist"> | Date | string
  }

  export type ConfirmedMatchWhereInput = {
    AND?: ConfirmedMatchWhereInput | ConfirmedMatchWhereInput[]
    OR?: ConfirmedMatchWhereInput[]
    NOT?: ConfirmedMatchWhereInput | ConfirmedMatchWhereInput[]
    id?: StringFilter<"ConfirmedMatch"> | string
    serviceListingId?: StringFilter<"ConfirmedMatch"> | string
    homeownerId?: StringFilter<"ConfirmedMatch"> | string
    confirmationDate?: DateTimeFilter<"ConfirmedMatch"> | Date | string
    serviceListing?: XOR<ServiceListingScalarRelationFilter, ServiceListingWhereInput>
    homeowner?: XOR<UserAccountScalarRelationFilter, UserAccountWhereInput>
  }

  export type ConfirmedMatchOrderByWithRelationInput = {
    id?: SortOrder
    serviceListingId?: SortOrder
    homeownerId?: SortOrder
    confirmationDate?: SortOrder
    serviceListing?: ServiceListingOrderByWithRelationInput
    homeowner?: UserAccountOrderByWithRelationInput
  }

  export type ConfirmedMatchWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ConfirmedMatchWhereInput | ConfirmedMatchWhereInput[]
    OR?: ConfirmedMatchWhereInput[]
    NOT?: ConfirmedMatchWhereInput | ConfirmedMatchWhereInput[]
    serviceListingId?: StringFilter<"ConfirmedMatch"> | string
    homeownerId?: StringFilter<"ConfirmedMatch"> | string
    confirmationDate?: DateTimeFilter<"ConfirmedMatch"> | Date | string
    serviceListing?: XOR<ServiceListingScalarRelationFilter, ServiceListingWhereInput>
    homeowner?: XOR<UserAccountScalarRelationFilter, UserAccountWhereInput>
  }, "id">

  export type ConfirmedMatchOrderByWithAggregationInput = {
    id?: SortOrder
    serviceListingId?: SortOrder
    homeownerId?: SortOrder
    confirmationDate?: SortOrder
    _count?: ConfirmedMatchCountOrderByAggregateInput
    _max?: ConfirmedMatchMaxOrderByAggregateInput
    _min?: ConfirmedMatchMinOrderByAggregateInput
  }

  export type ConfirmedMatchScalarWhereWithAggregatesInput = {
    AND?: ConfirmedMatchScalarWhereWithAggregatesInput | ConfirmedMatchScalarWhereWithAggregatesInput[]
    OR?: ConfirmedMatchScalarWhereWithAggregatesInput[]
    NOT?: ConfirmedMatchScalarWhereWithAggregatesInput | ConfirmedMatchScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ConfirmedMatch"> | string
    serviceListingId?: StringWithAggregatesFilter<"ConfirmedMatch"> | string
    homeownerId?: StringWithAggregatesFilter<"ConfirmedMatch"> | string
    confirmationDate?: DateTimeWithAggregatesFilter<"ConfirmedMatch"> | Date | string
  }

  export type UserAccountCreateInput = {
    id?: string
    username: string
    email: string
    password: string
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userProfile?: UserProfileCreateNestedOneWithoutUserAccountsInput
    serviceListings?: ServiceListingCreateNestedManyWithoutCleanerInput
    profileViews?: ProfileViewCreateNestedManyWithoutViewedProfileInput
    viewedOthers?: ProfileViewCreateNestedManyWithoutViewerInput
    createdShortlists?: ShortlistCreateNestedManyWithoutHomeownerInput
    shortlistedIn?: ShortlistCreateNestedManyWithoutCleanerInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchCreateNestedManyWithoutHomeownerInput
  }

  export type UserAccountUncheckedCreateInput = {
    id?: string
    username: string
    email: string
    password: string
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userProfileId?: string | null
    serviceListings?: ServiceListingUncheckedCreateNestedManyWithoutCleanerInput
    profileViews?: ProfileViewUncheckedCreateNestedManyWithoutViewedProfileInput
    viewedOthers?: ProfileViewUncheckedCreateNestedManyWithoutViewerInput
    createdShortlists?: ShortlistUncheckedCreateNestedManyWithoutHomeownerInput
    shortlistedIn?: ShortlistUncheckedCreateNestedManyWithoutCleanerInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchUncheckedCreateNestedManyWithoutHomeownerInput
  }

  export type UserAccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userProfile?: UserProfileUpdateOneWithoutUserAccountsNestedInput
    serviceListings?: ServiceListingUpdateManyWithoutCleanerNestedInput
    profileViews?: ProfileViewUpdateManyWithoutViewedProfileNestedInput
    viewedOthers?: ProfileViewUpdateManyWithoutViewerNestedInput
    createdShortlists?: ShortlistUpdateManyWithoutHomeownerNestedInput
    shortlistedIn?: ShortlistUpdateManyWithoutCleanerNestedInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchUpdateManyWithoutHomeownerNestedInput
  }

  export type UserAccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userProfileId?: NullableStringFieldUpdateOperationsInput | string | null
    serviceListings?: ServiceListingUncheckedUpdateManyWithoutCleanerNestedInput
    profileViews?: ProfileViewUncheckedUpdateManyWithoutViewedProfileNestedInput
    viewedOthers?: ProfileViewUncheckedUpdateManyWithoutViewerNestedInput
    createdShortlists?: ShortlistUncheckedUpdateManyWithoutHomeownerNestedInput
    shortlistedIn?: ShortlistUncheckedUpdateManyWithoutCleanerNestedInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchUncheckedUpdateManyWithoutHomeownerNestedInput
  }

  export type UserAccountCreateManyInput = {
    id?: string
    username: string
    email: string
    password: string
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userProfileId?: string | null
  }

  export type UserAccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userProfileId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserProfileCreateInput = {
    id?: string
    name: string
    permissions?: UserProfileCreatepermissionsInput | $Enums.Permission[]
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.UserProfileStatus
    userAccounts?: UserAccountCreateNestedManyWithoutUserProfileInput
  }

  export type UserProfileUncheckedCreateInput = {
    id?: string
    name: string
    permissions?: UserProfileCreatepermissionsInput | $Enums.Permission[]
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.UserProfileStatus
    userAccounts?: UserAccountUncheckedCreateNestedManyWithoutUserProfileInput
  }

  export type UserProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    permissions?: UserProfileUpdatepermissionsInput | $Enums.Permission[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumUserProfileStatusFieldUpdateOperationsInput | $Enums.UserProfileStatus
    userAccounts?: UserAccountUpdateManyWithoutUserProfileNestedInput
  }

  export type UserProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    permissions?: UserProfileUpdatepermissionsInput | $Enums.Permission[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumUserProfileStatusFieldUpdateOperationsInput | $Enums.UserProfileStatus
    userAccounts?: UserAccountUncheckedUpdateManyWithoutUserProfileNestedInput
  }

  export type UserProfileCreateManyInput = {
    id?: string
    name: string
    permissions?: UserProfileCreatepermissionsInput | $Enums.Permission[]
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.UserProfileStatus
  }

  export type UserProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    permissions?: UserProfileUpdatepermissionsInput | $Enums.Permission[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumUserProfileStatusFieldUpdateOperationsInput | $Enums.UserProfileStatus
  }

  export type UserProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    permissions?: UserProfileUpdatepermissionsInput | $Enums.Permission[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumUserProfileStatusFieldUpdateOperationsInput | $Enums.UserProfileStatus
  }

  export type ServiceListingCreateInput = {
    id?: string
    serviceType: string
    title: string
    description: string
    ratePerHr: number
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.ServiceListingStatus
    cleaner: UserAccountCreateNestedOneWithoutServiceListingsInput
    confirmedMatches?: ConfirmedMatchCreateNestedManyWithoutServiceListingInput
  }

  export type ServiceListingUncheckedCreateInput = {
    id?: string
    serviceType: string
    title: string
    description: string
    ratePerHr: number
    createdAt?: Date | string
    updatedAt?: Date | string
    cleanerId: string
    status?: $Enums.ServiceListingStatus
    confirmedMatches?: ConfirmedMatchUncheckedCreateNestedManyWithoutServiceListingInput
  }

  export type ServiceListingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ratePerHr?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumServiceListingStatusFieldUpdateOperationsInput | $Enums.ServiceListingStatus
    cleaner?: UserAccountUpdateOneRequiredWithoutServiceListingsNestedInput
    confirmedMatches?: ConfirmedMatchUpdateManyWithoutServiceListingNestedInput
  }

  export type ServiceListingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ratePerHr?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cleanerId?: StringFieldUpdateOperationsInput | string
    status?: EnumServiceListingStatusFieldUpdateOperationsInput | $Enums.ServiceListingStatus
    confirmedMatches?: ConfirmedMatchUncheckedUpdateManyWithoutServiceListingNestedInput
  }

  export type ServiceListingCreateManyInput = {
    id?: string
    serviceType: string
    title: string
    description: string
    ratePerHr: number
    createdAt?: Date | string
    updatedAt?: Date | string
    cleanerId: string
    status?: $Enums.ServiceListingStatus
  }

  export type ServiceListingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ratePerHr?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumServiceListingStatusFieldUpdateOperationsInput | $Enums.ServiceListingStatus
  }

  export type ServiceListingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ratePerHr?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cleanerId?: StringFieldUpdateOperationsInput | string
    status?: EnumServiceListingStatusFieldUpdateOperationsInput | $Enums.ServiceListingStatus
  }

  export type ProfileViewCreateInput = {
    id?: string
    viewedAt?: Date | string
    viewedProfile: UserAccountCreateNestedOneWithoutProfileViewsInput
    viewer?: UserAccountCreateNestedOneWithoutViewedOthersInput
  }

  export type ProfileViewUncheckedCreateInput = {
    id?: string
    viewedProfileId: string
    viewerId?: string | null
    viewedAt?: Date | string
  }

  export type ProfileViewUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    viewedProfile?: UserAccountUpdateOneRequiredWithoutProfileViewsNestedInput
    viewer?: UserAccountUpdateOneWithoutViewedOthersNestedInput
  }

  export type ProfileViewUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    viewedProfileId?: StringFieldUpdateOperationsInput | string
    viewerId?: NullableStringFieldUpdateOperationsInput | string | null
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileViewCreateManyInput = {
    id?: string
    viewedProfileId: string
    viewerId?: string | null
    viewedAt?: Date | string
  }

  export type ProfileViewUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileViewUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    viewedProfileId?: StringFieldUpdateOperationsInput | string
    viewerId?: NullableStringFieldUpdateOperationsInput | string | null
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShortlistCreateInput = {
    id?: string
    createdAt?: Date | string
    homeowner: UserAccountCreateNestedOneWithoutCreatedShortlistsInput
    cleaner: UserAccountCreateNestedOneWithoutShortlistedInInput
  }

  export type ShortlistUncheckedCreateInput = {
    id?: string
    homeownerId: string
    cleanerId: string
    createdAt?: Date | string
  }

  export type ShortlistUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    homeowner?: UserAccountUpdateOneRequiredWithoutCreatedShortlistsNestedInput
    cleaner?: UserAccountUpdateOneRequiredWithoutShortlistedInNestedInput
  }

  export type ShortlistUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    homeownerId?: StringFieldUpdateOperationsInput | string
    cleanerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShortlistCreateManyInput = {
    id?: string
    homeownerId: string
    cleanerId: string
    createdAt?: Date | string
  }

  export type ShortlistUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShortlistUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    homeownerId?: StringFieldUpdateOperationsInput | string
    cleanerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfirmedMatchCreateInput = {
    id?: string
    confirmationDate?: Date | string
    serviceListing: ServiceListingCreateNestedOneWithoutConfirmedMatchesInput
    homeowner: UserAccountCreateNestedOneWithoutConfirmedMatchesAsHomeownerInput
  }

  export type ConfirmedMatchUncheckedCreateInput = {
    id?: string
    serviceListingId: string
    homeownerId: string
    confirmationDate?: Date | string
  }

  export type ConfirmedMatchUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    confirmationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceListing?: ServiceListingUpdateOneRequiredWithoutConfirmedMatchesNestedInput
    homeowner?: UserAccountUpdateOneRequiredWithoutConfirmedMatchesAsHomeownerNestedInput
  }

  export type ConfirmedMatchUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceListingId?: StringFieldUpdateOperationsInput | string
    homeownerId?: StringFieldUpdateOperationsInput | string
    confirmationDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfirmedMatchCreateManyInput = {
    id?: string
    serviceListingId: string
    homeownerId: string
    confirmationDate?: Date | string
  }

  export type ConfirmedMatchUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    confirmationDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfirmedMatchUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceListingId?: StringFieldUpdateOperationsInput | string
    homeownerId?: StringFieldUpdateOperationsInput | string
    confirmationDate?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type EnumUserStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusFilter<$PrismaModel> | $Enums.UserStatus
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type UserProfileNullableScalarRelationFilter = {
    is?: UserProfileWhereInput | null
    isNot?: UserProfileWhereInput | null
  }

  export type ServiceListingListRelationFilter = {
    every?: ServiceListingWhereInput
    some?: ServiceListingWhereInput
    none?: ServiceListingWhereInput
  }

  export type ProfileViewListRelationFilter = {
    every?: ProfileViewWhereInput
    some?: ProfileViewWhereInput
    none?: ProfileViewWhereInput
  }

  export type ShortlistListRelationFilter = {
    every?: ShortlistWhereInput
    some?: ShortlistWhereInput
    none?: ShortlistWhereInput
  }

  export type ConfirmedMatchListRelationFilter = {
    every?: ConfirmedMatchWhereInput
    some?: ConfirmedMatchWhereInput
    none?: ConfirmedMatchWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ServiceListingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProfileViewOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ShortlistOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ConfirmedMatchOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserAccountCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userProfileId?: SortOrder
  }

  export type UserAccountMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userProfileId?: SortOrder
  }

  export type UserAccountMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userProfileId?: SortOrder
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

  export type EnumUserStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserStatusFilter<$PrismaModel>
    _max?: NestedEnumUserStatusFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumPermissionNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.Permission[] | ListEnumPermissionFieldRefInput<$PrismaModel> | null
    has?: $Enums.Permission | EnumPermissionFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.Permission[] | ListEnumPermissionFieldRefInput<$PrismaModel>
    hasSome?: $Enums.Permission[] | ListEnumPermissionFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumUserProfileStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserProfileStatus | EnumUserProfileStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserProfileStatus[] | ListEnumUserProfileStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserProfileStatus[] | ListEnumUserProfileStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserProfileStatusFilter<$PrismaModel> | $Enums.UserProfileStatus
  }

  export type UserAccountListRelationFilter = {
    every?: UserAccountWhereInput
    some?: UserAccountWhereInput
    none?: UserAccountWhereInput
  }

  export type UserAccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserProfileCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    permissions?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    status?: SortOrder
  }

  export type UserProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    status?: SortOrder
  }

  export type UserProfileMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    status?: SortOrder
  }

  export type EnumUserProfileStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserProfileStatus | EnumUserProfileStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserProfileStatus[] | ListEnumUserProfileStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserProfileStatus[] | ListEnumUserProfileStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserProfileStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserProfileStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserProfileStatusFilter<$PrismaModel>
    _max?: NestedEnumUserProfileStatusFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type EnumServiceListingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ServiceListingStatus | EnumServiceListingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ServiceListingStatus[] | ListEnumServiceListingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ServiceListingStatus[] | ListEnumServiceListingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumServiceListingStatusFilter<$PrismaModel> | $Enums.ServiceListingStatus
  }

  export type UserAccountScalarRelationFilter = {
    is?: UserAccountWhereInput
    isNot?: UserAccountWhereInput
  }

  export type ServiceListingCountOrderByAggregateInput = {
    id?: SortOrder
    serviceType?: SortOrder
    title?: SortOrder
    description?: SortOrder
    ratePerHr?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    cleanerId?: SortOrder
    status?: SortOrder
  }

  export type ServiceListingAvgOrderByAggregateInput = {
    ratePerHr?: SortOrder
  }

  export type ServiceListingMaxOrderByAggregateInput = {
    id?: SortOrder
    serviceType?: SortOrder
    title?: SortOrder
    description?: SortOrder
    ratePerHr?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    cleanerId?: SortOrder
    status?: SortOrder
  }

  export type ServiceListingMinOrderByAggregateInput = {
    id?: SortOrder
    serviceType?: SortOrder
    title?: SortOrder
    description?: SortOrder
    ratePerHr?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    cleanerId?: SortOrder
    status?: SortOrder
  }

  export type ServiceListingSumOrderByAggregateInput = {
    ratePerHr?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type EnumServiceListingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ServiceListingStatus | EnumServiceListingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ServiceListingStatus[] | ListEnumServiceListingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ServiceListingStatus[] | ListEnumServiceListingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumServiceListingStatusWithAggregatesFilter<$PrismaModel> | $Enums.ServiceListingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumServiceListingStatusFilter<$PrismaModel>
    _max?: NestedEnumServiceListingStatusFilter<$PrismaModel>
  }

  export type UserAccountNullableScalarRelationFilter = {
    is?: UserAccountWhereInput | null
    isNot?: UserAccountWhereInput | null
  }

  export type ProfileViewCountOrderByAggregateInput = {
    id?: SortOrder
    viewedProfileId?: SortOrder
    viewerId?: SortOrder
    viewedAt?: SortOrder
  }

  export type ProfileViewMaxOrderByAggregateInput = {
    id?: SortOrder
    viewedProfileId?: SortOrder
    viewerId?: SortOrder
    viewedAt?: SortOrder
  }

  export type ProfileViewMinOrderByAggregateInput = {
    id?: SortOrder
    viewedProfileId?: SortOrder
    viewerId?: SortOrder
    viewedAt?: SortOrder
  }

  export type ShortlistHomeownerIdCleanerIdCompoundUniqueInput = {
    homeownerId: string
    cleanerId: string
  }

  export type ShortlistCountOrderByAggregateInput = {
    id?: SortOrder
    homeownerId?: SortOrder
    cleanerId?: SortOrder
    createdAt?: SortOrder
  }

  export type ShortlistMaxOrderByAggregateInput = {
    id?: SortOrder
    homeownerId?: SortOrder
    cleanerId?: SortOrder
    createdAt?: SortOrder
  }

  export type ShortlistMinOrderByAggregateInput = {
    id?: SortOrder
    homeownerId?: SortOrder
    cleanerId?: SortOrder
    createdAt?: SortOrder
  }

  export type ServiceListingScalarRelationFilter = {
    is?: ServiceListingWhereInput
    isNot?: ServiceListingWhereInput
  }

  export type ConfirmedMatchCountOrderByAggregateInput = {
    id?: SortOrder
    serviceListingId?: SortOrder
    homeownerId?: SortOrder
    confirmationDate?: SortOrder
  }

  export type ConfirmedMatchMaxOrderByAggregateInput = {
    id?: SortOrder
    serviceListingId?: SortOrder
    homeownerId?: SortOrder
    confirmationDate?: SortOrder
  }

  export type ConfirmedMatchMinOrderByAggregateInput = {
    id?: SortOrder
    serviceListingId?: SortOrder
    homeownerId?: SortOrder
    confirmationDate?: SortOrder
  }

  export type UserProfileCreateNestedOneWithoutUserAccountsInput = {
    create?: XOR<UserProfileCreateWithoutUserAccountsInput, UserProfileUncheckedCreateWithoutUserAccountsInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutUserAccountsInput
    connect?: UserProfileWhereUniqueInput
  }

  export type ServiceListingCreateNestedManyWithoutCleanerInput = {
    create?: XOR<ServiceListingCreateWithoutCleanerInput, ServiceListingUncheckedCreateWithoutCleanerInput> | ServiceListingCreateWithoutCleanerInput[] | ServiceListingUncheckedCreateWithoutCleanerInput[]
    connectOrCreate?: ServiceListingCreateOrConnectWithoutCleanerInput | ServiceListingCreateOrConnectWithoutCleanerInput[]
    createMany?: ServiceListingCreateManyCleanerInputEnvelope
    connect?: ServiceListingWhereUniqueInput | ServiceListingWhereUniqueInput[]
  }

  export type ProfileViewCreateNestedManyWithoutViewedProfileInput = {
    create?: XOR<ProfileViewCreateWithoutViewedProfileInput, ProfileViewUncheckedCreateWithoutViewedProfileInput> | ProfileViewCreateWithoutViewedProfileInput[] | ProfileViewUncheckedCreateWithoutViewedProfileInput[]
    connectOrCreate?: ProfileViewCreateOrConnectWithoutViewedProfileInput | ProfileViewCreateOrConnectWithoutViewedProfileInput[]
    createMany?: ProfileViewCreateManyViewedProfileInputEnvelope
    connect?: ProfileViewWhereUniqueInput | ProfileViewWhereUniqueInput[]
  }

  export type ProfileViewCreateNestedManyWithoutViewerInput = {
    create?: XOR<ProfileViewCreateWithoutViewerInput, ProfileViewUncheckedCreateWithoutViewerInput> | ProfileViewCreateWithoutViewerInput[] | ProfileViewUncheckedCreateWithoutViewerInput[]
    connectOrCreate?: ProfileViewCreateOrConnectWithoutViewerInput | ProfileViewCreateOrConnectWithoutViewerInput[]
    createMany?: ProfileViewCreateManyViewerInputEnvelope
    connect?: ProfileViewWhereUniqueInput | ProfileViewWhereUniqueInput[]
  }

  export type ShortlistCreateNestedManyWithoutHomeownerInput = {
    create?: XOR<ShortlistCreateWithoutHomeownerInput, ShortlistUncheckedCreateWithoutHomeownerInput> | ShortlistCreateWithoutHomeownerInput[] | ShortlistUncheckedCreateWithoutHomeownerInput[]
    connectOrCreate?: ShortlistCreateOrConnectWithoutHomeownerInput | ShortlistCreateOrConnectWithoutHomeownerInput[]
    createMany?: ShortlistCreateManyHomeownerInputEnvelope
    connect?: ShortlistWhereUniqueInput | ShortlistWhereUniqueInput[]
  }

  export type ShortlistCreateNestedManyWithoutCleanerInput = {
    create?: XOR<ShortlistCreateWithoutCleanerInput, ShortlistUncheckedCreateWithoutCleanerInput> | ShortlistCreateWithoutCleanerInput[] | ShortlistUncheckedCreateWithoutCleanerInput[]
    connectOrCreate?: ShortlistCreateOrConnectWithoutCleanerInput | ShortlistCreateOrConnectWithoutCleanerInput[]
    createMany?: ShortlistCreateManyCleanerInputEnvelope
    connect?: ShortlistWhereUniqueInput | ShortlistWhereUniqueInput[]
  }

  export type ConfirmedMatchCreateNestedManyWithoutHomeownerInput = {
    create?: XOR<ConfirmedMatchCreateWithoutHomeownerInput, ConfirmedMatchUncheckedCreateWithoutHomeownerInput> | ConfirmedMatchCreateWithoutHomeownerInput[] | ConfirmedMatchUncheckedCreateWithoutHomeownerInput[]
    connectOrCreate?: ConfirmedMatchCreateOrConnectWithoutHomeownerInput | ConfirmedMatchCreateOrConnectWithoutHomeownerInput[]
    createMany?: ConfirmedMatchCreateManyHomeownerInputEnvelope
    connect?: ConfirmedMatchWhereUniqueInput | ConfirmedMatchWhereUniqueInput[]
  }

  export type ServiceListingUncheckedCreateNestedManyWithoutCleanerInput = {
    create?: XOR<ServiceListingCreateWithoutCleanerInput, ServiceListingUncheckedCreateWithoutCleanerInput> | ServiceListingCreateWithoutCleanerInput[] | ServiceListingUncheckedCreateWithoutCleanerInput[]
    connectOrCreate?: ServiceListingCreateOrConnectWithoutCleanerInput | ServiceListingCreateOrConnectWithoutCleanerInput[]
    createMany?: ServiceListingCreateManyCleanerInputEnvelope
    connect?: ServiceListingWhereUniqueInput | ServiceListingWhereUniqueInput[]
  }

  export type ProfileViewUncheckedCreateNestedManyWithoutViewedProfileInput = {
    create?: XOR<ProfileViewCreateWithoutViewedProfileInput, ProfileViewUncheckedCreateWithoutViewedProfileInput> | ProfileViewCreateWithoutViewedProfileInput[] | ProfileViewUncheckedCreateWithoutViewedProfileInput[]
    connectOrCreate?: ProfileViewCreateOrConnectWithoutViewedProfileInput | ProfileViewCreateOrConnectWithoutViewedProfileInput[]
    createMany?: ProfileViewCreateManyViewedProfileInputEnvelope
    connect?: ProfileViewWhereUniqueInput | ProfileViewWhereUniqueInput[]
  }

  export type ProfileViewUncheckedCreateNestedManyWithoutViewerInput = {
    create?: XOR<ProfileViewCreateWithoutViewerInput, ProfileViewUncheckedCreateWithoutViewerInput> | ProfileViewCreateWithoutViewerInput[] | ProfileViewUncheckedCreateWithoutViewerInput[]
    connectOrCreate?: ProfileViewCreateOrConnectWithoutViewerInput | ProfileViewCreateOrConnectWithoutViewerInput[]
    createMany?: ProfileViewCreateManyViewerInputEnvelope
    connect?: ProfileViewWhereUniqueInput | ProfileViewWhereUniqueInput[]
  }

  export type ShortlistUncheckedCreateNestedManyWithoutHomeownerInput = {
    create?: XOR<ShortlistCreateWithoutHomeownerInput, ShortlistUncheckedCreateWithoutHomeownerInput> | ShortlistCreateWithoutHomeownerInput[] | ShortlistUncheckedCreateWithoutHomeownerInput[]
    connectOrCreate?: ShortlistCreateOrConnectWithoutHomeownerInput | ShortlistCreateOrConnectWithoutHomeownerInput[]
    createMany?: ShortlistCreateManyHomeownerInputEnvelope
    connect?: ShortlistWhereUniqueInput | ShortlistWhereUniqueInput[]
  }

  export type ShortlistUncheckedCreateNestedManyWithoutCleanerInput = {
    create?: XOR<ShortlistCreateWithoutCleanerInput, ShortlistUncheckedCreateWithoutCleanerInput> | ShortlistCreateWithoutCleanerInput[] | ShortlistUncheckedCreateWithoutCleanerInput[]
    connectOrCreate?: ShortlistCreateOrConnectWithoutCleanerInput | ShortlistCreateOrConnectWithoutCleanerInput[]
    createMany?: ShortlistCreateManyCleanerInputEnvelope
    connect?: ShortlistWhereUniqueInput | ShortlistWhereUniqueInput[]
  }

  export type ConfirmedMatchUncheckedCreateNestedManyWithoutHomeownerInput = {
    create?: XOR<ConfirmedMatchCreateWithoutHomeownerInput, ConfirmedMatchUncheckedCreateWithoutHomeownerInput> | ConfirmedMatchCreateWithoutHomeownerInput[] | ConfirmedMatchUncheckedCreateWithoutHomeownerInput[]
    connectOrCreate?: ConfirmedMatchCreateOrConnectWithoutHomeownerInput | ConfirmedMatchCreateOrConnectWithoutHomeownerInput[]
    createMany?: ConfirmedMatchCreateManyHomeownerInputEnvelope
    connect?: ConfirmedMatchWhereUniqueInput | ConfirmedMatchWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumUserStatusFieldUpdateOperationsInput = {
    set?: $Enums.UserStatus
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserProfileUpdateOneWithoutUserAccountsNestedInput = {
    create?: XOR<UserProfileCreateWithoutUserAccountsInput, UserProfileUncheckedCreateWithoutUserAccountsInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutUserAccountsInput
    upsert?: UserProfileUpsertWithoutUserAccountsInput
    disconnect?: UserProfileWhereInput | boolean
    delete?: UserProfileWhereInput | boolean
    connect?: UserProfileWhereUniqueInput
    update?: XOR<XOR<UserProfileUpdateToOneWithWhereWithoutUserAccountsInput, UserProfileUpdateWithoutUserAccountsInput>, UserProfileUncheckedUpdateWithoutUserAccountsInput>
  }

  export type ServiceListingUpdateManyWithoutCleanerNestedInput = {
    create?: XOR<ServiceListingCreateWithoutCleanerInput, ServiceListingUncheckedCreateWithoutCleanerInput> | ServiceListingCreateWithoutCleanerInput[] | ServiceListingUncheckedCreateWithoutCleanerInput[]
    connectOrCreate?: ServiceListingCreateOrConnectWithoutCleanerInput | ServiceListingCreateOrConnectWithoutCleanerInput[]
    upsert?: ServiceListingUpsertWithWhereUniqueWithoutCleanerInput | ServiceListingUpsertWithWhereUniqueWithoutCleanerInput[]
    createMany?: ServiceListingCreateManyCleanerInputEnvelope
    set?: ServiceListingWhereUniqueInput | ServiceListingWhereUniqueInput[]
    disconnect?: ServiceListingWhereUniqueInput | ServiceListingWhereUniqueInput[]
    delete?: ServiceListingWhereUniqueInput | ServiceListingWhereUniqueInput[]
    connect?: ServiceListingWhereUniqueInput | ServiceListingWhereUniqueInput[]
    update?: ServiceListingUpdateWithWhereUniqueWithoutCleanerInput | ServiceListingUpdateWithWhereUniqueWithoutCleanerInput[]
    updateMany?: ServiceListingUpdateManyWithWhereWithoutCleanerInput | ServiceListingUpdateManyWithWhereWithoutCleanerInput[]
    deleteMany?: ServiceListingScalarWhereInput | ServiceListingScalarWhereInput[]
  }

  export type ProfileViewUpdateManyWithoutViewedProfileNestedInput = {
    create?: XOR<ProfileViewCreateWithoutViewedProfileInput, ProfileViewUncheckedCreateWithoutViewedProfileInput> | ProfileViewCreateWithoutViewedProfileInput[] | ProfileViewUncheckedCreateWithoutViewedProfileInput[]
    connectOrCreate?: ProfileViewCreateOrConnectWithoutViewedProfileInput | ProfileViewCreateOrConnectWithoutViewedProfileInput[]
    upsert?: ProfileViewUpsertWithWhereUniqueWithoutViewedProfileInput | ProfileViewUpsertWithWhereUniqueWithoutViewedProfileInput[]
    createMany?: ProfileViewCreateManyViewedProfileInputEnvelope
    set?: ProfileViewWhereUniqueInput | ProfileViewWhereUniqueInput[]
    disconnect?: ProfileViewWhereUniqueInput | ProfileViewWhereUniqueInput[]
    delete?: ProfileViewWhereUniqueInput | ProfileViewWhereUniqueInput[]
    connect?: ProfileViewWhereUniqueInput | ProfileViewWhereUniqueInput[]
    update?: ProfileViewUpdateWithWhereUniqueWithoutViewedProfileInput | ProfileViewUpdateWithWhereUniqueWithoutViewedProfileInput[]
    updateMany?: ProfileViewUpdateManyWithWhereWithoutViewedProfileInput | ProfileViewUpdateManyWithWhereWithoutViewedProfileInput[]
    deleteMany?: ProfileViewScalarWhereInput | ProfileViewScalarWhereInput[]
  }

  export type ProfileViewUpdateManyWithoutViewerNestedInput = {
    create?: XOR<ProfileViewCreateWithoutViewerInput, ProfileViewUncheckedCreateWithoutViewerInput> | ProfileViewCreateWithoutViewerInput[] | ProfileViewUncheckedCreateWithoutViewerInput[]
    connectOrCreate?: ProfileViewCreateOrConnectWithoutViewerInput | ProfileViewCreateOrConnectWithoutViewerInput[]
    upsert?: ProfileViewUpsertWithWhereUniqueWithoutViewerInput | ProfileViewUpsertWithWhereUniqueWithoutViewerInput[]
    createMany?: ProfileViewCreateManyViewerInputEnvelope
    set?: ProfileViewWhereUniqueInput | ProfileViewWhereUniqueInput[]
    disconnect?: ProfileViewWhereUniqueInput | ProfileViewWhereUniqueInput[]
    delete?: ProfileViewWhereUniqueInput | ProfileViewWhereUniqueInput[]
    connect?: ProfileViewWhereUniqueInput | ProfileViewWhereUniqueInput[]
    update?: ProfileViewUpdateWithWhereUniqueWithoutViewerInput | ProfileViewUpdateWithWhereUniqueWithoutViewerInput[]
    updateMany?: ProfileViewUpdateManyWithWhereWithoutViewerInput | ProfileViewUpdateManyWithWhereWithoutViewerInput[]
    deleteMany?: ProfileViewScalarWhereInput | ProfileViewScalarWhereInput[]
  }

  export type ShortlistUpdateManyWithoutHomeownerNestedInput = {
    create?: XOR<ShortlistCreateWithoutHomeownerInput, ShortlistUncheckedCreateWithoutHomeownerInput> | ShortlistCreateWithoutHomeownerInput[] | ShortlistUncheckedCreateWithoutHomeownerInput[]
    connectOrCreate?: ShortlistCreateOrConnectWithoutHomeownerInput | ShortlistCreateOrConnectWithoutHomeownerInput[]
    upsert?: ShortlistUpsertWithWhereUniqueWithoutHomeownerInput | ShortlistUpsertWithWhereUniqueWithoutHomeownerInput[]
    createMany?: ShortlistCreateManyHomeownerInputEnvelope
    set?: ShortlistWhereUniqueInput | ShortlistWhereUniqueInput[]
    disconnect?: ShortlistWhereUniqueInput | ShortlistWhereUniqueInput[]
    delete?: ShortlistWhereUniqueInput | ShortlistWhereUniqueInput[]
    connect?: ShortlistWhereUniqueInput | ShortlistWhereUniqueInput[]
    update?: ShortlistUpdateWithWhereUniqueWithoutHomeownerInput | ShortlistUpdateWithWhereUniqueWithoutHomeownerInput[]
    updateMany?: ShortlistUpdateManyWithWhereWithoutHomeownerInput | ShortlistUpdateManyWithWhereWithoutHomeownerInput[]
    deleteMany?: ShortlistScalarWhereInput | ShortlistScalarWhereInput[]
  }

  export type ShortlistUpdateManyWithoutCleanerNestedInput = {
    create?: XOR<ShortlistCreateWithoutCleanerInput, ShortlistUncheckedCreateWithoutCleanerInput> | ShortlistCreateWithoutCleanerInput[] | ShortlistUncheckedCreateWithoutCleanerInput[]
    connectOrCreate?: ShortlistCreateOrConnectWithoutCleanerInput | ShortlistCreateOrConnectWithoutCleanerInput[]
    upsert?: ShortlistUpsertWithWhereUniqueWithoutCleanerInput | ShortlistUpsertWithWhereUniqueWithoutCleanerInput[]
    createMany?: ShortlistCreateManyCleanerInputEnvelope
    set?: ShortlistWhereUniqueInput | ShortlistWhereUniqueInput[]
    disconnect?: ShortlistWhereUniqueInput | ShortlistWhereUniqueInput[]
    delete?: ShortlistWhereUniqueInput | ShortlistWhereUniqueInput[]
    connect?: ShortlistWhereUniqueInput | ShortlistWhereUniqueInput[]
    update?: ShortlistUpdateWithWhereUniqueWithoutCleanerInput | ShortlistUpdateWithWhereUniqueWithoutCleanerInput[]
    updateMany?: ShortlistUpdateManyWithWhereWithoutCleanerInput | ShortlistUpdateManyWithWhereWithoutCleanerInput[]
    deleteMany?: ShortlistScalarWhereInput | ShortlistScalarWhereInput[]
  }

  export type ConfirmedMatchUpdateManyWithoutHomeownerNestedInput = {
    create?: XOR<ConfirmedMatchCreateWithoutHomeownerInput, ConfirmedMatchUncheckedCreateWithoutHomeownerInput> | ConfirmedMatchCreateWithoutHomeownerInput[] | ConfirmedMatchUncheckedCreateWithoutHomeownerInput[]
    connectOrCreate?: ConfirmedMatchCreateOrConnectWithoutHomeownerInput | ConfirmedMatchCreateOrConnectWithoutHomeownerInput[]
    upsert?: ConfirmedMatchUpsertWithWhereUniqueWithoutHomeownerInput | ConfirmedMatchUpsertWithWhereUniqueWithoutHomeownerInput[]
    createMany?: ConfirmedMatchCreateManyHomeownerInputEnvelope
    set?: ConfirmedMatchWhereUniqueInput | ConfirmedMatchWhereUniqueInput[]
    disconnect?: ConfirmedMatchWhereUniqueInput | ConfirmedMatchWhereUniqueInput[]
    delete?: ConfirmedMatchWhereUniqueInput | ConfirmedMatchWhereUniqueInput[]
    connect?: ConfirmedMatchWhereUniqueInput | ConfirmedMatchWhereUniqueInput[]
    update?: ConfirmedMatchUpdateWithWhereUniqueWithoutHomeownerInput | ConfirmedMatchUpdateWithWhereUniqueWithoutHomeownerInput[]
    updateMany?: ConfirmedMatchUpdateManyWithWhereWithoutHomeownerInput | ConfirmedMatchUpdateManyWithWhereWithoutHomeownerInput[]
    deleteMany?: ConfirmedMatchScalarWhereInput | ConfirmedMatchScalarWhereInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type ServiceListingUncheckedUpdateManyWithoutCleanerNestedInput = {
    create?: XOR<ServiceListingCreateWithoutCleanerInput, ServiceListingUncheckedCreateWithoutCleanerInput> | ServiceListingCreateWithoutCleanerInput[] | ServiceListingUncheckedCreateWithoutCleanerInput[]
    connectOrCreate?: ServiceListingCreateOrConnectWithoutCleanerInput | ServiceListingCreateOrConnectWithoutCleanerInput[]
    upsert?: ServiceListingUpsertWithWhereUniqueWithoutCleanerInput | ServiceListingUpsertWithWhereUniqueWithoutCleanerInput[]
    createMany?: ServiceListingCreateManyCleanerInputEnvelope
    set?: ServiceListingWhereUniqueInput | ServiceListingWhereUniqueInput[]
    disconnect?: ServiceListingWhereUniqueInput | ServiceListingWhereUniqueInput[]
    delete?: ServiceListingWhereUniqueInput | ServiceListingWhereUniqueInput[]
    connect?: ServiceListingWhereUniqueInput | ServiceListingWhereUniqueInput[]
    update?: ServiceListingUpdateWithWhereUniqueWithoutCleanerInput | ServiceListingUpdateWithWhereUniqueWithoutCleanerInput[]
    updateMany?: ServiceListingUpdateManyWithWhereWithoutCleanerInput | ServiceListingUpdateManyWithWhereWithoutCleanerInput[]
    deleteMany?: ServiceListingScalarWhereInput | ServiceListingScalarWhereInput[]
  }

  export type ProfileViewUncheckedUpdateManyWithoutViewedProfileNestedInput = {
    create?: XOR<ProfileViewCreateWithoutViewedProfileInput, ProfileViewUncheckedCreateWithoutViewedProfileInput> | ProfileViewCreateWithoutViewedProfileInput[] | ProfileViewUncheckedCreateWithoutViewedProfileInput[]
    connectOrCreate?: ProfileViewCreateOrConnectWithoutViewedProfileInput | ProfileViewCreateOrConnectWithoutViewedProfileInput[]
    upsert?: ProfileViewUpsertWithWhereUniqueWithoutViewedProfileInput | ProfileViewUpsertWithWhereUniqueWithoutViewedProfileInput[]
    createMany?: ProfileViewCreateManyViewedProfileInputEnvelope
    set?: ProfileViewWhereUniqueInput | ProfileViewWhereUniqueInput[]
    disconnect?: ProfileViewWhereUniqueInput | ProfileViewWhereUniqueInput[]
    delete?: ProfileViewWhereUniqueInput | ProfileViewWhereUniqueInput[]
    connect?: ProfileViewWhereUniqueInput | ProfileViewWhereUniqueInput[]
    update?: ProfileViewUpdateWithWhereUniqueWithoutViewedProfileInput | ProfileViewUpdateWithWhereUniqueWithoutViewedProfileInput[]
    updateMany?: ProfileViewUpdateManyWithWhereWithoutViewedProfileInput | ProfileViewUpdateManyWithWhereWithoutViewedProfileInput[]
    deleteMany?: ProfileViewScalarWhereInput | ProfileViewScalarWhereInput[]
  }

  export type ProfileViewUncheckedUpdateManyWithoutViewerNestedInput = {
    create?: XOR<ProfileViewCreateWithoutViewerInput, ProfileViewUncheckedCreateWithoutViewerInput> | ProfileViewCreateWithoutViewerInput[] | ProfileViewUncheckedCreateWithoutViewerInput[]
    connectOrCreate?: ProfileViewCreateOrConnectWithoutViewerInput | ProfileViewCreateOrConnectWithoutViewerInput[]
    upsert?: ProfileViewUpsertWithWhereUniqueWithoutViewerInput | ProfileViewUpsertWithWhereUniqueWithoutViewerInput[]
    createMany?: ProfileViewCreateManyViewerInputEnvelope
    set?: ProfileViewWhereUniqueInput | ProfileViewWhereUniqueInput[]
    disconnect?: ProfileViewWhereUniqueInput | ProfileViewWhereUniqueInput[]
    delete?: ProfileViewWhereUniqueInput | ProfileViewWhereUniqueInput[]
    connect?: ProfileViewWhereUniqueInput | ProfileViewWhereUniqueInput[]
    update?: ProfileViewUpdateWithWhereUniqueWithoutViewerInput | ProfileViewUpdateWithWhereUniqueWithoutViewerInput[]
    updateMany?: ProfileViewUpdateManyWithWhereWithoutViewerInput | ProfileViewUpdateManyWithWhereWithoutViewerInput[]
    deleteMany?: ProfileViewScalarWhereInput | ProfileViewScalarWhereInput[]
  }

  export type ShortlistUncheckedUpdateManyWithoutHomeownerNestedInput = {
    create?: XOR<ShortlistCreateWithoutHomeownerInput, ShortlistUncheckedCreateWithoutHomeownerInput> | ShortlistCreateWithoutHomeownerInput[] | ShortlistUncheckedCreateWithoutHomeownerInput[]
    connectOrCreate?: ShortlistCreateOrConnectWithoutHomeownerInput | ShortlistCreateOrConnectWithoutHomeownerInput[]
    upsert?: ShortlistUpsertWithWhereUniqueWithoutHomeownerInput | ShortlistUpsertWithWhereUniqueWithoutHomeownerInput[]
    createMany?: ShortlistCreateManyHomeownerInputEnvelope
    set?: ShortlistWhereUniqueInput | ShortlistWhereUniqueInput[]
    disconnect?: ShortlistWhereUniqueInput | ShortlistWhereUniqueInput[]
    delete?: ShortlistWhereUniqueInput | ShortlistWhereUniqueInput[]
    connect?: ShortlistWhereUniqueInput | ShortlistWhereUniqueInput[]
    update?: ShortlistUpdateWithWhereUniqueWithoutHomeownerInput | ShortlistUpdateWithWhereUniqueWithoutHomeownerInput[]
    updateMany?: ShortlistUpdateManyWithWhereWithoutHomeownerInput | ShortlistUpdateManyWithWhereWithoutHomeownerInput[]
    deleteMany?: ShortlistScalarWhereInput | ShortlistScalarWhereInput[]
  }

  export type ShortlistUncheckedUpdateManyWithoutCleanerNestedInput = {
    create?: XOR<ShortlistCreateWithoutCleanerInput, ShortlistUncheckedCreateWithoutCleanerInput> | ShortlistCreateWithoutCleanerInput[] | ShortlistUncheckedCreateWithoutCleanerInput[]
    connectOrCreate?: ShortlistCreateOrConnectWithoutCleanerInput | ShortlistCreateOrConnectWithoutCleanerInput[]
    upsert?: ShortlistUpsertWithWhereUniqueWithoutCleanerInput | ShortlistUpsertWithWhereUniqueWithoutCleanerInput[]
    createMany?: ShortlistCreateManyCleanerInputEnvelope
    set?: ShortlistWhereUniqueInput | ShortlistWhereUniqueInput[]
    disconnect?: ShortlistWhereUniqueInput | ShortlistWhereUniqueInput[]
    delete?: ShortlistWhereUniqueInput | ShortlistWhereUniqueInput[]
    connect?: ShortlistWhereUniqueInput | ShortlistWhereUniqueInput[]
    update?: ShortlistUpdateWithWhereUniqueWithoutCleanerInput | ShortlistUpdateWithWhereUniqueWithoutCleanerInput[]
    updateMany?: ShortlistUpdateManyWithWhereWithoutCleanerInput | ShortlistUpdateManyWithWhereWithoutCleanerInput[]
    deleteMany?: ShortlistScalarWhereInput | ShortlistScalarWhereInput[]
  }

  export type ConfirmedMatchUncheckedUpdateManyWithoutHomeownerNestedInput = {
    create?: XOR<ConfirmedMatchCreateWithoutHomeownerInput, ConfirmedMatchUncheckedCreateWithoutHomeownerInput> | ConfirmedMatchCreateWithoutHomeownerInput[] | ConfirmedMatchUncheckedCreateWithoutHomeownerInput[]
    connectOrCreate?: ConfirmedMatchCreateOrConnectWithoutHomeownerInput | ConfirmedMatchCreateOrConnectWithoutHomeownerInput[]
    upsert?: ConfirmedMatchUpsertWithWhereUniqueWithoutHomeownerInput | ConfirmedMatchUpsertWithWhereUniqueWithoutHomeownerInput[]
    createMany?: ConfirmedMatchCreateManyHomeownerInputEnvelope
    set?: ConfirmedMatchWhereUniqueInput | ConfirmedMatchWhereUniqueInput[]
    disconnect?: ConfirmedMatchWhereUniqueInput | ConfirmedMatchWhereUniqueInput[]
    delete?: ConfirmedMatchWhereUniqueInput | ConfirmedMatchWhereUniqueInput[]
    connect?: ConfirmedMatchWhereUniqueInput | ConfirmedMatchWhereUniqueInput[]
    update?: ConfirmedMatchUpdateWithWhereUniqueWithoutHomeownerInput | ConfirmedMatchUpdateWithWhereUniqueWithoutHomeownerInput[]
    updateMany?: ConfirmedMatchUpdateManyWithWhereWithoutHomeownerInput | ConfirmedMatchUpdateManyWithWhereWithoutHomeownerInput[]
    deleteMany?: ConfirmedMatchScalarWhereInput | ConfirmedMatchScalarWhereInput[]
  }

  export type UserProfileCreatepermissionsInput = {
    set: $Enums.Permission[]
  }

  export type UserAccountCreateNestedManyWithoutUserProfileInput = {
    create?: XOR<UserAccountCreateWithoutUserProfileInput, UserAccountUncheckedCreateWithoutUserProfileInput> | UserAccountCreateWithoutUserProfileInput[] | UserAccountUncheckedCreateWithoutUserProfileInput[]
    connectOrCreate?: UserAccountCreateOrConnectWithoutUserProfileInput | UserAccountCreateOrConnectWithoutUserProfileInput[]
    createMany?: UserAccountCreateManyUserProfileInputEnvelope
    connect?: UserAccountWhereUniqueInput | UserAccountWhereUniqueInput[]
  }

  export type UserAccountUncheckedCreateNestedManyWithoutUserProfileInput = {
    create?: XOR<UserAccountCreateWithoutUserProfileInput, UserAccountUncheckedCreateWithoutUserProfileInput> | UserAccountCreateWithoutUserProfileInput[] | UserAccountUncheckedCreateWithoutUserProfileInput[]
    connectOrCreate?: UserAccountCreateOrConnectWithoutUserProfileInput | UserAccountCreateOrConnectWithoutUserProfileInput[]
    createMany?: UserAccountCreateManyUserProfileInputEnvelope
    connect?: UserAccountWhereUniqueInput | UserAccountWhereUniqueInput[]
  }

  export type UserProfileUpdatepermissionsInput = {
    set?: $Enums.Permission[]
    push?: $Enums.Permission | $Enums.Permission[]
  }

  export type EnumUserProfileStatusFieldUpdateOperationsInput = {
    set?: $Enums.UserProfileStatus
  }

  export type UserAccountUpdateManyWithoutUserProfileNestedInput = {
    create?: XOR<UserAccountCreateWithoutUserProfileInput, UserAccountUncheckedCreateWithoutUserProfileInput> | UserAccountCreateWithoutUserProfileInput[] | UserAccountUncheckedCreateWithoutUserProfileInput[]
    connectOrCreate?: UserAccountCreateOrConnectWithoutUserProfileInput | UserAccountCreateOrConnectWithoutUserProfileInput[]
    upsert?: UserAccountUpsertWithWhereUniqueWithoutUserProfileInput | UserAccountUpsertWithWhereUniqueWithoutUserProfileInput[]
    createMany?: UserAccountCreateManyUserProfileInputEnvelope
    set?: UserAccountWhereUniqueInput | UserAccountWhereUniqueInput[]
    disconnect?: UserAccountWhereUniqueInput | UserAccountWhereUniqueInput[]
    delete?: UserAccountWhereUniqueInput | UserAccountWhereUniqueInput[]
    connect?: UserAccountWhereUniqueInput | UserAccountWhereUniqueInput[]
    update?: UserAccountUpdateWithWhereUniqueWithoutUserProfileInput | UserAccountUpdateWithWhereUniqueWithoutUserProfileInput[]
    updateMany?: UserAccountUpdateManyWithWhereWithoutUserProfileInput | UserAccountUpdateManyWithWhereWithoutUserProfileInput[]
    deleteMany?: UserAccountScalarWhereInput | UserAccountScalarWhereInput[]
  }

  export type UserAccountUncheckedUpdateManyWithoutUserProfileNestedInput = {
    create?: XOR<UserAccountCreateWithoutUserProfileInput, UserAccountUncheckedCreateWithoutUserProfileInput> | UserAccountCreateWithoutUserProfileInput[] | UserAccountUncheckedCreateWithoutUserProfileInput[]
    connectOrCreate?: UserAccountCreateOrConnectWithoutUserProfileInput | UserAccountCreateOrConnectWithoutUserProfileInput[]
    upsert?: UserAccountUpsertWithWhereUniqueWithoutUserProfileInput | UserAccountUpsertWithWhereUniqueWithoutUserProfileInput[]
    createMany?: UserAccountCreateManyUserProfileInputEnvelope
    set?: UserAccountWhereUniqueInput | UserAccountWhereUniqueInput[]
    disconnect?: UserAccountWhereUniqueInput | UserAccountWhereUniqueInput[]
    delete?: UserAccountWhereUniqueInput | UserAccountWhereUniqueInput[]
    connect?: UserAccountWhereUniqueInput | UserAccountWhereUniqueInput[]
    update?: UserAccountUpdateWithWhereUniqueWithoutUserProfileInput | UserAccountUpdateWithWhereUniqueWithoutUserProfileInput[]
    updateMany?: UserAccountUpdateManyWithWhereWithoutUserProfileInput | UserAccountUpdateManyWithWhereWithoutUserProfileInput[]
    deleteMany?: UserAccountScalarWhereInput | UserAccountScalarWhereInput[]
  }

  export type UserAccountCreateNestedOneWithoutServiceListingsInput = {
    create?: XOR<UserAccountCreateWithoutServiceListingsInput, UserAccountUncheckedCreateWithoutServiceListingsInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutServiceListingsInput
    connect?: UserAccountWhereUniqueInput
  }

  export type ConfirmedMatchCreateNestedManyWithoutServiceListingInput = {
    create?: XOR<ConfirmedMatchCreateWithoutServiceListingInput, ConfirmedMatchUncheckedCreateWithoutServiceListingInput> | ConfirmedMatchCreateWithoutServiceListingInput[] | ConfirmedMatchUncheckedCreateWithoutServiceListingInput[]
    connectOrCreate?: ConfirmedMatchCreateOrConnectWithoutServiceListingInput | ConfirmedMatchCreateOrConnectWithoutServiceListingInput[]
    createMany?: ConfirmedMatchCreateManyServiceListingInputEnvelope
    connect?: ConfirmedMatchWhereUniqueInput | ConfirmedMatchWhereUniqueInput[]
  }

  export type ConfirmedMatchUncheckedCreateNestedManyWithoutServiceListingInput = {
    create?: XOR<ConfirmedMatchCreateWithoutServiceListingInput, ConfirmedMatchUncheckedCreateWithoutServiceListingInput> | ConfirmedMatchCreateWithoutServiceListingInput[] | ConfirmedMatchUncheckedCreateWithoutServiceListingInput[]
    connectOrCreate?: ConfirmedMatchCreateOrConnectWithoutServiceListingInput | ConfirmedMatchCreateOrConnectWithoutServiceListingInput[]
    createMany?: ConfirmedMatchCreateManyServiceListingInputEnvelope
    connect?: ConfirmedMatchWhereUniqueInput | ConfirmedMatchWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumServiceListingStatusFieldUpdateOperationsInput = {
    set?: $Enums.ServiceListingStatus
  }

  export type UserAccountUpdateOneRequiredWithoutServiceListingsNestedInput = {
    create?: XOR<UserAccountCreateWithoutServiceListingsInput, UserAccountUncheckedCreateWithoutServiceListingsInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutServiceListingsInput
    upsert?: UserAccountUpsertWithoutServiceListingsInput
    connect?: UserAccountWhereUniqueInput
    update?: XOR<XOR<UserAccountUpdateToOneWithWhereWithoutServiceListingsInput, UserAccountUpdateWithoutServiceListingsInput>, UserAccountUncheckedUpdateWithoutServiceListingsInput>
  }

  export type ConfirmedMatchUpdateManyWithoutServiceListingNestedInput = {
    create?: XOR<ConfirmedMatchCreateWithoutServiceListingInput, ConfirmedMatchUncheckedCreateWithoutServiceListingInput> | ConfirmedMatchCreateWithoutServiceListingInput[] | ConfirmedMatchUncheckedCreateWithoutServiceListingInput[]
    connectOrCreate?: ConfirmedMatchCreateOrConnectWithoutServiceListingInput | ConfirmedMatchCreateOrConnectWithoutServiceListingInput[]
    upsert?: ConfirmedMatchUpsertWithWhereUniqueWithoutServiceListingInput | ConfirmedMatchUpsertWithWhereUniqueWithoutServiceListingInput[]
    createMany?: ConfirmedMatchCreateManyServiceListingInputEnvelope
    set?: ConfirmedMatchWhereUniqueInput | ConfirmedMatchWhereUniqueInput[]
    disconnect?: ConfirmedMatchWhereUniqueInput | ConfirmedMatchWhereUniqueInput[]
    delete?: ConfirmedMatchWhereUniqueInput | ConfirmedMatchWhereUniqueInput[]
    connect?: ConfirmedMatchWhereUniqueInput | ConfirmedMatchWhereUniqueInput[]
    update?: ConfirmedMatchUpdateWithWhereUniqueWithoutServiceListingInput | ConfirmedMatchUpdateWithWhereUniqueWithoutServiceListingInput[]
    updateMany?: ConfirmedMatchUpdateManyWithWhereWithoutServiceListingInput | ConfirmedMatchUpdateManyWithWhereWithoutServiceListingInput[]
    deleteMany?: ConfirmedMatchScalarWhereInput | ConfirmedMatchScalarWhereInput[]
  }

  export type ConfirmedMatchUncheckedUpdateManyWithoutServiceListingNestedInput = {
    create?: XOR<ConfirmedMatchCreateWithoutServiceListingInput, ConfirmedMatchUncheckedCreateWithoutServiceListingInput> | ConfirmedMatchCreateWithoutServiceListingInput[] | ConfirmedMatchUncheckedCreateWithoutServiceListingInput[]
    connectOrCreate?: ConfirmedMatchCreateOrConnectWithoutServiceListingInput | ConfirmedMatchCreateOrConnectWithoutServiceListingInput[]
    upsert?: ConfirmedMatchUpsertWithWhereUniqueWithoutServiceListingInput | ConfirmedMatchUpsertWithWhereUniqueWithoutServiceListingInput[]
    createMany?: ConfirmedMatchCreateManyServiceListingInputEnvelope
    set?: ConfirmedMatchWhereUniqueInput | ConfirmedMatchWhereUniqueInput[]
    disconnect?: ConfirmedMatchWhereUniqueInput | ConfirmedMatchWhereUniqueInput[]
    delete?: ConfirmedMatchWhereUniqueInput | ConfirmedMatchWhereUniqueInput[]
    connect?: ConfirmedMatchWhereUniqueInput | ConfirmedMatchWhereUniqueInput[]
    update?: ConfirmedMatchUpdateWithWhereUniqueWithoutServiceListingInput | ConfirmedMatchUpdateWithWhereUniqueWithoutServiceListingInput[]
    updateMany?: ConfirmedMatchUpdateManyWithWhereWithoutServiceListingInput | ConfirmedMatchUpdateManyWithWhereWithoutServiceListingInput[]
    deleteMany?: ConfirmedMatchScalarWhereInput | ConfirmedMatchScalarWhereInput[]
  }

  export type UserAccountCreateNestedOneWithoutProfileViewsInput = {
    create?: XOR<UserAccountCreateWithoutProfileViewsInput, UserAccountUncheckedCreateWithoutProfileViewsInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutProfileViewsInput
    connect?: UserAccountWhereUniqueInput
  }

  export type UserAccountCreateNestedOneWithoutViewedOthersInput = {
    create?: XOR<UserAccountCreateWithoutViewedOthersInput, UserAccountUncheckedCreateWithoutViewedOthersInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutViewedOthersInput
    connect?: UserAccountWhereUniqueInput
  }

  export type UserAccountUpdateOneRequiredWithoutProfileViewsNestedInput = {
    create?: XOR<UserAccountCreateWithoutProfileViewsInput, UserAccountUncheckedCreateWithoutProfileViewsInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutProfileViewsInput
    upsert?: UserAccountUpsertWithoutProfileViewsInput
    connect?: UserAccountWhereUniqueInput
    update?: XOR<XOR<UserAccountUpdateToOneWithWhereWithoutProfileViewsInput, UserAccountUpdateWithoutProfileViewsInput>, UserAccountUncheckedUpdateWithoutProfileViewsInput>
  }

  export type UserAccountUpdateOneWithoutViewedOthersNestedInput = {
    create?: XOR<UserAccountCreateWithoutViewedOthersInput, UserAccountUncheckedCreateWithoutViewedOthersInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutViewedOthersInput
    upsert?: UserAccountUpsertWithoutViewedOthersInput
    disconnect?: UserAccountWhereInput | boolean
    delete?: UserAccountWhereInput | boolean
    connect?: UserAccountWhereUniqueInput
    update?: XOR<XOR<UserAccountUpdateToOneWithWhereWithoutViewedOthersInput, UserAccountUpdateWithoutViewedOthersInput>, UserAccountUncheckedUpdateWithoutViewedOthersInput>
  }

  export type UserAccountCreateNestedOneWithoutCreatedShortlistsInput = {
    create?: XOR<UserAccountCreateWithoutCreatedShortlistsInput, UserAccountUncheckedCreateWithoutCreatedShortlistsInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutCreatedShortlistsInput
    connect?: UserAccountWhereUniqueInput
  }

  export type UserAccountCreateNestedOneWithoutShortlistedInInput = {
    create?: XOR<UserAccountCreateWithoutShortlistedInInput, UserAccountUncheckedCreateWithoutShortlistedInInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutShortlistedInInput
    connect?: UserAccountWhereUniqueInput
  }

  export type UserAccountUpdateOneRequiredWithoutCreatedShortlistsNestedInput = {
    create?: XOR<UserAccountCreateWithoutCreatedShortlistsInput, UserAccountUncheckedCreateWithoutCreatedShortlistsInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutCreatedShortlistsInput
    upsert?: UserAccountUpsertWithoutCreatedShortlistsInput
    connect?: UserAccountWhereUniqueInput
    update?: XOR<XOR<UserAccountUpdateToOneWithWhereWithoutCreatedShortlistsInput, UserAccountUpdateWithoutCreatedShortlistsInput>, UserAccountUncheckedUpdateWithoutCreatedShortlistsInput>
  }

  export type UserAccountUpdateOneRequiredWithoutShortlistedInNestedInput = {
    create?: XOR<UserAccountCreateWithoutShortlistedInInput, UserAccountUncheckedCreateWithoutShortlistedInInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutShortlistedInInput
    upsert?: UserAccountUpsertWithoutShortlistedInInput
    connect?: UserAccountWhereUniqueInput
    update?: XOR<XOR<UserAccountUpdateToOneWithWhereWithoutShortlistedInInput, UserAccountUpdateWithoutShortlistedInInput>, UserAccountUncheckedUpdateWithoutShortlistedInInput>
  }

  export type ServiceListingCreateNestedOneWithoutConfirmedMatchesInput = {
    create?: XOR<ServiceListingCreateWithoutConfirmedMatchesInput, ServiceListingUncheckedCreateWithoutConfirmedMatchesInput>
    connectOrCreate?: ServiceListingCreateOrConnectWithoutConfirmedMatchesInput
    connect?: ServiceListingWhereUniqueInput
  }

  export type UserAccountCreateNestedOneWithoutConfirmedMatchesAsHomeownerInput = {
    create?: XOR<UserAccountCreateWithoutConfirmedMatchesAsHomeownerInput, UserAccountUncheckedCreateWithoutConfirmedMatchesAsHomeownerInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutConfirmedMatchesAsHomeownerInput
    connect?: UserAccountWhereUniqueInput
  }

  export type ServiceListingUpdateOneRequiredWithoutConfirmedMatchesNestedInput = {
    create?: XOR<ServiceListingCreateWithoutConfirmedMatchesInput, ServiceListingUncheckedCreateWithoutConfirmedMatchesInput>
    connectOrCreate?: ServiceListingCreateOrConnectWithoutConfirmedMatchesInput
    upsert?: ServiceListingUpsertWithoutConfirmedMatchesInput
    connect?: ServiceListingWhereUniqueInput
    update?: XOR<XOR<ServiceListingUpdateToOneWithWhereWithoutConfirmedMatchesInput, ServiceListingUpdateWithoutConfirmedMatchesInput>, ServiceListingUncheckedUpdateWithoutConfirmedMatchesInput>
  }

  export type UserAccountUpdateOneRequiredWithoutConfirmedMatchesAsHomeownerNestedInput = {
    create?: XOR<UserAccountCreateWithoutConfirmedMatchesAsHomeownerInput, UserAccountUncheckedCreateWithoutConfirmedMatchesAsHomeownerInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutConfirmedMatchesAsHomeownerInput
    upsert?: UserAccountUpsertWithoutConfirmedMatchesAsHomeownerInput
    connect?: UserAccountWhereUniqueInput
    update?: XOR<XOR<UserAccountUpdateToOneWithWhereWithoutConfirmedMatchesAsHomeownerInput, UserAccountUpdateWithoutConfirmedMatchesAsHomeownerInput>, UserAccountUncheckedUpdateWithoutConfirmedMatchesAsHomeownerInput>
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

  export type NestedEnumUserStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusFilter<$PrismaModel> | $Enums.UserStatus
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
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

  export type NestedEnumUserStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserStatusFilter<$PrismaModel>
    _max?: NestedEnumUserStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumUserProfileStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserProfileStatus | EnumUserProfileStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserProfileStatus[] | ListEnumUserProfileStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserProfileStatus[] | ListEnumUserProfileStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserProfileStatusFilter<$PrismaModel> | $Enums.UserProfileStatus
  }

  export type NestedEnumUserProfileStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserProfileStatus | EnumUserProfileStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserProfileStatus[] | ListEnumUserProfileStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserProfileStatus[] | ListEnumUserProfileStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserProfileStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserProfileStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserProfileStatusFilter<$PrismaModel>
    _max?: NestedEnumUserProfileStatusFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumServiceListingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ServiceListingStatus | EnumServiceListingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ServiceListingStatus[] | ListEnumServiceListingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ServiceListingStatus[] | ListEnumServiceListingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumServiceListingStatusFilter<$PrismaModel> | $Enums.ServiceListingStatus
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumServiceListingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ServiceListingStatus | EnumServiceListingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ServiceListingStatus[] | ListEnumServiceListingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ServiceListingStatus[] | ListEnumServiceListingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumServiceListingStatusWithAggregatesFilter<$PrismaModel> | $Enums.ServiceListingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumServiceListingStatusFilter<$PrismaModel>
    _max?: NestedEnumServiceListingStatusFilter<$PrismaModel>
  }

  export type UserProfileCreateWithoutUserAccountsInput = {
    id?: string
    name: string
    permissions?: UserProfileCreatepermissionsInput | $Enums.Permission[]
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.UserProfileStatus
  }

  export type UserProfileUncheckedCreateWithoutUserAccountsInput = {
    id?: string
    name: string
    permissions?: UserProfileCreatepermissionsInput | $Enums.Permission[]
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.UserProfileStatus
  }

  export type UserProfileCreateOrConnectWithoutUserAccountsInput = {
    where: UserProfileWhereUniqueInput
    create: XOR<UserProfileCreateWithoutUserAccountsInput, UserProfileUncheckedCreateWithoutUserAccountsInput>
  }

  export type ServiceListingCreateWithoutCleanerInput = {
    id?: string
    serviceType: string
    title: string
    description: string
    ratePerHr: number
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.ServiceListingStatus
    confirmedMatches?: ConfirmedMatchCreateNestedManyWithoutServiceListingInput
  }

  export type ServiceListingUncheckedCreateWithoutCleanerInput = {
    id?: string
    serviceType: string
    title: string
    description: string
    ratePerHr: number
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.ServiceListingStatus
    confirmedMatches?: ConfirmedMatchUncheckedCreateNestedManyWithoutServiceListingInput
  }

  export type ServiceListingCreateOrConnectWithoutCleanerInput = {
    where: ServiceListingWhereUniqueInput
    create: XOR<ServiceListingCreateWithoutCleanerInput, ServiceListingUncheckedCreateWithoutCleanerInput>
  }

  export type ServiceListingCreateManyCleanerInputEnvelope = {
    data: ServiceListingCreateManyCleanerInput | ServiceListingCreateManyCleanerInput[]
    skipDuplicates?: boolean
  }

  export type ProfileViewCreateWithoutViewedProfileInput = {
    id?: string
    viewedAt?: Date | string
    viewer?: UserAccountCreateNestedOneWithoutViewedOthersInput
  }

  export type ProfileViewUncheckedCreateWithoutViewedProfileInput = {
    id?: string
    viewerId?: string | null
    viewedAt?: Date | string
  }

  export type ProfileViewCreateOrConnectWithoutViewedProfileInput = {
    where: ProfileViewWhereUniqueInput
    create: XOR<ProfileViewCreateWithoutViewedProfileInput, ProfileViewUncheckedCreateWithoutViewedProfileInput>
  }

  export type ProfileViewCreateManyViewedProfileInputEnvelope = {
    data: ProfileViewCreateManyViewedProfileInput | ProfileViewCreateManyViewedProfileInput[]
    skipDuplicates?: boolean
  }

  export type ProfileViewCreateWithoutViewerInput = {
    id?: string
    viewedAt?: Date | string
    viewedProfile: UserAccountCreateNestedOneWithoutProfileViewsInput
  }

  export type ProfileViewUncheckedCreateWithoutViewerInput = {
    id?: string
    viewedProfileId: string
    viewedAt?: Date | string
  }

  export type ProfileViewCreateOrConnectWithoutViewerInput = {
    where: ProfileViewWhereUniqueInput
    create: XOR<ProfileViewCreateWithoutViewerInput, ProfileViewUncheckedCreateWithoutViewerInput>
  }

  export type ProfileViewCreateManyViewerInputEnvelope = {
    data: ProfileViewCreateManyViewerInput | ProfileViewCreateManyViewerInput[]
    skipDuplicates?: boolean
  }

  export type ShortlistCreateWithoutHomeownerInput = {
    id?: string
    createdAt?: Date | string
    cleaner: UserAccountCreateNestedOneWithoutShortlistedInInput
  }

  export type ShortlistUncheckedCreateWithoutHomeownerInput = {
    id?: string
    cleanerId: string
    createdAt?: Date | string
  }

  export type ShortlistCreateOrConnectWithoutHomeownerInput = {
    where: ShortlistWhereUniqueInput
    create: XOR<ShortlistCreateWithoutHomeownerInput, ShortlistUncheckedCreateWithoutHomeownerInput>
  }

  export type ShortlistCreateManyHomeownerInputEnvelope = {
    data: ShortlistCreateManyHomeownerInput | ShortlistCreateManyHomeownerInput[]
    skipDuplicates?: boolean
  }

  export type ShortlistCreateWithoutCleanerInput = {
    id?: string
    createdAt?: Date | string
    homeowner: UserAccountCreateNestedOneWithoutCreatedShortlistsInput
  }

  export type ShortlistUncheckedCreateWithoutCleanerInput = {
    id?: string
    homeownerId: string
    createdAt?: Date | string
  }

  export type ShortlistCreateOrConnectWithoutCleanerInput = {
    where: ShortlistWhereUniqueInput
    create: XOR<ShortlistCreateWithoutCleanerInput, ShortlistUncheckedCreateWithoutCleanerInput>
  }

  export type ShortlistCreateManyCleanerInputEnvelope = {
    data: ShortlistCreateManyCleanerInput | ShortlistCreateManyCleanerInput[]
    skipDuplicates?: boolean
  }

  export type ConfirmedMatchCreateWithoutHomeownerInput = {
    id?: string
    confirmationDate?: Date | string
    serviceListing: ServiceListingCreateNestedOneWithoutConfirmedMatchesInput
  }

  export type ConfirmedMatchUncheckedCreateWithoutHomeownerInput = {
    id?: string
    serviceListingId: string
    confirmationDate?: Date | string
  }

  export type ConfirmedMatchCreateOrConnectWithoutHomeownerInput = {
    where: ConfirmedMatchWhereUniqueInput
    create: XOR<ConfirmedMatchCreateWithoutHomeownerInput, ConfirmedMatchUncheckedCreateWithoutHomeownerInput>
  }

  export type ConfirmedMatchCreateManyHomeownerInputEnvelope = {
    data: ConfirmedMatchCreateManyHomeownerInput | ConfirmedMatchCreateManyHomeownerInput[]
    skipDuplicates?: boolean
  }

  export type UserProfileUpsertWithoutUserAccountsInput = {
    update: XOR<UserProfileUpdateWithoutUserAccountsInput, UserProfileUncheckedUpdateWithoutUserAccountsInput>
    create: XOR<UserProfileCreateWithoutUserAccountsInput, UserProfileUncheckedCreateWithoutUserAccountsInput>
    where?: UserProfileWhereInput
  }

  export type UserProfileUpdateToOneWithWhereWithoutUserAccountsInput = {
    where?: UserProfileWhereInput
    data: XOR<UserProfileUpdateWithoutUserAccountsInput, UserProfileUncheckedUpdateWithoutUserAccountsInput>
  }

  export type UserProfileUpdateWithoutUserAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    permissions?: UserProfileUpdatepermissionsInput | $Enums.Permission[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumUserProfileStatusFieldUpdateOperationsInput | $Enums.UserProfileStatus
  }

  export type UserProfileUncheckedUpdateWithoutUserAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    permissions?: UserProfileUpdatepermissionsInput | $Enums.Permission[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumUserProfileStatusFieldUpdateOperationsInput | $Enums.UserProfileStatus
  }

  export type ServiceListingUpsertWithWhereUniqueWithoutCleanerInput = {
    where: ServiceListingWhereUniqueInput
    update: XOR<ServiceListingUpdateWithoutCleanerInput, ServiceListingUncheckedUpdateWithoutCleanerInput>
    create: XOR<ServiceListingCreateWithoutCleanerInput, ServiceListingUncheckedCreateWithoutCleanerInput>
  }

  export type ServiceListingUpdateWithWhereUniqueWithoutCleanerInput = {
    where: ServiceListingWhereUniqueInput
    data: XOR<ServiceListingUpdateWithoutCleanerInput, ServiceListingUncheckedUpdateWithoutCleanerInput>
  }

  export type ServiceListingUpdateManyWithWhereWithoutCleanerInput = {
    where: ServiceListingScalarWhereInput
    data: XOR<ServiceListingUpdateManyMutationInput, ServiceListingUncheckedUpdateManyWithoutCleanerInput>
  }

  export type ServiceListingScalarWhereInput = {
    AND?: ServiceListingScalarWhereInput | ServiceListingScalarWhereInput[]
    OR?: ServiceListingScalarWhereInput[]
    NOT?: ServiceListingScalarWhereInput | ServiceListingScalarWhereInput[]
    id?: StringFilter<"ServiceListing"> | string
    serviceType?: StringFilter<"ServiceListing"> | string
    title?: StringFilter<"ServiceListing"> | string
    description?: StringFilter<"ServiceListing"> | string
    ratePerHr?: FloatFilter<"ServiceListing"> | number
    createdAt?: DateTimeFilter<"ServiceListing"> | Date | string
    updatedAt?: DateTimeFilter<"ServiceListing"> | Date | string
    cleanerId?: StringFilter<"ServiceListing"> | string
    status?: EnumServiceListingStatusFilter<"ServiceListing"> | $Enums.ServiceListingStatus
  }

  export type ProfileViewUpsertWithWhereUniqueWithoutViewedProfileInput = {
    where: ProfileViewWhereUniqueInput
    update: XOR<ProfileViewUpdateWithoutViewedProfileInput, ProfileViewUncheckedUpdateWithoutViewedProfileInput>
    create: XOR<ProfileViewCreateWithoutViewedProfileInput, ProfileViewUncheckedCreateWithoutViewedProfileInput>
  }

  export type ProfileViewUpdateWithWhereUniqueWithoutViewedProfileInput = {
    where: ProfileViewWhereUniqueInput
    data: XOR<ProfileViewUpdateWithoutViewedProfileInput, ProfileViewUncheckedUpdateWithoutViewedProfileInput>
  }

  export type ProfileViewUpdateManyWithWhereWithoutViewedProfileInput = {
    where: ProfileViewScalarWhereInput
    data: XOR<ProfileViewUpdateManyMutationInput, ProfileViewUncheckedUpdateManyWithoutViewedProfileInput>
  }

  export type ProfileViewScalarWhereInput = {
    AND?: ProfileViewScalarWhereInput | ProfileViewScalarWhereInput[]
    OR?: ProfileViewScalarWhereInput[]
    NOT?: ProfileViewScalarWhereInput | ProfileViewScalarWhereInput[]
    id?: StringFilter<"ProfileView"> | string
    viewedProfileId?: StringFilter<"ProfileView"> | string
    viewerId?: StringNullableFilter<"ProfileView"> | string | null
    viewedAt?: DateTimeFilter<"ProfileView"> | Date | string
  }

  export type ProfileViewUpsertWithWhereUniqueWithoutViewerInput = {
    where: ProfileViewWhereUniqueInput
    update: XOR<ProfileViewUpdateWithoutViewerInput, ProfileViewUncheckedUpdateWithoutViewerInput>
    create: XOR<ProfileViewCreateWithoutViewerInput, ProfileViewUncheckedCreateWithoutViewerInput>
  }

  export type ProfileViewUpdateWithWhereUniqueWithoutViewerInput = {
    where: ProfileViewWhereUniqueInput
    data: XOR<ProfileViewUpdateWithoutViewerInput, ProfileViewUncheckedUpdateWithoutViewerInput>
  }

  export type ProfileViewUpdateManyWithWhereWithoutViewerInput = {
    where: ProfileViewScalarWhereInput
    data: XOR<ProfileViewUpdateManyMutationInput, ProfileViewUncheckedUpdateManyWithoutViewerInput>
  }

  export type ShortlistUpsertWithWhereUniqueWithoutHomeownerInput = {
    where: ShortlistWhereUniqueInput
    update: XOR<ShortlistUpdateWithoutHomeownerInput, ShortlistUncheckedUpdateWithoutHomeownerInput>
    create: XOR<ShortlistCreateWithoutHomeownerInput, ShortlistUncheckedCreateWithoutHomeownerInput>
  }

  export type ShortlistUpdateWithWhereUniqueWithoutHomeownerInput = {
    where: ShortlistWhereUniqueInput
    data: XOR<ShortlistUpdateWithoutHomeownerInput, ShortlistUncheckedUpdateWithoutHomeownerInput>
  }

  export type ShortlistUpdateManyWithWhereWithoutHomeownerInput = {
    where: ShortlistScalarWhereInput
    data: XOR<ShortlistUpdateManyMutationInput, ShortlistUncheckedUpdateManyWithoutHomeownerInput>
  }

  export type ShortlistScalarWhereInput = {
    AND?: ShortlistScalarWhereInput | ShortlistScalarWhereInput[]
    OR?: ShortlistScalarWhereInput[]
    NOT?: ShortlistScalarWhereInput | ShortlistScalarWhereInput[]
    id?: StringFilter<"Shortlist"> | string
    homeownerId?: StringFilter<"Shortlist"> | string
    cleanerId?: StringFilter<"Shortlist"> | string
    createdAt?: DateTimeFilter<"Shortlist"> | Date | string
  }

  export type ShortlistUpsertWithWhereUniqueWithoutCleanerInput = {
    where: ShortlistWhereUniqueInput
    update: XOR<ShortlistUpdateWithoutCleanerInput, ShortlistUncheckedUpdateWithoutCleanerInput>
    create: XOR<ShortlistCreateWithoutCleanerInput, ShortlistUncheckedCreateWithoutCleanerInput>
  }

  export type ShortlistUpdateWithWhereUniqueWithoutCleanerInput = {
    where: ShortlistWhereUniqueInput
    data: XOR<ShortlistUpdateWithoutCleanerInput, ShortlistUncheckedUpdateWithoutCleanerInput>
  }

  export type ShortlistUpdateManyWithWhereWithoutCleanerInput = {
    where: ShortlistScalarWhereInput
    data: XOR<ShortlistUpdateManyMutationInput, ShortlistUncheckedUpdateManyWithoutCleanerInput>
  }

  export type ConfirmedMatchUpsertWithWhereUniqueWithoutHomeownerInput = {
    where: ConfirmedMatchWhereUniqueInput
    update: XOR<ConfirmedMatchUpdateWithoutHomeownerInput, ConfirmedMatchUncheckedUpdateWithoutHomeownerInput>
    create: XOR<ConfirmedMatchCreateWithoutHomeownerInput, ConfirmedMatchUncheckedCreateWithoutHomeownerInput>
  }

  export type ConfirmedMatchUpdateWithWhereUniqueWithoutHomeownerInput = {
    where: ConfirmedMatchWhereUniqueInput
    data: XOR<ConfirmedMatchUpdateWithoutHomeownerInput, ConfirmedMatchUncheckedUpdateWithoutHomeownerInput>
  }

  export type ConfirmedMatchUpdateManyWithWhereWithoutHomeownerInput = {
    where: ConfirmedMatchScalarWhereInput
    data: XOR<ConfirmedMatchUpdateManyMutationInput, ConfirmedMatchUncheckedUpdateManyWithoutHomeownerInput>
  }

  export type ConfirmedMatchScalarWhereInput = {
    AND?: ConfirmedMatchScalarWhereInput | ConfirmedMatchScalarWhereInput[]
    OR?: ConfirmedMatchScalarWhereInput[]
    NOT?: ConfirmedMatchScalarWhereInput | ConfirmedMatchScalarWhereInput[]
    id?: StringFilter<"ConfirmedMatch"> | string
    serviceListingId?: StringFilter<"ConfirmedMatch"> | string
    homeownerId?: StringFilter<"ConfirmedMatch"> | string
    confirmationDate?: DateTimeFilter<"ConfirmedMatch"> | Date | string
  }

  export type UserAccountCreateWithoutUserProfileInput = {
    id?: string
    username: string
    email: string
    password: string
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    serviceListings?: ServiceListingCreateNestedManyWithoutCleanerInput
    profileViews?: ProfileViewCreateNestedManyWithoutViewedProfileInput
    viewedOthers?: ProfileViewCreateNestedManyWithoutViewerInput
    createdShortlists?: ShortlistCreateNestedManyWithoutHomeownerInput
    shortlistedIn?: ShortlistCreateNestedManyWithoutCleanerInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchCreateNestedManyWithoutHomeownerInput
  }

  export type UserAccountUncheckedCreateWithoutUserProfileInput = {
    id?: string
    username: string
    email: string
    password: string
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    serviceListings?: ServiceListingUncheckedCreateNestedManyWithoutCleanerInput
    profileViews?: ProfileViewUncheckedCreateNestedManyWithoutViewedProfileInput
    viewedOthers?: ProfileViewUncheckedCreateNestedManyWithoutViewerInput
    createdShortlists?: ShortlistUncheckedCreateNestedManyWithoutHomeownerInput
    shortlistedIn?: ShortlistUncheckedCreateNestedManyWithoutCleanerInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchUncheckedCreateNestedManyWithoutHomeownerInput
  }

  export type UserAccountCreateOrConnectWithoutUserProfileInput = {
    where: UserAccountWhereUniqueInput
    create: XOR<UserAccountCreateWithoutUserProfileInput, UserAccountUncheckedCreateWithoutUserProfileInput>
  }

  export type UserAccountCreateManyUserProfileInputEnvelope = {
    data: UserAccountCreateManyUserProfileInput | UserAccountCreateManyUserProfileInput[]
    skipDuplicates?: boolean
  }

  export type UserAccountUpsertWithWhereUniqueWithoutUserProfileInput = {
    where: UserAccountWhereUniqueInput
    update: XOR<UserAccountUpdateWithoutUserProfileInput, UserAccountUncheckedUpdateWithoutUserProfileInput>
    create: XOR<UserAccountCreateWithoutUserProfileInput, UserAccountUncheckedCreateWithoutUserProfileInput>
  }

  export type UserAccountUpdateWithWhereUniqueWithoutUserProfileInput = {
    where: UserAccountWhereUniqueInput
    data: XOR<UserAccountUpdateWithoutUserProfileInput, UserAccountUncheckedUpdateWithoutUserProfileInput>
  }

  export type UserAccountUpdateManyWithWhereWithoutUserProfileInput = {
    where: UserAccountScalarWhereInput
    data: XOR<UserAccountUpdateManyMutationInput, UserAccountUncheckedUpdateManyWithoutUserProfileInput>
  }

  export type UserAccountScalarWhereInput = {
    AND?: UserAccountScalarWhereInput | UserAccountScalarWhereInput[]
    OR?: UserAccountScalarWhereInput[]
    NOT?: UserAccountScalarWhereInput | UserAccountScalarWhereInput[]
    id?: StringFilter<"UserAccount"> | string
    username?: StringFilter<"UserAccount"> | string
    email?: StringFilter<"UserAccount"> | string
    password?: StringFilter<"UserAccount"> | string
    status?: EnumUserStatusFilter<"UserAccount"> | $Enums.UserStatus
    createdAt?: DateTimeFilter<"UserAccount"> | Date | string
    updatedAt?: DateTimeFilter<"UserAccount"> | Date | string
    userProfileId?: StringNullableFilter<"UserAccount"> | string | null
  }

  export type UserAccountCreateWithoutServiceListingsInput = {
    id?: string
    username: string
    email: string
    password: string
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userProfile?: UserProfileCreateNestedOneWithoutUserAccountsInput
    profileViews?: ProfileViewCreateNestedManyWithoutViewedProfileInput
    viewedOthers?: ProfileViewCreateNestedManyWithoutViewerInput
    createdShortlists?: ShortlistCreateNestedManyWithoutHomeownerInput
    shortlistedIn?: ShortlistCreateNestedManyWithoutCleanerInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchCreateNestedManyWithoutHomeownerInput
  }

  export type UserAccountUncheckedCreateWithoutServiceListingsInput = {
    id?: string
    username: string
    email: string
    password: string
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userProfileId?: string | null
    profileViews?: ProfileViewUncheckedCreateNestedManyWithoutViewedProfileInput
    viewedOthers?: ProfileViewUncheckedCreateNestedManyWithoutViewerInput
    createdShortlists?: ShortlistUncheckedCreateNestedManyWithoutHomeownerInput
    shortlistedIn?: ShortlistUncheckedCreateNestedManyWithoutCleanerInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchUncheckedCreateNestedManyWithoutHomeownerInput
  }

  export type UserAccountCreateOrConnectWithoutServiceListingsInput = {
    where: UserAccountWhereUniqueInput
    create: XOR<UserAccountCreateWithoutServiceListingsInput, UserAccountUncheckedCreateWithoutServiceListingsInput>
  }

  export type ConfirmedMatchCreateWithoutServiceListingInput = {
    id?: string
    confirmationDate?: Date | string
    homeowner: UserAccountCreateNestedOneWithoutConfirmedMatchesAsHomeownerInput
  }

  export type ConfirmedMatchUncheckedCreateWithoutServiceListingInput = {
    id?: string
    homeownerId: string
    confirmationDate?: Date | string
  }

  export type ConfirmedMatchCreateOrConnectWithoutServiceListingInput = {
    where: ConfirmedMatchWhereUniqueInput
    create: XOR<ConfirmedMatchCreateWithoutServiceListingInput, ConfirmedMatchUncheckedCreateWithoutServiceListingInput>
  }

  export type ConfirmedMatchCreateManyServiceListingInputEnvelope = {
    data: ConfirmedMatchCreateManyServiceListingInput | ConfirmedMatchCreateManyServiceListingInput[]
    skipDuplicates?: boolean
  }

  export type UserAccountUpsertWithoutServiceListingsInput = {
    update: XOR<UserAccountUpdateWithoutServiceListingsInput, UserAccountUncheckedUpdateWithoutServiceListingsInput>
    create: XOR<UserAccountCreateWithoutServiceListingsInput, UserAccountUncheckedCreateWithoutServiceListingsInput>
    where?: UserAccountWhereInput
  }

  export type UserAccountUpdateToOneWithWhereWithoutServiceListingsInput = {
    where?: UserAccountWhereInput
    data: XOR<UserAccountUpdateWithoutServiceListingsInput, UserAccountUncheckedUpdateWithoutServiceListingsInput>
  }

  export type UserAccountUpdateWithoutServiceListingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userProfile?: UserProfileUpdateOneWithoutUserAccountsNestedInput
    profileViews?: ProfileViewUpdateManyWithoutViewedProfileNestedInput
    viewedOthers?: ProfileViewUpdateManyWithoutViewerNestedInput
    createdShortlists?: ShortlistUpdateManyWithoutHomeownerNestedInput
    shortlistedIn?: ShortlistUpdateManyWithoutCleanerNestedInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchUpdateManyWithoutHomeownerNestedInput
  }

  export type UserAccountUncheckedUpdateWithoutServiceListingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userProfileId?: NullableStringFieldUpdateOperationsInput | string | null
    profileViews?: ProfileViewUncheckedUpdateManyWithoutViewedProfileNestedInput
    viewedOthers?: ProfileViewUncheckedUpdateManyWithoutViewerNestedInput
    createdShortlists?: ShortlistUncheckedUpdateManyWithoutHomeownerNestedInput
    shortlistedIn?: ShortlistUncheckedUpdateManyWithoutCleanerNestedInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchUncheckedUpdateManyWithoutHomeownerNestedInput
  }

  export type ConfirmedMatchUpsertWithWhereUniqueWithoutServiceListingInput = {
    where: ConfirmedMatchWhereUniqueInput
    update: XOR<ConfirmedMatchUpdateWithoutServiceListingInput, ConfirmedMatchUncheckedUpdateWithoutServiceListingInput>
    create: XOR<ConfirmedMatchCreateWithoutServiceListingInput, ConfirmedMatchUncheckedCreateWithoutServiceListingInput>
  }

  export type ConfirmedMatchUpdateWithWhereUniqueWithoutServiceListingInput = {
    where: ConfirmedMatchWhereUniqueInput
    data: XOR<ConfirmedMatchUpdateWithoutServiceListingInput, ConfirmedMatchUncheckedUpdateWithoutServiceListingInput>
  }

  export type ConfirmedMatchUpdateManyWithWhereWithoutServiceListingInput = {
    where: ConfirmedMatchScalarWhereInput
    data: XOR<ConfirmedMatchUpdateManyMutationInput, ConfirmedMatchUncheckedUpdateManyWithoutServiceListingInput>
  }

  export type UserAccountCreateWithoutProfileViewsInput = {
    id?: string
    username: string
    email: string
    password: string
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userProfile?: UserProfileCreateNestedOneWithoutUserAccountsInput
    serviceListings?: ServiceListingCreateNestedManyWithoutCleanerInput
    viewedOthers?: ProfileViewCreateNestedManyWithoutViewerInput
    createdShortlists?: ShortlistCreateNestedManyWithoutHomeownerInput
    shortlistedIn?: ShortlistCreateNestedManyWithoutCleanerInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchCreateNestedManyWithoutHomeownerInput
  }

  export type UserAccountUncheckedCreateWithoutProfileViewsInput = {
    id?: string
    username: string
    email: string
    password: string
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userProfileId?: string | null
    serviceListings?: ServiceListingUncheckedCreateNestedManyWithoutCleanerInput
    viewedOthers?: ProfileViewUncheckedCreateNestedManyWithoutViewerInput
    createdShortlists?: ShortlistUncheckedCreateNestedManyWithoutHomeownerInput
    shortlistedIn?: ShortlistUncheckedCreateNestedManyWithoutCleanerInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchUncheckedCreateNestedManyWithoutHomeownerInput
  }

  export type UserAccountCreateOrConnectWithoutProfileViewsInput = {
    where: UserAccountWhereUniqueInput
    create: XOR<UserAccountCreateWithoutProfileViewsInput, UserAccountUncheckedCreateWithoutProfileViewsInput>
  }

  export type UserAccountCreateWithoutViewedOthersInput = {
    id?: string
    username: string
    email: string
    password: string
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userProfile?: UserProfileCreateNestedOneWithoutUserAccountsInput
    serviceListings?: ServiceListingCreateNestedManyWithoutCleanerInput
    profileViews?: ProfileViewCreateNestedManyWithoutViewedProfileInput
    createdShortlists?: ShortlistCreateNestedManyWithoutHomeownerInput
    shortlistedIn?: ShortlistCreateNestedManyWithoutCleanerInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchCreateNestedManyWithoutHomeownerInput
  }

  export type UserAccountUncheckedCreateWithoutViewedOthersInput = {
    id?: string
    username: string
    email: string
    password: string
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userProfileId?: string | null
    serviceListings?: ServiceListingUncheckedCreateNestedManyWithoutCleanerInput
    profileViews?: ProfileViewUncheckedCreateNestedManyWithoutViewedProfileInput
    createdShortlists?: ShortlistUncheckedCreateNestedManyWithoutHomeownerInput
    shortlistedIn?: ShortlistUncheckedCreateNestedManyWithoutCleanerInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchUncheckedCreateNestedManyWithoutHomeownerInput
  }

  export type UserAccountCreateOrConnectWithoutViewedOthersInput = {
    where: UserAccountWhereUniqueInput
    create: XOR<UserAccountCreateWithoutViewedOthersInput, UserAccountUncheckedCreateWithoutViewedOthersInput>
  }

  export type UserAccountUpsertWithoutProfileViewsInput = {
    update: XOR<UserAccountUpdateWithoutProfileViewsInput, UserAccountUncheckedUpdateWithoutProfileViewsInput>
    create: XOR<UserAccountCreateWithoutProfileViewsInput, UserAccountUncheckedCreateWithoutProfileViewsInput>
    where?: UserAccountWhereInput
  }

  export type UserAccountUpdateToOneWithWhereWithoutProfileViewsInput = {
    where?: UserAccountWhereInput
    data: XOR<UserAccountUpdateWithoutProfileViewsInput, UserAccountUncheckedUpdateWithoutProfileViewsInput>
  }

  export type UserAccountUpdateWithoutProfileViewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userProfile?: UserProfileUpdateOneWithoutUserAccountsNestedInput
    serviceListings?: ServiceListingUpdateManyWithoutCleanerNestedInput
    viewedOthers?: ProfileViewUpdateManyWithoutViewerNestedInput
    createdShortlists?: ShortlistUpdateManyWithoutHomeownerNestedInput
    shortlistedIn?: ShortlistUpdateManyWithoutCleanerNestedInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchUpdateManyWithoutHomeownerNestedInput
  }

  export type UserAccountUncheckedUpdateWithoutProfileViewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userProfileId?: NullableStringFieldUpdateOperationsInput | string | null
    serviceListings?: ServiceListingUncheckedUpdateManyWithoutCleanerNestedInput
    viewedOthers?: ProfileViewUncheckedUpdateManyWithoutViewerNestedInput
    createdShortlists?: ShortlistUncheckedUpdateManyWithoutHomeownerNestedInput
    shortlistedIn?: ShortlistUncheckedUpdateManyWithoutCleanerNestedInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchUncheckedUpdateManyWithoutHomeownerNestedInput
  }

  export type UserAccountUpsertWithoutViewedOthersInput = {
    update: XOR<UserAccountUpdateWithoutViewedOthersInput, UserAccountUncheckedUpdateWithoutViewedOthersInput>
    create: XOR<UserAccountCreateWithoutViewedOthersInput, UserAccountUncheckedCreateWithoutViewedOthersInput>
    where?: UserAccountWhereInput
  }

  export type UserAccountUpdateToOneWithWhereWithoutViewedOthersInput = {
    where?: UserAccountWhereInput
    data: XOR<UserAccountUpdateWithoutViewedOthersInput, UserAccountUncheckedUpdateWithoutViewedOthersInput>
  }

  export type UserAccountUpdateWithoutViewedOthersInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userProfile?: UserProfileUpdateOneWithoutUserAccountsNestedInput
    serviceListings?: ServiceListingUpdateManyWithoutCleanerNestedInput
    profileViews?: ProfileViewUpdateManyWithoutViewedProfileNestedInput
    createdShortlists?: ShortlistUpdateManyWithoutHomeownerNestedInput
    shortlistedIn?: ShortlistUpdateManyWithoutCleanerNestedInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchUpdateManyWithoutHomeownerNestedInput
  }

  export type UserAccountUncheckedUpdateWithoutViewedOthersInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userProfileId?: NullableStringFieldUpdateOperationsInput | string | null
    serviceListings?: ServiceListingUncheckedUpdateManyWithoutCleanerNestedInput
    profileViews?: ProfileViewUncheckedUpdateManyWithoutViewedProfileNestedInput
    createdShortlists?: ShortlistUncheckedUpdateManyWithoutHomeownerNestedInput
    shortlistedIn?: ShortlistUncheckedUpdateManyWithoutCleanerNestedInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchUncheckedUpdateManyWithoutHomeownerNestedInput
  }

  export type UserAccountCreateWithoutCreatedShortlistsInput = {
    id?: string
    username: string
    email: string
    password: string
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userProfile?: UserProfileCreateNestedOneWithoutUserAccountsInput
    serviceListings?: ServiceListingCreateNestedManyWithoutCleanerInput
    profileViews?: ProfileViewCreateNestedManyWithoutViewedProfileInput
    viewedOthers?: ProfileViewCreateNestedManyWithoutViewerInput
    shortlistedIn?: ShortlistCreateNestedManyWithoutCleanerInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchCreateNestedManyWithoutHomeownerInput
  }

  export type UserAccountUncheckedCreateWithoutCreatedShortlistsInput = {
    id?: string
    username: string
    email: string
    password: string
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userProfileId?: string | null
    serviceListings?: ServiceListingUncheckedCreateNestedManyWithoutCleanerInput
    profileViews?: ProfileViewUncheckedCreateNestedManyWithoutViewedProfileInput
    viewedOthers?: ProfileViewUncheckedCreateNestedManyWithoutViewerInput
    shortlistedIn?: ShortlistUncheckedCreateNestedManyWithoutCleanerInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchUncheckedCreateNestedManyWithoutHomeownerInput
  }

  export type UserAccountCreateOrConnectWithoutCreatedShortlistsInput = {
    where: UserAccountWhereUniqueInput
    create: XOR<UserAccountCreateWithoutCreatedShortlistsInput, UserAccountUncheckedCreateWithoutCreatedShortlistsInput>
  }

  export type UserAccountCreateWithoutShortlistedInInput = {
    id?: string
    username: string
    email: string
    password: string
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userProfile?: UserProfileCreateNestedOneWithoutUserAccountsInput
    serviceListings?: ServiceListingCreateNestedManyWithoutCleanerInput
    profileViews?: ProfileViewCreateNestedManyWithoutViewedProfileInput
    viewedOthers?: ProfileViewCreateNestedManyWithoutViewerInput
    createdShortlists?: ShortlistCreateNestedManyWithoutHomeownerInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchCreateNestedManyWithoutHomeownerInput
  }

  export type UserAccountUncheckedCreateWithoutShortlistedInInput = {
    id?: string
    username: string
    email: string
    password: string
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userProfileId?: string | null
    serviceListings?: ServiceListingUncheckedCreateNestedManyWithoutCleanerInput
    profileViews?: ProfileViewUncheckedCreateNestedManyWithoutViewedProfileInput
    viewedOthers?: ProfileViewUncheckedCreateNestedManyWithoutViewerInput
    createdShortlists?: ShortlistUncheckedCreateNestedManyWithoutHomeownerInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchUncheckedCreateNestedManyWithoutHomeownerInput
  }

  export type UserAccountCreateOrConnectWithoutShortlistedInInput = {
    where: UserAccountWhereUniqueInput
    create: XOR<UserAccountCreateWithoutShortlistedInInput, UserAccountUncheckedCreateWithoutShortlistedInInput>
  }

  export type UserAccountUpsertWithoutCreatedShortlistsInput = {
    update: XOR<UserAccountUpdateWithoutCreatedShortlistsInput, UserAccountUncheckedUpdateWithoutCreatedShortlistsInput>
    create: XOR<UserAccountCreateWithoutCreatedShortlistsInput, UserAccountUncheckedCreateWithoutCreatedShortlistsInput>
    where?: UserAccountWhereInput
  }

  export type UserAccountUpdateToOneWithWhereWithoutCreatedShortlistsInput = {
    where?: UserAccountWhereInput
    data: XOR<UserAccountUpdateWithoutCreatedShortlistsInput, UserAccountUncheckedUpdateWithoutCreatedShortlistsInput>
  }

  export type UserAccountUpdateWithoutCreatedShortlistsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userProfile?: UserProfileUpdateOneWithoutUserAccountsNestedInput
    serviceListings?: ServiceListingUpdateManyWithoutCleanerNestedInput
    profileViews?: ProfileViewUpdateManyWithoutViewedProfileNestedInput
    viewedOthers?: ProfileViewUpdateManyWithoutViewerNestedInput
    shortlistedIn?: ShortlistUpdateManyWithoutCleanerNestedInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchUpdateManyWithoutHomeownerNestedInput
  }

  export type UserAccountUncheckedUpdateWithoutCreatedShortlistsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userProfileId?: NullableStringFieldUpdateOperationsInput | string | null
    serviceListings?: ServiceListingUncheckedUpdateManyWithoutCleanerNestedInput
    profileViews?: ProfileViewUncheckedUpdateManyWithoutViewedProfileNestedInput
    viewedOthers?: ProfileViewUncheckedUpdateManyWithoutViewerNestedInput
    shortlistedIn?: ShortlistUncheckedUpdateManyWithoutCleanerNestedInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchUncheckedUpdateManyWithoutHomeownerNestedInput
  }

  export type UserAccountUpsertWithoutShortlistedInInput = {
    update: XOR<UserAccountUpdateWithoutShortlistedInInput, UserAccountUncheckedUpdateWithoutShortlistedInInput>
    create: XOR<UserAccountCreateWithoutShortlistedInInput, UserAccountUncheckedCreateWithoutShortlistedInInput>
    where?: UserAccountWhereInput
  }

  export type UserAccountUpdateToOneWithWhereWithoutShortlistedInInput = {
    where?: UserAccountWhereInput
    data: XOR<UserAccountUpdateWithoutShortlistedInInput, UserAccountUncheckedUpdateWithoutShortlistedInInput>
  }

  export type UserAccountUpdateWithoutShortlistedInInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userProfile?: UserProfileUpdateOneWithoutUserAccountsNestedInput
    serviceListings?: ServiceListingUpdateManyWithoutCleanerNestedInput
    profileViews?: ProfileViewUpdateManyWithoutViewedProfileNestedInput
    viewedOthers?: ProfileViewUpdateManyWithoutViewerNestedInput
    createdShortlists?: ShortlistUpdateManyWithoutHomeownerNestedInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchUpdateManyWithoutHomeownerNestedInput
  }

  export type UserAccountUncheckedUpdateWithoutShortlistedInInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userProfileId?: NullableStringFieldUpdateOperationsInput | string | null
    serviceListings?: ServiceListingUncheckedUpdateManyWithoutCleanerNestedInput
    profileViews?: ProfileViewUncheckedUpdateManyWithoutViewedProfileNestedInput
    viewedOthers?: ProfileViewUncheckedUpdateManyWithoutViewerNestedInput
    createdShortlists?: ShortlistUncheckedUpdateManyWithoutHomeownerNestedInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchUncheckedUpdateManyWithoutHomeownerNestedInput
  }

  export type ServiceListingCreateWithoutConfirmedMatchesInput = {
    id?: string
    serviceType: string
    title: string
    description: string
    ratePerHr: number
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.ServiceListingStatus
    cleaner: UserAccountCreateNestedOneWithoutServiceListingsInput
  }

  export type ServiceListingUncheckedCreateWithoutConfirmedMatchesInput = {
    id?: string
    serviceType: string
    title: string
    description: string
    ratePerHr: number
    createdAt?: Date | string
    updatedAt?: Date | string
    cleanerId: string
    status?: $Enums.ServiceListingStatus
  }

  export type ServiceListingCreateOrConnectWithoutConfirmedMatchesInput = {
    where: ServiceListingWhereUniqueInput
    create: XOR<ServiceListingCreateWithoutConfirmedMatchesInput, ServiceListingUncheckedCreateWithoutConfirmedMatchesInput>
  }

  export type UserAccountCreateWithoutConfirmedMatchesAsHomeownerInput = {
    id?: string
    username: string
    email: string
    password: string
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userProfile?: UserProfileCreateNestedOneWithoutUserAccountsInput
    serviceListings?: ServiceListingCreateNestedManyWithoutCleanerInput
    profileViews?: ProfileViewCreateNestedManyWithoutViewedProfileInput
    viewedOthers?: ProfileViewCreateNestedManyWithoutViewerInput
    createdShortlists?: ShortlistCreateNestedManyWithoutHomeownerInput
    shortlistedIn?: ShortlistCreateNestedManyWithoutCleanerInput
  }

  export type UserAccountUncheckedCreateWithoutConfirmedMatchesAsHomeownerInput = {
    id?: string
    username: string
    email: string
    password: string
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userProfileId?: string | null
    serviceListings?: ServiceListingUncheckedCreateNestedManyWithoutCleanerInput
    profileViews?: ProfileViewUncheckedCreateNestedManyWithoutViewedProfileInput
    viewedOthers?: ProfileViewUncheckedCreateNestedManyWithoutViewerInput
    createdShortlists?: ShortlistUncheckedCreateNestedManyWithoutHomeownerInput
    shortlistedIn?: ShortlistUncheckedCreateNestedManyWithoutCleanerInput
  }

  export type UserAccountCreateOrConnectWithoutConfirmedMatchesAsHomeownerInput = {
    where: UserAccountWhereUniqueInput
    create: XOR<UserAccountCreateWithoutConfirmedMatchesAsHomeownerInput, UserAccountUncheckedCreateWithoutConfirmedMatchesAsHomeownerInput>
  }

  export type ServiceListingUpsertWithoutConfirmedMatchesInput = {
    update: XOR<ServiceListingUpdateWithoutConfirmedMatchesInput, ServiceListingUncheckedUpdateWithoutConfirmedMatchesInput>
    create: XOR<ServiceListingCreateWithoutConfirmedMatchesInput, ServiceListingUncheckedCreateWithoutConfirmedMatchesInput>
    where?: ServiceListingWhereInput
  }

  export type ServiceListingUpdateToOneWithWhereWithoutConfirmedMatchesInput = {
    where?: ServiceListingWhereInput
    data: XOR<ServiceListingUpdateWithoutConfirmedMatchesInput, ServiceListingUncheckedUpdateWithoutConfirmedMatchesInput>
  }

  export type ServiceListingUpdateWithoutConfirmedMatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ratePerHr?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumServiceListingStatusFieldUpdateOperationsInput | $Enums.ServiceListingStatus
    cleaner?: UserAccountUpdateOneRequiredWithoutServiceListingsNestedInput
  }

  export type ServiceListingUncheckedUpdateWithoutConfirmedMatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ratePerHr?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cleanerId?: StringFieldUpdateOperationsInput | string
    status?: EnumServiceListingStatusFieldUpdateOperationsInput | $Enums.ServiceListingStatus
  }

  export type UserAccountUpsertWithoutConfirmedMatchesAsHomeownerInput = {
    update: XOR<UserAccountUpdateWithoutConfirmedMatchesAsHomeownerInput, UserAccountUncheckedUpdateWithoutConfirmedMatchesAsHomeownerInput>
    create: XOR<UserAccountCreateWithoutConfirmedMatchesAsHomeownerInput, UserAccountUncheckedCreateWithoutConfirmedMatchesAsHomeownerInput>
    where?: UserAccountWhereInput
  }

  export type UserAccountUpdateToOneWithWhereWithoutConfirmedMatchesAsHomeownerInput = {
    where?: UserAccountWhereInput
    data: XOR<UserAccountUpdateWithoutConfirmedMatchesAsHomeownerInput, UserAccountUncheckedUpdateWithoutConfirmedMatchesAsHomeownerInput>
  }

  export type UserAccountUpdateWithoutConfirmedMatchesAsHomeownerInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userProfile?: UserProfileUpdateOneWithoutUserAccountsNestedInput
    serviceListings?: ServiceListingUpdateManyWithoutCleanerNestedInput
    profileViews?: ProfileViewUpdateManyWithoutViewedProfileNestedInput
    viewedOthers?: ProfileViewUpdateManyWithoutViewerNestedInput
    createdShortlists?: ShortlistUpdateManyWithoutHomeownerNestedInput
    shortlistedIn?: ShortlistUpdateManyWithoutCleanerNestedInput
  }

  export type UserAccountUncheckedUpdateWithoutConfirmedMatchesAsHomeownerInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userProfileId?: NullableStringFieldUpdateOperationsInput | string | null
    serviceListings?: ServiceListingUncheckedUpdateManyWithoutCleanerNestedInput
    profileViews?: ProfileViewUncheckedUpdateManyWithoutViewedProfileNestedInput
    viewedOthers?: ProfileViewUncheckedUpdateManyWithoutViewerNestedInput
    createdShortlists?: ShortlistUncheckedUpdateManyWithoutHomeownerNestedInput
    shortlistedIn?: ShortlistUncheckedUpdateManyWithoutCleanerNestedInput
  }

  export type ServiceListingCreateManyCleanerInput = {
    id?: string
    serviceType: string
    title: string
    description: string
    ratePerHr: number
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.ServiceListingStatus
  }

  export type ProfileViewCreateManyViewedProfileInput = {
    id?: string
    viewerId?: string | null
    viewedAt?: Date | string
  }

  export type ProfileViewCreateManyViewerInput = {
    id?: string
    viewedProfileId: string
    viewedAt?: Date | string
  }

  export type ShortlistCreateManyHomeownerInput = {
    id?: string
    cleanerId: string
    createdAt?: Date | string
  }

  export type ShortlistCreateManyCleanerInput = {
    id?: string
    homeownerId: string
    createdAt?: Date | string
  }

  export type ConfirmedMatchCreateManyHomeownerInput = {
    id?: string
    serviceListingId: string
    confirmationDate?: Date | string
  }

  export type ServiceListingUpdateWithoutCleanerInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ratePerHr?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumServiceListingStatusFieldUpdateOperationsInput | $Enums.ServiceListingStatus
    confirmedMatches?: ConfirmedMatchUpdateManyWithoutServiceListingNestedInput
  }

  export type ServiceListingUncheckedUpdateWithoutCleanerInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ratePerHr?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumServiceListingStatusFieldUpdateOperationsInput | $Enums.ServiceListingStatus
    confirmedMatches?: ConfirmedMatchUncheckedUpdateManyWithoutServiceListingNestedInput
  }

  export type ServiceListingUncheckedUpdateManyWithoutCleanerInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ratePerHr?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumServiceListingStatusFieldUpdateOperationsInput | $Enums.ServiceListingStatus
  }

  export type ProfileViewUpdateWithoutViewedProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    viewer?: UserAccountUpdateOneWithoutViewedOthersNestedInput
  }

  export type ProfileViewUncheckedUpdateWithoutViewedProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    viewerId?: NullableStringFieldUpdateOperationsInput | string | null
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileViewUncheckedUpdateManyWithoutViewedProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    viewerId?: NullableStringFieldUpdateOperationsInput | string | null
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileViewUpdateWithoutViewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    viewedProfile?: UserAccountUpdateOneRequiredWithoutProfileViewsNestedInput
  }

  export type ProfileViewUncheckedUpdateWithoutViewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    viewedProfileId?: StringFieldUpdateOperationsInput | string
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileViewUncheckedUpdateManyWithoutViewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    viewedProfileId?: StringFieldUpdateOperationsInput | string
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShortlistUpdateWithoutHomeownerInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cleaner?: UserAccountUpdateOneRequiredWithoutShortlistedInNestedInput
  }

  export type ShortlistUncheckedUpdateWithoutHomeownerInput = {
    id?: StringFieldUpdateOperationsInput | string
    cleanerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShortlistUncheckedUpdateManyWithoutHomeownerInput = {
    id?: StringFieldUpdateOperationsInput | string
    cleanerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShortlistUpdateWithoutCleanerInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    homeowner?: UserAccountUpdateOneRequiredWithoutCreatedShortlistsNestedInput
  }

  export type ShortlistUncheckedUpdateWithoutCleanerInput = {
    id?: StringFieldUpdateOperationsInput | string
    homeownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShortlistUncheckedUpdateManyWithoutCleanerInput = {
    id?: StringFieldUpdateOperationsInput | string
    homeownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfirmedMatchUpdateWithoutHomeownerInput = {
    id?: StringFieldUpdateOperationsInput | string
    confirmationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceListing?: ServiceListingUpdateOneRequiredWithoutConfirmedMatchesNestedInput
  }

  export type ConfirmedMatchUncheckedUpdateWithoutHomeownerInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceListingId?: StringFieldUpdateOperationsInput | string
    confirmationDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfirmedMatchUncheckedUpdateManyWithoutHomeownerInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceListingId?: StringFieldUpdateOperationsInput | string
    confirmationDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAccountCreateManyUserProfileInput = {
    id?: string
    username: string
    email: string
    password: string
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserAccountUpdateWithoutUserProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceListings?: ServiceListingUpdateManyWithoutCleanerNestedInput
    profileViews?: ProfileViewUpdateManyWithoutViewedProfileNestedInput
    viewedOthers?: ProfileViewUpdateManyWithoutViewerNestedInput
    createdShortlists?: ShortlistUpdateManyWithoutHomeownerNestedInput
    shortlistedIn?: ShortlistUpdateManyWithoutCleanerNestedInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchUpdateManyWithoutHomeownerNestedInput
  }

  export type UserAccountUncheckedUpdateWithoutUserProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceListings?: ServiceListingUncheckedUpdateManyWithoutCleanerNestedInput
    profileViews?: ProfileViewUncheckedUpdateManyWithoutViewedProfileNestedInput
    viewedOthers?: ProfileViewUncheckedUpdateManyWithoutViewerNestedInput
    createdShortlists?: ShortlistUncheckedUpdateManyWithoutHomeownerNestedInput
    shortlistedIn?: ShortlistUncheckedUpdateManyWithoutCleanerNestedInput
    confirmedMatchesAsHomeowner?: ConfirmedMatchUncheckedUpdateManyWithoutHomeownerNestedInput
  }

  export type UserAccountUncheckedUpdateManyWithoutUserProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfirmedMatchCreateManyServiceListingInput = {
    id?: string
    homeownerId: string
    confirmationDate?: Date | string
  }

  export type ConfirmedMatchUpdateWithoutServiceListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    confirmationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    homeowner?: UserAccountUpdateOneRequiredWithoutConfirmedMatchesAsHomeownerNestedInput
  }

  export type ConfirmedMatchUncheckedUpdateWithoutServiceListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    homeownerId?: StringFieldUpdateOperationsInput | string
    confirmationDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfirmedMatchUncheckedUpdateManyWithoutServiceListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    homeownerId?: StringFieldUpdateOperationsInput | string
    confirmationDate?: DateTimeFieldUpdateOperationsInput | Date | string
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