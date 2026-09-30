import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Category, 
  Product, 
  OfferCard, 
  Advertisement, 
  WebsiteSettings, 
  ContactMessage 
} from '../types';
import { 
  defaultCategories, 
  defaultProducts, 
  defaultOffers, 
  defaultAdvertisements, 
  defaultSettings 
} from '../data/seedData';

// Collection references
export const COLLECTIONS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  OFFERS: 'offers',
  ADVERTISEMENTS: 'advertisements',
  SETTINGS: 'settings',
  MESSAGES: 'messages',
};

/**
 * Initializes Firestore with default seed data if collections are empty.
 */
export async function seedFirestoreIfEmpty(): Promise<boolean> {
  try {
    const productsSnap = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
    if (productsSnap.empty) {
      console.log('Seeding initial TakeZon Firestore data...');
      
      // Seed Categories
      for (const cat of defaultCategories) {
        await setDoc(doc(db, COLLECTIONS.CATEGORIES, cat.id), cat);
      }

      // Seed Products
      for (const prod of defaultProducts) {
        await setDoc(doc(db, COLLECTIONS.PRODUCTS, prod.id), prod);
      }

      // Seed Offers
      for (const offer of defaultOffers) {
        await setDoc(doc(db, COLLECTIONS.OFFERS, offer.id), offer);
      }

      // Seed Advertisements
      for (const ad of defaultAdvertisements) {
        await setDoc(doc(db, COLLECTIONS.ADVERTISEMENTS, ad.id), ad);
      }

      // Seed Settings
      await setDoc(doc(db, COLLECTIONS.SETTINGS, 'general'), defaultSettings);

      console.log('TakeZon default data successfully seeded into Firestore.');
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Note on Firestore seeding (might use local defaults or offline):', error);
    return false;
  }
}

/**
 * Force reset/re-seed all collections from default catalog
 */
export async function forceReseedCatalog(): Promise<void> {
  for (const cat of defaultCategories) {
    await setDoc(doc(db, COLLECTIONS.CATEGORIES, cat.id), cat);
  }
  for (const prod of defaultProducts) {
    await setDoc(doc(db, COLLECTIONS.PRODUCTS, prod.id), prod);
  }
  for (const offer of defaultOffers) {
    await setDoc(doc(db, COLLECTIONS.OFFERS, offer.id), offer);
  }
  for (const ad of defaultAdvertisements) {
    await setDoc(doc(db, COLLECTIONS.ADVERTISEMENTS, ad.id), ad);
  }
  await setDoc(doc(db, COLLECTIONS.SETTINGS, 'general'), defaultSettings);
}

// ================= PRODUCT CRUD =================

export function listenToProducts(callback: (products: Product[]) => void) {
  const colRef = collection(db, COLLECTIONS.PRODUCTS);
  return onSnapshot(colRef, (snapshot) => {
    if (!snapshot.empty) {
      const items: Product[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<Product, 'id'>) });
      });
      callback(items);
    } else {
      callback(defaultProducts);
    }
  }, (err) => {
    console.warn('Firestore products snapshot listener error, using fallback:', err);
    callback(defaultProducts);
  });
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.PRODUCTS), {
    ...product,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return docRef.id;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Date.now(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));
}

// ================= CATEGORY CRUD =================

export function listenToCategories(callback: (categories: Category[]) => void) {
  const colRef = collection(db, COLLECTIONS.CATEGORIES);
  return onSnapshot(colRef, (snapshot) => {
    if (!snapshot.empty) {
      const items: Category[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<Category, 'id'>) });
      });
      items.sort((a, b) => a.order - b.order);
      callback(items);
    } else {
      callback(defaultCategories);
    }
  }, (err) => {
    console.warn('Firestore categories listener error:', err);
    callback(defaultCategories);
  });
}

export async function createCategory(cat: Omit<Category, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.CATEGORIES), cat);
  return docRef.id;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.CATEGORIES, id), updates);
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.CATEGORIES, id));
}

// ================= OFFER CRUD =================

export function listenToOffers(callback: (offers: OfferCard[]) => void) {
  const colRef = collection(db, COLLECTIONS.OFFERS);
  return onSnapshot(colRef, (snapshot) => {
    if (!snapshot.empty) {
      const items: OfferCard[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<OfferCard, 'id'>) });
      });
      items.sort((a, b) => a.order - b.order);
      callback(items);
    } else {
      callback(defaultOffers);
    }
  }, (err) => {
    console.warn('Firestore offers listener error:', err);
    callback(defaultOffers);
  });
}

export async function createOffer(offer: Omit<OfferCard, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.OFFERS), {
    ...offer,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateOffer(id: string, updates: Partial<OfferCard>): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.OFFERS, id), updates);
}

export async function deleteOffer(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.OFFERS, id));
}

// ================= BANNER / ADVERTISEMENT CRUD =================

export function listenToAdvertisements(callback: (ads: Advertisement[]) => void) {
  const colRef = collection(db, COLLECTIONS.ADVERTISEMENTS);
  return onSnapshot(colRef, (snapshot) => {
    if (!snapshot.empty) {
      const items: Advertisement[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<Advertisement, 'id'>) });
      });
      items.sort((a, b) => (b.priority || 0) - (a.priority || 0));
      callback(items);
    } else {
      callback(defaultAdvertisements);
    }
  }, (err) => {
    console.warn('Firestore advertisements listener error:', err);
    callback(defaultAdvertisements);
  });
}

export async function createAdvertisement(ad: Omit<Advertisement, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.ADVERTISEMENTS), {
    ...ad,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateAdvertisement(id: string, updates: Partial<Advertisement>): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.ADVERTISEMENTS, id), updates);
}

export async function deleteAdvertisement(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.ADVERTISEMENTS, id));
}

// ================= SETTINGS =================

export function listenToSettings(callback: (settings: WebsiteSettings) => void) {
  const docRef = doc(db, COLLECTIONS.SETTINGS, 'general');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as WebsiteSettings);
    } else {
      callback(defaultSettings);
    }
  }, (err) => {
    console.warn('Firestore settings listener error:', err);
    callback(defaultSettings);
  });
}

export async function updateWebsiteSettings(settings: Partial<WebsiteSettings>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.SETTINGS, 'general');
  await setDoc(docRef, settings, { merge: true });
}

// ================= CONTACT MESSAGES =================

export async function submitContactMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.MESSAGES), {
    ...msg,
    createdAt: Date.now(),
    read: false,
  });
  return docRef.id;
}

export function listenToMessages(callback: (messages: ContactMessage[]) => void) {
  const colRef = collection(db, COLLECTIONS.MESSAGES);
  return onSnapshot(colRef, (snapshot) => {
    const items: ContactMessage[] = [];
    snapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...(docSnap.data() as Omit<ContactMessage, 'id'>) });
    });
    items.sort((a, b) => b.createdAt - a.createdAt);
    callback(items);
  }, (err) => {
    console.warn('Firestore messages listener error:', err);
    callback([]);
  });
}

export async function markMessageRead(id: string, read: boolean): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.MESSAGES, id), { read });
}

export async function deleteMessage(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.MESSAGES, id));
}
