import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  getDoc,
  updateDoc,
  onSnapshot
} from "firebase/firestore";
import { db } from "./firebase";
import { Project, Service, Skill, ContactMessage, SiteConfig, ClientReview, AdminUser, CustomFontData } from "../types";

// Helper to convert Firebase query snapshot to list
async function getCollectionData<T>(collectionName: string): Promise<T[]> {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    const items: T[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as unknown as T);
    });
    return items;
  } catch (error) {
    console.warn(`[Offline/Sync Notice] Could not fetch collection ${collectionName}:`, error);
    throw error;
  }
}

// 1. Projects DB Functions
export async function getProjectsDB(): Promise<Project[]> {
  return getCollectionData<Project>("projects");
}

export async function saveProjectDB(project: Project): Promise<void> {
  try {
    const docRef = doc(db, "projects", project.id);
    await setDoc(docRef, project);
  } catch (error) {
    console.warn("[Offline/Sync Notice] Error saving project:", error);
    throw error;
  }
}

export async function deleteProjectDB(id: string): Promise<void> {
  try {
    const docRef = doc(db, "projects", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn("[Offline/Sync Notice] Error deleting project:", error);
    throw error;
  }
}

// 2. Services DB Functions
export async function getServicesDB(): Promise<Service[]> {
  return getCollectionData<Service>("services");
}

export async function saveServiceDB(service: Service): Promise<void> {
  try {
    const docRef = doc(db, "services", service.id);
    await setDoc(docRef, service);
  } catch (error) {
    console.warn("[Offline/Sync Notice] Error saving service:", error);
    throw error;
  }
}

export async function deleteServiceDB(id: string): Promise<void> {
  try {
    const docRef = doc(db, "services", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn("[Offline/Sync Notice] Error deleting service:", error);
    throw error;
  }
}

// 3. Skills DB Functions
export async function getSkillsDB(): Promise<Skill[]> {
  return getCollectionData<Skill>("skills");
}

export async function saveSkillDB(skill: Skill): Promise<void> {
  try {
    const docRef = doc(db, "skills", skill.id);
    await setDoc(docRef, skill);
  } catch (error) {
    console.warn("[Offline/Sync Notice] Error saving skill:", error);
    throw error;
  }
}

export async function deleteSkillDB(id: string): Promise<void> {
  try {
    const docRef = doc(db, "skills", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn("[Offline/Sync Notice] Error deleting skill:", error);
    throw error;
  }
}

// 4. Reviews DB Functions
export async function getReviewsDB(): Promise<ClientReview[]> {
  return getCollectionData<ClientReview>("reviews");
}

export async function saveReviewDB(review: ClientReview): Promise<void> {
  try {
    const docRef = doc(db, "reviews", review.id);
    await setDoc(docRef, review);
  } catch (error) {
    console.warn("[Offline/Sync Notice] Error saving review:", error);
    throw error;
  }
}

export async function deleteReviewDB(id: string): Promise<void> {
  try {
    const docRef = doc(db, "reviews", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn("[Offline/Sync Notice] Error deleting review:", error);
    throw error;
  }
}

// 5. Config DB Functions
export async function getConfigDB(): Promise<SiteConfig | null> {
  try {
    const docRef = doc(db, "config", "site_config");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as SiteConfig;
    }
    return null;
  } catch (error) {
    console.warn("[Offline/Sync Notice] Error fetching site config:", error);
    throw error;
  }
}

export async function saveConfigDB(config: SiteConfig): Promise<void> {
  try {
    const docRef = doc(db, "config", "site_config");
    await setDoc(docRef, config);
  } catch (error) {
    console.warn("[Offline/Sync Notice] Error saving site config:", error);
    throw error;
  }
}

// 6. Contact Messages DB Functions
export async function getMessagesDB(): Promise<ContactMessage[]> {
  return getCollectionData<ContactMessage>("messages");
}

export async function saveMessageDB(message: ContactMessage): Promise<void> {
  try {
    const docRef = doc(db, "messages", message.id);
    await setDoc(docRef, message);
  } catch (error) {
    console.warn("[Offline/Sync Notice] Error saving message:", error);
    throw error;
  }
}

export async function deleteMessageDB(id: string): Promise<void> {
  try {
    const docRef = doc(db, "messages", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn("[Offline/Sync Notice] Error deleting message:", error);
    throw error;
  }
}

/**
 * @deprecated Legacy SHA-256 Client-side hashing.
 * Authentication has been migrated to official Firebase Authentication SDK.
 */
export async function hashPassword(password: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * @deprecated Legacy client-side user database lookup.
 * Authentication is now managed directly via Firebase Auth and useAuth().
 */
export async function getAdminUserDB(email: string): Promise<AdminUser | null> {
  const trimmedEmail = email.toLowerCase().trim();
  const isDefaultAdmin = trimmedEmail === 'malikalwesabi@gmail.com' || 
                         trimmedEmail === 'admin@malek.art' || 
                         trimmedEmail === 'admin@malek';

  // ALWAYS check local storage first for instant, zero-delay responses!
  const local = localStorage.getItem(`malek_admin_${trimmedEmail}`);
  if (local) {
    try {
      const parsed = JSON.parse(local) as AdminUser;
      // Start a background fetch to update the local cache, but don't block the UI!
      const docRef = doc(db, "admin_users", trimmedEmail);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          localStorage.setItem(`malek_admin_${trimmedEmail}`, JSON.stringify(docSnap.data()));
        }
      }).catch(() => {});
      
      return parsed;
    } catch (e) {}
  }

  // If there's no local storage, try fetching from the cloud, but with a strict timeout (e.g., 1.5 seconds)
  // to avoid infinite loading spinners on slow or restricted networks.
  try {
    const docRef = doc(db, "admin_users", trimmedEmail);
    const cloudFetchPromise = getDoc(docRef).then(async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as AdminUser;
        localStorage.setItem(`malek_admin_${trimmedEmail}`, JSON.stringify(data));
        return data;
      }
      return null;
    });

    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500));
    const cloudAdmin = await Promise.race([cloudFetchPromise, timeoutPromise]);
    if (cloudAdmin) {
      return cloudAdmin;
    }
  } catch (error) {
    console.warn("[Offline/Sync Notice] Error fetching admin user from cloud:", error);
  }
  
  // Try local fallback as a last resort
  if (isDefaultAdmin) {
    const defaultAdmin: AdminUser = {
      email: trimmedEmail,
      passwordHash: "",
      isFirstLogin: true,
      createdAt: new Date().toISOString()
    };
    // Save locally immediately
    localStorage.setItem(`malek_admin_${trimmedEmail}`, JSON.stringify(defaultAdmin));
    // Save to cloud in background
    const docRef = doc(db, "admin_users", trimmedEmail);
    setDoc(docRef, defaultAdmin).catch(() => {});
    return defaultAdmin;
  }
  return null;
}

export async function saveAdminUserDB(admin: AdminUser): Promise<void> {
  const trimmedEmail = admin.email.toLowerCase().trim();
  // Always write to local storage first for absolute resilience and instant UI updates
  localStorage.setItem(`malek_admin_${trimmedEmail}`, JSON.stringify(admin));
  
  // Non-blocking background save to Cloud Firestore so the user never gets stuck waiting/spinning
  try {
    const docRef = doc(db, "admin_users", trimmedEmail);
    setDoc(docRef, admin).catch((error) => {
      console.warn("[Offline/Sync Notice] Background save to Firestore failed:", error);
    });
  } catch (error) {
    console.warn("[Offline/Sync Notice] Error initializing cloud save:", error);
  }
}

export async function seedDefaultAdminUser(email: string): Promise<void> {
  try {
    const trimmedEmail = email.toLowerCase().trim();
    const existingAdmin = await getAdminUserDB(trimmedEmail);
    if (!existingAdmin) {
      const defaultAdmin: AdminUser = {
        email: trimmedEmail,
        passwordHash: "", // No password set initially
        isFirstLogin: true,
        createdAt: new Date().toISOString()
      };
      await saveAdminUserDB(defaultAdmin);
      console.log(`Seeded default admin user: ${trimmedEmail}`);
    }
  } catch (error) {
    console.warn("[Offline/Sync Notice] Error seeding default admin user:", error);
  }
}

// 9. Real-time Subscription Functions for live instant updates on all devices
export function subscribeConfig(onUpdate: (config: SiteConfig) => void): () => void {
  const docRef = doc(db, "config", "site_config");
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      onUpdate(docSnap.data() as SiteConfig);
    }
  }, (error) => {
    console.warn("Error in live config subscription:", error);
  });
}

export function subscribeProjects(onUpdate: (projects: Project[]) => void): () => void {
  const colRef = collection(db, "projects");
  return onSnapshot(colRef, (snapshot) => {
    const items: Project[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as unknown as Project);
    });
    // Sort projects by sortOrder if available
    items.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    onUpdate(items);
  }, (error) => {
    console.warn("Error in live projects subscription:", error);
  });
}

export function subscribeServices(onUpdate: (services: Service[]) => void): () => void {
  const colRef = collection(db, "services");
  return onSnapshot(colRef, (snapshot) => {
    const items: Service[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as unknown as Service);
    });
    onUpdate(items);
  }, (error) => {
    console.warn("Error in live services subscription:", error);
  });
}

export function subscribeSkills(onUpdate: (skills: Skill[]) => void): () => void {
  const colRef = collection(db, "skills");
  return onSnapshot(colRef, (snapshot) => {
    const items: Skill[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as unknown as Skill);
    });
    onUpdate(items);
  }, (error) => {
    console.warn("Error in live skills subscription:", error);
  });
}

export function subscribeReviews(onUpdate: (reviews: ClientReview[]) => void): () => void {
  const colRef = collection(db, "reviews");
  return onSnapshot(colRef, (snapshot) => {
    const items: ClientReview[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as unknown as ClientReview);
    });
    onUpdate(items);
  }, (error) => {
    console.warn("Error in live reviews subscription:", error);
  });
}

export function subscribeMessages(onUpdate: (messages: ContactMessage[]) => void): () => void {
  const colRef = collection(db, "messages");
  return onSnapshot(colRef, (snapshot) => {
    const items: ContactMessage[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as unknown as ContactMessage);
    });
    // Sort messages by timestamp or date if available
    items.sort((a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime());
    onUpdate(items);
  }, (error) => {
    console.warn("Error in live messages subscription:", error);
  });
}

// 7. Custom Uploaded Font Functions (stored under config/custom_font, which is
//    covered by the existing `match /config/{id}` security rule — public read,
//    authenticated write — so no rules redeploy is required).
export async function getCustomFontDB(): Promise<CustomFontData | null> {
  try {
    const docRef = doc(db, "config", "custom_font");
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as CustomFontData) : null;
  } catch (error) {
    console.warn("[Offline/Sync Notice] Could not fetch custom font:", error);
    return null;
  }
}

export async function saveCustomFontDB(font: CustomFontData): Promise<void> {
  try {
    const docRef = doc(db, "config", "custom_font");
    await setDoc(docRef, font);
  } catch (error) {
    console.warn("[Offline/Sync Notice] Error saving custom font:", error);
    throw error;
  }
}

export async function clearCustomFontDB(): Promise<void> {
  try {
    await deleteDoc(doc(db, "config", "custom_font"));
  } catch (error) {
    console.warn("[Offline/Sync Notice] Error clearing custom font:", error);
  }
}

export function subscribeCustomFont(onUpdate: (font: CustomFontData | null) => void): () => void {
  const docRef = doc(db, "config", "custom_font");
  return onSnapshot(
    docRef,
    (docSnap) => {
      onUpdate(docSnap.exists() ? (docSnap.data() as CustomFontData) : null);
    },
    (error) => {
      console.warn("Error in live custom font subscription:", error);
    }
  );
}

