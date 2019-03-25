import React, { Component } from 'react';

import http from 'services/httpService';
import NotificationService from 'services/notificationService';
import AdminService from 'services/adminService';

import Table from 'components/table';
import Modal from 'components/dashboard-modal';
import ModalAsk from 'components/modal';
import Input from 'components/input';
import Button from 'components/button';
import Preloader from 'components/preloader';

import i18n from 'i18n';

import classnames from 'classnames/bind';
import style from './style.module.css';

const cx = classnames.bind(style);

const rulesTableCaptions = {
  name: {
    text: i18n.t('name'),
    width: 250,
  },
};

class Rules extends Component {
  constructor(props) {
    super(props);
    this.notificationService = new NotificationService();
    this.adminService = new AdminService();
  }

  state = {
    rules: [],
    ruleData: {
      name: '',
    },
    isRuleEditing: false,
    isRuleCreating: false,
    confirmRuleDeleting: false,
    isLoading: false,
  };

  addRuleInit = () => this.setState({ isRuleCreating: true });

  confirmRuleDeleting = () => this.setState({ confirmRuleDeleting: true });

  closeConfirmRuleDeleting = () => this.setState({ confirmRuleDeleting: false });

  editRuleInit = (ruleId) => {
    const rule = this.state.rules.filter(rule => rule._id === ruleId)[0];

    this.setState({
      isRuleEditing: true,
      ruleData: {
        ...this.state.ruleData,
        ...rule,
      },
    });
  }

  editRuleSubmit = async () => {
    this.setState({ isLoading: true });

    const editedRuleId = this.state.ruleData._id;

    await http(`/api/admin/rules/${editedRuleId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rule: this.state.ruleData,
      }),
    });

    const { rules } = await this.adminService.getAllRules();

    this.setState({
      isLoading: false,
      isRuleEditing: false,
      rules,
    }, () => this.notificationService.show('Rule was successfully updated!'));
  }

  addRuleSubmit = async () => {
    const { ruleData } = this.state;

    if (!ruleData.name) {
      await this.notificationService.show('Please, write rule name');

      return;
    }

    this.setState({ isLoading: true });

    await http('/api/admin/rules', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rule: this.state.ruleData,
      }),
    });

    const { rules } = await this.adminService.getAllRules();

    this.setState({
      rules,
      isLoading: false,
      isRuleCreating: false,
      ruleData: {
        name: '',
      },
    }, () => this.notificationService.show('Rule was successfully created!'));
  }

  deleteRule = async () => {
    this.setState({ isLoading: true });

    const editedRuleId = this.state.ruleData._id;

    await http(`/api/admin/rules/${editedRuleId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const { rules } = await this.adminService.getAllRules();

    this.setState({
      rules,
      isLoading: false,
      isRuleEditing: false,
      confirmRuleDeleting: false,
      isRuleDelete: false,
      ruleData: {
        name: '',
      },
    }, () => this.notificationService.show('Rule was successfully deleted!'));
  }

  resetRule = () => this.setState({
    isRuleCreating: false,
    isRuleEditing: false,
    ruleData: {},
  });

  handleInputChange = (event) => {
    this.setState({
      ruleData: {
        ...this.state.ruleData,
        [event.target.name]: event.target.value,
      },
    });
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    const { rules } = await this.adminService.getAllRules();

    this.setState({
      rules,
      isLoading: false,
    });
  }

  renderRow = ({ className, itemClass, textClass, item }) => {
    const ruleId = item._id;

    return <div onClick={() => this.editRuleInit(ruleId)} className={cx(className, style.rule_row)} key={item._id}>
      <div className={itemClass} style={{ '--width': rulesTableCaptions.name.width }}>
        <span className={textClass}>{item.name}</span>
      </div>
    </div>;
  }

  render() {
    const {
      rules,
      ruleData,
      isRuleEditing,
      isRuleCreating,
      confirmRuleDeleting,
      isLoading,
    } = this.state;

    const modalTitle = isRuleEditing ? `Editing ${ruleData.name}` : `Add new rule`;
    const isRuleModalActive = isRuleEditing || isRuleCreating;

    let modalActions = [];

    if (!isRuleEditing) {
      modalActions.push(
        { text: 'Create rule', onClick: this.addRuleSubmit, isDanger: false },
      );
    }

    if (isRuleEditing) {
      modalActions.push(
        { text: 'Delete rule', onClick: this.confirmRuleDeleting, isDanger: true },
        { text: 'Update rule', onClick: this.editRuleSubmit, isDanger: false},
      );
    }

    return <div className={style.rules}>

      <div className={style.rules_controls}>
        <Button
          appearance="_basic-accent"
          text="Add rule"
          onClick={this.addRuleInit}
          className={style.button}
        />
      </div>

      <Table
        captions={rulesTableCaptions}
        items={rules}
        className={style.table}
        renderRow={this.renderRow}
        isLoading={isLoading}
        emptyMessage={"There's no rules yet"}
      />

      {isRuleModalActive &&
        <Modal
          title={modalTitle}
          close={this.resetRule}
          actions={modalActions}
        >

          {isLoading && <Preloader />}

          {confirmRuleDeleting && <ModalAsk
            textModal={'Do you really want to remove the rule?'}
            submitClick={this.deleteRule}
            closeModal={this.closeConfirmRuleDeleting} />}

          <Input
            label="Rule name"
            name="name"
            value={ruleData.name || ''}
            onChange={this.handleInputChange}
          />
        </Modal>
      }
    </div>;
  }
}

export default Rules;