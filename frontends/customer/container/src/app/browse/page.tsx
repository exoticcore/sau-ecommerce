'use client';

import styled from 'styled-components';
import Sidebar from '../../components/browseProduct/SideBar';
import ProductList from '../../components/browseProduct/ProductList';
import Navigation from '../../components/product/Navigation';
import Promotion from '../../components/Promotion';
import Subscribe from '../../components/Subscribe';

export default function BrowseProudctPage() {
  return (
    <BrowseProductWrapper>
      <Navigation navigate={['Home', 'Browse Products']} />
      <div className="display">
        <Sidebar />
        <ProductList />
      </div>
      <Promotion />
      <Subscribe />
    </BrowseProductWrapper>
  );
}

const BrowseProductWrapper = styled.div.attrs({
  className: 'select-none',
})`
  width: 100%;

  .display {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 1.5rem;
    width: 100%;
    margin: 2rem 0;
  }
`;
