import React from "react";
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
  IonAvatar,
  IonImg,
  IonLabel,
  IonFooter,
  IonSegment,
  IonSegmentButton,
  IonSkeletonText,
  IonMenuToggle,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { usePeople } from "../../hooks/usePeople";
import { Person } from "../../types/Person";
import { menu } from "ionicons/icons";

const PeoplePage: React.FC = () => {
  const { data: people, loading, error } = usePeople();

  // Group people by first letter of last name
  const groupPeopleByLetter = (people: Person[]) => {
    const groups: { [key: string]: Person[] } = {};

    people.forEach((person) => {
      const firstLetter = (person.lastName || "").charAt(0).toUpperCase();
      const letter = firstLetter || "#";
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(person);
    });

    return groups;
  };

  const groupedPeople = people ? groupPeopleByLetter(people) : {};
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
          <IonTitle>
            <strong className="ion-text-uppercase">People</strong>
          </IonTitle>
        </IonToolbar>

        <IonToolbar color="secondary">
          <IonSearchbar
            debounce={500}
            placeholder="Search people..."
            animated={true}
          />
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {loading ? (
          <IonList>
            {[1, 2, 3, 4, 5].map((index) => (
              <IonItem key={index}>
                <IonAvatar slot="start">
                  <IonSkeletonText animated />
                </IonAvatar>
                <IonLabel>
                  <h3>
                    <IonSkeletonText animated style={{ width: "50%" }} />
                  </h3>
                  <p>
                    <IonSkeletonText animated style={{ width: "80%" }} />
                  </p>
                  <p>
                    <IonSkeletonText animated style={{ width: "60%" }} />
                  </p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p>Error loading people. Please try again.</p>
          </div>
        ) : (
          <IonList>
            {Object.keys(groupedPeople)
              .sort()
              .map((letter) => (
                <IonItemGroup key={letter}>
                  <IonItemDivider color="light" sticky>
                    <IonLabel>{letter}</IonLabel>
                  </IonItemDivider>

                  {groupedPeople[letter].map((person) => (
                    <IonItem key={person.id} button>
                      <IonAvatar slot="start">
                        <IonImg
                          src={
                            person.imageURL ||
                            person.photoURL ||
                            "./assets/placeholders/person-circle-outline.svg"
                          }
                          alt="avatar"
                          onIonError={(e) => {
                            (e.target as HTMLIonImgElement).src =
                              "./assets/placeholders/person-circle-outline.svg";
                          }}
                        />
                      </IonAvatar>
                      <IonLabel>
                        <h2>
                          {person.firstName && <span>{person.firstName} </span>}
                          {person.lastName && (
                            <strong>{person.lastName}</strong>
                          )}
                        </h2>
                        {person.company && (
                          <p>
                            {typeof person.company === "string"
                              ? person.company
                              : person.company.name}
                          </p>
                        )}
                        {person.jobTitle && <p>{person.jobTitle}</p>}
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonItemGroup>
              ))}
          </IonList>
        )}
      </IonContent>

      <IonFooter translucent>
        <IonToolbar color="secondary">
          <IonSegment value="all">
            <IonSegmentButton value="all">
              <IonLabel>All {people && `(${people.length})`}</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="favorites">
              <IonLabel>Favorites (0)</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default PeoplePage;
