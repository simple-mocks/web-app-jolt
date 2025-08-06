import React, { useState } from 'react';
import { InputJson } from './InputJson';
import { OutputJson } from './OutputJson';
import { Alert, Button, Col, Container, Nav, Row } from 'react-bootstrap';
import {
  FluentCheckboxChecked16Regular,
  FluentMagicWand16Regular,
  FluentPlayCircle24Filled,
  FluentTextWrap20Regular,
  FluentTextWrapOff20Regular
} from '../const/icons';
import { prettifyJson, validateJson } from '../utils/validators';
import { ValidationState } from '../common';
import { transform } from '../api/service';


const validateInputText = (
  value: string,
  setValidation: (validation: ValidationState) => void
) => {
  const validationStatus = validateJson(value);
  if (validationStatus.status) {
    setValidation({
      valid: true,
    });
    return validationStatus.message;
  }
  setValidation({
    valid: false,
    invalidMessage: validationStatus.message,
  });
  return null;
};

const prettifyInputText = (
  value: string,
  setValue: (newValue: string) => void,
  setValidation: (validation: ValidationState) => void
) => {
  const prettifyStatus = prettifyJson(value);
  if (prettifyStatus.status) {
    setValidation({
      valid: true,
    });
    setValue(prettifyStatus.message);
  } else {
    setValidation({
      valid: false,
      invalidMessage: prettifyStatus.message,
    });
  }
};

export const JoltTransformer = () => {
  const [inputJsonValue, setInputJsonValue] = useState<string>('{}')
  const [inputJsonWrapEnabled, setInputJsonWrapEnabled] = useState(false)
  const [inputJsonValidation, setInputJsonValidation] = useState<ValidationState>()
  const [specificationValue, setSpecificationValue] = useState<string>('[]')
  const [specificationWrapEnabled, setSpecificationWrapEnabled] = useState(false)
  const [specificationValidation, setSpecificationValidation] = useState<ValidationState>()
  const [outputJsonValue, setOutputJsonValue] = useState<string>('')
  const [outputJsonWrapEnabled, setOutputJsonWrapEnabled] = useState(false)
  const [showMode, setShowMode] = useState<'input' | 'specification' | 'output'>('input');

  const [errorMessage, setErrorMessage] = useState('');

  const handleTransform = async () => {
    const input = validateInputText(inputJsonValue, setInputJsonValidation);
    if (!input) {
      setErrorMessage('Empty or invalid input.');
      return;
    }

    const specification = validateInputText(specificationValue, setSpecificationValidation);
    if (!specification) {
      setErrorMessage('Empty or invalid specification.');
      return;
    }

    try {
      const response = await transform({ input, specification });

      if (response.data.success) {
        const result = await response.data.body;
        setOutputJsonValue(JSON.stringify(result, null, 4));
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

  return (
    <Container fluid>
      <Row>
        <Nav className={'mt-2'} justify variant="tabs" defaultActiveKey="input" activeKey={showMode}>
          <Nav.Item>
            <Nav.Link eventKey="input" onClick={() => setShowMode('input')}>Input</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="specification" onClick={() => setShowMode('specification')}>Specification</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="output" onClick={() => setShowMode('output')}>Output</Nav.Link>
          </Nav.Item>
          {showMode === 'input' && (
            <Nav.Item>
              <div className="d-grid gap-2 d-flex justify-content-end">
                <Button
                  size={'sm'}
                  variant={'primary'}
                  title="Beautify"
                  onClick={() => prettifyInputText(inputJsonValue, setInputJsonValue, setInputJsonValidation)}>
                  <FluentMagicWand16Regular />
                </Button>
                <Button
                  size={'sm'}
                  variant={'success'}
                  title="Validate"
                  onClick={() => validateInputText(inputJsonValue, setInputJsonValidation)}>
                  <FluentCheckboxChecked16Regular />
                </Button>
                <Button
                  size={'sm'}
                  variant={'primary'}
                  className={`${(inputJsonWrapEnabled ? 'active' : '')}`}
                  title={inputJsonWrapEnabled ? 'Unwrap' : 'Wrap'}
                  onClick={() => setInputJsonWrapEnabled((prev) => !prev)}
                >
                  {inputJsonWrapEnabled && (<FluentTextWrap20Regular />)}
                  {!inputJsonWrapEnabled && (<FluentTextWrapOff20Regular />)}
                </Button>
              </div>
            </Nav.Item>
          )}
          {showMode === 'specification' && (
            <Nav.Item>
              <div className="d-grid gap-2 d-flex justify-content-end">
                <Button
                  size={'sm'}
                  variant={'primary'}
                  title="Beautify"
                  onClick={() => prettifyInputText(specificationValue, setSpecificationValue, setSpecificationValidation)}>
                  <FluentMagicWand16Regular />
                </Button>
                <Button
                  size={'sm'}
                  variant={'success'}
                  title="Validate"
                  onClick={() => validateInputText(specificationValue, setSpecificationValidation)}>
                  <FluentCheckboxChecked16Regular />
                </Button>
                <Button
                  size={'sm'}
                  variant={'primary'}
                  className={`${(specificationWrapEnabled ? 'active' : '')}`}
                  title={specificationWrapEnabled ? 'Unwrap' : 'Wrap'}
                  onClick={() => setSpecificationWrapEnabled((prev) => !prev)}
                >
                  {specificationWrapEnabled && (<FluentTextWrap20Regular />)}
                  {!specificationWrapEnabled && (<FluentTextWrapOff20Regular />)}
                </Button>
              </div>
            </Nav.Item>
          )}
          {showMode === 'output' && (
            <Nav.Item>
              <div className="d-grid gap-2 d-flex justify-content-end">
                <Button
                  size={'sm'}
                  variant={'success'}
                  onClick={handleTransform}>
                  <FluentPlayCircle24Filled />
                </Button>
                <Button
                  size={'sm'}
                  variant={'primary'}
                  className={`${(outputJsonWrapEnabled ? 'active' : '')}`}
                  title={outputJsonWrapEnabled ? 'Unwrap' : 'Wrap'}
                  onClick={() => setOutputJsonWrapEnabled((prev) => !prev)}
                >
                  {outputJsonWrapEnabled && (<FluentTextWrap20Regular />)}
                  {!outputJsonWrapEnabled && (<FluentTextWrapOff20Regular />)}
                </Button>
              </div>
            </Nav.Item>
          )}
        </Nav>
      </Row>
      {errorMessage && (
        <Row>
          <Row className="mt-3">
            <Col>
              <Alert variant={'danger'} role="alert">
                {errorMessage}
              </Alert>
            </Col>
          </Row>
        </Row>
      )}
      <Row>
        <Col xs={12} hidden={showMode !== 'input'}>
          <InputJson
            id="input"
            value={inputJsonValue}
            setValue={setInputJsonValue}
            wrapEnabled={inputJsonWrapEnabled}
            validation={inputJsonValidation}
          />
        </Col>
        <Col xs={12} hidden={showMode !== 'specification'}>
          <InputJson
            id="inputSpecification"
            value={specificationValue}
            setValue={setSpecificationValue}
            wrapEnabled={specificationWrapEnabled}
            validation={specificationValidation}
          />
        </Col>
        <Col xs={12} hidden={showMode !== 'output'}>
          <OutputJson
            value={outputJsonValue}
            wrapEnabled={outputJsonWrapEnabled}
          />
        </Col>
      </Row>
    </Container>
  );
};
