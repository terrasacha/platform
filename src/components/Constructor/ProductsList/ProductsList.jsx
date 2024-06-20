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

// Import images
import vacio from '../../views/_images/caja-vacia-gris.png'

export default function ProductsList() {
  const { userProjects } = useUserProjects();

  const userProjectsFiltered = userProjects.filter((project) => project.product.isActiveOnPlatform === true)

  return (
    <>
      <h2 className="mt-5">Tus Proyectos</h2>
      {userProjectsFiltered.length === 0 ? (
        <div className="m-4 text-center pt-6 mt-4">
          <img src={vacio} 
                height="150"
                width="150"
                className="d-inline-block align-top align-center mx-auto mt-3 mb-3 img-vacio"
                alt="ATP"
                />
          <p className="color-grey">No tienes proyectos aún. Para crear el primero, te invitamos a dar click en Postular proyecto</p>
          <Button href="/new_project" variant="primary">Postular Proyecto</Button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-lg-3 g-2 m-4">
          {userProjectsFiltered.map((product, index) => {
            return (
              <div className="p-3" key={index}>
                <Card key={product.id} className="p-0">
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
                    <p className="fs-6 my-2 text-h">{product?.product.description}</p>
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
      )}
    </>
  );
}
