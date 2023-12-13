'use client';

import { useMemo, useState } from 'react';

import styled from 'styled-components';
import variables from '@/scss/variables.module.scss';

import Link from 'next/link';

import LoginSignup from '@/components/shared/LoginSignup';

import { setActived } from '@/redux/features/loginSignup/loginSignUpSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';

import { SlMenu } from 'react-icons/sl';
import { FiSearch } from 'react-icons/fi';
import { FaRegUser } from 'react-icons/fa';
import { GoChevronDown } from 'react-icons/go';
import { MdOutlineShoppingBag } from 'react-icons/md';

export default function Navbar() {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('Big Boobs');
  const [isSearch, setIsSearch] = useState<boolean>(false);

  const login = useAppSelector((state) => state.loginSignUp);
  const dispatch = useAppDispatch();

  useMemo(() => {
    setIsLogin(false);
  }, [isLogin]);

  return (
    <NavStyle>
      <div className="main">
        <div className="navbar">
          <div className="left">
            <div className="logo">
              <Link href="/">NASK {login.actived ? 'true' : 'false'}</Link>
            </div>
            <div className="menu">
              <SlMenu className="icon" />
            </div>
          </div>
          <div className="navigation">
            <div className="navigation__link">
              <Link href="/browse">Shop</Link>
              <GoChevronDown />
            </div>
            <div className="navigation__link">Most wanted</div>
            <div className="navigation__link">New arrival</div>
            <div className="navigation__link">Brands</div>
          </div>
          <div className="right">
            <div className="search" onClick={() => setIsSearch(!isSearch)}>
              <FiSearch className="icon" />
            </div>
            <div className="cart">
              <MdOutlineShoppingBag className="icon" />
            </div>
            <div className="user" onClick={() => dispatch(setActived({}))}>
              {isLogin ? (
                <div className="user__image">{userName[0]}</div>
              ) : (
                <FaRegUser className="icon" />
              )}
            </div>
          </div>
          {isSearch ? (
            <div className="search-box">
              <input type="text" placeholder="search..." />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      {login.actived ? <LoginSignup /> : ''}
    </NavStyle>
  );
}

const NavStyle = styled.nav.attrs({ className: 'select-none' })`
  width: 100%;
  display: block;
  cursor: default;

  .navbar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    padding: 1.5rem 0;

    .icon {
      font-size: 1.25rem;
      color: ${variables.black};
      transition: ${variables.transition};
    }

    .left {
      .logo {
        display: none;
      }
      .menu {
        padding: 0.35rem;
        border-radius: ${variables.borderRadius};
        cursor: pointer;
      }
    }

    .navigation {
      display: none;
      align-items: center;
      gap: 2rem;
      font-weight: 300;
      font-size: 0.95rem;

      &__link {
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.15rem;
        color: ${variables.grey400};
        transition: ${variables.transitionNormal};

        &:hover {
          color: ${variables.black};
          transform: translate(0, -0.15rem);
        }
      }
    }

    .right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      .search {
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: ${variables.transition};
        &:hover {
          background: ${variables.grey400};
          .icon {
            color: ${variables.white};
          }
        }
      }
      .user {
        display: none;
        cursor: pointer;
        color: ${variables.white};

        width: 100%;
        padding: 0;
        &__image {
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${variables.grey500};
          border-radius: 50%;
          padding: 0.5rem;
          width: 2.5rem;
          height: 2.5rem;
        }
      }
    }

    .search-box {
      position: absolute;
      display: flex;
      bottom: -1.5rem;
      right: 0;
      border-radius: ${variables.borderRadius};
      border: 1px solid ${variables.grey200};
      background: ${variables.white};
      padding: 0.5rem;
      padding-left: 3rem;
      box-shadow: ${variables.shadow1};
      z-index: 10;

      input {
        background: ${variables.white};
      }

      input:focus {
        box-shadow: 0 0 0 0 transparent;
      }
    }
  }

  @media screen and (min-width: ${variables.tabletHorizontal}) {
    .navbar {
      padding: 1.5rem 0;
      .left {
        .logo {
          display: block;
        }
        .menu {
          display: none;
        }
      }

      .navigation {
        display: flex;
      }

      .right {
        .user {
          display: block;
        }
      }
    }
  }
`;
