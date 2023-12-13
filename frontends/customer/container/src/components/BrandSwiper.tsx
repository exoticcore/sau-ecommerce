import styled from 'styled-components';
import variables from '@/scss/variables.module.scss';
import Image from 'next/image';

import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import Chanel from '../../public/chenel.png';
import CK from '../../public/ck.png';
import Guess from '../../public/guess.png';
import Gucci from '../../public/gucci.png';
import Dior from '../../public/dior.png';
import Prada from '../../public/prada.png';
import Zara from '../../public/zara.png';
import Addidas from '../../public/adidas.png';

export default function MySwiper() {
  return (
    <SwiperStyle>
      <Swiper
        modules={[Autoplay]}
        loop={true}
        autoplay={{
          delay: 500,
          pauseOnMouseEnter: true,
          disableOnInteraction: false,
        }}
        speed={2000}
        breakpoints={{
          0: {
            slidesPerView: 4,
            spaceBetween: 10,
          },
          480: {
            slidesPerView: 5,
            spaceBetween: 10,
          },
          700: {
            slidesPerView: 6,
            spaceBetween: 10,
          },
          1080: {
            slidesPerView: 8,
            spaceBetween: 10,
          },
        }}
      >
        <SwiperSlide>
          <div className="brands__image">
            <Image src={Chanel} alt="" fill className="brands__image-fit" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="brands__image">
            <Image src={CK} alt="" fill className="brands__image-fit" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="brands__image">
            <Image src={Guess} alt="" fill className="brands__image-fit" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="brands__image">
            <Image src={Gucci} alt="" fill className="brands__image-fit" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="brands__image">
            <Image src={Zara} alt="" fill className="brands__image-fit" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="brands__image">
            <Image src={Dior} alt="" fill className="brands__image-fit" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="brands__image">
            <Image src={Prada} alt="" fill className="brands__image-fit" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="brands__image">
            <Image src={Addidas} alt="" fill className="brands__image-fit" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="brands__image">
            <Image src={Guess} alt="" fill className="brands__image-fit" />
          </div>
        </SwiperSlide>
      </Swiper>
    </SwiperStyle>
  );
}

const SwiperStyle = styled.div.attrs({ className: 'select-none' })`
  width: 100%;

  .brands__image {
    cursor: pointer;
    position: relative;
    width: 4rem;
    height: 4rem;
    transition: ${variables.transition};

    &-fit {
      transition: ${variables.transition};
      object-fit: contain;
      transform: scale(0.9);

      &:hover {
        transform: scale(1);
      }
    }
  }
`;
