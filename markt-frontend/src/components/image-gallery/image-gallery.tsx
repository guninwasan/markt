import React, { useState } from "react";
import styled from "styled-components";

const GalleryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  cursor: pointer;
  overflow: hidden;
`;

const Image = styled.img<{ blurred?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  ${({ blurred }) => blurred && `filter: blur(5px); opacity: 0.8;`}
`;

const LeftCountOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 1000;
`;

const CarouselContainer = styled.div`
  position: relative;
  max-width: 90%;
  max-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const CarouselImage = styled.img<{ scale: number }>`
  transition: transform 0.3s ease;
  transform: ${({ scale }) => `scale(${scale})`};
  max-width: 100%;
  max-height: 100%;
`;

const CarouselVideo = styled.video`
  max-width: 100%;
  max-height: 100%;
  outline: none;
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.7);
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  z-index: 1001;
`;

const PrevButton = styled(NavigationButton)`
  left: 10px;
`;

const NextButton = styled(NavigationButton)`
  right: 10px;
`;

const Magnifier = styled.div<{
  x: number;
  y: number;
  zoom: number;
  src: string;
}>`
  position: absolute;
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  width: 150px;
  height: 150px;
  background-image: url(${({ src }) => src});
  background-repeat: no-repeat;
  background-size: ${({ zoom }) => zoom * 100}%;
  border-radius: 50%;
  border: 2px solid white;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 1002;
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 10px;
`;

const Thumbnail = styled.div<{ active: boolean }>`
  width: 40px;
  height: 40px;
  border: 2px solid ${({ active }) => (active ? "white" : "transparent")};
  overflow: hidden;
  cursor: pointer;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ThumbnailVideo = styled.video`
  width: 100%;
  height: 100%;
`;

const detectMediaType = (url: string): "image" | "video" => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  const videoExtensions = [".mp4", ".webm", ".ogg"];
  const extension = url.split(".").pop()?.toLowerCase();

  if (extension && imageExtensions.includes(`.${extension}`)) return "image";
  if (extension && videoExtensions.includes(`.${extension}`)) return "video";
  return "image";
};

interface ImageGalleryProps {
  mediaUrls: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ mediaUrls }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMagnifying, setIsMagnifying] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [zoomLevel] = useState(2.5);

  const handleMediaClick = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToNextMedia = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaUrls.length);
  };

  const goToPrevMedia = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? mediaUrls.length - 1 : prevIndex - 1
    );
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { offsetX, offsetY, target } = e.nativeEvent;
    const { offsetWidth, offsetHeight } = target as HTMLImageElement;

    const x = (offsetX / offsetWidth) * 100;
    const y = (offsetY / offsetHeight) * 100;

    setMagnifierPosition({ x, y });
  };

  const handleMouseEnter = () => setIsMagnifying(true);
  const handleMouseLeave = () => setIsMagnifying(false);

  const mediaItems = mediaUrls.map((url) => ({
    src: url,
    type: detectMediaType(url),
  }));

  const displayedItems = mediaItems.slice(0, 4);

  return (
    <>
      <GalleryContainer>
        {displayedItems.map((item, index) => (
          <ImageWrapper key={index} onClick={() => handleMediaClick(index)}>
            {item.type === "image" ? (
              <Image
                src={item.src}
                blurred={index === 3 && mediaUrls.length > 4}
              />
            ) : (
              <CarouselVideo src={item.src} controls />
            )}
            {index === 3 && mediaUrls.length > 4 && (
              <LeftCountOverlay>+ {mediaUrls.length - 4} Left</LeftCountOverlay>
            )}
          </ImageWrapper>
        ))}
      </GalleryContainer>

      {isModalOpen && (
        <Modal>
          <PrevButton onClick={goToPrevMedia}>❮</PrevButton>
          <CarouselContainer
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {mediaItems[currentIndex].type === "image" ? (
              <CarouselImage src={mediaItems[currentIndex].src} scale={1} />
            ) : (
              <CarouselVideo
                src={mediaItems[currentIndex].src}
                controls
                autoPlay
              />
            )}
            {isMagnifying && mediaItems[currentIndex].type === "image" && (
              <Magnifier
                src={mediaItems[currentIndex].src}
                x={magnifierPosition.x}
                y={magnifierPosition.y}
                zoom={zoomLevel}
                style={{
                  backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                }}
              />
            )}
          </CarouselContainer>
          <NextButton onClick={goToNextMedia}>❯</NextButton>
          <ThumbnailContainer>
            {mediaItems.map((item, index) => (
              <Thumbnail
                key={index}
                active={index === currentIndex}
                onClick={() => setCurrentIndex(index)}
              >
                {item.type === "image" ? (
                  <ThumbnailImage src={item.src} />
                ) : (
                  <ThumbnailVideo src={item.src} muted />
                )}
              </Thumbnail>
            ))}
          </ThumbnailContainer>
        </Modal>
      )}
    </>
  );
};

export { ImageGallery };
