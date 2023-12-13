'use client';
import styled from 'styled-components';
import Marketing from '../components/Marketing';
import Brands from '../components/Brands';
import Qoutes from '../components/Quotes';
import CurratedPicks from '../components/CurratedPicks';
import Feature from '../components/Feature';
import Promotion from '../components/Promotion';
import Subscribe from '../components/Subscribe';
import Carousel from '../components/Carousel';
import FeatureProducts from '../components/FeatureProducts';

export default function Home() {
  return (
    <HomeStyle>
      <Carousel />
      <Brands />
      <Qoutes />
      <CurratedPicks />
      <FeatureProducts isScroll={true} perView={3} isGeneral={false} />
      <Promotion />
      <Subscribe />
    </HomeStyle>
  );
}

const HomeStyle = styled.main.attrs({ className: 'main' })`
  padding: 1rem 0;
`;
