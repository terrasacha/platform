import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import { TrashIcon } from "components/common/icons/TrashIcon";
import { EditIcon } from "components/common/icons/EditIcon";
import { PlusIcon } from "components/common/icons/PlusIcon";
import { SaveDiskIcon } from "components/common/icons/SaveDiskIcon";
export default function TableEdit({ infoTable, handleEditValue, handleChangeInputValue, columns, handleAddCashFlow, handleSaveHistoricalData, handleDeleteHistoricalData }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (infoTable) {
        setData(infoTable);

    }
  }, [infoTable]);


  return (
    <Table responsive>
      <thead className="text-center">
        <tr>
          {columns.map((column) => {
            return (
              <th scope="col" className="px-6 py-3" key={column}>
                {column.replace("_", " ")}
              </th>
            );
          })}
          <th style={{ width: "120px" }}></th>
        </tr>
      </thead>
      <tbody>
        {data && data.map((row, index) => {
          return (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 "
              key={index}
            >
              {columns.map((column) => (
                <td className="px-6 py-4 text-center" key={column}>
                  {row.editing?
                  <Form.Control
                  size="sm"
                  type="text"
                  value={data[index][column]}
                  className="text-center"
                  name={`input-${column}-${index}`}
                  onChange={(e) => handleChangeInputValue(e)}
                />:
                row[column]
                  }
                </td>
              ))}
              <td className="text-end">
                            {row.editing?
                            <Button
                            size="sm"
                            variant="success"
                            className="m-1"
                            onClick={() => handleSaveHistoricalData(index)}
                          >
                            <SaveDiskIcon />
                          </Button>
                          :
                            <Button
                              size="sm"
                              variant="warning"
                              className="m-1"
                              onClick={() => handleEditValue(index)}
                            >
                              <EditIcon />
                            </Button>}
                            <Button
                              size="sm"
                              variant="danger"
                              className="m-1"
                              onClick={() => handleDeleteHistoricalData(index)}
                            >
                              <TrashIcon />
                            </Button>
                          </td>
            </tr>
          );
        })}
        <tr>
                  <td colSpan={5}>
                    <div className="d-flex">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-100"
                        onClick={() => handleAddCashFlow()}
                      >
                        <PlusIcon></PlusIcon>
                      </Button>
                    </div>
                  </td>
                </tr>
      </tbody>
    </Table>
  );
}
