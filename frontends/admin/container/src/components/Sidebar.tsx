import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FaCaretDown,
  FaCartArrowDown,
  FaBoxOpen,
  FaFileInvoiceDollar,
  FaUserFriends,
} from 'react-icons/fa';
import {
  TbLayoutSidebarLeftCollapseFilled,
  TbLayoutSidebarLeftExpandFilled,
} from 'react-icons/tb';
import { BiTransferAlt } from 'react-icons/bi';
import { MdDiscount, MdLocalShipping } from 'react-icons/md';
import { LuLogOut } from 'react-icons/lu';
import { IoChatbox } from 'react-icons/io5';
import { SlGraph } from 'react-icons/sl';
import { HiDocumentChartBar } from 'react-icons/hi2';
import * as Theme from '../constant/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
  const [active, setActive] = useState<boolean>(true);
  const navigate = useNavigate();

  const onLogout = () => {
    async function callApi() {
      try {
        const resp = await axios.delete(
          'http://localhost:3000/api/v1/auth/logout',
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const { data } = resp;
        if (data) {
          localStorage.removeItem('access_token');
          navigate(0);
        }
      } catch (err) {
        console.log(err);
      }
    }
    callApi();
  };
  return (
    <SidebarStyle className={active ? '--active' : ''}>
      <div className="logo">
        <div className="logo__image">
          <span>X shop</span>
        </div>
        {active ? (
          <TbLayoutSidebarLeftCollapseFilled
            className="logo__button"
            onClick={() => setActive(!active)}
          />
        ) : (
          <TbLayoutSidebarLeftExpandFilled
            className="logo__button"
            onClick={() => setActive(!active)}
          />
        )}
      </div>
      <div className="manage">
        <div className="manage__display">S</div>
        <div className="manage__info">
          <span>Major</span>
          <p>Sukhumvit</p>
        </div>
        <FaCaretDown className="manage__dropdown-button" />
      </div>
      <div className="menu hide-scroll">
        <div className="navigation">
          <div className="navigation__icon">
            <SlGraph />
          </div>
          <div className="navigation__title">Dashboard</div>
        </div>
        <div className="navigation">
          <div className="navigation__icon">
            <FaCartArrowDown />
          </div>
          <div className="navigation__title">Orders</div>
        </div>
        <div className="navigation">
          <div className="navigation__icon">
            <MdLocalShipping />
          </div>
          <div className="navigation__title">Derivery</div>
        </div>
        <div className="navigation --selected">
          <div className="navigation__icon">
            <FaBoxOpen />
          </div>
          <div className="navigation__title">Products</div>
        </div>
        <div className="navigation">
          <div className="navigation__icon">
            <FaFileInvoiceDollar />
          </div>
          <div className="navigation__title">Invoices</div>
        </div>
        <div className="navigation">
          <div className="navigation__icon">
            <BiTransferAlt />
          </div>
          <div className="navigation__title">Transactions</div>
        </div>
        <div className="navigation">
          <div className="navigation__icon">
            <IoChatbox />
          </div>
          <div className="navigation__title">Messages</div>
          <div className="navigation__notification">13</div>
        </div>
        <div className="navigation">
          <div className="navigation__icon">
            <FaUserFriends />
          </div>
          <div className="navigation__title">Customers</div>
        </div>
        <div className="navigation">
          <div className="navigation__icon">
            <MdDiscount />
          </div>
          <div className="navigation__title">Marketing</div>
        </div>
        <div
          className="navigation"
          onClick={(e) => e.currentTarget.classList.add('--selected')}
        >
          <div className="navigation__icon">
            <HiDocumentChartBar />
          </div>
          <div className="navigation__title">Reports</div>
        </div>
      </div>
      <div className="navigation" onClick={() => onLogout()}>
        <div className="navigation__icon">
          <LuLogOut />
        </div>
        <div className="navigation__title">Logout</div>
      </div>
    </SidebarStyle>
  );
}

const SidebarStyle = styled.div.attrs({ className: 'select-none' })`
  display: none;
  overflow-x: hidden;
  flex-direction: column;
  width: 5rem;
  padding: 1.25rem 1.25rem;
  transition: ${Theme.transitionNormal};
  background: ${Theme.white};
  gap: 1rem;
  height: 100svh;
  cursor: default;

  .logo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &__image {
      transition: ${Theme.transitionNormal};
      opacity: 0;
      width: 0;
      overflow: hidden;
      white-space: nowrap;
    }
    &__button {
      padding: 0.5rem 0.3rem;
      border-radius: ${Theme.borderRadius};
      font-size: 2.5rem;
      transition: ${Theme.transitionNormal};
      color: ${Theme.grey300};
      z-index: 1;
      cursor: pointer;
      &:hover {
        /* background: ${Theme.grey600}; */
        color: ${Theme.grey500};
      }
    }
  }

  .manage {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    overflow: hidden;
    border-radius: ${Theme.borderRadius};
    background: ${Theme.white};
    box-shadow: none;
    transition: ${Theme.transitionNormal};
    width: 0;
    opacity: 0;
    cursor: pointer;

    &__display {
      background: ${Theme.grey300};
      color: ${Theme.white};
      padding: 0.75rem 0.85rem;
      font-size: 1rem;
      border-radius: ${Theme.borderRadius};
    }

    &__info {
      display: flex;
      gap: 0.25rem;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      height: 100%;
      span {
        color: ${Theme.grey500};
        font-size: 0.65rem;
        font-weight: 300;
      }
      p {
        font-size: 0.9rem;
        font-weight: 400;
      }
    }

    &__dropdown-button {
      color: ${Theme.grey300};
    }
  }

  .menu {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    gap: 0.4rem;
    margin-top: -3.5rem;
    transition: ${Theme.transitionNormal};
    overflow-y: scroll;
  }

  .navigation {
    position: relative;
    display: flex;
    width: 100%;
    align-items: center;
    gap: 0.5rem;
    border-radius: ${Theme.borderRadius};
    color: ${Theme.grey400};
    cursor: pointer;

    &.--selected {
      background: ${Theme.grey100};
      color: ${Theme.textColor};
      cursor: default;

      &:hover {
        background: ${Theme.grey100};
        color: ${Theme.textColor};
      }
    }

    &:hover {
      background: ${Theme.primary200};
      color: ${Theme.white};
    }

    &__icon {
      padding: 0.5rem;
      font-size: 1.25rem;
      border-radius: ${Theme.borderRadius};
      transition: ${Theme.transitionNormal};
    }

    &__title {
      width: 0;
      opacity: 0;
      font-size: 0.9rem;
      font-weight: 300;
      transition: ${Theme.transitionNormal};
    }

    &__notification {
      position: absolute;
      top: 15%;
      right: 15%;
      font-size: 0.35rem;
      padding: 0.1rem;
      box-shadow: 0 0 0 1px ${Theme.white};
      color: transparent;
      border-radius: 50%;
      background-color: ${Theme.primary600};
      transition: ${Theme.transitionNormal};
    }
  }

  &.--active {
    width: 19rem;
    .logo {
      &__image {
        width: 100%;
        opacity: 1;
      }
      &__title {
        width: 100%;
      }
    }
    .manage {
      opacity: 1;
      flex-shrink: 0;
      width: 100%;
      height: auto;
      padding: 0.35rem;
      box-shadow: 0 0 0 1px ${Theme.grey300};
    }
    .menu {
      margin: 0;
    }

    .navigation {
      &__title {
        width: 100%;
        opacity: 1;
      }
      &__notification {
        top: 30%;
        right: 7%;
        font-size: 0.7rem;
        padding: 0.2rem 0.45rem;
        box-shadow: 0 0 0;
        color: ${Theme.white};
        border-radius: ${Theme.borderRadius};
      }
    }
  }

  @media screen and (min-width: ${Theme.tabletVertical}) {
    display: flex;
  }
`;

export default Sidebar;
