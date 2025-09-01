import React from "react";
import { IonHeader, IonMenuToggle } from "@ionic/react";
import {
  IonMenu,
  IonContent,
  IonImg,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
} from "@ionic/react";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../routes";
import { SPLIT_PLANE_CONTENT_ID } from "../App";

const SideMenu: React.FC = () => {
  const location = useLocation();
  const currentRoute =
    ROUTES.find((t) => t.path === location.pathname) || ROUTES[0];

  return (
    <IonMenu contentId={SPLIT_PLANE_CONTENT_ID} className="shadow-md max-w-60">
      <h4 className="bg-secondary h-16 flex px-8 py-4">
        <IonImg src="/assets/branding/logo.png" alt="logo" />
      </h4>

      <IonContent className="ion-padding" color="secondary">
        {ROUTES.map((route) => {
          const isActive = currentRoute.path === route.path;
          return (
            <IonMenuToggle key={route.id} autoHide={false}>
              <IonItem
                color={isActive ? "secondary" : "secondary-tint"}
                button
                routerLink={route.path}
              >
                <IonIcon slot="start" icon={route.icon} />
                <IonLabel className={isActive ? "text-white font-bold" : ""}>
                  {route.label}
                </IonLabel>
              </IonItem>
            </IonMenuToggle>
          );
        })}
      </IonContent>
    </IonMenu>
  );
};

export default SideMenu;
