import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './button.module.scss';

const cx = classNames.bind(styles);

function Button({
   to,
   href,
   medium,
   large,
   small,
   primary,
   children,
   ...rest
}) {
   let Comp = 'button';
   const props = {};
   if (to) {
      Comp = Link;
      props.to = to;
   } else if (href) {
      Comp = 'a';
      props.href = href;
   }
   return (
      <Comp
         className={cx('wrapper', {
            medium,
            small,
            large,
            primary,
         })}
         {...props}
         {...rest}
      >
         {children}
      </Comp>
   );
}

export default Button;
