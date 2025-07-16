import React from "react";
import ProductsList from "./ProductsList/ProductsList";
import NewHeaderNavbar from "components/common/NewHeaderNavbar";
import { Row } from "react-bootstrap";

export default function ConstructorAdmon() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-lime-50 pt-16">
      <Row>
        <NewHeaderNavbar />
      </Row>
      <div className="flex justify-center px-2 md:px-0">
        <div className="w-full max-w-7xl mt-8 mb-8 bg-white rounded-2xl shadow-2xl md:p-8">
          <ProductsList />
        </div>
      </div>
    </div>
  );
}
