import React from "react";
import styled from "styled-components";

const GalleryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  background-color: #f0f0f0;
  border: 1px solid #ddd;
`;

const Placeholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #666;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const placeholders = 4 - images.length;

  return (
    <GalleryContainer>
      {images.map((src, index) => (
        <ImageWrapper key={index}>
          <Image src={src} alt={`Image ${index + 1}`} />
        </ImageWrapper>
      ))}
      {Array.from({ length: placeholders }).map((_, index) => (
        <ImageWrapper key={`placeholder-${index}`}>
          <Placeholder>Placeholder</Placeholder>
        </ImageWrapper>
      ))}
    </GalleryContainer>
  );
};

export { ImageGallery };
