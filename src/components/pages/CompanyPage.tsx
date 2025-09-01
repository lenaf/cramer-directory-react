import React, { useState, useMemo } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonSearchbar,
  IonList,
  IonItemGroup,
  IonItemDivider,
  IonItem,
  IonThumbnail,
  IonImg,
  IonLabel,
  IonSkeletonText,
  IonText,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonButton,
  IonIcon,
  IonMenuToggle,
} from "@ionic/react";
import { useCompanySearch } from "../../hooks/useCompanies";
import { Company } from "../../types/Company";
import { menu } from "ionicons/icons";

const CompanyPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: searchResults,
    loading,
    error,
    totalCount,
  } = useCompanySearch(searchTerm);

  // Group companies by first letter
  const groupedCompanies = useMemo(() => {
    const groups: { [key: string]: Company[] } = {};

    searchResults.forEach((company) => {
      const firstLetter = (company.name || "").charAt(0).toUpperCase();
      const letter = firstLetter || "#";
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(company);
    });

    return groups;
  }, [searchResults]);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    // In a more sophisticated implementation, you might refresh data here
    setTimeout(() => {
      event.detail.complete();
    }, 1000);
  };

  const handleSearchInput = (e: CustomEvent) => {
    setSearchTerm(e.detail.value);
  };

  if (error) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="secondary">
            <IonButtons slot="start">
              <IonMenuToggle>
                <IonButton>
                  <IonIcon slot="icon-only" icon={menu}></IonIcon>
                </IonButton>
              </IonMenuToggle>
            </IonButtons>
            <IonTitle>Companies</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div style={{ textAlign: "center", padding: "20px" }}>
            <IonText color="danger">
              <h3>Error loading companies</h3>
              <p>{error.message}</p>
            </IonText>
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
            <IonMenuToggle>
              <IonButton>
                <IonIcon slot="icon-only" icon={menu}></IonIcon>
              </IonButton>
            </IonMenuToggle>{" "}
          </IonButtons>
          <IonTitle>
            <strong className="ion-text-uppercase">
              Companies
              {totalCount > 0 &&
                `(${searchTerm ? searchResults.length : totalCount})`}
            </strong>
          </IonTitle>
        </IonToolbar>

        <IonToolbar color="secondary">
          <IonSearchbar
            debounce={300}
            placeholder="Search companies..."
            animated={true}
            value={searchTerm}
            onIonInput={handleSearchInput}
            showClearButton="focus"
          />
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {loading ? (
          <IonList>
            {[1, 2, 3, 4, 5].map((index) => (
              <IonItem key={index}>
                <IonThumbnail slot="start">
                  <IonSkeletonText animated />
                </IonThumbnail>
                <IonLabel>
                  <h3>
                    <IonSkeletonText animated style={{ width: "50%" }} />
                  </h3>
                  <p>
                    <IonSkeletonText animated style={{ width: "80%" }} />
                  </p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        ) : searchResults.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <IonText color="medium">
              <h3>
                {searchTerm ? "No companies found" : "No companies available"}
              </h3>
              {searchTerm && <p>Try adjusting your search terms</p>}
            </IonText>
          </div>
        ) : (
          <IonList>
            {Object.keys(groupedCompanies)
              .sort()
              .map((letter) => (
                <IonItemGroup key={letter}>
                  <IonItemDivider color="light" sticky>
                    <IonLabel>{letter}</IonLabel>
                  </IonItemDivider>

                  {groupedCompanies[letter].map((company) => (
                    <IonItem
                      key={company.id}
                      button
                      routerLink={`/company/${company.id}`}
                    >
                      <IonThumbnail slot="start">
                        <IonImg
                          src={
                            company.logoURL ||
                            "./assets/placeholders/business-outline.svg"
                          }
                          alt={`${company.name} logo`}
                          onIonError={(e) => {
                            (e.target as HTMLIonImgElement).src =
                              "./assets/placeholders/business-outline.svg";
                          }}
                        />
                      </IonThumbnail>
                      <IonLabel>
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
                        {company.description && (
                          <p
                            className="ion-text-wrap"
                            style={{
                              fontSize: "0.9em",
                              color: "var(--ion-color-medium)",
                            }}
                          >
                            {company.description.substring(0, 100)}
                            {company.description.length > 100 && "..."}
                          </p>
                        )}
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonItemGroup>
              ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default CompanyPage;
