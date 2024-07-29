import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ImageView = ({ src, alt, className }) => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validateImage = (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    };

    validateImage(src).then(setIsValid(true));
  }, [src]);

  return (
    <View className={className}>
      <img
        src={isValid ? src : 'placeholder_image_link_here'} 
        alt={alt}
        className="w-full h-full object-cover"
      />
    </View>
  );
};

const View = styled.div`
    width: 200px;
    height: 200px;
`

export default ImageView;
