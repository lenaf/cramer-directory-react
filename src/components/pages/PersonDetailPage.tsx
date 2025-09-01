import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItemGroup,
  IonItem,
  IonIcon,
  IonLabel,
  IonThumbnail,
  IonImg,
  IonChip,
} from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import {
  informationCircleOutline,
  constructOutline,
  phonePortraitOutline,
  mailOutline,
  callOutline,
  arrowBackOutline,
} from "ionicons/icons";
import { usePerson } from "../../hooks/usePeople";
import { useCompany } from "../../hooks/useCompanies";
import DetailHeader from "../shared/DetailHeader";
import AdWidget from "../widgets/AdWidget";
import { getPreviousRouteName } from "../../utils/navigation";
import { cacheEntity, cacheEntityName } from "../../utils/cache";

const PersonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { data: person, loading, error } = usePerson(id);
  const { data: company } = useCompany(person?.companyIds?.[0]);

  const fullName = person
    ? `${person.firstName || ""} ${person.lastName || ""}`.trim()
    : "";

  // Cache person data and name when loaded
  if (person && fullName) {
    cacheEntity(person.id, person);
    cacheEntityName(person.id, fullName);
  }

  console.log(person);

  if (loading) {
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
          <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
        </IonContent>
      </IonPage>
    );
  }

  if (error || !person) {
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
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h3>Person not found</h3>
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
            <IonButton fill="clear" onClick={() => history.goBack()}>
              <IonIcon icon={arrowBackOutline} slot="start" />
              {getPreviousRouteName(history)}
            </IonButton>
          </IonButtons>
          <IonTitle>{fullName}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Header */}
        <DetailHeader
          title={fullName}
          subtitle={person.jobTitle}
          imageUrl={person.imageURL || person.photoURL}
          fallbackImage="/assets/placeholders/person-circle-outline.svg"
          showFavoriteButton={true}
          isFavorite={false}
          onFavoriteToggle={() => {
            // TODO: Implement favorite toggle
            console.log("Toggle favorite");
          }}
        />

        {/* Contact Card */}
        {((person.emailAddresses && person.emailAddresses.length > 0) ||
          (person.phoneNumbers && person.phoneNumbers.length > 0)) && (
          <IonCard>
            <IonCardHeader>
              <IonCardSubtitle>Contact</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent className="ion-no-padding">
              <IonList>
                {/* Email Addresses */}
                {person.emailAddresses && person.emailAddresses.length > 0 && (
                  <IonItemGroup>
                    {person.emailAddresses
                      .sort((a, b) => (a.weight || 0) - (b.weight || 0))
                      .map((email, index) => (
                        <IonItem
                          key={index}
                          button
                          href={`mailto:${email.name}`}
                        >
                          <IonIcon icon={mailOutline} slot="start" />
                          <IonLabel>
                            <h3>{email.name}</h3>
                            <p>{email.label}</p>
                          </IonLabel>
                        </IonItem>
                      ))}
                  </IonItemGroup>
                )}

                {/* Phone Numbers */}
                {person.phoneNumbers && person.phoneNumbers.length > 0 && (
                  <IonItemGroup>
                    {person.phoneNumbers
                      .sort((a, b) => (a.weight || 0) - (b.weight || 0))
                      .map((phone, index) => (
                        <IonItem
                          key={index}
                          button
                          href={`tel:${phone.phoneNumber}`}
                        >
                          <IonIcon icon={callOutline} slot="start" />
                          <IonLabel>
                            <h3>{phone.phoneNumber}</h3>
                            <p>{phone.label}</p>
                          </IonLabel>
                        </IonItem>
                      ))}
                  </IonItemGroup>
                )}
              </IonList>
            </IonCardContent>
          </IonCard>
        )}

        {/* Company Card */}
        {company && (
          <IonCard>
            <IonCardHeader>
              <IonCardSubtitle>Company</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent className="ion-no-padding">
              <IonList>
                <IonItemGroup>
                  <IonItem button routerLink={`/company/${company.id}`} detail>
                    <IonThumbnail slot="start">
                      <IonImg
                        src={
                          company.logoURL ||
                          "/assets/placeholders/business-outline.svg"
                        }
                        alt="company logo"
                        onIonError={(e) => {
                          (e.target as HTMLIonImgElement).src =
                            "/assets/placeholders/business-outline.svg";
                        }}
                      />
                    </IonThumbnail>
                    <IonLabel className="ion-text-wrap">
                      <h2>{company.name}</h2>
                      {company.postalAddress && (
                        <p>
                          {company.postalAddress.city}
                          {company.postalAddress.state &&
                            company.postalAddress.city &&
                            ", "}
                          {company.postalAddress.state}
                        </p>
                      )}
                    </IonLabel>
                  </IonItem>
                </IonItemGroup>
              </IonList>
            </IonCardContent>
          </IonCard>
        )}

        {/* Profile Card */}
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Profile</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent className="ion-no-padding">
            <IonList>
              {/* About Me */}
              {person.about && (
                <IonItemGroup>
                  <IonItem>
                    <IonIcon icon={informationCircleOutline} slot="start" />
                    <IonLabel className="ion-text-wrap">
                      <p>About Me</p>
                      <h3>{person.about}</h3>
                    </IonLabel>
                  </IonItem>
                </IonItemGroup>
              )}

              {/* Roles & Responsibilities */}
              {person.responsibilities && (
                <IonItemGroup>
                  <IonItem>
                    <IonIcon icon={constructOutline} slot="start" />
                    <IonLabel className="ion-text-wrap">
                      <p>Roles & Responsibilities</p>
                      <h3>{person.responsibilities}</h3>
                    </IonLabel>
                  </IonItem>
                </IonItemGroup>
              )}

              {/* Experience */}
              {person.experience &&
                Array.isArray(person.experience) &&
                person.experience.length > 0 && (
                  <IonItemGroup>
                    <IonItem>
                      <IonIcon icon={phonePortraitOutline} slot="start" />
                      <IonLabel className="ion-text-wrap">
                        <p>Experience</p>
                        <div style={{ marginTop: "8px" }}>
                          {person.experience
                            .sort(
                              (a: any, b: any) =>
                                (a.weight || 0) - (b.weight || 0)
                            )
                            .map((exp: any, index: number) => (
                              <div key={index} style={{ marginBottom: "8px" }}>
                                <h3>{exp.title}</h3>
                              </div>
                            ))}
                        </div>
                      </IonLabel>
                    </IonItem>
                  </IonItemGroup>
                )}

              {/* Skills/Tags */}
              {person.skills && person.skills.length > 0 && (
                <IonItemGroup>
                  <IonItem>
                    <IonIcon icon={phonePortraitOutline} slot="start" />
                    <IonLabel className="ion-text-wrap">
                      <p>Skills</p>
                      <div style={{ marginTop: "8px" }}>
                        {person.skills.map((skill, index) => (
                          <IonChip
                            key={index}
                            outline
                            color="primary"
                            className="border border-primary"
                            style={{ marginRight: "4px", marginBottom: "4px" }}
                          >
                            {typeof skill === "string"
                              ? skill
                              : JSON.stringify(skill)}
                          </IonChip>
                        ))}
                      </div>
                    </IonLabel>
                  </IonItem>
                </IonItemGroup>
              )}
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Ad Widget */}
        <IonCard>
          <AdWidget type="full" />
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default PersonDetailPage;
