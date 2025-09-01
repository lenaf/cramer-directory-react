import React from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from "@ionic/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { usePillars } from "../../hooks/useContent";

const PillarWidget: React.FC = () => {
  const { data: pillars, loading, error } = usePillars();

  console.log(
    "PillarWidget - loading:",
    loading,
    "pillars:",
    pillars,
    "error:",
    error
  );

  if (loading) {
    return (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Four Pillars</IonCardTitle>
          <IonCardSubtitle>Loading...</IonCardSubtitle>
        </IonCardHeader>
      </IonCard>
    );
  }

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Four Pillars</IonCardTitle>
        <IonCardSubtitle>Cramer & Associates</IonCardSubtitle>
      </IonCardHeader>

      {pillars && pillars.length > 0 && (
        <IonCardContent>
          <Swiper
            slidesPerView={4}
            spaceBetween={10}
            // pagination={{ clickable: true }}
            modules={[Pagination]}
          >
            {pillars.map((pillar) => (
              <SwiperSlide key={pillar.id}>
                <img alt={pillar.name} src={pillar.imageURL} />
              </SwiperSlide>
            ))}
          </Swiper>
        </IonCardContent>
      )}
    </IonCard>
  );
};

export default PillarWidget;
