import React, { useState } from "react";
import {
  GalleryContainer,
  ImageWrapper,
  ThumbnailImage,
  ThumbnailVideo,
  ModalContainer,
  CloseButton,
  CarouselContent,
  PrevButton,
  NextButton,
  MediaWrapper,
  ThumbnailContainer,
  Thumbnail,
  ZoomedImage,
  IndexText,
} from "./image-gallery.styles";

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
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const mediaItems = mediaUrls.map((url) => ({
    src: url,
    type: detectMediaType(url),
  }));

  const handleMediaClick = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
    setZoomPosition({ x: 0, y: 0 });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToNextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % mediaUrls.length);
    setZoomPosition({ x: 0, y: 0 });
  };

  const goToPrevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? mediaUrls.length - 1 : prev - 1));
    setZoomPosition({ x: 0, y: 0 });
  };

  // const handleMouseMove = (e: any) => {
  //   const { offsetX, offsetY, target } = e.nativeEvent;
  //   const { width, height } = target;
  //   const offsetXPercent = ((offsetX / width) * 2 - 1) * 25;
  //   const offsetYPercent = ((offsetY / height) * 2 - 1) * 25;
  //   setZoomPosition({ x: offsetXPercent, y: offsetYPercent });
  // };

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
          <CloseButton onClick={closeModal}>{"✕"}</CloseButton>
          <CarouselContent>
            <PrevButton onClick={goToPrevMedia} data-testid="prev">
              {"❮"}
            </PrevButton>
            {/* <MediaWrapper onMouseMove={handleMouseMove}> */}
            <MediaWrapper>
              {mediaItems[currentIndex].type === "image" ? (
                <ZoomedImage
                  src={mediaItems[currentIndex].src}
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
            <NextButton onClick={goToNextMedia} data-testid="next">
              {"❯"}
            </NextButton>
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
            <IndexText>
              {currentIndex + 1}/{mediaItems.length}
            </IndexText>
          </CarouselContent>
        </ModalContainer>
      )}
    </>
  );
};

export { ImageGallery };
