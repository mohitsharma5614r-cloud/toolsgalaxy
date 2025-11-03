import React from 'react';
import { ImageCropper } from '../ImageCropper';

export const TwitterHeaderCropper: React.FC<{ title: string }> = ({ title }) => {
  return (
    <ImageCropper
      title={title}
      description="Crop your image to the 1500x500 pixel aspect ratio for a perfect Twitter header."
      aspectRatio={1500 / 500}
      outputWidth={1500}
    />
  );
};
