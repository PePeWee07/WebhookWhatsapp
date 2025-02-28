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
  messaging_product: string;
  metadata: Metadata;
  contacts?: ValueContact[];
  messages?: Message[];
  statuses?: Status[];
}

export interface ValueContact {
  profile: Profile;
  wa_id: string;
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
  country_code: string;
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
  formatted_name: string;
  first_name: string;
  last_name: string;
  middle_name: string;
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
  wa_id: string;
  type: string;
}

export interface URLItem {
  url: string;
  type: string;
}

export interface Context {
  from: string;
  id: string;
  referred_product?: ReferredProduct;
}

export interface ReferredProduct {
  catalog_id: string;
  product_retailer_id: string;
}

export interface MessageError {
  code: number;
  details: string;
  title: string;
}

export interface Image {
  caption?: string;
  mime_type: string;
  sha256: string;
  id: string;
}

export interface Sticker {
  mime_ype: string;
  sha256: string;
  id: string;
}

export interface Interactive {
  list_reply?: ListReply;
  type: string;
  button_reply?: ButtonReply;
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
  catalog_id: string;
  product_items: ProductItem[];
  text: string;
}

export interface ProductItem {
  product_retailer_id: string;
  quantity: string;
  itemPrice: string;
  currency: string;
}

export interface Referral {
  source_url: string;
  source_id: string;
  source_type: string;
  headline: string;
  body: string;
  media_type: string;
  image_url: string;
  video_url: string;
  thumbnail_url: string;
  ctwa_clid: string;
}

export interface System {
  body: string;
  new_wa_id: string;
  type: string;
}

export interface Text {
  body: string;
}

export interface Metadata {
  display_phone_number: string;
  phone_number_id: string;
}

export interface Status {
  id: string;
  status: string;
  timestamp: string;
  recipient_id: string;
  conversation?: Conversation;
  pricing?: Pricing;
  errors?: StatusError[];
}

export interface Conversation {
  id: string;
  expiration_timestamp: string;
  origin: Origin;
}

export interface Origin {
  type: string;
}

export interface StatusError {
  code: number | string;
  title: string;
  message?: string;
  error_data?: ErrorData;
  href?: string;
}

export interface ErrorData {
  details: string;
}

export interface Pricing {
  billable: boolean;
  pricing_model: string;
  category: string;
}
