'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

import styled from 'styled-components';
import variables from '@/scss/variables.module.scss';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Controller } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/bundle';

import Black1 from '../../../public/product/black1.jpeg';
import Black2 from '../../../public/product/black2.jpeg';
import Black3 from '../../../public/product/black3.jpeg';
import Black4 from '../../../public/product/black4.jpeg';
import Black5 from '../../../public/product/black5.jpeg';
import Black6 from '../../../public/product/black6.jpeg';

const productImages = [
  { image: Black1, position: 'center center' },
  { image: Black2, position: 'center top' },
  { image: Black3, position: 'center bottom' },
  { image: Black4, position: 'center center' },
  { image: Black5, position: 'center center' },
  { image: Black6, position: 'center center' },
];

export default function ProductImage() {
  const [mainSwiper, setMainSwiper] = useState<SwiperType>();
  const [previewSwiper, setPreviewSwiper] = useState<SwiperType>();
  const [activeIndex, setActiveIndex] = useState<number>();

  return (
    <ProductImageWrapper>
      <div className="main-product-image">
        <Swiper
          modules={[Navigation, Controller]}
          slidesPerView={1}
          spaceBetween={10}
          loop={false}
          navigation
          onSwiper={(swiper) => {
            setMainSwiper(swiper);
            setActiveIndex(swiper.activeIndex);
          }}
          onRealIndexChange={(element) => {
            previewSwiper?.slideTo(element.activeIndex, 300);
            setActiveIndex(element.activeIndex);
          }}
        >
          {productImages.map((productImage, index) => {
            return (
              <SwiperSlide key={index}>
                <div className="product-image">
                  <Image
                    alt=""
                    src={productImage.image}
                    style={{
                      objectFit: 'cover',
                      objectPosition: productImage.position,
                    }}
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <div className="preview-product-image">
        <Swiper
          slidesPerView={4.5}
          spaceBetween={10}
          loop={false}
          onSwiper={(swiper) => setPreviewSwiper(swiper)}
        >
          {productImages.map((productImage, index) => {
            return (
              <SwiperSlide key={index}>
                <div
                  className={
                    index === activeIndex
                      ? 'preview-image active'
                      : 'preview-image'
                  }
                  onClick={() => mainSwiper?.slideTo(index, 300)}
                >
                  <Image
                    alt=""
                    src={productImage.image}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="preview-image-filter"></div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </ProductImageWrapper>
  );
}

const ProductImageWrapper = styled.div.attrs({ className: 'select-none' })`
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .main-product-image {
    width: 100%;
    position: relative;

    .product-image {
      position: relative;
      width: 100%;
      height: 40rem;
      border-radius: ${variables.borderRadius};
      overflow: hidden;
      z-index: -1;
    }

    .swiper-button-prev,
    .swiper-button-next {
      color: ${variables.grey500};
      border-radius: ${variables.borderRadius};
      padding: 0 1.25rem;
      background: ${variables.white};
      &::after {
        font-size: 0.9rem;
        font-weight: 600;
      }

      &:hover {
        color: ${variables.black};
      }
    }
  }

  .preview-product-image {
    width: 100%;
    position: relative;

    .preview-image {
      position: relative;
      width: 7rem;
      height: 7rem;
      border-radius: ${variables.borderRadius};
      overflow: hidden;
      cursor: pointer;

      &-filter {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 2px solid transparent;
        border-radius: ${variables.borderRadius};
        z-index: 1;
        top: 0;
        transition: ${variables.transition};
      }

      &.active {
        cursor: default;

        .preview-image-filter {
          border-color: ${variables.grey300};
        }
      }
    }
  }
`;
