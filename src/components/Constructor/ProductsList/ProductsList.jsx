import React from "react";
// Tailwind CSS
// import TailwindHeaderNavbar from 'components/common/TailwindHeaderNarvbar';

// GraphQL
import {
  getImagesCategories,
  getYearFromAWSDatetime,
} from "../ProjectPage/utils";
import useUserProjects from "hooks/useUserProjects";

export default function ProductsList() {
  const { userProjects } = useUserProjects();
  return (
    <>
      {/* <TailwindHeaderNavbar /> */}

      <h2 className="mt-5 text-3xl font-semibold">Tus Proyectos</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 card_project">
        {userProjects.map((product) => (
          <div className="" key={product.id}>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img
                className="w-full h-40 object-cover mb-4 rounded"
                src={getImagesCategories(product?.product.categoryID)}
                alt="Imagen del proyecto"
              />
              <div className="flex items-center mb-2">
                <span className="bg-primary text-white py-1 px-2 rounded category_label">
                  {getYearFromAWSDatetime(product?.product.createdAt)}
                </span>
                <span className="bg-primary text-white py-1 px-2 rounded category_label">
                  {product?.product.categoryID}
                </span>
              </div>
              <p className="text-xl font-semibold mb-2">
                {product?.product.name}
              </p>
              <hr className="mb-2" />
              <p className=" mb-2">{product?.product.description}</p>
              <div className="flex justify-center">
                <a href={"project/" + product?.product.id}>
                  <button className="bg-primary text-white py-2 px-4 rounded">
                    Ver más
                  </button>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
