import styled from 'styled-components';
import { FONT_SIZE, FONT_WEIGHT, media } from '@/styles/themes/constants';
import { BaseInput } from '../BaseInput/BaseInput';
import { BaseSpace } from '../../BaseSpace/BaseSpace';

export const SearchInput = styled(BaseInput.Search)`
  & .ant-input-prefix {
    margin: 0.5rem;
  }

  & .ant-input-group .ant-input {
    height: 1.4rem;
    line-height: 1.4rem;
    padding: 0.4rem 1.1rem;
  }

  & .ant-input-search-button {
    height: 2.4rem;
    line-height: 2.4rem;
    box-shadow: none;
  }

  &.ant-input-search-large .ant-input-search-button {
    height: 2.8rem;
    line-height: 2.8rem;
  }
  
  &.ant-input-search-large .ant-input {
    height: 2.8rem;
    line-height: 2.8rem;
    padding: 0.4rem 1.1rem;
  }

  & input {
    font-weight: 600;
    background-color: var(--background-color);

    @media only screen and ${media.md} {
      font-size: 1rem;
    }

    &::placeholder {
      font-weight: 500;
    }
  }

  .ant-input-group-addon {
    min-width: 5.5rem;
    color: var(--primary-color);
    font-weight: ${FONT_WEIGHT.semibold};
    font-size: ${FONT_SIZE.lg};
  }

  .ant-input-search-button {
    display: flex;
    align-items: center;
    justify-content: center;
    &.ant-btn .anticon {
      color: var(--primary-color);
    }
    width: 100%;
    background-color: rgba(1, 80, 154, 0.05);
    border: 1px solid var(--border-color);
    color: var(--primary-color);
    padding: 0 15px;
  }
`;

export const Space = styled(BaseSpace)`
  & > .ant-space-item:last-of-type {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
