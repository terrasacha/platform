// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const PropertyStatusType = {
  "PENDING": "PENDING",
  "DOC_UPLOADED": "DOC_UPLOADED",
  "SELECTABLE": "SELECTABLE",
  "NOT_SELECTABLE": "NOT_SELECTABLE",
  "APPROVED": "APPROVED",
  "REJECTED": "REJECTED"
};

const { Notification, User, Wallet, Verification, VerificationComment, Document, Category, ProductItem, Marketplace, Campaign, Property, PropertyFeature, Product, Analysis, AnalysisResult, ApiQuery, Image, FeatureType, Feature, UnitOfMeasure, Formula, FeatureFormula, Result, ProductFeature, ProductFeatureResult, UserProduct, Order, Payment, Transactions, Company, Script, Rate, Token, ClaimedToken } = initSchema(schema);

export {
  Notification,
  User,
  Wallet,
  Verification,
  VerificationComment,
  Document,
  Category,
  ProductItem,
  Marketplace,
  Campaign,
  Property,
  PropertyFeature,
  Product,
  Analysis,
  AnalysisResult,
  ApiQuery,
  Image,
  FeatureType,
  Feature,
  UnitOfMeasure,
  Formula,
  FeatureFormula,
  Result,
  ProductFeature,
  ProductFeatureResult,
  UserProduct,
  Order,
  Payment,
  Transactions,
  Company,
  Script,
  Rate,
  Token,
  ClaimedToken,
  PropertyStatusType
};