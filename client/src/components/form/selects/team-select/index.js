import classnames from 'classnames';
import React, { Component } from 'react';
import Select from 'react-select';
import compose from 'recompose/compose';
import map from 'lodash/map';
import get from 'lodash/get';

import withStyles from '../hoc/with-styles';
import style from './style.module.css';

const cx = classnames.bind(style);

const enhance = compose(
  withStyles,
);

class TeamSelect extends Component {
  onChange = ({ value }) => {
    this.props.form.setFieldValue(this.props.field.name, value);
  };

  render() {
    const { errors } = this.props.form;

    const options = map(this.props.options, ({ _id, name }) => ({ value: _id, label: name }));
    const error = get(errors, this.props.field.name);

    return (
      <div className={cx('wrapper', this.props.className)}>
        {this.props.label && (
          <label className={style.caption}>
            {this.props.label}
          </label>
        )}

        <Select
          options={options}
          styles={this.props.styles}
          onChange={this.onChange}
        />

        {error &&
          <p className={style.error}>{error}</p>
        }
      </div>
    );
  }
}

export default enhance(TeamSelect);
