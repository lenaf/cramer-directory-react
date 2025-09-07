import React, { useState, useMemo } from "react";
import {
  IonContent,
  IonPage,
  IonToolbar,
  IonSearchbar,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonSkeletonText,
  IonText,
} from "@ionic/react";
import { useCategories } from "../../hooks/useCategories";
import TopNavBar from "../shared/TopNavBar";

const CategoryPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const { data: categories, loading, error } = useCategories();

  const filteredCategories = useMemo(() => {
    const activeCategories = categories.filter(
      (category) => category.isActive !== false
    );

    if (!searchText.trim()) return activeCategories;

    const term = searchText.toLowerCase();
    return activeCategories.filter(
      (category) =>
        category.name?.toLowerCase().includes(term) ||
        category.description?.toLowerCase().includes(term)
    );
  }, [categories, searchText]);

  return (
    <IonPage>
      <TopNavBar title="Categories" />
      <IonToolbar color="secondary">
        <IonSearchbar
          debounce={500}
          placeholder="Search categories..."
          animated={true}
          value={searchText}
          onIonInput={(e) => setSearchText(e.detail.value!)}
        />
      </IonToolbar>

      <IonContent>
        {error && (
          <IonText color="danger" className="ion-padding">
            <p>Error loading categories: {error.message}</p>
          </IonText>
        )}

        <IonList>
          {loading
            ? Array.from({ length: 4 }, (_, index) => (
                <IonItem key={index}>
                  <IonIcon slot="start">
                    <IonSkeletonText
                      animated
                      style={{ width: "24px", height: "24px" }}
                    />
                  </IonIcon>
                  <IonLabel>
                    <IonSkeletonText animated style={{ width: "60%" }} />
                    <IonSkeletonText animated style={{ width: "80%" }} />
                  </IonLabel>
                </IonItem>
              ))
            : filteredCategories.map((category) => (
                <IonItem key={category.id} button>
                  <IonIcon icon={category.icon} slot="start" />
                  <IonLabel>
                    <h2>{category.name}</h2>
                    {category.description && <p>{category.description}</p>}
                  </IonLabel>
                </IonItem>
              ))}
        </IonList>

        {!loading && filteredCategories.length === 0 && (
          <IonText className="ion-padding">
            <p>No categories found.</p>
          </IonText>
        )}
      </IonContent>
    </IonPage>
  );
};

export default CategoryPage;
