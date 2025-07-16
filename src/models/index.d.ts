import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncItem, AsyncCollection } from "@aws-amplify/datastore";

export enum PropertyStatusType {
  PENDING = "PENDING",
  DOC_UPLOADED = "DOC_UPLOADED",
  SELECTABLE = "SELECTABLE",
  NOT_SELECTABLE = "NOT_SELECTABLE",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}



type EagerNotification = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Notification, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userOriginID: string;
  readonly userOrigin?: User | null;
  readonly userID: string;
  readonly user?: User | null;
  readonly message?: string | null;
  readonly type: string;
  readonly resourceID?: string | null;
  readonly isRead: boolean;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyNotification = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Notification, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userOriginID: string;
  readonly userOrigin: AsyncItem<User | undefined>;
  readonly userID: string;
  readonly user: AsyncItem<User | undefined>;
  readonly message?: string | null;
  readonly type: string;
  readonly resourceID?: string | null;
  readonly isRead: boolean;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Notification = LazyLoading extends LazyLoadingDisabled ? EagerNotification : LazyNotification

export declare const Notification: (new (init: ModelInit<Notification>) => Notification) & {
  copyOf(source: Notification, mutator: (draft: MutableModel<Notification>) => MutableModel<Notification> | void): Notification;
}

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly dateOfBirth?: string | null;
  readonly isProfileUpdated: boolean;
  readonly isValidatedStep1?: boolean | null;
  readonly isValidatedStep2?: boolean | null;
  readonly addresss?: string | null;
  readonly cellphone?: string | null;
  readonly role: string;
  readonly subrole?: string | null;
  readonly status?: string | null;
  readonly email?: string | null;
  readonly wallets?: (Wallet | null)[] | null;
  readonly verifierVerifications?: (Verification | null)[] | null;
  readonly verifiedVerifications?: (Verification | null)[] | null;
  readonly userProducts?: (UserProduct | null)[] | null;
  readonly notifications?: (Notification | null)[] | null;
  readonly documents?: (Document | null)[] | null;
  readonly companies?: (Company | null)[] | null;
  readonly payments?: (Payment | null)[] | null;
  readonly marketplaceID?: string | null;
  readonly marketplace?: Marketplace | null;
  readonly campaigns?: (Campaign | null)[] | null;
  readonly properties?: (Property | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly dateOfBirth?: string | null;
  readonly isProfileUpdated: boolean;
  readonly isValidatedStep1?: boolean | null;
  readonly isValidatedStep2?: boolean | null;
  readonly addresss?: string | null;
  readonly cellphone?: string | null;
  readonly role: string;
  readonly subrole?: string | null;
  readonly status?: string | null;
  readonly email?: string | null;
  readonly wallets: AsyncCollection<Wallet>;
  readonly verifierVerifications: AsyncCollection<Verification>;
  readonly verifiedVerifications: AsyncCollection<Verification>;
  readonly userProducts: AsyncCollection<UserProduct>;
  readonly notifications: AsyncCollection<Notification>;
  readonly documents: AsyncCollection<Document>;
  readonly companies: AsyncCollection<Company>;
  readonly payments: AsyncCollection<Payment>;
  readonly marketplaceID?: string | null;
  readonly marketplace: AsyncItem<Marketplace | undefined>;
  readonly campaigns: AsyncCollection<Campaign>;
  readonly properties: AsyncCollection<Property>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerWallet = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Wallet, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly status?: string | null;
  readonly password?: string | null;
  readonly seed?: string | null;
  readonly address: string;
  readonly stake_address: string;
  readonly isSelected?: boolean | null;
  readonly claimed_token?: boolean | null;
  readonly isAdmin?: boolean | null;
  readonly userID?: string | null;
  readonly user?: User | null;
  readonly orders?: (Order | null)[] | null;
  readonly boughtOrders?: (Order | null)[] | null;
  readonly transactions?: (Transactions | null)[] | null;
  readonly claimedToken?: (ClaimedToken | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyWallet = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Wallet, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly status?: string | null;
  readonly password?: string | null;
  readonly seed?: string | null;
  readonly address: string;
  readonly stake_address: string;
  readonly isSelected?: boolean | null;
  readonly claimed_token?: boolean | null;
  readonly isAdmin?: boolean | null;
  readonly userID?: string | null;
  readonly user: AsyncItem<User | undefined>;
  readonly orders: AsyncCollection<Order>;
  readonly boughtOrders: AsyncCollection<Order>;
  readonly transactions: AsyncCollection<Transactions>;
  readonly claimedToken: AsyncCollection<ClaimedToken>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Wallet = LazyLoading extends LazyLoadingDisabled ? EagerWallet : LazyWallet

export declare const Wallet: (new (init: ModelInit<Wallet>) => Wallet) & {
  copyOf(source: Wallet, mutator: (draft: MutableModel<Wallet>) => MutableModel<Wallet> | void): Wallet;
}

type EagerVerification = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Verification, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly createdOn?: string | null;
  readonly updatedOn?: string | null;
  readonly sign?: string | null;
  readonly userVerifierID?: string | null;
  readonly userVerifier?: User | null;
  readonly userVerifiedID?: string | null;
  readonly userVerified?: User | null;
  readonly productFeatureID?: string | null;
  readonly productFeature?: ProductFeature | null;
  readonly propertyFeatureID?: string | null;
  readonly propertyFeature?: PropertyFeature | null;
  readonly verificationComments?: (VerificationComment | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyVerification = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Verification, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly createdOn?: string | null;
  readonly updatedOn?: string | null;
  readonly sign?: string | null;
  readonly userVerifierID?: string | null;
  readonly userVerifier: AsyncItem<User | undefined>;
  readonly userVerifiedID?: string | null;
  readonly userVerified: AsyncItem<User | undefined>;
  readonly productFeatureID?: string | null;
  readonly productFeature: AsyncItem<ProductFeature | undefined>;
  readonly propertyFeatureID?: string | null;
  readonly propertyFeature: AsyncItem<PropertyFeature | undefined>;
  readonly verificationComments: AsyncCollection<VerificationComment>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Verification = LazyLoading extends LazyLoadingDisabled ? EagerVerification : LazyVerification

export declare const Verification: (new (init: ModelInit<Verification>) => Verification) & {
  copyOf(source: Verification, mutator: (draft: MutableModel<Verification>) => MutableModel<Verification> | void): Verification;
}

type EagerVerificationComment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<VerificationComment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly comment?: string | null;
  readonly isCommentByVerifier?: boolean | null;
  readonly verificationID: string;
  readonly verification?: Verification | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyVerificationComment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<VerificationComment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly comment?: string | null;
  readonly isCommentByVerifier?: boolean | null;
  readonly verificationID: string;
  readonly verification: AsyncItem<Verification | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type VerificationComment = LazyLoading extends LazyLoadingDisabled ? EagerVerificationComment : LazyVerificationComment

export declare const VerificationComment: (new (init: ModelInit<VerificationComment>) => VerificationComment) & {
  copyOf(source: VerificationComment, mutator: (draft: MutableModel<VerificationComment>) => MutableModel<VerificationComment> | void): VerificationComment;
}

type EagerDocument = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Document, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly data?: string | null;
  readonly timeStamp?: number | null;
  readonly docHash?: string | null;
  readonly url?: string | null;
  readonly signed?: string | null;
  readonly signedHash?: string | null;
  readonly isApproved?: boolean | null;
  readonly status?: string | null;
  readonly visible?: boolean | null;
  readonly isUploadedToBlockChain?: boolean | null;
  readonly productFeatureID?: string | null;
  readonly productFeature?: ProductFeature | null;
  readonly propertyFeatureID?: string | null;
  readonly propertyFeature?: PropertyFeature | null;
  readonly userID: string;
  readonly user?: User | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyDocument = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Document, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly data?: string | null;
  readonly timeStamp?: number | null;
  readonly docHash?: string | null;
  readonly url?: string | null;
  readonly signed?: string | null;
  readonly signedHash?: string | null;
  readonly isApproved?: boolean | null;
  readonly status?: string | null;
  readonly visible?: boolean | null;
  readonly isUploadedToBlockChain?: boolean | null;
  readonly productFeatureID?: string | null;
  readonly productFeature: AsyncItem<ProductFeature | undefined>;
  readonly propertyFeatureID?: string | null;
  readonly propertyFeature: AsyncItem<PropertyFeature | undefined>;
  readonly userID: string;
  readonly user: AsyncItem<User | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Document = LazyLoading extends LazyLoadingDisabled ? EagerDocument : LazyDocument

export declare const Document: (new (init: ModelInit<Document>) => Document) & {
  copyOf(source: Document, mutator: (draft: MutableModel<Document>) => MutableModel<Document> | void): Document;
}

type EagerCategory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Category, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly isSelected?: boolean | null;
  readonly products?: (Product | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCategory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Category, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly isSelected?: boolean | null;
  readonly products: AsyncCollection<Product>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Category = LazyLoading extends LazyLoadingDisabled ? EagerCategory : LazyCategory

export declare const Category: (new (init: ModelInit<Category>) => Category) & {
  copyOf(source: Category, mutator: (draft: MutableModel<Category>) => MutableModel<Category> | void): Category;
}

type EagerProductItem = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ProductItem, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyProductItem = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ProductItem, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ProductItem = LazyLoading extends LazyLoadingDisabled ? EagerProductItem : LazyProductItem

export declare const ProductItem: (new (init: ModelInit<ProductItem>) => ProductItem) & {
  copyOf(source: ProductItem, mutator: (draft: MutableModel<ProductItem>) => MutableModel<ProductItem> | void): ProductItem;
}

type EagerMarketplace = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Marketplace, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly oracleTokenName?: string | null;
  readonly oracleWalletID?: string | null;
  readonly oracleWallet?: Wallet | null;
  readonly adminWalletID?: string | null;
  readonly adminWallet?: Wallet | null;
  readonly scripts?: (Script | null)[] | null;
  readonly products?: (Product | null)[] | null;
  readonly users?: (User | null)[] | null;
  readonly claimedToken?: (ClaimedToken | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMarketplace = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Marketplace, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly oracleTokenName?: string | null;
  readonly oracleWalletID?: string | null;
  readonly oracleWallet: AsyncItem<Wallet | undefined>;
  readonly adminWalletID?: string | null;
  readonly adminWallet: AsyncItem<Wallet | undefined>;
  readonly scripts: AsyncCollection<Script>;
  readonly products: AsyncCollection<Product>;
  readonly users: AsyncCollection<User>;
  readonly claimedToken: AsyncCollection<ClaimedToken>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Marketplace = LazyLoading extends LazyLoadingDisabled ? EagerMarketplace : LazyMarketplace

export declare const Marketplace: (new (init: ModelInit<Marketplace>) => Marketplace) & {
  copyOf(source: Marketplace, mutator: (draft: MutableModel<Marketplace>) => MutableModel<Marketplace> | void): Marketplace;
}

type EagerCampaign = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Campaign, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userID: string;
  readonly user?: User | null;
  readonly products?: (Product | null)[] | null;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly initialDate?: number | null;
  readonly endDate?: number | null;
  readonly available?: boolean | null;
  readonly images?: string | null;
  readonly properties?: (Property | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCampaign = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Campaign, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userID: string;
  readonly user: AsyncItem<User | undefined>;
  readonly products: AsyncCollection<Product>;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly initialDate?: number | null;
  readonly endDate?: number | null;
  readonly available?: boolean | null;
  readonly images?: string | null;
  readonly properties: AsyncCollection<Property>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Campaign = LazyLoading extends LazyLoadingDisabled ? EagerCampaign : LazyCampaign

export declare const Campaign: (new (init: ModelInit<Campaign>) => Campaign) & {
  copyOf(source: Campaign, mutator: (draft: MutableModel<Campaign>) => MutableModel<Campaign> | void): Campaign;
}

type EagerProperty = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Property, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly department?: string | null;
  readonly cadastralNumber?: string | null;
  readonly productID?: string | null;
  readonly product?: Product | null;
  readonly campaignID?: string | null;
  readonly campaign?: Campaign | null;
  readonly userID: string;
  readonly user?: User | null;
  readonly userLegalID?: string | null;
  readonly userLegal?: User | null;
  readonly propertyFeatures?: (PropertyFeature | null)[] | null;
  readonly status?: PropertyStatusType | keyof typeof PropertyStatusType | null;
  readonly reason?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyProperty = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Property, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly department?: string | null;
  readonly cadastralNumber?: string | null;
  readonly productID?: string | null;
  readonly product: AsyncItem<Product | undefined>;
  readonly campaignID?: string | null;
  readonly campaign: AsyncItem<Campaign | undefined>;
  readonly userID: string;
  readonly user: AsyncItem<User | undefined>;
  readonly userLegalID?: string | null;
  readonly userLegal: AsyncItem<User | undefined>;
  readonly propertyFeatures: AsyncCollection<PropertyFeature>;
  readonly status?: PropertyStatusType | keyof typeof PropertyStatusType | null;
  readonly reason?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Property = LazyLoading extends LazyLoadingDisabled ? EagerProperty : LazyProperty

export declare const Property: (new (init: ModelInit<Property>) => Property) & {
  copyOf(source: Property, mutator: (draft: MutableModel<Property>) => MutableModel<Property> | void): Property;
}

type EagerPropertyFeature = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PropertyFeature, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly value?: string | null;
  readonly isToBlockChain?: boolean | null;
  readonly order?: number | null;
  readonly isOnMainCard?: boolean | null;
  readonly isResult?: boolean | null;
  readonly propertyID: string;
  readonly property?: Property | null;
  readonly featureID: string;
  readonly feature?: Feature | null;
  readonly verifications?: (Verification | null)[] | null;
  readonly documents?: (Document | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPropertyFeature = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PropertyFeature, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly value?: string | null;
  readonly isToBlockChain?: boolean | null;
  readonly order?: number | null;
  readonly isOnMainCard?: boolean | null;
  readonly isResult?: boolean | null;
  readonly propertyID: string;
  readonly property: AsyncItem<Property | undefined>;
  readonly featureID: string;
  readonly feature: AsyncItem<Feature | undefined>;
  readonly verifications: AsyncCollection<Verification>;
  readonly documents: AsyncCollection<Document>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type PropertyFeature = LazyLoading extends LazyLoadingDisabled ? EagerPropertyFeature : LazyPropertyFeature

export declare const PropertyFeature: (new (init: ModelInit<PropertyFeature>) => PropertyFeature) & {
  copyOf(source: PropertyFeature, mutator: (draft: MutableModel<PropertyFeature>) => MutableModel<PropertyFeature> | void): PropertyFeature;
}

type EagerProduct = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Product, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly isActive: boolean;
  readonly isActiveOnPlatform?: boolean | null;
  readonly showOn?: string | null;
  readonly order?: number | null;
  readonly status?: string | null;
  readonly timeOnVerification?: number | null;
  readonly projectReadiness?: boolean | null;
  readonly tokenClaimedByOwner?: boolean | null;
  readonly tokenGenesis?: boolean | null;
  readonly categoryID: string;
  readonly category?: Category | null;
  readonly marketplaceID?: string | null;
  readonly marketplace?: Marketplace | null;
  readonly images?: (Image | null)[] | null;
  readonly productFeatures?: (ProductFeature | null)[] | null;
  readonly userProducts?: (UserProduct | null)[] | null;
  readonly transactions?: (Transactions | null)[] | null;
  readonly orders?: (Order | null)[] | null;
  readonly companies?: (Company | null)[] | null;
  readonly payments?: (Payment | null)[] | null;
  readonly scripts?: (Script | null)[] | null;
  readonly tokens?: (Token | null)[] | null;
  readonly analysis?: (Analysis | null)[] | null;
  readonly apiQueries?: (ApiQuery | null)[] | null;
  readonly campaignID?: string | null;
  readonly campaign?: Campaign | null;
  readonly properties?: (Property | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyProduct = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Product, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly isActive: boolean;
  readonly isActiveOnPlatform?: boolean | null;
  readonly showOn?: string | null;
  readonly order?: number | null;
  readonly status?: string | null;
  readonly timeOnVerification?: number | null;
  readonly projectReadiness?: boolean | null;
  readonly tokenClaimedByOwner?: boolean | null;
  readonly tokenGenesis?: boolean | null;
  readonly categoryID: string;
  readonly category: AsyncItem<Category | undefined>;
  readonly marketplaceID?: string | null;
  readonly marketplace: AsyncItem<Marketplace | undefined>;
  readonly images: AsyncCollection<Image>;
  readonly productFeatures: AsyncCollection<ProductFeature>;
  readonly userProducts: AsyncCollection<UserProduct>;
  readonly transactions: AsyncCollection<Transactions>;
  readonly orders: AsyncCollection<Order>;
  readonly companies: AsyncCollection<Company>;
  readonly payments: AsyncCollection<Payment>;
  readonly scripts: AsyncCollection<Script>;
  readonly tokens: AsyncCollection<Token>;
  readonly analysis: AsyncCollection<Analysis>;
  readonly apiQueries: AsyncCollection<ApiQuery>;
  readonly campaignID?: string | null;
  readonly campaign: AsyncItem<Campaign | undefined>;
  readonly properties: AsyncCollection<Property>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Product = LazyLoading extends LazyLoadingDisabled ? EagerProduct : LazyProduct

export declare const Product: (new (init: ModelInit<Product>) => Product) & {
  copyOf(source: Product, mutator: (draft: MutableModel<Product>) => MutableModel<Product> | void): Product;
}

type EagerAnalysis = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Analysis, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly productID: string;
  readonly product?: Product | null;
  readonly imgAnteriorNombreImg?: string | null;
  readonly imgAnteriorSatellite?: string | null;
  readonly imgAnteriorYear?: number | null;
  readonly imgAnteriorMesInicial?: number | null;
  readonly imgAnteriorMesFinal?: number | null;
  readonly imgAnteriorNubosidadMaxima?: number | null;
  readonly imgAnteriorBandas?: string | null;
  readonly imgPosteriorNombreImg?: string | null;
  readonly imgPosteriorSatellite?: string | null;
  readonly imgPosteriorYear?: number | null;
  readonly imgPosteriorMesInicial?: number | null;
  readonly imgPosteriorMesFinal?: number | null;
  readonly imgPosteriorNubosidadMaxima?: number | null;
  readonly imgPosteriorBandas?: string | null;
  readonly resultados?: string | null;
  readonly ajustado?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyAnalysis = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Analysis, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly productID: string;
  readonly product: AsyncItem<Product | undefined>;
  readonly imgAnteriorNombreImg?: string | null;
  readonly imgAnteriorSatellite?: string | null;
  readonly imgAnteriorYear?: number | null;
  readonly imgAnteriorMesInicial?: number | null;
  readonly imgAnteriorMesFinal?: number | null;
  readonly imgAnteriorNubosidadMaxima?: number | null;
  readonly imgAnteriorBandas?: string | null;
  readonly imgPosteriorNombreImg?: string | null;
  readonly imgPosteriorSatellite?: string | null;
  readonly imgPosteriorYear?: number | null;
  readonly imgPosteriorMesInicial?: number | null;
  readonly imgPosteriorMesFinal?: number | null;
  readonly imgPosteriorNubosidadMaxima?: number | null;
  readonly imgPosteriorBandas?: string | null;
  readonly resultados?: string | null;
  readonly ajustado?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Analysis = LazyLoading extends LazyLoadingDisabled ? EagerAnalysis : LazyAnalysis

export declare const Analysis: (new (init: ModelInit<Analysis>) => Analysis) & {
  copyOf(source: Analysis, mutator: (draft: MutableModel<Analysis>) => MutableModel<Analysis> | void): Analysis;
}

type EagerAnalysisResult = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<AnalysisResult, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly fuente: string;
  readonly modelo: string;
  readonly cobertura: string;
  readonly valor: number;
  readonly unidad: string;
  readonly proyecto: string;
  readonly nombreImagen: string;
  readonly data: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyAnalysisResult = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<AnalysisResult, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly fuente: string;
  readonly modelo: string;
  readonly cobertura: string;
  readonly valor: number;
  readonly unidad: string;
  readonly proyecto: string;
  readonly nombreImagen: string;
  readonly data: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type AnalysisResult = LazyLoading extends LazyLoadingDisabled ? EagerAnalysisResult : LazyAnalysisResult

export declare const AnalysisResult: (new (init: ModelInit<AnalysisResult>) => AnalysisResult) & {
  copyOf(source: AnalysisResult, mutator: (draft: MutableModel<AnalysisResult>) => MutableModel<AnalysisResult> | void): AnalysisResult;
}

type EagerApiQuery = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ApiQuery, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly productID: string;
  readonly product?: Product | null;
  readonly cedulaCatastral?: string | null;
  readonly imgAnteriorSatellite: string;
  readonly imgAnteriorYear: number;
  readonly imgAnteriorMesInicial: number;
  readonly imgAnteriorMesFinal: number;
  readonly imgAnteriorNubosidadMaxima: number;
  readonly imgPosteriorSatellite: string;
  readonly imgPosteriorYear: number;
  readonly imgPosteriorMesInicial: number;
  readonly imgPosteriorMesFinal: number;
  readonly imgPosteriorNubosidadMaxima: number;
  readonly fechaHoraConsulta?: number | null;
  readonly fechaHoraActualizacion?: number | null;
  readonly verificado: boolean;
  readonly rawConsulta?: string | null;
  readonly resultadoConsulta?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyApiQuery = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ApiQuery, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly productID: string;
  readonly product: AsyncItem<Product | undefined>;
  readonly cedulaCatastral?: string | null;
  readonly imgAnteriorSatellite: string;
  readonly imgAnteriorYear: number;
  readonly imgAnteriorMesInicial: number;
  readonly imgAnteriorMesFinal: number;
  readonly imgAnteriorNubosidadMaxima: number;
  readonly imgPosteriorSatellite: string;
  readonly imgPosteriorYear: number;
  readonly imgPosteriorMesInicial: number;
  readonly imgPosteriorMesFinal: number;
  readonly imgPosteriorNubosidadMaxima: number;
  readonly fechaHoraConsulta?: number | null;
  readonly fechaHoraActualizacion?: number | null;
  readonly verificado: boolean;
  readonly rawConsulta?: string | null;
  readonly resultadoConsulta?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ApiQuery = LazyLoading extends LazyLoadingDisabled ? EagerApiQuery : LazyApiQuery

export declare const ApiQuery: (new (init: ModelInit<ApiQuery>) => ApiQuery) & {
  copyOf(source: ApiQuery, mutator: (draft: MutableModel<ApiQuery>) => MutableModel<ApiQuery> | void): ApiQuery;
}

type EagerImage = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Image, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly imageURL: string;
  readonly format: string;
  readonly title?: string | null;
  readonly imageURLToDisplay?: string | null;
  readonly isOnCarousel?: boolean | null;
  readonly carouselLabel?: string | null;
  readonly carouselDescription?: string | null;
  readonly isActive: boolean;
  readonly order?: number | null;
  readonly productID: string;
  readonly product?: Product | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyImage = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Image, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly imageURL: string;
  readonly format: string;
  readonly title?: string | null;
  readonly imageURLToDisplay?: string | null;
  readonly isOnCarousel?: boolean | null;
  readonly carouselLabel?: string | null;
  readonly carouselDescription?: string | null;
  readonly isActive: boolean;
  readonly order?: number | null;
  readonly productID: string;
  readonly product: AsyncItem<Product | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Image = LazyLoading extends LazyLoadingDisabled ? EagerImage : LazyImage

export declare const Image: (new (init: ModelInit<Image>) => Image) & {
  copyOf(source: Image, mutator: (draft: MutableModel<Image>) => MutableModel<Image> | void): Image;
}

type EagerFeatureType = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FeatureType, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly features?: (Feature | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyFeatureType = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FeatureType, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly features: AsyncCollection<Feature>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type FeatureType = LazyLoading extends LazyLoadingDisabled ? EagerFeatureType : LazyFeatureType

export declare const FeatureType: (new (init: ModelInit<FeatureType>) => FeatureType) & {
  copyOf(source: FeatureType, mutator: (draft: MutableModel<FeatureType>) => MutableModel<FeatureType> | void): FeatureType;
}

type EagerFeature = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Feature, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly isTemplate?: boolean | null;
  readonly isVerifable?: boolean | null;
  readonly defaultValue?: string | null;
  readonly formOrder?: number | null;
  readonly formHint?: string | null;
  readonly formRequired?: boolean | null;
  readonly formAppearance?: string | null;
  readonly formRelevant?: string | null;
  readonly formConstraint?: string | null;
  readonly formRequiredMessage?: string | null;
  readonly parentID?: string | null;
  readonly children?: (Feature | null)[] | null;
  readonly featureTypeID?: string | null;
  readonly featureType?: FeatureType | null;
  readonly unitOfMeasureID?: string | null;
  readonly unitOfMeasure?: UnitOfMeasure | null;
  readonly productFeatures?: (ProductFeature | null)[] | null;
  readonly propertyFeatures?: (PropertyFeature | null)[] | null;
  readonly featureFormulas?: (FeatureFormula | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyFeature = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Feature, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly isTemplate?: boolean | null;
  readonly isVerifable?: boolean | null;
  readonly defaultValue?: string | null;
  readonly formOrder?: number | null;
  readonly formHint?: string | null;
  readonly formRequired?: boolean | null;
  readonly formAppearance?: string | null;
  readonly formRelevant?: string | null;
  readonly formConstraint?: string | null;
  readonly formRequiredMessage?: string | null;
  readonly parentID?: string | null;
  readonly children: AsyncCollection<Feature>;
  readonly featureTypeID?: string | null;
  readonly featureType: AsyncItem<FeatureType | undefined>;
  readonly unitOfMeasureID?: string | null;
  readonly unitOfMeasure: AsyncItem<UnitOfMeasure | undefined>;
  readonly productFeatures: AsyncCollection<ProductFeature>;
  readonly propertyFeatures: AsyncCollection<PropertyFeature>;
  readonly featureFormulas: AsyncCollection<FeatureFormula>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Feature = LazyLoading extends LazyLoadingDisabled ? EagerFeature : LazyFeature

export declare const Feature: (new (init: ModelInit<Feature>) => Feature) & {
  copyOf(source: Feature, mutator: (draft: MutableModel<Feature>) => MutableModel<Feature> | void): Feature;
}

type EagerUnitOfMeasure = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UnitOfMeasure, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly engineeringUnit: string;
  readonly description?: string | null;
  readonly isFloat?: boolean | null;
  readonly features?: (Feature | null)[] | null;
  readonly formulas?: (Formula | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUnitOfMeasure = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UnitOfMeasure, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly engineeringUnit: string;
  readonly description?: string | null;
  readonly isFloat?: boolean | null;
  readonly features: AsyncCollection<Feature>;
  readonly formulas: AsyncCollection<Formula>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type UnitOfMeasure = LazyLoading extends LazyLoadingDisabled ? EagerUnitOfMeasure : LazyUnitOfMeasure

export declare const UnitOfMeasure: (new (init: ModelInit<UnitOfMeasure>) => UnitOfMeasure) & {
  copyOf(source: UnitOfMeasure, mutator: (draft: MutableModel<UnitOfMeasure>) => MutableModel<UnitOfMeasure> | void): UnitOfMeasure;
}

type EagerFormula = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Formula, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly varID: string;
  readonly equation: string;
  readonly unitOfMeasureID?: string | null;
  readonly unitOfMeasure?: UnitOfMeasure | null;
  readonly results?: (Result | null)[] | null;
  readonly featureFormulas?: (FeatureFormula | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyFormula = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Formula, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly varID: string;
  readonly equation: string;
  readonly unitOfMeasureID?: string | null;
  readonly unitOfMeasure: AsyncItem<UnitOfMeasure | undefined>;
  readonly results: AsyncCollection<Result>;
  readonly featureFormulas: AsyncCollection<FeatureFormula>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Formula = LazyLoading extends LazyLoadingDisabled ? EagerFormula : LazyFormula

export declare const Formula: (new (init: ModelInit<Formula>) => Formula) & {
  copyOf(source: Formula, mutator: (draft: MutableModel<Formula>) => MutableModel<Formula> | void): Formula;
}

type EagerFeatureFormula = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FeatureFormula, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly featureID: string;
  readonly feature?: Feature | null;
  readonly formulaID: string;
  readonly formula?: Formula | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyFeatureFormula = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FeatureFormula, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly featureID: string;
  readonly feature: AsyncItem<Feature | undefined>;
  readonly formulaID: string;
  readonly formula: AsyncItem<Formula | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type FeatureFormula = LazyLoading extends LazyLoadingDisabled ? EagerFeatureFormula : LazyFeatureFormula

export declare const FeatureFormula: (new (init: ModelInit<FeatureFormula>) => FeatureFormula) & {
  copyOf(source: FeatureFormula, mutator: (draft: MutableModel<FeatureFormula>) => MutableModel<FeatureFormula> | void): FeatureFormula;
}

type EagerResult = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Result, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly varID: string;
  readonly value?: number | null;
  readonly dateTimeStamp?: number | null;
  readonly formulaID: string;
  readonly formula?: Formula | null;
  readonly productFeatureResults?: (ProductFeatureResult | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyResult = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Result, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly varID: string;
  readonly value?: number | null;
  readonly dateTimeStamp?: number | null;
  readonly formulaID: string;
  readonly formula: AsyncItem<Formula | undefined>;
  readonly productFeatureResults: AsyncCollection<ProductFeatureResult>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Result = LazyLoading extends LazyLoadingDisabled ? EagerResult : LazyResult

export declare const Result: (new (init: ModelInit<Result>) => Result) & {
  copyOf(source: Result, mutator: (draft: MutableModel<Result>) => MutableModel<Result> | void): Result;
}

type EagerProductFeature = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ProductFeature, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly value?: string | null;
  readonly isToBlockChain?: boolean | null;
  readonly order?: number | null;
  readonly isOnMainCard?: boolean | null;
  readonly isResult?: boolean | null;
  readonly productID: string;
  readonly product?: Product | null;
  readonly featureID: string;
  readonly feature?: Feature | null;
  readonly verifications?: (Verification | null)[] | null;
  readonly documents?: (Document | null)[] | null;
  readonly productFeatureResults?: (ProductFeatureResult | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyProductFeature = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ProductFeature, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly value?: string | null;
  readonly isToBlockChain?: boolean | null;
  readonly order?: number | null;
  readonly isOnMainCard?: boolean | null;
  readonly isResult?: boolean | null;
  readonly productID: string;
  readonly product: AsyncItem<Product | undefined>;
  readonly featureID: string;
  readonly feature: AsyncItem<Feature | undefined>;
  readonly verifications: AsyncCollection<Verification>;
  readonly documents: AsyncCollection<Document>;
  readonly productFeatureResults: AsyncCollection<ProductFeatureResult>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ProductFeature = LazyLoading extends LazyLoadingDisabled ? EagerProductFeature : LazyProductFeature

export declare const ProductFeature: (new (init: ModelInit<ProductFeature>) => ProductFeature) & {
  copyOf(source: ProductFeature, mutator: (draft: MutableModel<ProductFeature>) => MutableModel<ProductFeature> | void): ProductFeature;
}

type EagerProductFeatureResult = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ProductFeatureResult, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly isActive: boolean;
  readonly productFeatureID?: string | null;
  readonly productFeature?: ProductFeature | null;
  readonly resultID?: string | null;
  readonly result?: Result | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyProductFeatureResult = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ProductFeatureResult, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly isActive: boolean;
  readonly productFeatureID?: string | null;
  readonly productFeature: AsyncItem<ProductFeature | undefined>;
  readonly resultID?: string | null;
  readonly result: AsyncItem<Result | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ProductFeatureResult = LazyLoading extends LazyLoadingDisabled ? EagerProductFeatureResult : LazyProductFeatureResult

export declare const ProductFeatureResult: (new (init: ModelInit<ProductFeatureResult>) => ProductFeatureResult) & {
  copyOf(source: ProductFeatureResult, mutator: (draft: MutableModel<ProductFeatureResult>) => MutableModel<ProductFeatureResult> | void): ProductFeatureResult;
}

type EagerUserProduct = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserProduct, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly isFavorite?: boolean | null;
  readonly userID: string;
  readonly user?: User | null;
  readonly productID: string;
  readonly product?: Product | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUserProduct = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserProduct, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly isFavorite?: boolean | null;
  readonly userID: string;
  readonly user: AsyncItem<User | undefined>;
  readonly productID: string;
  readonly product: AsyncItem<Product | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type UserProduct = LazyLoading extends LazyLoadingDisabled ? EagerUserProduct : LazyUserProduct

export declare const UserProduct: (new (init: ModelInit<UserProduct>) => UserProduct) & {
  copyOf(source: UserProduct, mutator: (draft: MutableModel<UserProduct>) => MutableModel<UserProduct> | void): UserProduct;
}

type EagerOrder = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Order, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly statusCode?: string | null;
  readonly tokenPolicyId?: string | null;
  readonly tokenName?: string | null;
  readonly tokenAmount?: number | null;
  readonly utxos?: string | null;
  readonly value?: number | null;
  readonly walletBuyerID?: string | null;
  readonly walletBuyer?: Wallet | null;
  readonly scriptID?: string | null;
  readonly script?: Script | null;
  readonly walletID?: string | null;
  readonly wallet?: Wallet | null;
  readonly productID?: string | null;
  readonly product?: Product | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyOrder = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Order, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly statusCode?: string | null;
  readonly tokenPolicyId?: string | null;
  readonly tokenName?: string | null;
  readonly tokenAmount?: number | null;
  readonly utxos?: string | null;
  readonly value?: number | null;
  readonly walletBuyerID?: string | null;
  readonly walletBuyer: AsyncItem<Wallet | undefined>;
  readonly scriptID?: string | null;
  readonly script: AsyncItem<Script | undefined>;
  readonly walletID?: string | null;
  readonly wallet: AsyncItem<Wallet | undefined>;
  readonly productID?: string | null;
  readonly product: AsyncItem<Product | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Order = LazyLoading extends LazyLoadingDisabled ? EagerOrder : LazyOrder

export declare const Order: (new (init: ModelInit<Order>) => Order) & {
  copyOf(source: Order, mutator: (draft: MutableModel<Order>) => MutableModel<Order> | void): Order;
}

type EagerPayment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Payment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly orderType?: string | null;
  readonly ref?: string | null;
  readonly walletAddress?: string | null;
  readonly statusCode?: string | null;
  readonly walletStakeAddress?: string | null;
  readonly tokenName?: string | null;
  readonly tokenAmount?: number | null;
  readonly fee?: number | null;
  readonly baseValue?: number | null;
  readonly finalValue?: number | null;
  readonly currency?: string | null;
  readonly exchangeRate?: number | null;
  readonly timestamp?: number | null;
  readonly productID: string;
  readonly product?: Product | null;
  readonly userID?: string | null;
  readonly user?: User | null;
  readonly claimedByUser?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPayment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Payment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly orderType?: string | null;
  readonly ref?: string | null;
  readonly walletAddress?: string | null;
  readonly statusCode?: string | null;
  readonly walletStakeAddress?: string | null;
  readonly tokenName?: string | null;
  readonly tokenAmount?: number | null;
  readonly fee?: number | null;
  readonly baseValue?: number | null;
  readonly finalValue?: number | null;
  readonly currency?: string | null;
  readonly exchangeRate?: number | null;
  readonly timestamp?: number | null;
  readonly productID: string;
  readonly product: AsyncItem<Product | undefined>;
  readonly userID?: string | null;
  readonly user: AsyncItem<User | undefined>;
  readonly claimedByUser?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Payment = LazyLoading extends LazyLoadingDisabled ? EagerPayment : LazyPayment

export declare const Payment: (new (init: ModelInit<Payment>) => Payment) & {
  copyOf(source: Payment, mutator: (draft: MutableModel<Payment>) => MutableModel<Payment> | void): Payment;
}

type EagerTransactions = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Transactions, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly addressOrigin?: string | null;
  readonly addressDestination?: string | null;
  readonly walletID?: string | null;
  readonly txIn?: string | null;
  readonly txOutput?: string | null;
  readonly txCborhex?: string | null;
  readonly txHash?: string | null;
  readonly mint?: string | null;
  readonly scriptDataHash?: string | null;
  readonly metadataUrl?: string | null;
  readonly redeemer?: string | null;
  readonly fees?: number | null;
  readonly network?: string | null;
  readonly type?: string | null;
  readonly productID?: string | null;
  readonly product?: Product | null;
  readonly signed: boolean;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyTransactions = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Transactions, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly addressOrigin?: string | null;
  readonly addressDestination?: string | null;
  readonly walletID?: string | null;
  readonly txIn?: string | null;
  readonly txOutput?: string | null;
  readonly txCborhex?: string | null;
  readonly txHash?: string | null;
  readonly mint?: string | null;
  readonly scriptDataHash?: string | null;
  readonly metadataUrl?: string | null;
  readonly redeemer?: string | null;
  readonly fees?: number | null;
  readonly network?: string | null;
  readonly type?: string | null;
  readonly productID?: string | null;
  readonly product: AsyncItem<Product | undefined>;
  readonly signed: boolean;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Transactions = LazyLoading extends LazyLoadingDisabled ? EagerTransactions : LazyTransactions

export declare const Transactions: (new (init: ModelInit<Transactions>) => Transactions) & {
  copyOf(source: Transactions, mutator: (draft: MutableModel<Transactions>) => MutableModel<Transactions> | void): Transactions;
}

type EagerCompany = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Company, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly userID: string;
  readonly user?: User | null;
  readonly productID: string;
  readonly product?: Product | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCompany = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Company, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly userID: string;
  readonly user: AsyncItem<User | undefined>;
  readonly productID: string;
  readonly product: AsyncItem<Product | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Company = LazyLoading extends LazyLoadingDisabled ? EagerCompany : LazyCompany

export declare const Company: (new (init: ModelInit<Company>) => Company) & {
  copyOf(source: Company, mutator: (draft: MutableModel<Company>) => MutableModel<Company> | void): Company;
}

type EagerScript = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Script, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly scriptParentID?: string | null;
  readonly scripts?: (Script | null)[] | null;
  readonly name: string;
  readonly script_type: string;
  readonly script_category: string;
  readonly marketplaceID?: string | null;
  readonly marketplace?: Marketplace | null;
  readonly pbk?: (string | null)[] | null;
  readonly token_name?: string | null;
  readonly cbor: string;
  readonly productID?: string | null;
  readonly product?: Product | null;
  readonly testnetAddr: string;
  readonly MainnetAddr: string;
  readonly Active: boolean;
  readonly base_code?: string | null;
  readonly orders?: (Order | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyScript = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Script, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly scriptParentID?: string | null;
  readonly scripts: AsyncCollection<Script>;
  readonly name: string;
  readonly script_type: string;
  readonly script_category: string;
  readonly marketplaceID?: string | null;
  readonly marketplace: AsyncItem<Marketplace | undefined>;
  readonly pbk?: (string | null)[] | null;
  readonly token_name?: string | null;
  readonly cbor: string;
  readonly productID?: string | null;
  readonly product: AsyncItem<Product | undefined>;
  readonly testnetAddr: string;
  readonly MainnetAddr: string;
  readonly Active: boolean;
  readonly base_code?: string | null;
  readonly orders: AsyncCollection<Order>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Script = LazyLoading extends LazyLoadingDisabled ? EagerScript : LazyScript

export declare const Script: (new (init: ModelInit<Script>) => Script) & {
  copyOf(source: Script, mutator: (draft: MutableModel<Script>) => MutableModel<Script> | void): Script;
}

type EagerRate = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Rate, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly currency?: string | null;
  readonly value?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyRate = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Rate, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly currency?: string | null;
  readonly value?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Rate = LazyLoading extends LazyLoadingDisabled ? EagerRate : LazyRate

export declare const Rate: (new (init: ModelInit<Rate>) => Rate) & {
  copyOf(source: Rate, mutator: (draft: MutableModel<Rate>) => MutableModel<Rate> | void): Rate;
}

type EagerToken = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Token, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly productID?: string | null;
  readonly product?: Product | null;
  readonly policyID?: string | null;
  readonly tokenName?: string | null;
  readonly supply?: number | null;
  readonly oraclePrice?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyToken = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Token, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly productID?: string | null;
  readonly product: AsyncItem<Product | undefined>;
  readonly policyID?: string | null;
  readonly tokenName?: string | null;
  readonly supply?: number | null;
  readonly oraclePrice?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Token = LazyLoading extends LazyLoadingDisabled ? EagerToken : LazyToken

export declare const Token: (new (init: ModelInit<Token>) => Token) & {
  copyOf(source: Token, mutator: (draft: MutableModel<Token>) => MutableModel<Token> | void): Token;
}

type EagerClaimedToken = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ClaimedToken, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly marketplaceID: string;
  readonly walletID: string;
  readonly marketplace?: Marketplace | null;
  readonly wallet?: Wallet | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyClaimedToken = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ClaimedToken, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly marketplaceID: string;
  readonly walletID: string;
  readonly marketplace: AsyncItem<Marketplace | undefined>;
  readonly wallet: AsyncItem<Wallet | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ClaimedToken = LazyLoading extends LazyLoadingDisabled ? EagerClaimedToken : LazyClaimedToken

export declare const ClaimedToken: (new (init: ModelInit<ClaimedToken>) => ClaimedToken) & {
  copyOf(source: ClaimedToken, mutator: (draft: MutableModel<ClaimedToken>) => MutableModel<ClaimedToken> | void): ClaimedToken;
}