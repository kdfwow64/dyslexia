import React from 'react';
import PropTypes from 'prop-types';
import { RiseLoader } from 'react-spinners';
import classNames from 'classnames';
import logo from './react-logo.png';
import './style.css';

export default class Spinner extends React.Component {
  static propTypes = {
      loading: PropTypes.bool
  }

  static defaultProps = {
      loading: false
  }

  render() {
      const clsNames = classNames({
          'sweet-loading vertical-align': true,
          'show': this.props.loading
      });
      return (
          <div className={clsNames}>
              <div>
                  <img src={logo} className="spinner-logo" alt="" />
                  <RiseLoader sizeUnit="px"
                      size={20}
                      color={'#2C6CDF'}
                      loading={this.props.loading}
                  />
              </div>
          </div>
      );
  }
}
