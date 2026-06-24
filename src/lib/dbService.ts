import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  getDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "./firebase";
import { Project, Service, Skill, ContactMessage, SiteConfig, ClientReview, AdminUser } from "../types";

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

// 7. SHA-256 Client-side hashing for password protection (Web standards compatible)
export async function hashPassword(password: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// 8. Admin authentication database operations with local storage resilient fallbacks
export async function getAdminUserDB(email: string): Promise<AdminUser | null> {
  const trimmedEmail = email.toLowerCase().trim();
  const isDefaultAdmin = trimmedEmail === 'malikalwesabi@gmail.com' || 
                         trimmedEmail === 'admin@malek.art' || 
                         trimmedEmail === 'admin@malek';

  try {
    const docRef = doc(db, "admin_users", trimmedEmail);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as AdminUser;
      localStorage.setItem(`malek_admin_${trimmedEmail}`, JSON.stringify(data));
      return data;
    } else if (isDefaultAdmin) {
      // If default admin does not exist in Cloud, seed it on-the-fly
      const defaultAdmin: AdminUser = {
        email: trimmedEmail,
        passwordHash: "",
        isFirstLogin: true,
        createdAt: new Date().toISOString()
      };
      await saveAdminUserDB(defaultAdmin);
      return defaultAdmin;
    }
  } catch (error) {
    console.warn("[Offline/Sync Notice] Error fetching admin user from cloud:", error);
  }
  
  // Try local fallback
  const local = localStorage.getItem(`malek_admin_${trimmedEmail}`);
  if (local) {
    try {
      return JSON.parse(local) as AdminUser;
    } catch (e) {}
  } else if (isDefaultAdmin) {
    // If absolutely offline and no local record, create a local-only default admin
    const defaultAdmin: AdminUser = {
      email: trimmedEmail,
      passwordHash: "",
      isFirstLogin: true,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(`malek_admin_${trimmedEmail}`, JSON.stringify(defaultAdmin));
    return defaultAdmin;
  }
  return null;
}

export async function saveAdminUserDB(admin: AdminUser): Promise<void> {
  const trimmedEmail = admin.email.toLowerCase().trim();
  // Always write to local storage first for resilience
  localStorage.setItem(`malek_admin_${trimmedEmail}`, JSON.stringify(admin));
  
  try {
    const docRef = doc(db, "admin_users", trimmedEmail);
    await setDoc(docRef, admin);
  } catch (error) {
    console.warn("[Offline/Sync Notice] Error saving admin user to cloud:", error);
    // Do not throw error so local operations can continue seamlessly
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

