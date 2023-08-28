import { FiMenu } from 'react-icons/fi';
import { LiaShoppingBagSolid } from 'react-icons/lia';

const NavBar = (): React.ReactElement => {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="menu">
          <FiMenu className="menu icon" />
        </div>
        <div className="cart">
          <div className="cart noti">1</div>
          <LiaShoppingBagSolid className="cart icon" />
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
