import React from 'react';

const ListGroup = ({ items }) => {
  return (
    <ul className="list-disc pl-4">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
};

export default ListGroup;
