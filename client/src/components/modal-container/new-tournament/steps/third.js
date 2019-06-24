import React from 'react';
import { useFormikContext } from 'formik';
import { connect } from 'react-redux';

import Button from 'components/button';

import style from '../style.module.css';

import modalActions from '../../actions';

const withModal = connect(
  null,
  {
    toggleModal: modalActions.toggleModal,
  }
);

export default withModal(({ toggleModal }) => {
  const { values, setFieldValue } = useFormikContext();
  const { matches } = values;
  console.log('what fomik context gives us', values);
  return (
    <div className={style.matches}>
      {matches.length > 0 &&
        matches.map((match, index) => (
          <div key={match.uid} className={style.match}>
            <p className={style.name}>
              {index + 1}. {match.name} {match.startTime}
            </p>

            <Button
              appearance="_icon-danger"
              icon="close"
              type="button"
              className={style.delete}
              onClick={() => setFieldValue(matches.filter(({ uid }) => uid !== match.uid))}
            />

            <Button
              appearance="_icon-default"
              icon="edit"
              type="button"
              className={style.edit}
              onClick={() =>
                toggleModal({
                  id: 'add-match-modal',

                  options: {
                    onAdd: newMatches => setFieldValue('matches', newMatches),
                    matches: values.matches,
                    editUid: match.uid,
                  },
                })
              }
            />
          </div>
        ))}
    </div>
  );
});
