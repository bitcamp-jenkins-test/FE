import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ImageSlider = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const slideTimeout = setTimeout(() => {
      setIsSliding(false);
    }, 500);

    return () => clearTimeout(slideTimeout);
  }, [currentImageIndex]);

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    setIsSliding(true);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    setIsSliding(true);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <SliderContainer>
      <SliderContent
        style={{
          transform: `translateX(-${currentImageIndex * 100}%)`,
          transition: isSliding ? 'transform 0.4s ease-in-out' : 'none',
        }}
      >
        {images.map((image, index) => (
          <SliderImage
            key={index}
            src={`http://xflopvzfwqjk19996213.cdn.ntruss.com/article/${image.filePath}?type=f&w=450&h=450`}
            alt={`Image ${index + 1}`}
            onClick={openModal}
          />
        ))}
      </SliderContent>
      {images.length > 1 && (
        <>
          <PreviousButton onClick={handlePreviousImage}>
            <ButtonCircle>&lt;</ButtonCircle>
          </PreviousButton>
          <NextButton onClick={handleNextImage}>
            <ButtonCircle>&gt;</ButtonCircle>
          </NextButton>
        </>
      )}
      {isModalOpen && (
        <Modal>
          <ModalContent>
            <CloseButton onClick={closeModal}>X</CloseButton>
            <LargeImage
              src={`http://xflopvzfwqjk19996213.cdn.ntruss.com/article/${images[currentImageIndex].filePath}?type=f&w=600&h=600`}
              alt={`Image ${currentImageIndex + 1}`}
            />
          </ModalContent>
        </Modal>
      )}
    </SliderContainer>
  );
};

const SliderContainer = styled.div`
  width: 25vw;
  height: 45vh;
  overflow: hidden;
  position: relative;
  z-index: 1;
`;

const SliderContent = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
`;

const SliderImage = styled.img`
  width: 25vw;
  height: 45vh;
  object-fit: cover;
  flex: none;
  cursor: pointer;
  border-radius: 5%
`;

const PreviousButton = styled.button`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  font-size: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const NextButton = styled.button`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  font-size: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const ButtonCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(128, 128, 128, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  position: relative;
  background: #fff;
  max-width: 90%;
  max-height: 90%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 40px;
  right: 10px;
  font-size: 30px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const LargeImage = styled.img`
  max-width: 800px;
  max-height: 800px;
`;

export default ImageSlider;
