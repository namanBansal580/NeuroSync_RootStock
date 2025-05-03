import React from 'react';
import  {cn}  from '../../../lib/utils';



const FeatureCard = ({
  title,
  description,
  imageSrc,
  className,
  style,
  delay = 0
}) => {
  return (
    <div 
      className={cn("feature-card p-8 h-full", className)}
      style={{ 
        ...style,
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="corner-decoration top-left"></div>
      <div className="corner-decoration top-right"></div>
      <div className="corner-decoration bottom-right"></div>
      <div className="corner-decoration bottom-left"></div>
      <div className="card-inner-border"></div>
      
      <div className="flex flex-col items-center justify-between h-full">
        <div className="mb-8 relative w-32 h-32 flex items-center justify-center">
          <img 
            src={imageSrc} 
            alt={title} 
            className="feature-image w-full h-full object-contain"
            style={{ 
              filter: 'drop-shadow(0 0 8px rgba(118, 66, 245, 0.5))',
              transform: 'scale(0.9)',
            }}
          />
        </div>
        
        <div className="text-center">
          <h3 className="feature-title text-xl md:text-2xl mb-4">{title}</h3>
          <p className="feature-description text-sm md:text-base">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
