import * as React from 'react';
import { EditableArea } from '@magnolia/react-editor';

export default function HomePage(props) {

  const { main, title } = props;
  return (
    <>
      <div className='Main'>
        {main && <EditableArea className='Area' content={main} />}
      </div>
    </>
  );
}