import React from 'react';
import { 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardContent,
  IonButton
} from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useEvents } from '../../hooks/useEvents';

const EventWidget: React.FC = () => {
  const { data: events, loading, error } = useEvents();

  console.log('EventWidget - loading:', loading, 'events:', events, 'error:', error);

  const openLink = (url: string) => {
    window.open(url, '_blank');
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
          >
            {events.map((event) => (
              <SwiperSlide key={event.id}>
                <img src={event.imageURL} />
                <div className="slide-content">
                  <div className="subtitle">
                    {event.startDate ? new Date(event.startDate.seconds * 1000).toLocaleDateString() : ''}
                  </div>
                  <div className="title">
                    {event.title}
                  </div>
                  <div className="subtitle">
                    {event.location.city}, {event.location.state}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </IonCardContent>
      )}

      <div className="ion-padding-horizontal ion-padding-bottom">
        <IonButton fill="clear" expand="block" onClick={() => openLink('https://www.jackcramer.com/roundtables')}>
          View All Events
        </IonButton>
      </div>
    </IonCard>
  );
};

export default EventWidget;