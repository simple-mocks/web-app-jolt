import React from 'react';
import AceEditor from 'react-ace';
import { loadSettings } from '../settings/utils';
import { Row } from 'react-bootstrap';
import Feedback from 'react-bootstrap/Feedback';
import { IAceEditor } from 'react-ace/lib/types';
import { ValidationState } from '../common';

export interface InputJsonProps {
  id: string;
  value: string;
  setValue: (value: string) => void;
  wrapEnabled: boolean;
  validation: ValidationState | undefined;
}

export const InputJson = (
  ({
     id,
     value,
     setValue,
     wrapEnabled,
     validation
   }: InputJsonProps) => {
    const settings = loadSettings();

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

    return (
      <>
        <Row className={validation && !validation.valid ? 'is-invalid' : ''}>
          <AceEditor
            mode="json"
            key={`${id}TextArea`}
            className={validation ? (validation.valid ? 'border border-success' : 'border border-danger') : ''}
            style={{
              resize: 'vertical',
              overflow: 'auto',
              minHeight: '400px',
            }}
            theme={settings['aceTheme'].value}
            onLoad={handleLoad}
            name={`${id}AceEditor`}
            onChange={(newValue) => setValue(newValue)}
            value={value}
            fontSize={14}
            width="100%"
            height="640px"
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            wrapEnabled={wrapEnabled}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              showLineNumbers: true,
              enableSnippets: false,
              wrap: wrapEnabled,
              useWorker: false,
              enableMobileMenu: false,
            }}
            editorProps={{ $blockScrolling: true }}
          />
        </Row>
        <Feedback id={`${id}TextAreaFeedback`} type={'invalid'}>
          {validation?.invalidMessage}
        </Feedback>
      </>
    );
  }
);
