import styled from "styled-components";
import { colors } from "../../utils";

const GalleryContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 10px;
  flex-wrap: wrap;
  user-select: none;
  user-drag: none;
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
  width: 200px;
  height: 200px;
  object-fit: contain;
  overflow: hidden;
  cursor: pointer;
  border-radius: 8px;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
  user-select: none;
  user-drag: none;
`;

const MediaWrapper = styled.div`
  width: 100%;
  height: 100%;
  max-height: 70vh;
  object-fit: contain;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ZoomedImage = styled.img<{
  offsetX?: number;
  offsetY?: number;
}>`
  width: 100%;
  height: 70vh;
  object-fit: contain;
  transition: transform 0.3s ease;
  user-select: none;
  user-drag: none;
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: center;
  user-select: none;
  user-drag: none;
`;

const Thumbnail = styled.div<{ active: boolean }>`
  width: 60px;
  height: 60px;
  overflow: hidden;
  border: ${({ active }) =>
    active ? `2px solid ${colors.white}` : "2px solid transparent"};
  transition: transform 0.2s ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
  }
  user-select: none;
  user-drag: none;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  user-drag: none;
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
  color: ${colors.darkGrey};
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: background 0.3s ease;
  &:hover {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.9);
  }
`;

const PrevButton = styled(NavButton)`
  left: -100px;
`;

const NextButton = styled(NavButton)`
  right: -100px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: ${colors.white};
  font-size: 30px;
  cursor: pointer;
  &:hover {
    color: ${colors.red};
  }
`;

const IndexText = styled.p`
  color: ${colors.white};
  font-size: 12px;
`;

export {
  GalleryContainer,
  ModalContainer,
  CarouselContent,
  ImageWrapper,
  MediaWrapper,
  ZoomedImage,
  ThumbnailContainer,
  Thumbnail,
  ThumbnailImage,
  ThumbnailVideo,
  NavButton,
  PrevButton,
  NextButton,
  CloseButton,
  IndexText,
};
