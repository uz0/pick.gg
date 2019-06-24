import React from 'react';
import classnames from 'classnames/bind';
import style from './style.module.css';

const cx = classnames.bind(style);

const Card = ({
  items,
  renderCard,
  defaultSorting,
  className,
}) => {
  const list = items;

  if (defaultSorting) {
    list.sort(defaultSorting);
  }

  return (
    <div className={cx('card_block', className)}>

      {list.length > 0 &&
      list.map((item, index) => renderCard({
        item,
        index,
        className: style.card,
        nameClass: style.name,
        avatarClass: style.avatar,
        winningsClass: style.winnings,
      }))
      }

    </div>
  );
};

export default Card;
