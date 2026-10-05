export type CategorySlug = 
  | 'smart-gadgets' 
  | 'camera-gear' 
  | 'pc-accessories' 
  | 'kitchen-apps' 
  | 'fitness-gear';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  badge?: string;
  order: number;
  enabled: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string; // slug matching category
  shortDescription: string;
  fullDescription: string;
  images: string[];
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  availability: 'In Stock' | 'Limited Stock' | 'Pre-Order' | 'Out of Stock';
  productUrl: string;
  affiliateUrl: string;
  ctaText: 'View Deal' | 'Shop Now' | 'Learn More' | 'Get Offer' | string;
  isFeatured: boolean;
  isNew: boolean;
  isDeal: boolean;
  isTrending: boolean;
  specs?: Record<string, string>;
  features?: string[];
  createdAt: number;
  updatedAt: number;

  // ================= 4. PRODUCT DISPLAY CONTROL =================
  displayMode?: 'amount' | 'checkDetails';
  amountText?: string;
  checkDetailsText?: string;
  customDisplayText?: string;

  // ================= 5. THREE PRODUCT ACTION LINKS =================
  amazonUrl?: string;
  walmartUrl?: string;
  videoUrl?: string;

  // ================= 8. PRODUCT BUTTON TEXT CONTROL =================
  amazonButtonText?: string;
  walmartButtonText?: string;
  videoButtonText?: string;

  // ================= 7. PRODUCT-LEVEL VISIBILITY CONTROLS =================
  showImage?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showAmount?: boolean;
  showCheckDetails?: boolean;
  showAmazonButton?: boolean;
  showWalmartButton?: boolean;
  showVideoButton?: boolean;
}

export interface OfferCard {
  id: string;
  title: string;
  subtitle?: string;
  badge: 'HOT DEAL' | 'LIMITED OFFER' | 'NEW' | 'CPA OFFER' | 'EXCLUSIVE' | string;
  description: string;
  image: string;
  discount: string;
  originalPrice?: number;
  offerPrice?: number;
  expirationDate: string;
  ctaButtonText: string;
  affiliateUrl: string;
  isActive: boolean;
  order: number;
  createdAt: number;
}

export type AdPlacement = 
  | 'homepage_top' 
  | 'homepage_middle' 
  | 'between_sections' 
  | 'bottom_listings' 
  | 'sidebar' 
  | 'footer'
  | 'product_details';

export interface Advertisement {
  id: string;
  title: string;
  subtitle?: string;
  placement: AdPlacement;
  adType?: 'image' | 'code' | 'adsense';
  imageUrl: string;
  targetUrl: string;
  ctaText?: string;
  badgeText?: string;
  customCode?: string;
  codeType?: 'html' | 'script' | 'iframe';
  adDimensions?: 'responsive' | '728x90' | '300x250' | '970x250' | '320x100' | 'auto';
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  priority: number;
  createdAt: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  category?: string;
  message: string;
  createdAt: number;
  read: boolean;
}

// ================= 1. SOCIAL MEDIA LINK MANAGEMENT =================
export type SocialPlatformType = 
  | 'facebook' 
  | 'instagram' 
  | 'youtube' 
  | 'tiktok' 
  | 'x' 
  | 'linkedin' 
  | 'pinterest' 
  | 'telegram' 
  | 'whatsapp' 
  | 'messenger' 
  | 'reddit' 
  | 'discord' 
  | 'custom';

export interface SocialMediaLink {
  id: string;
  platform: SocialPlatformType | string;
  label: string;
  url: string;
  icon?: string;
  enabled: boolean;
  order: number;
}

// ================= 2. TOP HEADER / TOP BORDER CONTROL =================
export interface TopBarItem {
  id: string;
  type: 'badge' | 'text' | 'button' | 'link' | 'status' | 'custom';
  label: string;
  text: string;
  badgeText?: string;
  linkUrl?: string;
  isExternal?: boolean;
  enabled: boolean;
  order: number;
}

export interface TopBarSettings {
  enabled: boolean;
  items: TopBarItem[];
}

// ================= 3. MAIN NAVIGATION MENU CONTROL =================
export interface NavigationItem {
  id: string;
  label: string;
  url: string; // View name ('home', 'offers', 'contact', 'search') or category route ('category:smart-gadgets') or external link
  categorySlug?: string;
  isExternal?: boolean;
  enabled: boolean;
  order: number;
  badge?: string;
}

export interface WebsiteSettings {
  siteTitle: string;
  logoText: string;
  logoSubtitle: string;
  announcementText: string;
  announcementLink?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroImageUrl: string;
  heroBadgeText: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  footerText: string;
  affiliateDisclosure: string;
  facebookUrl?: string;
  instagramUrl?: string;
  xUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;

  // New persistent management structures
  socialLinks?: SocialMediaLink[];
  topBar?: TopBarSettings;
  navigationItems?: NavigationItem[];
}
