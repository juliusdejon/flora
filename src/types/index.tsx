export type INavigation = {
  navigation: any;
};

export type IWishlist = {
  wishlists: IProduct[];
};

type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};
// export type IUser = {
//   firstName: string;
//   lastName: string;
//   email: string;
//   address?: Address;
//   code?: string;
//   codeExpires?: Date;
//   faceShape?: string;
//   preferredHairColors?: string[];
//   preferredHairLengths?: string[];
//   preferredHairTypes?: string[];
// };

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  parent: number;
  type: string;
  variation: string;
  permalink: string;
  sku: string;
  short_description: string;
  description: string;
  on_sale: boolean;
  prices: Prices;
  price_html: string;
  average_rating: string;
  review_count: number;
  images: Image[];
  categories: Category[];
  tags: Tag[];
  attributes: Attribute[];
  variations: Variation[];
  has_options: boolean;
  is_purchasable: boolean;
  is_in_stock: boolean;
  is_on_backorder: boolean;
  low_stock_remaining: any;
  sold_individually: boolean;
  add_to_cart: AddToCart;
  extensions: Extensions;
}

export interface Prices {
  price: string;
  regular_price: string;
  sale_price: string;
  price_range: PriceRange;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

export interface PriceRange {
  min_amount: string;
  max_amount: string;
}

export interface Image {
  id: number;
  src: string;
  thumbnail: string;
  srcset: string;
  sizes: string;
  name: string;
  alt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  link: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  link: string;
}

export interface Attribute {
  id: number;
  name: string;
  taxonomy: any;
  has_variations: boolean;
  terms: Term[];
}

export interface Term {
  id: number;
  name: string;
  slug: string;
  option: string;
}

export interface Variation {
  id: number;
  stock_status: string;
  attributes: Term[];
}

export interface AddToCart {
  text: string;
  description: string;
  url: string;
  minimum: number;
  maximum: number;
  multiple_of: number;
}

export interface Extensions {}

export interface ICart {
  items: ICartItem[];
  coupons: Coupon[];
  fees: any[];
  totals: Totals2;
  shipping_address: ShippingAddress;
  billing_address: BillingAddress;
  needs_payment: boolean;
  needs_shipping: boolean;
  payment_requirements: string[];
  has_calculated_shipping: boolean;
  shipping_rates: any[];
  items_count: number;
  items_weight: number;
  cross_sells: any[];
  errors: any[];
  payment_methods: string[];
  extensions: Extensions2;
}

export interface Coupon {
  code: string;
  discount_type: string;
  totals: CouponTotals;
}
export interface CouponTotals {
  total_discount: string;
  total_discount_tax: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

export interface ICartItem {
  key: string;
  id: number;
  type: string;
  quantity: number;
  quantity_limits: QuantityLimits;
  name: string;
  short_description: string;
  description: string;
  sku: string;
  low_stock_remaining: any;
  backorders_allowed: boolean;
  show_backorder_badge: boolean;
  sold_individually: boolean;
  permalink: string;
  images: Image[];
  variation: Variation[];
  item_data: any[];
  prices: Prices;
  totals: Totals;
  catalog_visibility: string;
  extensions: Extensions;
}

export interface QuantityLimits {
  minimum: number;
  maximum: number;
  multiple_of: number;
  editable: boolean;
}

export interface Image {
  id: number;
  src: string;
  thumbnail: string;
  srcset: string;
  sizes: string;
  name: string;
  alt: string;
}

export interface Variation {
  id: number;
  stock_status: string;
  attributes: Term[];
  attribute: string;
  value: string;
}

export interface Prices {
  price: string;
  regular_price: string;
  sale_price: string;
  // @ts-ignore
  price_range: any;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
  raw_prices: RawPrices;
}

export interface RawPrices {
  precision: number;
  price: string;
  regular_price: string;
  sale_price: string;
}

export interface Totals {
  line_subtotal: string;
  line_subtotal_tax: string;
  line_total: string;
  line_total_tax: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

export interface Extensions {}

export interface Totals2 {
  total_items: string;
  total_items_tax: string;
  total_fees: string;
  total_fees_tax: string;
  total_discount: string;
  total_discount_tax: string;
  total_shipping: any;
  total_shipping_tax: any;
  total_price: string;
  total_tax: string;
  tax_lines: any[];
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2: string;
  city: string;
  postcode: string;
  country: string;
  state: string;
  phone: string;
}

export interface BillingAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

export interface Extensions2 {}

export interface Customer {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  username: string;
  billing: Billing;
  shipping: ShippingAddress;
  is_paying_customer: boolean;
  avatar_url: string;
  meta_data: MetaDaum[];
  orders_count: number;
  total_spent: string;
  _links: Links;
}

export interface Billing {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  postcode: string;
  country: string;
  state: string;
  email: string;
  phone: string;
}

export interface MetaDaum {
  id: number;
  key: string;
  value: string;
}

export interface Links {
  self: Self[];
  collection: Collection[];
}

export interface Self {
  href: string;
}

export interface Collection {
  href: string;
}

export interface Me {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: AvatarUrls;
}

export interface AvatarUrls {
  '24': string;
  '48': string;
  '96': string;
}

export interface IUser extends Customer, Me {}

export interface IOrder {
  billing_address: BillingAddress;
  shipping_address: ShippingAddress;
  payment_method: string;
  create_account: boolean;
}

export interface Bundle {
  id: number;
  name: string;
  option: string[];
  slug: string;
}
