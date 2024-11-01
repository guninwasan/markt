import React, { useState } from "react";
import styled from "styled-components";

const GalleryContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const CarouselContent = styled.div`
  position: relative;
  max-width: 70%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 8px;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

const MediaWrapper = styled.div`
  width: 100%;
  height: 60vh;
  overflow: hidden;
  position: relative;
  cursor: zoom-in;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ZoomedImage = styled.img<{
  isZoomed: boolean;
  offsetX: number;
  offsetY: number;
}>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  transform: ${({ isZoomed, offsetX, offsetY }) =>
    isZoomed ? `scale(1.8) translate(${offsetX}%, ${offsetY}%)` : "scale(1)"};
  cursor: ${({ isZoomed }) => (isZoomed ? "zoom-out" : "zoom-in")};
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  overflow-x: auto;
  justify-content: center;
`;

const Thumbnail = styled.div<{ active: boolean }>`
  width: 60px;
  height: 60px;
  overflow: hidden;
  border: ${({ active }) =>
    active ? "2px solid #fff" : "2px solid transparent"};
  transition: transform 0.2s ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ThumbnailVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NavButton = styled.button`
  background: rgba(255, 255, 255, 0.6);
  border: none;
  font-size: 30px;
  color: #333;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: background 0.3s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }
`;

const PrevButton = styled(NavButton)`
  left: -50px;
`;

const NextButton = styled(NavButton)`
  right: -50px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #fff;
  font-size: 30px;
  cursor: pointer;
  &:hover {
    color: #ff5f5f;
  }
`;

const detectMediaType = (url: string): "image" | "video" => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  const videoExtensions = [".mp4", ".webm", ".ogg"];
  const extension = url.split(".").pop()?.toLowerCase();
  return extension && videoExtensions.includes(`.${extension}`)
    ? "video"
    : "image";
};

interface ImageGalleryProps {
  mediaUrls: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ mediaUrls }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const mediaItems = mediaUrls.map((url) => ({
    src: url,
    type: detectMediaType(url),
  }));

  const handleMediaClick = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsZoomed(false);
  };

  const goToNextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % mediaUrls.length);
  };

  const goToPrevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? mediaUrls.length - 1 : prev - 1));
  };

  const toggleZoom = () => setIsZoomed(!isZoomed);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isZoomed) {
      const { offsetX, offsetY, target } = e.nativeEvent;
      const { width, height } = target as any;
      const offsetXPercent = ((offsetX / width) * 2 - 1) * 25;
      const offsetYPercent = ((offsetY / height) * 2 - 1) * 25;
      setZoomPosition({ x: offsetXPercent, y: offsetYPercent });
    }
  };

  return (
    <>
      <GalleryContainer>
        {mediaItems.slice(0, 4).map((item, index) => (
          <ImageWrapper key={index} onClick={() => handleMediaClick(index)}>
            {item.type === "image" ? (
              <ThumbnailImage src={item.src} />
            ) : (
              <ThumbnailVideo src={item.src} controls muted />
            )}
          </ImageWrapper>
        ))}
      </GalleryContainer>

      {isModalOpen && (
        <ModalContainer>
          <CloseButton onClick={closeModal}>✕</CloseButton>
          <CarouselContent>
            <PrevButton onClick={goToPrevMedia}>❮</PrevButton>
            <MediaWrapper onClick={toggleZoom} onMouseMove={handleMouseMove}>
              {mediaItems[currentIndex].type === "image" ? (
                <ZoomedImage
                  src={mediaItems[currentIndex].src}
                  isZoomed={isZoomed}
                  offsetX={zoomPosition.x}
                  offsetY={zoomPosition.y}
                />
              ) : (
                <ThumbnailVideo
                  src={mediaItems[currentIndex].src}
                  controls
                  autoPlay
                />
              )}
            </MediaWrapper>
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
          </CarouselContent>
        </ModalContainer>
      )}
    </>
  );
};

export { ImageGallery };
