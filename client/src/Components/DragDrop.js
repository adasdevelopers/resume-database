import {Component} from 'react'
import {useCallback} from 'react'
import Dropzone from 'react-dropzone'
import React from 'react';
import {useDropzone} from 'react-dropzone';

function DragDrop(props) {

    const onDrop = useCallback(acceptedFiles => {
        console.log("success")
      }, [])

    const {
      acceptedFiles,
      getRootProps,
      getInputProps
    } = useDropzone({
      accept: '.pdf,.doc,.docx'
    });

    useDropzone({onDrop});

    const acceptedFileItems = acceptedFiles.map(file => (
      <li key={file.path}>
        {file.path} - {file.size} bytes
      </li>
    ));
  
    return (
      <section className="container">
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
          <em>(Only *.pdf,*.docx and *.doc files will be accepted)</em>
        </div>
        <aside>
          <h4>Accepted files</h4>
          <ul>{acceptedFileItems}</ul>
        </aside>
      </section>
    );
  }
  




export default DragDrop;