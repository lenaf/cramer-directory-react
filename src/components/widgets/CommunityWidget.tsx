import React from 'react';
import { 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent
} from '@ionic/react';
import useFirestore from '../../hooks/useFirestore';
import { Community } from '../../types/Community';

const CommunityWidget: React.FC = () => {
  const { useCollection } = useFirestore();
  const { data: communities, loading, error } = useCollection<Community>(
    'community',
    [{ property: 'isActive', operator: '==', value: true }],
    [{ property: 'weight', direction: 'asc' }]
  );

  console.log('CommunityWidget - loading:', loading, 'communities:', communities, 'error:', error);

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

      <IonCardContent>
        {communities && communities.length > 0 ? (
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
            {communities.map((community) => (
              <div key={community.id} style={{ minWidth: '120px', textAlign: 'center' }}>
                <img 
                  src={community.imageURL} 
                  alt={community.name}
                  style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ marginTop: '8px', fontWeight: 'bold', fontSize: '0.9em' }}>
                  {community.name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No community content available</p>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default CommunityWidget;