import React, { } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles

const modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
];

const TextEditor = ({value, setValue}) => {
  // const [value, setValue] = useState('');

  return (
    <div className=''>
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={setValue} 
        modules={modules}
        formats={formats}
        
      />
    </div>
  );
};

export default TextEditor;
