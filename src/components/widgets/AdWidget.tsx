import React from 'react';
import { 
  IonCard, 
  IonCardContent
} from '@ionic/react';
import { AdTypeTypes } from '../../types/Ad';
import { useRandomAdByType } from '../../hooks/useContent';

interface AdWidgetProps {
  className?: string;
  type: AdTypeTypes;
}

const AdWidget: React.FC<AdWidgetProps> = ({ className, type }) => {
  const { data: ad, loading, error } = useRandomAdByType(type);

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className={className}>
        <IonCard>
          <IonCardContent>
            <div className="text-center p-5 bg-gray-100 rounded-lg">
              <p className="m-0 text-gray-600">Loading advertisement...</p>
            </div>
          </IonCardContent>
        </IonCard>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className={className}>
        <IonCard>
          <IonCardContent>
            <div className="text-center p-5 bg-gray-100 rounded-lg">
              <p className="m-0 text-gray-600">Advertisement Space ({type})</p>
            </div>
          </IonCardContent>
        </IonCard>
      </div>
    );
  }

  return (
    <div className={className}>
      <div 
        onClick={() => openLink(ad.linkURL)}
        className="cursor-pointer"
      >
        <img 
          src={ad.imageURL} 
          alt={ad.name}
          className="w-full h-auto rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default AdWidget;