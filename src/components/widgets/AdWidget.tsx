import React from 'react';
import { 
  IonCard, 
  IonCardContent
} from '@ionic/react';

interface AdWidgetProps {
  className?: string;
}

const AdWidget: React.FC<AdWidgetProps> = ({ className }) => {
  return (
    <div className={className}>
      <IonCard>
        <IonCardContent>
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <p style={{ margin: 0, color: '#666' }}>Advertisement Space</p>
          </div>
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default AdWidget;