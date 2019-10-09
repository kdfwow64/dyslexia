import React, { Component } from 'react';
import reactCSS from 'reactcss'
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class PopupMenu extends Component {
    static propTypes = {
        close: PropTypes.func.isRequired,
        read: PropTypes.func.isRequired,
        see: PropTypes.func.isRequired
    };

    render() {
        const styles = reactCSS({
            'default': {
                color: {
                    width: '36px',
                    height: '21px',
                    borderRadius: '2px',
                    background: "white",
                },
                swatch: {
                    padding: '5px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'absolute',
                    zIndex: '2',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
            },
        });
        return (
            <div className="popup-option">
                <div className="each-option" onClick={this.props.read}>
                    Read This word
                </div>
                <div className="each-option" onClick={this.props.see}>
                    Show Definition
                </div>
            </div>
        );
    }
}
