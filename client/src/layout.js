import React from 'react';
import { YMInitializer } from 'react-yandex-metrika';

import Header from 'components/header';
import Footer from 'components/footer';
import Notification from 'components/notification';
import ModalContainer from 'components/modal-container';

export default props => (
  <>
    <Header/>
    {props.children}
    <Footer/>

    <YMInitializer accounts={[53679490]}/>
    <Notification/>
    <ModalContainer/>
  </>
);
