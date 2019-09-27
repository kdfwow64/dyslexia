import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextareaAutosize from 'react-textarea-autosize';

export default class NewTextArea extends Component {
    static propTypes = {
        textarea: PropTypes.shape({
            content: PropTypes.string,
            selection: PropTypes.object
        }).isRequired,
        fontSize: PropTypes.number.isRequired,
        fontFamily: PropTypes.string.isRequired,
        color: PropTypes.shape({
            r: PropTypes.string,
            g: PropTypes.string,
            b: PropTypes.string,
            a: PropTypes.string,
        }).isRequired,
        onChange: PropTypes.func.isRequired,
        onChangeSelection: PropTypes.func.isRequired
    };
    constructor(props) {
        super(props);
        // this.state = {
        //     content: '',
        //     selection: { startOffset: 0, endOffset: 0 }
        // };
        this.selectionUpdateEvents = [
            'select'
        ];
    }

    selectionUpdateListener = (e) => {
        this.props.onChangeSelection(this.getSelection(this.textarea), this.textarea.selectionEnd);
        console.log(e);
        // this.setState({
        //     selection: this.getSelection(this.textarea)
        // });
    };

    getSelection = (textareaRef) => ({
        startOffset: textareaRef.selectionStart,
        endOffset: textareaRef.selectionEnd,
    });

    setSelectionToDOM = (textareaRef, selection) => {
        textareaRef.selectionStart = selection.startOffset;
        textareaRef.selectionEnd = selection.endOffset;
    }

    componentDidMount() {
        const addEventListeners = () => this.selectionUpdateEvents.forEach(
            eventType => this.textarea.addEventListener(
                eventType,
                this.selectionUpdateListener
            )
        );
        addEventListeners();
    }

    componentWillUnmount() {
        const removeEventListeners = () => this.selectionUpdateEvents.forEach(
            eventType => this.textarea.removeEventListener(
                eventType,
                this.selectionUpdateListener
            )
        );
        removeEventListeners();
    }

    onChange = () => this.updateTextarea({
        content: this.textarea.value,
        selection: this.getSelection(this.textarea)
    });


    updateTextarea = ({ content, selection }) => {
        const updatedContent = content || this.textarea.value;
        const updatedSelection = selection || this.getSelection(this.textarea);
        this.props.onChange(updatedContent, updatedSelection);
        this.setSelectionToDOM(
            this.textarea,
            updatedSelection
        );
        // this.setState(
        //     {
        //         content: updatedContent,
        //         selection: updatedSelection
        //     },
        //     () => this.setSelectionToDOM(
        //         this.textarea,
        //         updatedSelection
        //     )
        // );
    }

    render() {
        return (
            <TextareaAutosize
                minRows={5}
                className="text-box"
                inputRef={c => { this.textarea = c; }}
                value={this.props.textarea.content}
                onChange={this.onChange}
                style={{
                    fontSize: this.props.fontSize,
                    fontFamily: this.props.fontFamily,
                    color: `rgba(${ this.props.color.r }, ${ this.props.color.g }, ${ this.props.color.b }, ${ this.props.color.a })` }}
            />
        );
    }
}