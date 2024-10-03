import React from 'react';
import { Dropdown } from 'react-bootstrap';

export default function DropDownProjects({ style, className, variant }) {
  return (
    <Dropdown style={style} className={className}>
      <Dropdown.Toggle variant={variant} id="dropdown-basic">
        Ver Proyectos
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item 
          style={{ fontWeight: 800 }} 
          href={process.env.REACT_APP_ENV === 'TEST' ? 'https://test-marketplace-cauca.suan.global' : 'https://marketplace-cauca.suan.global'}
        >
          Cauca marketplace
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item 
          href={process.env.REACT_APP_ENV === 'TEST' ? 'https://test-marketplace.suan.global' : 'https://marketplace.suan.global'}
        >
          Suan marketplace
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
