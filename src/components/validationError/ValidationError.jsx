import React from 'react';
import s from './ValidationError.module.css';

const ValidationError = () => {
  return (
    <div className={s.mensaje}>
      <p>Usted no se encuentra validado todavía, comunicarse con X</p>
    </div>
  );
};

export default ValidationError;