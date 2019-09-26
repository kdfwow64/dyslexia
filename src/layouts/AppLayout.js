import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import appRoutes from '../routes/app';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SettingBar from '../components/SettingBar';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TightlyControlledTextarea from '../components/NewTextArea';
import appLayoutStyle from '../assets/jss/appLayoutStyle';
import './style.css';

class AppLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchor: 'left',
      fontSize: 12,
      fontSizePunc: 12,
      color: {
        r: '241',
        g: '112',
        b: '19',
        a: '1',
      },
      fontFamily: 'Open Sans',
      textareaVal: ''
    };
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleChangeAnchor = event => {
    this.setState({
      anchor: event.target.value,
    });
  };

  onChangeFontSize = (e) => {
    this.setState({
      fontSize: e.target.value
    });
  }

  onChangeFontSizePunc = (e) => {
    this.setState({
      fontSizePunc: e.target.value
    });
  }

  onColorChange = (color) => {
    this.setState({
      color: color.rgb
    });
  }

  onFontFamilyChange = (font) => {
    this.setState({
      fontFamily: font.family
    });
  }

  boldPunctuation = () => {
  }

  dashFunction = () => {
  }

  handleChangeTextArea = (e) => {
    this.setState({
      textareaVal: e.target.value
    })
  }

  clickTextArea= (e) => {
    console.log(this.textAreaRef);
    const ss = this.textAreaRef;
    console.log(window.getSelection().toString());
    if (this.textAreaRef.current) {
      let cursorStart = this.textAreaRef.curent.selectionStart;
      let cursorEnd = this.textAreaRef.curent.selectionEnd;
      const temp = this.state.textareaVal.substring(cursorStart,cursorEnd) ;
      console.log(cursorStart, cursorEnd, this.textAreaRef);
    }
  }

  render() {
    const { classes } = this.props;
    const { anchor, open, fontSize, color, fontFamily, fontSizePunc, textareaVal } = this.state;

    let before = null;
    let after = null;

    if (anchor === 'left') {
      before = <Sidebar {...this.state} routes={appRoutes} onClickDrawerClose={this.handleDrawerClose} />;
    } else {
      after = <Sidebar {...this.state} routes={appRoutes} onClickDrawerClose={this.handleDrawerClose} />;
    }

    return (
      <div className={classes.root}>
        <CssBaseline />
        <div className={classNames(classes.appFrame, "height-100")}>
          <Header {...this.state} onClickDrawerOpen={this.handleDrawerOpen} onChangeAnchor={this.handleChangeAnchor} />
          {before}
          <main
            className={classNames(classes.content, classes[`content-${anchor}`], {
              [classes.contentShift]: open,
              [classes[`contentShift-${anchor}`]]: open,
            })}>
            <div className={classes.drawerHeader}></div>
            <SettingBar fontSize={fontSize}
              onChangeFontSize={this.onChangeFontSize}
              color={color}
              onColorChange={this.onColorChange}
              fontFamily={fontFamily}
              onFontFamilyChange={this.onFontFamilyChange}
              fontSizePunc={fontSizePunc}
              onChangeFontSizePunc={this.onChangeFontSizePunc}
              boldPunctuation={this.boldPunctuation}
              dashFunction={this.dashFunction}
            />
            <TightlyControlledTextarea
              textareaVal={textareaVal}
            />
          </main>
          {after}
        </div>
      </div>
    );
  }
}

AppLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(appLayoutStyle, { withTheme: true })(AppLayout);