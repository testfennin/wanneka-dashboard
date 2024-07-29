import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageDropzone = ({saveImages, defaultImages, small, maxFiles}) => {
  const [images, setImages] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));

    setImages(prevImages => [...prevImages, ...newImages]);
    if(maxFiles){
      saveImages(newImages[0])
    }else{
      saveImages([...images, ...newImages])
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxFiles: maxFiles || null
  });

  useEffect(()=>{
    if(defaultImages){
      defaultImages?.forEach(img=>{
        setImages(prev=>[...prev, img?.file])
      })
    }
    // setImages(prev=>[...prev, ])
  }, [defaultImages])

  return (
    <div className='w-full'>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #cccccc',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer'
        }}
      >
        <input {...getInputProps()} />
        <div className="w-full flex justify-center mb-2">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="text-3xl text-green-500" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>
        </div>
        {isDragActive ? (
          <p>Drop the images here ...</p>
        ) : (
          <p>Drag & drop some images here, or click to select images</p>
        )}
        <em className="text-xs text-gray-400">(Only *.jpeg, *.webp and *.png images will be accepted)</em>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
        {(maxFiles ? images.slice(0,1):images).map((file, index) => (
          <div key={index} style={{ margin: '10px' }}>
            <img
              src={file.preview || file}
              alt={`preview-${index}`}
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
            <div className='cursor-pointer hover:text-red-500' onClick={()=>{
              let imgs = [...images];
              imgs.splice(index,1);
              setImages(imgs)
            }}><small>Remove</small></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageDropzone;
