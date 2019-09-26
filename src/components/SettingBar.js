import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FontPicker from "font-picker-react";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { Row } from 'reactstrap';
import { fontSizeLists } from '../config/fontSizeLists';
import ColorButton from './ColorButton';

class SettingBar extends Component {
  boldPunctuation = (e) => {

  }

  dash = (e) => {

  }
  render() {
    const { fontSize, onChangeFontSize, color, onColorChange, fontFamily, onFontFamilyChange, fontSizePunc, onChangeFontSizePunc, boldPunctuation, dashFunction } = this.props;

    return (
      <AppBar position="static" color="default">
        <Toolbar>
          <Row>
            <Grid container justify="center">
              <Grid item className="each-item">
                <label className="title">Font Size : </label>
                <Paper>
                  <TextField
                    id="persistent-anchor"
                    select
                    value={fontSize}
                    onChange={onChangeFontSize}
                  >
                    {
                      fontSizeLists.map((item, index) => {
                        return (
                          <MenuItem key={index} value={item}>{item}</MenuItem>
                        )
                      })
                    }
                  </TextField>
                </Paper>
              </Grid>

              <Grid item className="each-item">
                <label className="title">Color : </label>
                <Paper>
                  <ColorButton color={color} onColorChange={onColorChange} />
                </Paper>
              </Grid>

              <Grid item className="each-item">
                <label className="title">Font Family : </label>
                <Paper>
                  <FontPicker
                    apiKey="AIzaSyCCqgj2ksV24uMjyw64bzuDQanu-5E3HMc"
                    activeFontFamily={fontFamily}
                    onChange={onFontFamilyChange}
                  />
                </Paper>
              </Grid>
              <Grid item className="each-item">
                <label className="title">Punctuation Size : </label>
                <Paper>
                  <TextField
                    select
                    value={fontSizePunc}
                    onChange={onChangeFontSizePunc}
                  >
                    {
                      fontSizeLists.map((item, index) => {
                        return (
                          <MenuItem key={index} value={item}>{item}</MenuItem>
                        )
                      })
                    }
                  </TextField>
                </Paper>
              </Grid>

              <Grid item className="each-item">
                {/* <label className="title"> : </label> */}
                <Paper>
                  <Button variant="contained" color="primary" onClick={boldPunctuation}>
                    Bold Punctuation
                  </Button>
                </Paper>
              </Grid>

              <Grid item className="each-item">
                {/* <label className="title">Dash button : </label> */}
                <Paper>
                  <Button variant="contained" color="primary" onClick={dashFunction}>
                    Dash button
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Row>
        </Toolbar>
      </AppBar>
    );
  }
}

// SettingBar.propTypes = {
//   anchor: PropTypes.string.isRequired,
//   onChangeAnchor: PropTypes.func.isRequired
// };

export default SettingBar;