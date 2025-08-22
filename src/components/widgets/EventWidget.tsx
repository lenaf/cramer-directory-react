import React from 'react';
import { 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardContent,
  IonButton
} from '@ionic/react';
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

      <IonCardContent>
        {events && events.length > 0 ? (
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
            {events.map((event) => (
              <div key={event.id} style={{ minWidth: '200px', textAlign: 'center' }}>
                <img 
                  src={event.imageURL} 
                  alt={event.title}
                  style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontSize: '0.8em', color: '#666' }}>
                    {event.startDate ? new Date(event.startDate.seconds * 1000).toLocaleDateString() : ''}
                  </div>
                  <div style={{ fontWeight: 'bold', margin: '4px 0' }}>{event.title}</div>
                  <div style={{ fontSize: '0.8em', color: '#666' }}>
                    {event.location.city}, {event.location.state}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No events available</p>
        )}
      </IonCardContent>

      <div className="ion-padding-horizontal ion-padding-bottom">
        <IonButton fill="clear" expand="block" onClick={() => openLink('https://www.jackcramer.com/roundtables')}>
          View All Events
        </IonButton>
      </div>
    </IonCard>
  );
};

export default EventWidget;