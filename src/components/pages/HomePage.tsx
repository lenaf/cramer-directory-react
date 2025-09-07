import React from "react";
import {
  IonContent,
  IonPage,
  IonToolbar,
  IonSearchbar,
} from "@ionic/react";

import PillarWidget from "../widgets/PillarWidget";
import EventWidget from "../widgets/EventWidget";
import AdWidget from "../widgets/AdWidget";
import ResourceWidget from "../widgets/ResourceWidget";
import CommunityWidget from "../widgets/CommunityWidget";
import TopNavBar from "../shared/TopNavBar";


const HomePage: React.FC = () => {
  return (
    <IonPage>
      <TopNavBar title="Cramer" subtitle="Directory" />
      
      <IonToolbar color="secondary">
        <IonSearchbar
          debounce={500}
          placeholder="Search..."
          animated={true}
        />
      </IonToolbar>

      <IonContent>
        <PillarWidget />
        <EventWidget />
        <AdWidget className="ion-padding-horizontal" type="banner" />
        <ResourceWidget />
        <CommunityWidget />
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
