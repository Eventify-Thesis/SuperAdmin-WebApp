import styled from 'styled-components';
import { Card } from 'antd';

export const ListWrapper = styled.div`
  margin-top: 3rem;
`;

export const StyledCard = styled(Card)`
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

export const CardBody = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
`;

export const Thumbnail = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 16px;
  cursor: pointer;
`;

export const CategoryDetails = styled.div`
  flex: 1;
`;

export const BoldText = styled.div`
  font-weight: bold;
`;

export const SectionTitle = styled.h3`
  font-size: 1.75rem; // or 28px
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1f1f1f;
`;