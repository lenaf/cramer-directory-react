import { useState, useEffect, useMemo, useCallback } from "react";
import { User } from "../types/User";
import { Company } from "../types/Company";
import { Person } from "../types/Person";
import { useFirestoreDocument } from "./useFirestoreDocument";
import { useFirestoreMutations } from "./useFirestoreMutations";
import { useAuthContext } from "../contexts/AuthContext";

// Hook for user profile
export function useUser(userId?: string) {
  const { user } = useAuthContext();
  const effectiveUserId = userId || user?.uid;

  return useFirestoreDocument<User>(
    effectiveUserId ? `user/${effectiveUserId}` : "",
    { enabled: !!effectiveUserId }
  );
}

// Hook for user mutations
export function useUserMutations() {
  const mutations = useFirestoreMutations();

  const createUser = useCallback(
    async (userId: string, userData: Omit<User, "id">) => {
      const userDoc = {
        ...userData,
        id: userId,
        favoriteIds: userData.favoriteIds || [],
        isActive: true,
      };
      return mutations.setDocument(`user/${userId}`, userDoc);
    },
    [mutations]
  );

  const updateUser = useCallback(
    async (userId: string, userData: Partial<User>) => {
      return mutations.updateDocument(`user/${userId}`, userData);
    },
    [mutations]
  );

  const addFavorite = useCallback(
    async (userId: string, itemId: string) => {
      return mutations.addToArray(`user/${userId}`, "favoriteIds", itemId);
    },
    [mutations]
  );

  const removeFavorite = useCallback(
    async (userId: string, itemId: string) => {
      return mutations.removeFromArray(`user/${userId}`, "favoriteIds", itemId);
    },
    [mutations]
  );

  return {
    createUser,
    updateUser,
    addFavorite,
    removeFavorite,
    ...mutations.state,
  };
}

// Hook for managing favorites
export function useFavorites(userId?: string) {
  const { user } = useAuthContext();
  const effectiveUserId = userId || user?.uid;
  const mutations = useUserMutations();

  const { data: userData, loading, error } = useUser(effectiveUserId);

  const favoriteIds = useMemo(() => userData?.favoriteIds || [], [userData]);

  const isFavorite = useCallback(
    (itemId: string) => {
      return favoriteIds.includes(itemId);
    },
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (itemId: string) => {
      if (!effectiveUserId) return;

      if (isFavorite(itemId)) {
        await mutations.removeFavorite(effectiveUserId, itemId);
      } else {
        await mutations.addFavorite(effectiveUserId, itemId);
      }
    },
    [effectiveUserId, isFavorite, mutations]
  );

  const addFavorite = useCallback(
    async (itemId: string) => {
      if (!effectiveUserId || isFavorite(itemId)) return;
      await mutations.addFavorite(effectiveUserId, itemId);
    },
    [effectiveUserId, isFavorite, mutations]
  );

  const removeFavorite = useCallback(
    async (itemId: string) => {
      if (!effectiveUserId || !isFavorite(itemId)) return;
      await mutations.removeFavorite(effectiveUserId, itemId);
    },
    [effectiveUserId, isFavorite, mutations]
  );

  return {
    favoriteIds,
    loading,
    error,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    mutationState: mutations,
  };
}

// Hook for getting favorite companies with proper async handling
export function useFavoriteCompanies(userId?: string) {
  const { favoriteIds } = useFavorites(userId);
  const mutations = useFirestoreMutations();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFavoriteCompanies = async () => {
      if (!favoriteIds.length) {
        setCompanies([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const companyPromises = favoriteIds.map(async (id) => {
          try {
            const company = await mutations.getDocument<Company>(
              `company/${id}`
            );
            return company && company.isActive ? company : null;
          } catch (err) {
            console.warn(`Failed to fetch favorite company ${id}:`, err);
            return null;
          }
        });

        const results = await Promise.all(companyPromises);
        const validCompanies = results.filter(
          (company): company is Company => company !== null
        );

        // Sort by name
        validCompanies.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );

        if (isMounted) {
          setCompanies(validCompanies);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };

    fetchFavoriteCompanies();

    return () => {
      isMounted = false;
    };
  }, [favoriteIds, mutations]);

  return { data: companies, loading, error };
}

// Hook for getting favorite people with proper async handling
export function useFavoritePeople(userId?: string) {
  const { favoriteIds } = useFavorites(userId);
  const mutations = useFirestoreMutations();

  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFavoritePeople = async () => {
      if (!favoriteIds.length) {
        setPeople([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const personPromises = favoriteIds.map(async (id) => {
          try {
            const person = await mutations.getDocument<Person>(`person/${id}`);
            return person && person.isActive ? person : null;
          } catch (err) {
            console.warn(`Failed to fetch favorite person ${id}:`, err);
            return null;
          }
        });

        const results = await Promise.all(personPromises);
        const validPeople = results.filter(
          (person): person is Person => person !== null
        );

        // Sort by name
        validPeople.sort(
          (a, b) =>
            (a.firstName || "").localeCompare(b.firstName || "") ||
            (a.lastName || "").localeCompare(b.lastName || "")
        );

        if (isMounted) {
          setPeople(validPeople);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };

    fetchFavoritePeople();

    return () => {
      isMounted = false;
    };
  }, [favoriteIds, mutations]);

  return { data: people, loading, error };
}
