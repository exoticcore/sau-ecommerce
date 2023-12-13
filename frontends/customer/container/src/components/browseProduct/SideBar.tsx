import styled from 'styled-components';
import variables from '@/scss/variables.module.scss';

import { MdChevronRight } from 'react-icons/md';
import { useState } from 'react';
import CategoryDropdown from './BrowseCategoryDropdown';
import BrandDropdown from './BrandDropdown';

export default function Sidebar() {
  const [menuActive, setMenuActive] = useState<number>(0);

  return (
    <SidebarWrapper>
      <div className="sidebar-main">
        <CategoryDropdown />
        <hr />
        <BrandDropdown />
      </div>
    </SidebarWrapper>
  );
}

const SidebarWrapper = styled.div.attrs({ className: 'select-none' })`
  display: flex;
  flex-direction: column;
  font-weight: 300;

  .sidebar {
    &-main {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      border-radius: ${variables.borderRadius};
      font-weight: 300;
      text-transform: capitalize;
      border: 1px solid ${variables.grey200};

      hr {
        margin: 0.35rem;
      }

      &__menu {
        padding: 1rem;
        border-radius: ${variables.borderRadius};
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;

        &:hover {
          background: ${variables.grey100};
        }

        &.active {
          background: ${variables.grey100};

          .menu-icon {
            transform: rotate(90deg);
          }
        }
      }
    }
  }
`;
