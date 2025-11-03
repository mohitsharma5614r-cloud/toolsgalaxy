import React from 'react';
import { ImageCropper } from '../ImageCropper';

export const InstagramStoryCropTool: React.FC<{ title: string }> = ({ title }) => {
  return (
    <ImageCropper
      title={title}
      description="Crop your image to the perfect 9:16 aspect ratio for Instagram Stories."
      aspectRatio={9 / 16}
      outputWidth={1080}
    />
  );
};
