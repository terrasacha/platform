// Table.js
import React from 'react';

const Table = ({ children }) => {
  return (
    <table className="table-auto w-full">
      <tbody>{children}</tbody>
    </table>
  );
};

export default Table;
