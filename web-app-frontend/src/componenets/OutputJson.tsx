import React from 'react';
import AceEditor from 'react-ace';
import { loadSettings } from '../settings/utils';
import { Row } from 'react-bootstrap';
import { IAceEditor } from 'react-ace/lib/types';

export interface OutputJsonProps {
  value: string;
  wrapEnabled: boolean;
}

export const OutputJson = (
  ({
     value,
     wrapEnabled
   }: OutputJsonProps) => {
    const settings = loadSettings()

    const handleLoad = (editor: IAceEditor) => {
      editor.commands.addCommand({
        name: 'openSearch',
        bindKey: { win: 'Ctrl-F', mac: 'Command-F' },
        exec: (editor) => editor.execCommand('find'),
      });
    };

    return (
      <>
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
            value={value}
            fontSize={14}
            width="100%"
            height="640px"
            readOnly
            wrapEnabled={wrapEnabled}
            setOptions={{
              wrap: wrapEnabled,
              useWorker: false
            }}
            editorProps={{ $blockScrolling: true }}
          />
        </Row>
      </>
    );
  }
);
