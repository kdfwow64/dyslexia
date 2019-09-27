import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Row } from 'reactstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TextareaAutosize from 'react-textarea-autosize';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Speech from 'speak-tts';

import appRoutes from '../routes/app';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SettingBar from '../components/SettingBar';
import NewTextArea from '../components/NewTextArea';
import PopupMenu from '../components/PopupMenu';
import Spinner from '../components/Spinner';
import appLayoutStyle from '../assets/jss/appLayoutStyle';
import { suffixes, preSuffixes } from '../config/suffixes';
import './style.css';


class AppLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchor: 'left',
      fontSize: 18,
      fontSizePunc: 12,
      color: {
        r: '0',
        g: '0',
        b: '0',
        a: '1',
      },
      fontFamily: 'Open Sans',
      textarea: {
        content: '',
        selection: { startOffset: 0, endOffset: 0 }
      },
      definitionValue: '',
      definitionDescription: '',
      isOpenOptionPopup: false,
      loading: false
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
    var content = this.state.textarea.content;
    preSuffixes.map((item, index) => {
      content = content.replace(item.word, item.wordWithDash);
    });
    suffixes.map((item, index) => {
      content = content.replace(item.word, item.wordWithDash);
    });
    this.setState({
      textarea: {
        ...this.state.textarea,
        content
      }
    });
  }

  handleChangeTextArea = (e) => {
    this.setState({
      textareaVal: e.target.value
    })
  }

  onChangeTextArea = (value, offset) => {
    this.setState({
      textarea: {
        content: value,
        selection: offset
      }
    });
    if(value === '') {
      this.closeOptionPopup();
    }
  }

  onChangeSelection = (offset, selectionEnd) => {
    this.setState({
      textarea: {
        ...this.state.textarea,
        selection: offset
      }
    });
    if( offset.startOffset !== offset.endOffset) {
      this.openOptionPopup();
    }
  }

  changeDefinitionValue = (e) => {
    this.setState({
      definitionValue: e.target.value
    });
  }

  openOptionPopup = () => {
    this.setState({
      isOpenOptionPopup: true
    });
  }

  closeOptionPopup = () => {
    this.setState({
      isOpenOptionPopup: false
    });
  }

  readWords = () => {
    this.closeOptionPopup();
    const speech = new Speech();
    if(speech.hasBrowserSupport()) { // returns a boolean
        console.log("speech synthesis supported");
    }
    speech
    .init({
      volume: 0.5,
      lang: "en-GB",
      rate: 1,
      pitch: 1,
      //'voice':'Google UK English Male',
      //'splitSentences': false,
      listeners: {
        onvoiceschanged: voices => {
          console.log("Voices changed", voices);
        }
      }
    });

    const temp = this.state.textarea.content.substr(
      this.state.textarea.selection.startOffset, this.state.textarea.selection.endOffset
    );

    speech.speak({
        text: temp,
    }).then(() => {
        console.log("Success !")
    }).catch(e => {
        console.error("An error occurred :", e)
    })
  }

  seeDefinition = () => {
    const temp = this.state.textarea.content.substr(
      this.state.textarea.selection.startOffset, this.state.textarea.selection.endOffset
    ).replace(" ", "");
    
    this.closeOptionPopup();
    this.setState({
      loading: true
    });

    fetch("http://mydictionaryapi.appspot.com/?define="+temp+"&lang=en", {
      "method": "GET"
    })
      .then(response => response.json())
      .then(data => {
        const keys = Object.keys(data[0].meaning);
        var definition = '';
        for(var i = 0; i< keys.length;i++) {
          definition += keys[i] + ": \r\n";
          data[0].meaning[keys[i]].map((item, index) => {
            definition += "\r\n \t";
            definition += "-" + item.definition;
          });
        }
        this.setState({
          definitionValue: temp,
          definitionDescription: definition,
          loading: false
        });
      })
      .catch(err => {
        this.setState({
          definitionValue: temp,
          definitionDescription: "No Description!",
          loading: false
        });
      });
  }

  render() {
    const { classes } = this.props;
    const { anchor, open, fontSize, color, fontFamily, fontSizePunc, textarea, definitionValue, definitionDescription, isOpenOptionPopup, loading } = this.state;

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
            className={classNames(classes.content, "main", classes[`content-${anchor}`], {
              [classes.contentShift]: open,
              [classes[`contentShift-${anchor}`]]: open,
            })}>
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
            <div className="main-content">
              <Row>
                <label>MainTextArea</label>
                {
                  isOpenOptionPopup &&
                    <PopupMenu
                      close={this.closeOptionPopup}
                      read={this.readWords}
                      see={this.seeDefinition}
                    />
                }
                <NewTextArea
                  fontSize={fontSize}
                  fontFamily={fontFamily}
                  color={color}
                  textarea={textarea}
                  onChange={this.onChangeTextArea}
                  onChangeSelection={this.onChangeSelection}
                />
              </Row>
              <Row>
                <p className="p-definition-box">
                  <label>Definition box</label>
                </p>
                <input
                  disabled
                  value={definitionValue}
                  onChange={this.changeDefinitionValue}
                  className="input-definition-box"
                />
              </Row>
              <Row>
                <TextareaAutosize
                  minRows={3}
                  disabled
                  value={definitionDescription}
                  className="input-definition-description"
                />
              </Row>
            </div>
          </main>
          {after}
        </div>
        <Spinner loading={loading} />
      </div>
    );
  }
}

AppLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(appLayoutStyle, { withTheme: true })(AppLayout);