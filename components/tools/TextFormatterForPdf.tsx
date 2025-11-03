
import React from 'react';
import { ToolPlaceholder } from '../ToolPlaceholder';

export const TextFormatterForPdf: React.FC<{ title: string }> = ({ title }) => {
  return <ToolPlaceholder title={title} />;
};
