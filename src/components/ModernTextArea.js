import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import Color from './Color';
import './style.css';
export default class ModernTextArea extends Component {
    static propTypes = {
        editorState: PropTypes.object,
        onEditorStateChange: PropTypes.func.isRequired
    };

    static defaultProps = {
        editorState: EditorState.createEmpty()
    };

    render() {
        return (
            <Editor wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                editorState={this.props.editorState}
                onEditorStateChange={this.props.onEditorStateChange}
                toolbar={{
                    colorPicker: { component: Color },
                }}
            />
        );
    }
}