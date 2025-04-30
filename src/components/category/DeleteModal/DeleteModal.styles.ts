import styled from 'styled-components';

export const ModalContent = styled.div`
  text-align: center;
  background-color: #fff9db;
  border-radius: 10px;
  padding: 2rem 1rem;
`;

export const ModalImageWrapper = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 16px;
  overflow: hidden;
  margin: 0 auto 1.5rem auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fffef4;
  padding: 8px;
`;

export const ModalImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const ModalTitle = styled.h2`
  margin: 0 0 0.5rem 0;
  font-weight: 700;
`;

export const ModalSubtitle = styled.div`
  font-size: 16px;
  margin-bottom: 1.5rem;
  color: #333;
  max-width: 280px;
  margin: 0 auto;
  line-height: 1.5;
`;
