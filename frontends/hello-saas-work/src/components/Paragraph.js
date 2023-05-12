import React from 'react';

const Paragraph = props => <p className="Paragraph" dangerouslySetInnerHTML={{ __html: props.richText }} />;

export default Paragraph;
