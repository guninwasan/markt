import React from 'react';
import { StarContainer, FullStarIcon, PartialStarWrapper, PartialStarIcon } from './rating.styles';
import { FaStar } from 'react-icons/fa';

type RatingProps = {
  rating: number;
};

const Rating: React.FC<RatingProps> = ({ rating }) => {
  const fullStars = Math.floor(rating); 
  const partialStar = rating - fullStars; 
  const stars = Array(5).fill(0); 

  return (
    <StarContainer>
      {stars.map((_, index) => (
        <React.Fragment key={index}>
          {index < fullStars ? (
            <FullStarIcon>
              <FaStar />
            </FullStarIcon>
          ) : index === fullStars && partialStar > 0 ? (
            <PartialStarWrapper>
              <FaStar style={{ color: '#b8adad' }} /> 
              <PartialStarIcon fillPercentage={partialStar * 100}>
                <FaStar />
              </PartialStarIcon>
            </PartialStarWrapper>
          ) : (
            <FaStar style={{ color: '#b8adad' }} /> 
          )}
        </React.Fragment>
      ))}
    </StarContainer>
  );
};

export {Rating};