import React, { useState } from "react";
import styled from "styled-components";

const GalleryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
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
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const CarouselContainer = styled.div`
  position: relative;
  max-width: 80%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

const CarouselImage = styled.img<{
  scale: number;
  translateX: number;
  translateY: number;
}>`
  transition: transform 0.3s ease;
  transform-origin: center;
  cursor: ${({ scale }) => (scale > 1 ? "zoom-out" : "zoom-in")};
  max-width: 100%;
  max-height: 100%;
  transform: ${({ scale, translateX, translateY }) =>
    `scale(${scale}) translate(${translateX}%, ${translateY}%)`};
`;

const CarouselVideo = styled.video`
  max-width: 100%;
  max-height: 100%;
  outline: none;
  transition: opacity 0.3s ease;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.1);
  }
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 15px;
  justify-content: center;
  animation: fadeIn 0.4s ease;
`;

const Thumbnail = styled.div<{ active: boolean }>`
  width: 50px;
  height: 50px;
  border: 2px solid ${({ active }) => (active ? "white" : "transparent")};
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, border 0.2s ease;
  &:hover {
    transform: scale(1.1);
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
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.1);
  }
`;

const PrevButton = styled(NavigationButton)`
  left: 10px;
`;

const NextButton = styled(NavigationButton)`
  right: 10px;
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
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const handleMediaClick = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  const goToNextMedia = () =>
    setCurrentIndex((prev) => (prev + 1) % mediaUrls.length);
  const goToPrevMedia = () =>
    setCurrentIndex((prev) => (prev === 0 ? mediaUrls.length - 1 : prev - 1));

  const toggleZoom = (e: React.MouseEvent<HTMLImageElement>) => {
    if (scale > 1) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    } else {
      setScale(2);
      const { offsetX, offsetY, target } = e.nativeEvent;
      const { width, height } = target as HTMLImageElement;
      const translateX = ((offsetX / width) * 100 - 50) * 0.5;
      const translateY = ((offsetY / height) * 100 - 50) * 0.5;
      setTranslate({ x: translateX, y: translateY });
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = "none";
  };

  const mediaItems = mediaUrls.map((url) => ({
    src: url,
    type: detectMediaType(url),
  }));

  return (
    <>
      <GalleryContainer>
        {mediaItems.slice(0, 4).map((item, index) => (
          <ImageWrapper key={index} onClick={() => handleMediaClick(index)}>
            {item.type === "image" ? (
              <Image
                src={item.src}
                onError={handleImageError}
                blurred={index === 3 && mediaItems.length > 4}
              />
            ) : (
              <ThumbnailVideo src={item.src} controls muted />
            )}
            {index === 3 && mediaItems.length > 4 && (
              <LeftCountOverlay>
                + {mediaItems.length - 4} Left
              </LeftCountOverlay>
            )}
          </ImageWrapper>
        ))}
      </GalleryContainer>

      {isModalOpen && (
        <Modal onClick={closeModal}>
          <CloseButton onClick={closeModal}>✕</CloseButton>
          <CarouselContainer onClick={(e) => e.stopPropagation()}>
            <PrevButton onClick={goToPrevMedia}>❮</PrevButton>
            {mediaItems[currentIndex].type === "image" ? (
              <CarouselImage
                src={mediaItems[currentIndex].src}
                onClick={toggleZoom}
                scale={scale}
                translateX={translate.x}
                translateY={translate.y}
                onError={handleImageError}
              />
            ) : (
              <CarouselVideo
                src={mediaItems[currentIndex].src}
                controls
                autoPlay
              />
            )}
            <NextButton onClick={goToNextMedia}>❯</NextButton>
          </CarouselContainer>
          <ThumbnailContainer>
            {mediaItems.map((item, index) => (
              <Thumbnail
                key={index}
                active={index === currentIndex}
                onClick={() => setCurrentIndex(index)}
              >
                {item.type === "image" ? (
                  <ThumbnailImage src={item.src} onError={handleImageError} />
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
