import SolidHeart from 'images/SolidHeart';
import SolidStar from 'images/SolidStar';
import ClickableIcon from 'components/ClickableIcon';
import styles from './Card.module.css';

const Card = ({ imageURL, name, favorites, rating, clickIcon, index, favorite, rate }) => {
  return (
    <div className={[styles.Card, 'card-list'].join(' ')} style={{ backgroundImage: `url('${imageURL}')` }}>
      <div className={styles.NameWrapper}>
        <span>{name}</span>
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>

          <ClickableIcon
            Icon={SolidStar}
            isSelected={rate}
            selectColor="yellow"
            runFunction={() => {
              clickIcon(index, 'rate');
            }} />
          {rating || 0.00}

          <ClickableIcon
            Icon={SolidHeart}
            isSelected={favorite}
            selectColor="red"
            runFunction={() => {
              clickIcon(index, 'favorite');
            }} />
          {favorite ? favorites + 1 : favorites}

        </div>
      </div>
    </div>
  );
}

export default Card;