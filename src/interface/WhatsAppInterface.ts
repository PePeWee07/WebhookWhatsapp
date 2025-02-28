export interface Whatsapp {
  object: string;
  entry: Entry[];
}

export interface Entry {
  id: string;
  changes: Change[];
}

export interface Change {
  value: Value;
  field: string;
}

export interface Value {
  messagingProduct: string;
  metadata: Metadata;
  contacts?: ValueContact[];
  messages?: Message[];
  statuses?: Status[];
}

export interface ValueContact {
  profile: Profile;
  waId: string;
}

export interface Profile {
  name: string;
}

export interface Message {
  from: string;
  id: string;
  timestamp: string;
  text?: Text;
  type?: string;
  image?: Image;
  sticker?: Sticker;
  errors?: MessageError[];
  location?: Location;
  contacts?: MessageContact[];
  context?: Context;
  button?: Button;
  interactive?: Interactive;
  referral?: Referral;
  order?: Order;
  system?: System;
}

export interface Button {
  text: string;
  payload: string;
}

export interface MessageContact {
  addresses: Address[];
  birthday: string;
  emails: Email[];
  name: NameClass;
  org: Org;
  phones: Phone[];
  urls: URLItem[];
}

export interface Address {
  city: string;
  country: string;
  countryCode: string;
  state: string;
  street: string;
  type: string;
  zip: string;
}

export interface Email {
  email: string;
  type: string;
}

export interface NameClass {
  formattedName: string;
  firstName: string;
  lastName: string;
  middleName: string;
  suffix: string;
  prefix: string;
}

export interface Org {
  company: string;
  department: string;
  title: string;
}

export interface Phone {
  phone: string;
  waId: string;
  type: string;
}

export interface URLItem {
  url: string;
  type: string;
}

export interface Context {
  from: string;
  id: string;
  referredProduct?: ReferredProduct;
}

export interface ReferredProduct {
  catalogId: string;
  productRetailerId: string;
}

export interface MessageError {
  code: number;
  details: string;
  title: string;
}

export interface Image {
  caption?: string;
  mimeType: string;
  sha256: string;
  id: string;
}

export interface Sticker {
  mimeType: string;
  sha256: string;
  id: string;
}

export interface Interactive {
  listReply?: ListReply;
  type: string;
  buttonReply?: ButtonReply;
}

export interface ButtonReply {
  id: string;
  title: string;
}

export interface ListReply {
  id: string;
  title: string;
  description: string;
}

export interface Location {
  latitude: string;
  longitude: string;
  name: string;
  address: string;
}

export interface Order {
  catalogId: string;
  productItems: ProductItem[];
  text: string;
}

export interface ProductItem {
  productRetailerId: string;
  quantity: string;
  itemPrice: string;
  currency: string;
}

export interface Referral {
  sourceUrl: string;
  sourceId: string;
  sourceType: string;
  headline: string;
  body: string;
  mediaType: string;
  imageUrl: string;
  videoUrl: string;
  thumbnailUrl: string;
  ctwaClid: string;
}

export interface System {
  body: string;
  newWaId: string;
  type: string;
}

export interface Text {
  body: string;
}

export interface Metadata {
  displayPhoneNumber: string;
  phoneNumberId: string;
}

export interface Status {
  id: string;
  status: string;
  timestamp: string;
  recipientId: string;
  conversation?: Conversation;
  pricing?: Pricing;
  errors?: StatusError[];
}

export interface Conversation {
  id: string;
  expirationTimestamp: string;
  origin: Origin;
}

export interface Origin {
  type: string;
}

export interface StatusError {
  code: number | string;
  title: string;
  message?: string;
  errorData?: ErrorData;
  href?: string;
}

export interface ErrorData {
  details: string;
}

export interface Pricing {
  billable: boolean;
  pricingModel: string;
  category: string;
}
