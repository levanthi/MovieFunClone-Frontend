import { useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './tabUI.module.scss';
import Button from '../Button';

const cx = classNames.bind(styles);

function TabUI({ tabData = [], tabActive, setTabActive }) {
   const slideBarRef = useRef();

   useEffect(() => {
      try {
         const sidebarWidth = +slideBarRef.current.offsetWidth;
         slideBarRef.current.style.left = sidebarWidth * tabActive + 'px';
      } catch (err) {
         console.log(err);
      }
   }, [tabActive]);

   const handleActiveChange = (index) => {
      if (tabActive !== index) {
         setTabActive(index);
         slideBarRef.current.style.left = 160 * index + 'px';
      }
   };
   const handleTouchRipple = (e, rippleElement) => {
      const left = e.clientX - e.target.getBoundingClientRect().left;
      const top = e.clientY - e.target.getBoundingClientRect().top;
      rippleElement.style.top = top + 'px';
      rippleElement.style.left = left + 'px';
      rippleElement.style.right = `calc(100% - ${left}px )`;
      rippleElement.style.bottom = `calc(100% - ${top}px )`;
      rippleElement.classList.add('envade-animation');
      setTimeout(() => {
         rippleElement.classList.remove('envade-animation');
      }, 350);
   };
   return (
      <div className={cx('tab-ui-wrap')}>
         <div className={cx('tab-ui')}>
            <span ref={slideBarRef} className={cx('slide-bar')}></span>
            {tabData.map((tab, index) => {
               return (
                  <div
                     key={index}
                     className={cx('tab-item', {
                        active: tabActive === index,
                     })}
                     onClick={() => {
                        handleActiveChange(index);
                     }}
                     onMouseDown={(e) => {
                        handleTouchRipple(e, e.currentTarget.lastChild);
                     }}
                  >
                     <Button medium layout>
                        {tab.title}
                     </Button>
                     <span className={cx('touch-ripple')}></span>
                  </div>
               );
            })}
         </div>
      </div>
   );
}

export default TabUI;
