import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../style/Sidebar.css';
import logo from '../assets/images/MEDICARE.png';

const menuItems = [
  { label: 'TRANG CHỦ', path: '/*' },
  { label: 'LỊCH HẸN KHÁM', path: '/appointments' },
  { label: 'THÔNG TIN BÁC SĨ', path: '/doctors' },
  { label: 'LỊCH LÀM VIỆC', path: '/workschedules' },
  { label: 'DỊCH VỤ KHÁM', path: '/services' },
  { label: 'THÔNG TIN BỆNH NHÂN', path: '/patients' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Medicare Logo" className="logo-image" />
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.label}
            className={`sidebar-menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <Link to={item.path} className="sidebar-link">
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;