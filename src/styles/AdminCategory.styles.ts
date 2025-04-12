import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 2rem;
`;

export const FormWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

export const CenteredListItem = styled.div`
  display: flex;
  justify-content: center;
`;

export const StyledCard = styled.div`
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
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
