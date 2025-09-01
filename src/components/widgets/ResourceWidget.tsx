import React from 'react';
import { 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent
} from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { useResources } from '../../hooks/useContent';

const ResourceWidget: React.FC = () => {
  const { data: resources, loading, error } = useResources();

  console.log('ResourceWidget - loading:', loading, 'resources:', resources, 'error:', error);

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Resources</IonCardTitle>
        </IonCardHeader>
      </IonCard>
    );
  }

  if (error) {
    return (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Resources</IonCardTitle>
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
        <IonCardTitle>News / Resources</IonCardTitle>
      </IonCardHeader>

      {resources && resources.length > 0 && (
        <IonCardContent>
          <Swiper
            slidesPerView={4}
            spaceBetween={10}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
          >
            {resources.map((resource) => (
              <SwiperSlide key={resource.id} onClick={() => openLink(resource.linkURL)}>
                <img src={resource.imageURL} />
              </SwiperSlide>
            ))}
          </Swiper>
        </IonCardContent>
      )}
    </IonCard>
  );
};

export default ResourceWidget;