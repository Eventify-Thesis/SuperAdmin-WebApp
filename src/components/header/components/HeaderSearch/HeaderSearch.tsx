import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { SearchDropdown } from '../searchDropdown/SearchDropdown';
import { BaseButton } from '@/components/common/BaseButton/BaseButton';
import {
  components as configComponents,
  Component,
} from '@/constants/config/components';
import { categoriesList, CategoryType } from '@/constants/categoriesList';
import { useResponsive } from '@/hooks/useResponsive';
import * as S from './HeaderSearch.styles';

export interface CategoryComponents {
  category: CategoryType;
  components: Component[];
}

export const HeaderSearch: React.FC = () => {
  const { mobileOnly, isTablet } = useResponsive();

  const { pathname } = useLocation();

  const [query, setQuery] = useState('');
  const [components] = useState<Component[]>(configComponents);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isOverlayOpen, setOverlayOpen] = useState(false);

  const sortedResults = query
    ? categoriesList.reduce((acc, current) => {
        const searchResults = components.filter(
          (component) =>
            component.categories.includes(current.name) &&
            component.keywords.some((keyword) => keyword.includes(query)),
        );

        return searchResults.length > 0
          ? acc.concat({ category: current.name, components: searchResults })
          : acc;
      }, [] as CategoryComponents[])
    : null;

  useEffect(() => {
    setModalOpen(false);
    setOverlayOpen(false);
  }, [pathname]);

  return (
    <>
      {mobileOnly && (
        <>
          <BaseButton
            type={isModalOpen ? 'default' : 'text'}
            icon={<S.SearchIcon onClick={() => setModalOpen(true)} />}
          />
          <S.SearchModal
            open={isModalOpen}
            closable={false}
            footer={null}
            onCancel={() => setModalOpen(false)}
            destroyOnClose
            style={{ height: '100%' }}
          >
            <SearchDropdown
              query={query}
              setQuery={setQuery}
              data={sortedResults}
              isOverlayOpen={isOverlayOpen}
              setOverlayOpen={setOverlayOpen}
            />
          </S.SearchModal>
        </>
      )}

      {isTablet && (
        <SearchDropdown
          query={query}
          setQuery={setQuery}
          data={sortedResults}
          isOverlayOpen={isOverlayOpen}
          setOverlayOpen={setOverlayOpen}
        />
      )}
    </>
  );
};
