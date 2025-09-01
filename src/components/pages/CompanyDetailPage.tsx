import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonAvatar,
  IonImg,
  IonList,
  IonItemGroup,
  IonItem,
  IonIcon,
  IonLabel,
  IonChip,
  IonTitle,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import {
  pricetagOutline,
  informationCircleOutline,
  locationOutline,
} from "ionicons/icons";
import { useCompany } from "../../hooks/useCompanies";
import { usePeopleByCompany } from "../../hooks/usePeople";
import AdWidget from "../widgets/AdWidget";
import { ROUTES } from "../../routes";

const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: company, loading, error } = useCompany(id);
  const { data: people } = usePeopleByCompany(id);

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="secondary">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/company" />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
        </IonContent>
      </IonPage>
    );
  }

  if (error || !company) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="secondary">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/company" />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h3>Company not found</h3>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/company" text="Companies" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Header Card */}
        <div className="header relative" style={{ paddingTop: "224px" }}>
          <div
            className="header_background fixed top-0 left-0 right-0 w-full bg-gradient-to-br from-secondary via-secondary-tint to-secondary rounded-b-lg"
            style={{ height: "400px" }}
          ></div>
          <IonCard
            className="relative overflow-visible"
            style={{
              marginTop: "-90px",
              paddingTop: "80px",
              contain: "inherit",
            }}
          >
            <IonAvatar
              className="block absolute box-border left-0 right-0 mx-auto text-center border-8 border-secondary bg-white shadow-2xl"
              style={{ top: "-110px", width: "196px", height: "196px" }}
            >
              <IonImg
                src={
                  company.logoURL || "/assets/placeholders/business-outline.svg"
                }
                alt="company logo"
                onIonError={(e) => {
                  (e.target as HTMLIonImgElement).src =
                    "/assets/placeholders/business-outline.svg";
                }}
              />
            </IonAvatar>

            <IonCardHeader className="ion-text-center">
              <IonCardTitle>{company.name}</IonCardTitle>
              {company.postalAddress && (
                <IonCardSubtitle>
                  {company.postalAddress.city}, {company.postalAddress.state}
                </IonCardSubtitle>
              )}
            </IonCardHeader>
          </IonCard>
        </div>

        {/* About Card */}
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>About</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent className="ion-no-padding">
            <IonList>
              {/* Categories */}
              {company.categoryIds && company.categoryIds.length > 0 && (
                <IonItemGroup>
                  <IonItem>
                    <IonIcon icon={pricetagOutline} slot="start" />
                    <IonLabel className="ion-text-wrap">
                      <p>Categories</p>
                      <div style={{ marginTop: "8px" }}>
                        {company.categoryIds.map((category, index) => (
                          <IonChip
                            key={index}
                            outline
                            color="primary"
                            className="border border-primary"
                            style={{ marginRight: "4px", marginBottom: "4px" }}
                          >
                            {category}
                          </IonChip>
                        ))}
                      </div>
                    </IonLabel>
                  </IonItem>
                </IonItemGroup>
              )}

              {/* Description */}
              {/* {company.description && ( */}
              <IonItemGroup>
                <IonItem>
                  <IonIcon icon={informationCircleOutline} slot="start" />
                  <IonLabel className="ion-text-wrap">
                    <p>Overview</p>
                    <h3>{company.description}</h3>
                  </IonLabel>
                </IonItem>
              </IonItemGroup>
              {/* )} */}

              {/* Address */}
              {company.postalAddress && (
                <IonItem>
                  <IonIcon icon={locationOutline} slot="start" />
                  <IonLabel>
                    <p>Location</p>
                    <h3>
                      {company.postalAddress.street}
                      <br />
                      {company.postalAddress.street_2 && (
                        <>
                          {company.postalAddress.street_2}
                          <br />
                        </>
                      )}
                      {company.postalAddress.city},{" "}
                      {company.postalAddress.state}{" "}
                      {company.postalAddress.postalCode}
                    </h3>
                  </IonLabel>
                </IonItem>
              )}
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Contacts Card */}
        {people && (
          <IonCard>
            <IonCardHeader>
              <IonCardSubtitle>Contacts</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent className="ion-no-padding">
              <IonList>
                {people.length > 0 ? (
                  people.map((person) => (
                    <IonItem
                      key={person.id}
                      button
                      routerLink={`/people/${person.id}`}
                    >
                      <IonAvatar slot="start">
                        <IonImg
                          src={
                            person.photoURL ||
                            "/assets/placeholders/person-circle-outline.svg"
                          }
                          alt="avatar"
                          onIonError={(e) => {
                            (e.target as HTMLIonImgElement).src =
                              "/assets/placeholders/person-circle-outline.svg";
                          }}
                        />
                      </IonAvatar>
                      <IonLabel>
                        <h2>
                          {person.firstName} {person.lastName}
                        </h2>
                        {person.jobTitle && <p>{person.jobTitle}</p>}
                      </IonLabel>
                    </IonItem>
                  ))
                ) : (
                  <IonItem>
                    <h2>No Employees Assigned</h2>
                  </IonItem>
                )}
              </IonList>
            </IonCardContent>
          </IonCard>
        )}

        {/* Ad Widget */}
        <IonCard>
          <AdWidget type="full" />
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default CompanyDetailPage;
