import React from 'react';
import { styled } from '@mui/system';

const StyledDiv = styled('div')({
  color: 'darkslateblue',
  backgroundColor: 'aliceblue',
  padding: 8,
  borderRadius: 4,
});

const TestApp: React.FC = () => {
  return (
    <StyledDiv>
      <h1>Hello, World!</h1>
      <p>This is a test component with Material-UI styling.</p>
    </StyledDiv>
  );
};

export default TestApp;