import React from 'react';
import ReactDOM from 'react-dom';
import Basic from './Basic';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Basic />, div);
  ReactDOM.unmountComponentAtNode(div);
});
