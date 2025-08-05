import React, { useState } from 'react';
import { Exchange01Icon, TextWrapIcon } from 'hugeicons-react';
import { InputJsonHandle } from './InputJson';
import AceEditor from 'react-ace';
import { loadSettings } from '../settings/utils';
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import { transform } from '../api/service';
import { IAceEditor } from 'react-ace/lib/types';

export interface OutputJsonProps {
  setErrorMessage: (inputText: string) => void;
  inputTextRef: React.MutableRefObject<InputJsonHandle | null>;
  inputSpecificationRef: React.MutableRefObject<InputJsonHandle | null>;
}

export const OutputJson = ({
                             setErrorMessage,
                             inputTextRef,
                             inputSpecificationRef
                           }: OutputJsonProps) => {
  const settings = loadSettings()
  const [outputText, setOutputText] = useState('');
  const [wordWrapEnabled, setWordWrapEnabled] = useState(true);

  const handleLoad = (editor: IAceEditor) => {
    editor.commands.addCommand({
      name: 'openSearch',
      bindKey: { win: 'Ctrl-F', mac: 'Command-F' },
      exec: (editor) => editor.execCommand('find'),
    });
  };

  const handleTransform = async () => {
    let input = inputTextRef?.current?.getValidated();
    if (!input) {
      return;
    }

    let specification = inputSpecificationRef?.current?.getValidated();
    if (!specification) {
      return;
    }

    try {
      const response = await transform({ input, specification });

      if (response.data.success) {
        const result = await response.data.body;
        setOutputText(JSON.stringify(result, null, 4));
        setErrorMessage('');
      } else {
        console.error(`Failed to process: ${response.status}`);
        setErrorMessage(`Failed to process: ${response.status}`);
        return;
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(`Failed to transform: ${error}`);
    }
  };

  const toggleWordWrap = () => {
    setWordWrapEnabled((prev) => !prev);
  };

  return (
    <>
      <Row>
        <Col xs={{ span: 2, offset: 10 }}>
          <ButtonGroup className={'float-end'}>
            <Button variant={'success'} onClick={handleTransform}>
              <Exchange01Icon />
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
          key={'outputAceEditor'}
          style={{
            resize: 'vertical',
            overflow: 'auto',
            minHeight: '400px',
          }}
          theme={settings['aceTheme'].value}
          onLoad={handleLoad}
          name="outputAceEditor"
          value={outputText}
          fontSize={14}
          width="100%"
          height="640px"
          readOnly
          wrapEnabled={wordWrapEnabled}
          setOptions={{
            wrap: wordWrapEnabled,
            useWorker: false
          }}
          editorProps={{ $blockScrolling: true }}
        />
      </Row>
    </>
  );
};
