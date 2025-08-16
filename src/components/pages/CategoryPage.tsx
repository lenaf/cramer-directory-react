import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonSearchbar
} from '@ionic/react';

const CategoryPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>
            <strong className="ion-text-uppercase">Categories</strong>
          </IonTitle>
        </IonToolbar>
        
        <IonToolbar color="secondary">
          <IonSearchbar 
            debounce={500} 
            placeholder="Search categories..." 
            animated={true}
          />
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        {/* Category list and details will be implemented */}
      </IonContent>
    </IonPage>
  );
};

export default CategoryPage;