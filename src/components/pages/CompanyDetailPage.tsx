import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButtons,
  IonButton,
  IonCard,
  IonCardHeader,
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
  IonLoading,
} from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import {
  pricetagOutline,
  informationCircleOutline,
  locationOutline,
  arrowBackOutline,
} from "ionicons/icons";
import { useCompany } from "../../hooks/useCompanies";
import { usePeopleByCompany } from "../../hooks/usePeople";
import DetailHeader from "../shared/DetailHeader";
import AdWidget from "../widgets/AdWidget";
import { getPreviousRouteName } from "../../utils/navigation";
import { cacheEntity, cacheEntityName } from "../../utils/cache";

const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { data: company, loading, error } = useCompany(id);
  const { data: people } = usePeopleByCompany(id);

  // Cache company data and name when loaded
  if (company) {
    cacheEntity(company.id, company);
    cacheEntityName(company.id, company.name);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButtons slot="start">
            <IonButton fill="clear" onClick={() => history.goBack()}>
              <IonIcon icon={arrowBackOutline} slot="start" />
              {getPreviousRouteName(history)}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? (
          <IonLoading />
        ) : error || !company ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h3>Company not found</h3>
          </div>
        ) : company ? (
          <div>
            <DetailHeader
              title={company.name}
              subtitle={
                company.postalAddress
                  ? `${company.postalAddress.city}, ${company.postalAddress.state}`
                  : undefined
              }
              imageUrl={company.logoURL}
              fallbackImage="/assets/placeholders/business-outline.svg"
            />

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
                                style={{
                                  marginRight: "4px",
                                  marginBottom: "4px",
                                }}
                              >
                                {typeof category === "string"
                                  ? category
                                  : JSON.stringify(category)}
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
          </div>
        ) : null}

        {/* Ad Widget */}
        <IonCard>
          <AdWidget type="full" />
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default CompanyDetailPage;
