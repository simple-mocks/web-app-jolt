import React, { useRef, useState } from 'react';
import { InputJson, InputJsonHandle } from './InputJson';
import { OutputJson } from './OutputJson';
import { Alert, Col, Container, Nav, Row } from 'react-bootstrap';

export const JoltTransformer = () => {
  const inputTextRef = useRef<InputJsonHandle>(null);
  const inputSpecificationRef = useRef<InputJsonHandle>(null);
  const [showMode, setShowMode] = useState<'input' | 'specification' | 'output'>('input');

  const [errorMessage, setErrorMessage] = useState('');

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
        <Col xs={12} hidden={showMode !== "input"}>
          <InputJson
            ref={inputTextRef}
            id="input"
            defaultValue={'{}'}
          />
        </Col>
        <Col xs={12} hidden={showMode !== "specification"}>
          <InputJson
            ref={inputSpecificationRef}
            id="inputSpecification"
            defaultValue={'[]'}
          />
        </Col>
        <Col xs={12} hidden={showMode !== "output"}>
          <OutputJson
            inputTextRef={inputTextRef}
            inputSpecificationRef={inputSpecificationRef}
            setErrorMessage={setErrorMessage}
          />
        </Col>
      </Row>
    </Container>
  );
};
