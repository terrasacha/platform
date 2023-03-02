import React, { Component } from 'react'
import s from './DragArea.module.css'
class DragArea extends Component{
  constructor(props) {
    super(props)
    this.state = {
      ImageSelectedPrevious: null
    }
    this.handleFiles = this.props.handleFiles.bind(this)
  }

  changeImage = (e) => {
    const file = e.target.files[0];
    this.handleFiles(e) // le damos el binario de la imagen para mostrarla en pantalla
    if (e.target.files[0] !== undefined) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (e) => {
        e.preventDefault();
        this.setState({ImageSelectedPrevious: file.name})
      };
    }
  };
  render(){
    return (
      <div className={s.container}>
        <div>
          <br />
          <div className={s.image_upload_wrap}>
            <input
              className={s.file_upload_input}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                this.changeImage(e);
              }}
            />
            <div className={s.text_information}>
              <h3>{this.state.ImageSelectedPrevious !== null?`File ${this.state.ImageSelectedPrevious} added`: "Drag and drop a file or select add Image"}</h3>
            </div>
          </div>
        </div >
      </div>
    );
 }
  
}

export default DragArea;
