import * as Yup from 'yup';

import First from './first';
import Second from './second';
import Third from './third';

export const steps = [
  {
    id: '1',
    component: First,
    initialValues: {
      name: '',
      image: '',
      'rule-kills': 0,
      'rule-deaths': 0,
      'rule-assists': 0,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required('Required'),

      'rule-kills': Yup.number()
        .min(-10, 'Should be -10 and more')
        .max(10, 'Should be 10 and less')
        .integer('Should be integer'),

      'rule-deaths': Yup.number()
        .min(-10, 'Should be -10 and more')
        .max(10, 'Should be 10 and less')
        .integer('Should be integer'),

      'rule-assists': Yup.number()
        .min(-10, 'Should be -10 and more')
        .max(10, 'Should be 10 and less')
        .integer('Should be integer'),
    }),
  },
  {
    id: '2',
    component: Second,
    initialValues: {
      players: [],
    },
  },
  {
    id: '3',
    component: Third,
    initialValues: {
      matches: [],
    },
  },
];

