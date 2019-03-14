import React from 'react';
import classnames from 'classnames/bind';
import style from './style.module.css';

const cx = classnames.bind(style);

const Table = ({
  captions,
  noCaptions,
  items,
  renderRow,
  isLoading,
  emptyMessage,
  className,
}) => {
  const isEmptyMessageShown = items.length === 0 && emptyMessage && !isLoading;
  const isCaptionsShown = !noCaptions && items.length > 0;

  return <div className={cx('table', className)}>
    {isCaptionsShown &&
      <div className={style.captions}>
        {Object.keys(captions).map(key => <div className={style.cell} key={key} style={{'--width': captions[key].width}}>
          <span className={style.text}>{captions[key].text}</span>
        </div>)}
      </div>
    }

    {items.length > 0 &&
      items.map(item => renderRow({
        item,
        className: style.row,
        itemClass: style.item,
        textClass: style.text,
      }))
    }

    {isEmptyMessageShown &&
      <p className={style.empty}>{emptyMessage}</p>
    }
  </div>;
};

export default Table;
