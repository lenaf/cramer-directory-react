import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonSearchbar,
  IonButton,
  IonMenuToggle,
  IonIcon,
} from "@ionic/react";

import PillarWidget from "../widgets/PillarWidget";
import EventWidget from "../widgets/EventWidget";
import AdWidget from "../widgets/AdWidget";
import ResourceWidget from "../widgets/ResourceWidget";
import CommunityWidget from "../widgets/CommunityWidget";
import { menu } from "ionicons/icons";

const HomePage: React.FC = () => {
  return (
    <IonPage>
      {/* HEADER */}
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButtons slot="start">
            <IonMenuToggle>
              <IonButton>
                <IonIcon slot="icon-only" icon={menu}></IonIcon>
              </IonButton>
            </IonMenuToggle>
          </IonButtons>
          <IonTitle>
            <strong className="ion-text-uppercase">
              Cramer <span style={{ opacity: 0.5 }}>Directory</span>
            </strong>
          </IonTitle>
        </IonToolbar>

        <IonToolbar color="secondary">
          <IonSearchbar
            debounce={500}
            placeholder="Search..."
            animated={true}
          />
        </IonToolbar>
      </IonHeader>

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
