import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
   faMagnifyingGlass,
   faCircleDollarToSlot,
   faFilm,
   faComment,
   faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

import { getUser } from '../../redux/selector';
import userSlice from '../../redux/userSlice';
import styles from './header.module.scss';
import Button from '../Button';
import { images } from '../../assets/images';
import { refreshToken } from '../../redux/API/authApi';

const cx = classNames.bind(styles);

const linkList = [
   { to: '/search', children: 'Tìm kiếm' },
   { to: '/top', children: 'Phim Hot' },
   { to: '/filter?type=movie&currentPage=1', children: 'Phim Lẻ' },
   { to: '/filter?type=show&currentPage=1', children: 'Phim Bộ' },
   { to: '/filter?=updated&currentPage=1', children: 'Phim Mới' },
   { to: '/faq', children: 'FAQ' },
];

function Header() {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const headerRef = useRef();
   const user = useSelector(getUser);
   const dropDowns = [
      {
         name: 'Tài khoản',
         icon: faUser,
         to: '/profile',
      },
      {
         name: 'Donate',
         icon: faCircleDollarToSlot,
         to: '/donate',
      },
      {
         name: 'Bộ sưu tập',
         icon: faFilm,
         to: '/collection',
      },

      {
         name: 'Cập câu song ngữ',
         icon: faComment,
         to: '/pairs',
      },
      {
         name: 'Thoát',
         icon: faRightFromBracket,
         onClick: handleLogout,
      },
   ];

   const axiosJWT = axios.create({
      baseURL: 'http://localhost:8080',
   });
   axiosJWT.interceptors.request.use(
      async (config) => {
         let date = new Date();
         const decode = jwtDecode(user?.accessToken);
         if (decode.exp < date.getTime() / 1000) {
            const data = await refreshToken();
            const refreshUser = { ...user, accessToken: data.accessToken };
            document.cookie = `token=Bearer ${data.refreshToken}`;
            dispatch(userSlice.actions.setUser(refreshUser));
            config.headers = { authorization: `Bearer ${data.accessToken}` };
         }
         return config;
      },
      (err) => {
         return Promise.reject(err);
      },
   );

   function handleLogout() {
      axios
         .get('http://localhost:8080/auth/logout', {
            // headers: {
            //    Authorization: `Bearer ${user.accessToken}`,
            // },
            withCredentials: true,
         })
         .then((res) => {
            if (res.status === 200) {
               dispatch(userSlice.actions.setUser(null));
               navigate('/');
            }
         });
   }
   useEffect(() => {
      window.addEventListener('scroll', () => {
         if (window.scrollY >= 65) {
            headerRef.current?.classList.add(cx('background'));
         } else {
            headerRef.current?.classList.remove(cx('background'));
         }
      });
      return () => {
         headerRef.current?.classList.remove(cx('background'));
      };
   }, []);

   return (
      <div ref={headerRef} className={cx('header')}>
         <Link to={'/'} className={cx('brand', 'item')}>
            <img src={images.logo} alt="logo" />
         </Link>
         <div className={cx('menu')}>
            <div className={cx('start')}>
               {linkList.map((item, index) => {
                  return (
                     <Button to={item.to} key={index} className={cx('item')}>
                        {index === 0 && (
                           <span className={cx('icon')}>
                              <FontAwesomeIcon icon={faMagnifyingGlass} />
                           </span>
                        )}
                        <span> {item.children}</span>
                     </Button>
                  );
               })}
            </div>

            {user ? (
               <div className={cx('name-group')}>
                  <div className={cx('name')}>{user.name}</div>
                  <div className={cx('drop-down')}>
                     {dropDowns.map((item, index) => {
                        return item.to ? (
                           <Link key={index} to={item.to}>
                              <FontAwesomeIcon icon={item.icon} />
                              <span>{item.name}</span>
                           </Link>
                        ) : (
                           <Button key={index} onClick={item.onClick}>
                              <FontAwesomeIcon icon={item.icon} />
                              <span>{item.name}</span>
                           </Button>
                        );
                     })}
                  </div>
               </div>
            ) : (
               <div className={cx('item')}>
                  <Link to={'/login'} className={cx('end')}>
                     <Button medium primary>
                        Đăng Nhập
                     </Button>
                  </Link>
               </div>
            )}
         </div>
      </div>
   );
}

export default Header;
