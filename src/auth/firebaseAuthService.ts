import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  updatePassword, 
  sendPasswordResetEmail,
  User as FirebaseUser,
  onAuthStateChanged,
  Unsubscribe
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { IAuthService } from "./authService";
import { User, AuthResult, Permissions, Roles } from "./authTypes";

export class FirebaseAuthService implements IAuthService {
  
  private async fetchUserRoleAndPermissions(email: string): Promise<{ role: Roles; permissions: Permissions[] }> {
    try {
      const trimmedEmail = email.toLowerCase().trim();
      const adminDocRef = doc(db, "admin_users", trimmedEmail);
      const docSnap = await getDoc(adminDocRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.role === 'admin' || data.role === 'editor' || data.role === 'viewer') {
          return {
            role: data.role as Roles,
            permissions: Array.isArray(data.permissions) ? data.permissions : [
              'manage_projects', 'manage_services', 'manage_skills', 'manage_config', 'manage_users', 'read_messages', 'delete_messages', 'approve_reviews'
            ]
          };
        }
      }
      
      // Fallback for designated VITE_ADMIN_EMAIL or default admin email if recorded
      const designatedAdmin = (import.meta.env.VITE_ADMIN_EMAIL || "malikalwesabi@gmail.com").toLowerCase().trim();
      if (trimmedEmail === designatedAdmin || trimmedEmail === "admin@malek.art" || trimmedEmail === "admin@malek") {
        return {
          role: 'admin',
          permissions: [
            'manage_projects', 'manage_services', 'manage_skills', 'manage_config', 'manage_users', 'read_messages', 'delete_messages', 'approve_reviews'
          ]
        };
      }
    } catch (e) {
      console.warn("Could not fetch user role/permissions from Firestore:", e);
    }

    // Default unprivileged viewer role
    return {
      role: 'viewer',
      permissions: []
    };
  }

  public async mapFirebaseUser(fbUser: FirebaseUser): Promise<User> {
    const { role, permissions } = await this.fetchUserRoleAndPermissions(fbUser.email || "");
    return {
      id: fbUser.uid,
      email: fbUser.email || "",
      displayName: fbUser.displayName || undefined,
      role,
      permissions,
      createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
      lastLoginAt: fbUser.metadata.lastSignInTime || new Date().toISOString()
    };
  }

  public subscribeAuthState(onUserChanged: (user: User | null) => void): Unsubscribe {
    return onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const user = await this.mapFirebaseUser(fbUser);
        onUserChanged(user);
      } else {
        onUserChanged(null);
      }
    });
  }

  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = await this.mapFirebaseUser(userCredential.user);
      const token = await userCredential.user.getIdToken();

      return {
        success: true,
        user,
        session: {
          token,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          user
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to sign in with Firebase Authentication."
      };
    }
  }

  async logout(): Promise<void> {
    await firebaseSignOut(auth);
  }

  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        unsubscribe();
        if (fbUser) {
          const user = await this.mapFirebaseUser(fbUser);
          resolve(user);
        } else {
          resolve(null);
        }
      });
    });
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<AuthResult> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        return { success: false, error: "No authenticated user session found." };
      }

      await signInWithEmailAndPassword(auth, currentUser.email, oldPassword);
      await updatePassword(currentUser, newPassword);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to change password." };
    }
  }

  async resetPassword(email: string): Promise<AuthResult> {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to send password reset email." };
    }
  }

  async refreshSession(): Promise<AuthResult> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return { success: false, error: "No active Firebase session." };
      }
      const token = await currentUser.getIdToken(true);
      const user = await this.mapFirebaseUser(currentUser);
      return {
        success: true,
        user,
        session: {
          token,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          user
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  hasPermission(permission: Permissions): boolean {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;
    return true;
  }
}

export const firebaseAuthService = new FirebaseAuthService();
