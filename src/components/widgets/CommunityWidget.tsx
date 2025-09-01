import React from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useCommunity } from "../../hooks/useContent";

const CommunityWidget: React.FC = () => {
  const { data: communities, loading, error } = useCommunity();

  console.log(
    "CommunityWidget - loading:",
    loading,
    "communities:",
    communities,
    "error:",
    error
  );

  if (loading) {
    return (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Cramer Community</IonCardTitle>
        </IonCardHeader>
      </IonCard>
    );
  }

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Cramer Community</IonCardTitle>
      </IonCardHeader>

      {communities && communities.length > 0 && (
        <IonCardContent>
          <Swiper
            slidesPerView={3}
            spaceBetween={10}
            pagination={{ clickable: true }}
            modules={[Pagination]}
          >
            {communities.map((community) => (
              <SwiperSlide key={community.id}>
                <img src={community.imageURL} />
              </SwiperSlide>
            ))}
          </Swiper>
        </IonCardContent>
      )}
    </IonCard>
  );
};

export default CommunityWidget;
