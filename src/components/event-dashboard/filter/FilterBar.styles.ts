import { BASE_COLORS } from '@/styles/themes/constants';
import { Radio } from 'antd';
import styled from 'styled-components';

export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const InputsWrapper = styled.div`
  width: 100%;
  max-width: 25rem;
  height: 3rem;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 1280px) {
    max-width: 100%;
    margin-bottom: 1rem;
  }

  .ant-input-group-wrapper {
    display: flex;
    align-items: center;
  }

  .ant-input {
    padding: 6px 11px;
    display: flex;
    align-items: center;
  }

  .ant-input-affix-wrapper {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .ant-input-prefix {
    display: flex;
    align-items: center;
    margin-right: 8px;
  }

  .ant-input-search-button {
    height: 2.5rem;
    padding: 6px 11px;
    color: black;
    background: ${BASE_COLORS.white};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  && {
    .ant-input-search-button:hover {
      opacity: 0.8;
      color: ${BASE_COLORS.black};
      background: var(--primary-color);
    }
  }
`;

export const RadioGroup = styled(Radio.Group)`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  height: auto;

  color: ${BASE_COLORS.black};
  @media (max-width: 1280px) {
    width: 100%;
    justify-content: space-between;
  }

  .ant-radio-button-wrapper-checked {
    background-color: var(--primary-color);
    border-color: var(--primary-color) !important;
    border-radius: 4px;
    color: ${BASE_COLORS.black};
  }

  .ant-radio-button-wrapper-checked:before {
    display: none;
  }

  .ant-radio-button-wrapper:hover {
    color: ${BASE_COLORS.black};
  }

  .ant-radio-button-wrapper-checked:hover {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: ${BASE_COLORS.white};
    border-radius: 4px;
  }
`;

export const RadioButton = styled(Radio.Button)`
  flex: 1 1 auto;
  min-width: 8rem;
  max-width: 100%;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: normal;
  text-align: center;
  padding: 0 4px;

  @media (max-width: 1280px) {
    min-width: 6rem;
    height: 2.2rem;
    font-size: 0.9rem;
  }

  @media (max-width: 500px) {
    font-size: 0.75rem;
    height: 3rem; /* 👈 Taller button for small screens */
    line-height: 1.1rem;
    padding: 0 6px;
  }
`;

