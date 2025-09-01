import React from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
} from "@ionic/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useEvents } from "../../hooks/useEvents";

const EventWidget: React.FC = () => {
  const { data: events, loading, error } = useEvents();

  console.log(
    "EventWidget - loading:",
    loading,
    "events:",
    events,
    "error:",
    error
  );

  const openLink = (url: string) => {
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Events</IonCardTitle>
          <IonCardSubtitle>Loading...</IonCardSubtitle>
        </IonCardHeader>
      </IonCard>
    );
  }

  if (error) {
    return (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Events</IonCardTitle>
          <IonCardSubtitle>Error loading events</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <p>Error: {error.message}</p>
        </IonCardContent>
      </IonCard>
    );
  }

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Events</IonCardTitle>
        <IonCardSubtitle>Upcoming Roundtables</IonCardSubtitle>
      </IonCardHeader>

      {events && events.length > 0 && (
        <IonCardContent>
          <Swiper
            slidesPerView={2}
            spaceBetween={10}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            style={{ paddingBottom: "30px" }}
          >
            {events.map((event) => (
              <SwiperSlide
                key={event.id}
                style={{
                  position: "relative",
                  color: "#fff",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={event.imageURL}
                  alt={event.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <div
                  className="slide-content"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    height: "100%",
                    padding: "4%",
                    background: "rgba(0,0,0,0.65)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                  }}
                >
                  <div className="subtitle" style={{ fontSize: "12px" }}>
                    {event.startDate
                      ? new Date(
                          event.startDate.seconds * 1000
                        ).toLocaleDateString()
                      : ""}
                  </div>
                  <div
                    className="title"
                    style={{ fontSize: "16px", fontWeight: 300, lineHeight: 1 }}
                  >
                    {event.title}
                  </div>
                  <div className="subtitle" style={{ fontSize: "12px" }}>
                    {event.location.city}, {event.location.state}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </IonCardContent>
      )}

      <div className="ion-padding-horizontal ion-padding-bottom">
        <IonButton
          fill="clear"
          expand="block"
          onClick={() => openLink("https://www.jackcramer.com/roundtables")}
        >
          View All Events
        </IonButton>
      </div>
    </IonCard>
  );
};

export default EventWidget;
