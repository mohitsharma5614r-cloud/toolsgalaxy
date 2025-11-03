import React from 'react';
import { ImageCropper } from '../ImageCropper';

export const LinkedInBannerMaker: React.FC<{ title: string }> = ({ title }) => {
  return (
    <ImageCropper
      title={title}
      description="Create a professional LinkedIn banner with the correct 1584x396 pixel aspect ratio."
      aspectRatio={1584 / 396}
      outputWidth={1584}
    />
  );
};
