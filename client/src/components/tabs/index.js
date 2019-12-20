import React, { Children, useState, cloneElement } from 'react';
import classnames from 'classnames/bind';

import style from './style.module.css';

const cx = classnames.bind(style);

export const Tab = ({ children, tabIndex, activeTabIndex, setActiveTab }) => (
  <button
    type="button"
    className={cx({ [style.active]: tabIndex === activeTabIndex })}
    onClick={() => setActiveTab(tabIndex)}
  >
    {children}
  </button>
);

export const Panel = ({ children, panelIndex, activeTabIndex }) => {
  return activeTabIndex === panelIndex ? children : null;
};

export const Tabs = ({ children }) => {
  const [activeTabIndex, setActiveTab] = useState(0);

  const tabs = Children.toArray(children).filter(child => child.type.name === 'Tab');
  const panels = Children.toArray(children).filter(child => child.type.name === 'Panel');

  const renderTab = (child, index) => {
    const tabProps = {
      ...child.props,
      tabIndex: index,
      activeTabIndex,
      setActiveTab: () => setActiveTab(index),
    };

    return cloneElement(child, tabProps);
  };

  const renderPanel = (child, index) => {
    const panelProps = {
      ...child.props,
      activeTabIndex,
      panelIndex: index,
    };

    return cloneElement(child, panelProps);
  };

  return (
    <div className={style.tabs}>
      <div className={style.header}>
        {tabs.map((tab, index) => renderTab(tab, index))}
      </div>

      <div className={style.content}>
        {panels.map((panel, index) => renderPanel(panel, index))}
      </div>
    </div>
  );
};
