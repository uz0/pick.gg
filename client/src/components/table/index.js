import React from 'react';
import classnames from 'classnames/bind';
import style from './style.module.css';

const cx = classnames.bind(style);

const Table = ({
  captions,
  noCaptions,
  items,
  renderRow,
  defaultSorting,
  isLoading,
  emptyMessage,
  className,
}) => {
  const isEmptyMessageShown = items.length === 0 && emptyMessage && !isLoading;
  const isCaptionsShown = !noCaptions && items.length > 0;
  const list = items;

  if (defaultSorting) {
    list.sort(defaultSorting);
  }

  return (
    <div className={cx('table', className)}>
      {isCaptionsShown && (
        <div className={style.captions}>
          {Object.keys(captions).map(key => (
            <div key={key} className={style.cell} style={{ '--width': captions[key].width }}>
              <span className={style.text}>{captions[key].text}</span>
            </div>
          ))}
        </div>
      )}

      {list.length > 0 &&
      list.map((item, index) => renderRow({
        item,
        index,
        className: style.row,
        itemClass: style.item,
        textClass: style.text,
      }))
      }

      {isEmptyMessageShown &&
        <p className={style.empty}>{emptyMessage}</p>
      }
    </div>
  );
};

export default Table;
