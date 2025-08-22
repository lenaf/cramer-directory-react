import { 
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    confirmPasswordReset,
    verifyPasswordResetCode,
    createUserWithEmailAndPassword,
    User as FirebaseUser
} from 'firebase/auth';
import { BehaviorSubject, Observable, combineLatest, map, switchMap, distinctUntilChanged, of, catchError } from 'rxjs';
import { Auth as FirebaseAuth } from 'firebase/auth';
import { Auth, getPermissionIds } from '../types/Auth';
import { User } from '../types/User';
import { FirestoreService } from './FirestoreService';

export class AuthService {
    private _auth$ = new BehaviorSubject<Auth | null>(null);
    private auth: FirebaseAuth;
    private firestoreService: FirestoreService;

    constructor(auth: FirebaseAuth, firestoreService: FirestoreService) {
        this.auth = auth;
        this.firestoreService = firestoreService;
        this.initializeAuth();
    }

    get auth$(): Observable<Auth | null> {
        return this._auth$.asObservable();
    }

    private initializeAuth() {
        // Listen to auth state changes
        this.auth.onAuthStateChanged((firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                // Get user data from Firestore
                this.firestoreService.doc$<User>(`user/${firebaseUser.uid}`).pipe(
                    distinctUntilChanged(),
                    switchMap((user: User) => {
                        // Get role data if roleId exists
                        if (user.roleId) {
                            return this.firestoreService.doc$<any>(`role/${user.roleId}`).pipe(
                                catchError(() => of({})),
                                map((role: any) => ({ user, role }))
                            );
                        } else {
                            return of({ user, role: {} });
                        }
                    }),
                    map(({ user, role }) => ({ ...firebaseUser, user, role } as Auth))
                ).subscribe({
                    next: (auth) => this._auth$.next(auth),
                    error: (error) => {
                        console.error('Error fetching user data:', error);
                        this._auth$.next(null);
                    }
                });
            } else {
                this._auth$.next(null);
            }
        });
    }

    async signInWithEmailAndPassword(email: string, password: string) {
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    async createUserWithEmailAndPassword(email: string, password: string) {
        return createUserWithEmailAndPassword(this.auth, email, password);
    }

    async signOut() {
        return signOut(this.auth);
    }

    async sendPasswordResetEmail(email: string) {
        return sendPasswordResetEmail(this.auth, email);
    }

    async confirmPasswordReset(oobCode: string, newPassword: string) {
        return confirmPasswordReset(this.auth, oobCode, newPassword);
    }

    async verifyPasswordResetCode(oobCode: string) {
        return verifyPasswordResetCode(this.auth, oobCode);
    }

    getCurrentUser(): Observable<Auth | null> {
        return this._auth$.asObservable();
    }

    isAuthenticated(): Observable<boolean> {
        return this._auth$.pipe(
            map(auth => auth !== null)
        );
    }

    hasPermission(permissionId: string): Observable<boolean> {
        return this._auth$.pipe(
            map(auth => {
                if (!auth) return false;
                const permissions = getPermissionIds(auth);
                return permissions.includes(permissionId);
            })
        );
    }

    hasAnyPermission(permissionIds: string[]): Observable<boolean> {
        return this._auth$.pipe(
            map(auth => {
                if (!auth) return false;
                const permissions = getPermissionIds(auth);
                return permissionIds.some(permissionId => permissions.includes(permissionId));
            })
        );
    }
}