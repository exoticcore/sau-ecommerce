'use client';

import styled from 'styled-components';
import MySwiper from '@/components/BrandSwiper';

export default function Brands() {
  return (
    <BrandWrapper>
      <h4>Brands</h4>
      <MySwiper />
    </BrandWrapper>
  );
}

const BrandWrapper = styled.div.attrs({ className: 'select-none' })`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  overflow-x: hidden;
  gap: 2rem;
  padding: 3rem 0;
  cursor: default;

  .brands {
    display: flex;
    gap: 5.75rem;
  }
`;
