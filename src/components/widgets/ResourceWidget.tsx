import React from 'react';
import { 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent
} from '@ionic/react';
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
        <IonCardTitle>Resources</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        {resources && resources.length > 0 ? (
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
            {resources.map((resource) => (
              <div 
                key={resource.id} 
                style={{ minWidth: '120px', textAlign: 'center', cursor: 'pointer' }}
                onClick={() => openLink(resource.linkURL)}
              >
                <img 
                  src={resource.imageURL} 
                  alt={resource.name}
                  style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ marginTop: '8px', fontWeight: 'bold', fontSize: '0.9em' }}>
                  {resource.name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No resources available</p>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default ResourceWidget;