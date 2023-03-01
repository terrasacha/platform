import { useState } from "react";
import s from './DragArea.module.css'
function DragArea() {
  const [ImageSelectedPrevious, setImageSelectedPrevious] = useState(null);
  const changeImage = (e) => {
    console.log(e.target.files);
    if (e.target.files[0] !== undefined) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (e) => {
        e.preventDefault();
        setImageSelectedPrevious(e.target.result); // le damos el binario de la imagen para mostrarla en pantalla
      };
    }
  };
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
              changeImage(e);
            }}
          />
          <div className={s.text_information}>
            <h3>Drag and drop a file or select add Image</h3>
          </div>
        </div>
      </div >
    </div>
  );
}

export default DragArea;
