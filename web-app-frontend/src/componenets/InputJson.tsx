import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { AiBeautifyIcon, CheckmarkSquare01Icon, TextWrapIcon } from 'hugeicons-react';
import { prettifyJson, validateJson } from '../utils/validators';
import AceEditor from 'react-ace';
import { loadSettings } from '../settings/utils';
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import Feedback from 'react-bootstrap/Feedback';
import { IAceEditor } from 'react-ace/lib/types';

export interface InputJsonProps {
  id: string;
  defaultValue: string;
}

export interface InputJsonHandle {
  getValidated: () => string;
}

export const InputJson = forwardRef<InputJsonHandle, InputJsonProps>(
  ({ id, defaultValue }: InputJsonProps, ref) => {
    const settings = loadSettings();

    const [inputText, setInputText] = useState(defaultValue);
    const [inputTextInvalid, setInputTextInvalid] = useState('');
    const [inputTextValid, setInputTextValid] = useState(false);
    const [wordWrapEnabled, setWordWrapEnabled] = useState(true);

    const handleLoad = (editor: IAceEditor) => {
      editor.commands.addCommand({
        name: 'openSearch',
        bindKey: { win: 'Ctrl-F', mac: 'Command-F' },
        exec: (editor) => editor.execCommand('find'),
      });

      editor.commands.addCommand({
        name: 'openReplace',
        bindKey: { win: 'Ctrl-H', mac: 'Command-H' },
        exec: (editor) => editor.execCommand('replace'),
      });
    };

    useImperativeHandle(ref, () => ({
      getValidated: () => {
        return validateInputText();
      },
    }));

    const handleInputChange = (newValue: string) => {
      setInputText(newValue);
    };

    const validateInputText = () => {
      const validationStatus = validateJson(inputText);
      if (validationStatus.status) {
        setInputTextInvalid('');
        setInputTextValid(true);
        return validationStatus.message;
      }
      setInputTextInvalid(validationStatus.message);
      setInputTextValid(false);
      return null;
    };

    const prettifyInputText = () => {
      const prettifyStatus = prettifyJson(inputText);
      if (prettifyStatus.status) {
        setInputTextInvalid('');
        setInputTextValid(true);
        setInputText(prettifyStatus.message);
      } else {
        setInputTextInvalid(prettifyStatus.message);
        setInputTextValid(false);
      }
    };

    const toggleWordWrap = () => {
      setWordWrapEnabled((prev) => !prev);
    };

    return (
      <>
        <Row>
          <Col xs={{span: 2, offset: 10}}>
            <ButtonGroup className={'float-end'}>
              <Button variant={'primary'} title="Beautify" onClick={prettifyInputText}>
                <AiBeautifyIcon />
              </Button>
              <Button
                variant={'success'}
                title="Validate"
                onClick={validateInputText}>
                <CheckmarkSquare01Icon />
              </Button>
              <Button
                variant={'primary'}
                className={`${(wordWrapEnabled ? 'active' : '')}`}
                title={wordWrapEnabled ? 'Unwrap' : 'Wrap'}
                onClick={toggleWordWrap}
              >
                <TextWrapIcon />
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
        <Row>
          <AceEditor
            mode="json"
            key={`${id}TextArea`}
            className={`${(inputTextInvalid === '' ? '' : 'border border-danger')} ${(inputTextValid ? 'border border-success' : '')}`}
            style={{
              resize: 'vertical',
              overflow: 'auto',
              minHeight: '400px',
            }}
            theme={settings['aceTheme'].value}
            onLoad={handleLoad}
            name={`${id}AceEditor`}
            onChange={handleInputChange}
            value={inputText}
            fontSize={14}
            width="100%"
            height="640px"
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            wrapEnabled={wordWrapEnabled}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              showLineNumbers: true,
              enableSnippets: false,
              wrap: wordWrapEnabled,
              useWorker: false,
              enableMobileMenu: false,
            }}
            editorProps={{ $blockScrolling: true }}
          />
          <Feedback id={`${id}TextAreaFeedback`} type={'invalid'}>
            {inputTextInvalid}
          </Feedback>
        </Row>
      </>
    );
  }
);
