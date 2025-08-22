import React from 'react';
import { 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardContent
} from '@ionic/react';
import { usePillars } from '../../hooks/useContent';

const PillarWidget: React.FC = () => {
  const { data: pillars, loading, error } = usePillars();

  console.log('PillarWidget - loading:', loading, 'pillars:', pillars, 'error:', error);

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

      <IonCardContent>
        {pillars && pillars.length > 0 ? (
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
            {pillars.map((pillar) => (
              <div key={pillar.id} style={{ minWidth: '120px', textAlign: 'center' }}>
                <img 
                  src={pillar.imageURL} 
                  alt={pillar.name}
                  style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ marginTop: '8px', fontWeight: 'bold', fontSize: '0.9em' }}>
                  {pillar.name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No pillars available</p>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default PillarWidget;