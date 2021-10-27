import styles from './ClickableIcon.module.css';
import { useRef } from "react";

const ClickableIcon = ({isSelected = false, selectColor = "red", runFunction, Icon, innerProps}) => {
  const ref = useRef(null);
  return (
    <span ref={ref} className={[styles.IconWrapper].join(' ')} onClick={() => {
      const star = ref.current;
      star.classList.remove(styles.active);
      star.classList.add(styles.active);
      setTimeout(() => { star.classList.remove(styles.active) }, 500);
      runFunction();
    }}>
      {<Icon fill={isSelected ? selectColor : "white"} height="1.5em" width="1.5em" style={{ margin: '.25em .5em 0', cursor: 'pointer' }}  {...innerProps}/>}
    </span>
  );
}

export default ClickableIcon;