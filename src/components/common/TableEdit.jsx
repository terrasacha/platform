import Table from "../ui/Table";
import Button from "../ui/Button";
import Form from "../ui/Form";
import { useEffect, useState } from "react";
import { TrashIcon } from "components/common/icons/TrashIcon";
import { EditIcon } from "components/common/icons/EditIcon";
import { PlusIcon } from "components/common/icons/PlusIcon";
import { SaveDiskIcon } from "components/common/icons/SaveDiskIcon";
export default function TableEdit({
  canEdit,
  infoTable,
  handleEditValue,
  handleChangeInputValue,
  columns,
  handleAddCashFlow,
  handleSaveHistoricalData,
  handleDeleteHistoricalData,
  conceptOptions,
}) {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (infoTable) {
      setData(infoTable);
    }
  }, [infoTable]);
  console.log(conceptOptions, "conceptOptions");

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
        {data &&
          data.map((row, index) => {
            return (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 "
                key={index}
              >
                {columns.map((column) => (
                  <td className="px-6 py-4 text-center" key={column}>
                    {row.editing ? (
                      column === "CONCEPTO" ? (
                        <Form.Select
                          size="sm"
                          type="text"
                          value={data[index][column] || ""}
                          className="text-center"
                          name={`input-${column}-${index}`}
                          onChange={(e) => handleChangeInputValue(e)}
                        >
                          <option disabled value=""></option>
                          {conceptOptions.map((op) => (
                            <option value={op.name} key={op.id}>
                              {op.name}
                            </option>
                          ))}
                        </Form.Select>
                      ) : column === "CANTIDAD" ? (
                        <Form.Control
                          size="sm"
                          type="number"
                          value={data[index][column]}
                          className="text-center"
                          name={`input-${column}-${index}`}
                          onChange={(e) => handleChangeInputValue(e)}
                        />
                      ) : (
                        <Form.Control
                          size="sm"
                          type="text"
                          value={data[index][column]}
                          className="text-center"
                          name={`input-${column}-${index}`}
                          onChange={(e) => handleChangeInputValue(e)}
                        />
                      )
                    ) : column === "CANTIDAD" ? (
                      parseFloat(row[column]).toLocaleString('es-ES')
                    ) : (
                      row[column]
                    )}
                  </td>
                ))}
                <td className="text-end">
                  {row.editing ? (
                    <button
                      size="sm"
                      variant="success"
                      className="m-1"
                      onClick={() => handleSaveHistoricalData(index)}
                    >
                      <SaveDiskIcon />
                    </button>
                  ) : (
                    <button
                      size="sm"
                      variant="warning"
                      className="m-1"
                      disabled={canEdit}
                      onClick={() => handleEditValue(index)}
                    >
                      <EditIcon />
                    </button>
                  )}
                  <button
                    size="sm"
                    variant="danger"
                    className="m-1"
                    disabled={canEdit}
                    onClick={() => handleDeleteHistoricalData(index)}
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            );
          })}
        <tr>
          <td colSpan={5}>
            <div className="d-flex">
              <button
                size="sm"
                variant="secondary"
                className="w-100"
                disabled={canEdit}
                onClick={() => handleAddCashFlow()}
              >
                <PlusIcon></PlusIcon>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
