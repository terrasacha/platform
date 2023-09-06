import React from "react";

import Card from "../../../../common/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { DownloadIcon } from "../../../../common/icons/DownloadIcon";
import { MessagesIcon } from "../../../../common/icons/MessagesIcon";

export default function FilesInfoCard(props) {
  const { className, projectFiles, handleMessageButtonClick } = props;


  return (
    <Card className={className}>
      <Card.Body>
        <Table className="text-center">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Ultima actualización</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="align-middle">
            {projectFiles?.map((file) => {
              return (
                <tr key={file.id}>
                  <td>{file.title}</td>
                  <td>{file.updatedAt}</td>
                  <td className="text-end">
                    <a href={file.url}>
                      <Button
                        className="m-1"
                        size="sm"
                        variant="outline-primary"
                      >
                        <DownloadIcon />
                      </Button>
                    </a>
                    <Button className="m-1" size="sm" variant="outline-primary" onClick={() => handleMessageButtonClick(file.verification)}>
                      <MessagesIcon />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
