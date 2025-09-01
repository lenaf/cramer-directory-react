import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonAvatar,
  IonImg,
  IonButton,
  IonIcon
} from '@ionic/react';
import { starOutline, star } from 'ionicons/icons';

interface DetailHeaderProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  fallbackImage: string;
  showFavoriteButton?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  children?: React.ReactNode;
}

const DetailHeader: React.FC<DetailHeaderProps> = ({
  title,
  subtitle,
  imageUrl,
  fallbackImage,
  showFavoriteButton = false,
  isFavorite = false,
  onFavoriteToggle,
  children
}) => {
  return (
    <div className="header relative" style={{ paddingTop: '224px' }}>
      <div
        className="header_background fixed top-0 left-0 right-0 w-full bg-gradient-to-br from-secondary via-secondary-tint to-secondary rounded-b-lg"
        style={{ height: '400px' }}
      />
      <IonCard
        className="relative overflow-visible"
        style={{
          marginTop: '-90px',
          paddingTop: '80px',
          contain: 'inherit',
        }}
      >
        <IonAvatar
          className="block absolute box-border left-0 right-0 mx-auto text-center border-8 border-secondary bg-white shadow-2xl"
          style={{ top: '-110px', width: '196px', height: '196px' }}
        >
          <IonImg
            src={imageUrl || fallbackImage}
            alt="avatar"
            onIonError={(e) => {
              (e.target as HTMLIonImgElement).src = fallbackImage;
            }}
          />
        </IonAvatar>

        <IonCardHeader className="ion-text-center">
          <IonCardTitle>{title}</IonCardTitle>
          {subtitle && <IonCardSubtitle>{subtitle}</IonCardSubtitle>}
        </IonCardHeader>

        {(showFavoriteButton || children) && (
          <IonCardContent>
            {showFavoriteButton && (
              <IonButton
                color={isFavorite ? 'danger' : 'primary'}
                expand="block"
                fill="outline"
                onClick={onFavoriteToggle}
              >
                <IonIcon slot="start" icon={isFavorite ? star : starOutline} />
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </IonButton>
            )}
            {children}
          </IonCardContent>
        )}
      </IonCard>
    </div>
  );
};

export default DetailHeader;