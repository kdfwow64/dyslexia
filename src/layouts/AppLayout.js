import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Row } from 'reactstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TextareaAutosize from 'react-textarea-autosize';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Speech from 'speak-tts';

import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import appRoutes from '../routes/app';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SettingBar from '../components/SettingBar';
import NewTextArea from '../components/NewTextArea';
import ModernTextArea from '../components/ModernTextArea';
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
      loading: false,
      editorState: EditorState.createEmpty(),
      selectedText: ''
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
    var content = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
    preSuffixes.map((item, index) => {
      content = content.replace(item.word, item.wordWithDash);
    });
    suffixes.map((item, index) => {
      content = content.replace(item.word, item.wordWithDash);
    });
    let editorState = EditorState.createEmpty();
    if (htmlToDraft(content)) {
      const contentBlock = htmlToDraft(content);
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      editorState = EditorState.createWithContent(contentState);
    }
    this.setState({
      editorState
    });
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

    const temp = this.state.selectedText.replace(/(\r\n|\n|\r)/gm, "");

    speech.speak({
        text: temp,
    }).then(() => {
        console.log("Success !")
    }).catch(e => {
        console.error("An error occurred :", e)
    })
  }

  seeDefinition = () => {
    var temp = this.state.selectedText.replace(/(\r\n|\n|\r)/gm, "");
    temp = temp.replace(/(\r\n|\n|\r)/gm, "");
    temp = temp.replace(/ /g, "");

    fetch("https://www.dictionaryapi.com/api/v3/references/sd4/json/"+temp+"?key=fcf06d2f-d3f8-45b9-a94d-d9c9d40ee515", {
          "method": "GET"
        })
          .then(response => response.json())
          .then(data => {
            var definition = '';
            if('shortdef' in data[0]) {
              definition = data[0].shortdef;
            }

            this.setState({
              definitionValue: temp,
              definitionDescription: definition,
              loading: false
            });
          })
          .catch(err => {
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
            console.log(definition);
            this.setState({
              definitionValue: temp,
              definitionDescription: definition,
              loading: false
            });
          })
          .catch(err => {

          });
              });


    this.closeOptionPopup();
    this.setState({
      loading: true
    });
  }

  updateEditorState = (editorState) => {
    this.setState({
      editorState
    });
    if (editorState.getSelection().getStartOffset() !== editorState.getSelection().getEndOffset()) {
      var selectedText = editorState.getCurrentContent().getPlainText().substring(editorState.getSelection().getStartOffset(), editorState.getSelection().getEndOffset());
      this.setState({
        selectedText
      });
      this.openOptionPopup();
    }
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
                <ModernTextArea editorState={this.state.editorState}
                  onEditorStateChange={this.updateEditorState}
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