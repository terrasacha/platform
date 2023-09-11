import React from "react";
//Bootstrap
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";
// GraphQL
import {
  getImagesCategories,
  getYearFromAWSDatetime,
} from "../ProjectPage/utils";
import useUserProjects from "hooks/useUserProjects";

export default function ProductsList() {
  const { userProjects } = useUserProjects();
  return (
    <div className="row row-cols-1 row-cols-lg-3 g-2">
      {userProjects.map((product) => {
        return (
          <div className="col">
            <Card key={product.id}>
              <img
                variant="top"
                src={getImagesCategories(product?.product.categoryID)}
                style={{ height: "150px" }}
                alt="Hola"
              />
              <Card.Body>
                <div className="d-flex">
                  <Stack direction="horizontal" gap={2}>
                    <Badge bg="primary">
                      {getYearFromAWSDatetime(product?.product.createdAt)}
                    </Badge>
                    <Badge bg="primary">{product?.product.categoryID}</Badge>
                  </Stack>
                </div>
                <p className="fs-5 my-2">{product?.product.name}</p>
                <hr className="mb-2" />
                <p className="fs-6 my-2">{product?.product.description}</p>
              </Card.Body>
              <Card.Footer>
                <div className="d-flex justify-content-center align-items-center">
                  <a href={"project/" + product?.product.id}>
                    <Button>Ver más</Button>
                  </a>
                </div>
              </Card.Footer>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
