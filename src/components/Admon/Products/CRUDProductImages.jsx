import React, { Component } from 'react'
// Bootstrap reemplazado con Tailwind CSS y sistema Terrasacha
// Componentes Terrasacha
import TerrasachaTable, { TerrasachaTableCell, TerrasachaBadge } from "../../common/TerrasachaTable";

export default class CRUDProductImages extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.handleChangeProductImageProperty = this.props.handleChangeProductImageProperty.bind(this)
    }
  render() {
    let {CRUD_Product, isImageUploadingFile, urlS3Image} = this.props

    const renderCRUDProductImages = () => {
        return (
            <TerrasachaTable
                title="🖼️ Gestión de Imágenes del Proyecto"
                subtitle="Configuración y administración de todas las imágenes asociadas al proyecto"
                headers={[
                    'Cargar', 'Vista Previa', 'URL', 'Título', 
                    'Orden', 'En Carrusel', 'Etiqueta', 'Descripción'
                ]}
                data={CRUD_Product.images}
                renderRow={(image) => (
                    <>
                        {/* Columna Cargar */}
                        <TerrasachaTableCell>
                            <div className="space-y-2">
                                <div className="flex flex-col space-y-2">
                                    <label className="form-terrasacha-label text-sm">
                                        📤 Subir Imagen
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="form-terrasacha-input text-sm file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-medium file:bg-terrasacha-primary file:text-white hover:file:bg-terrasacha-primary/80"
                                        onChange={(e) => this.handleChangeProductImageProperty(e, image, 'carouselImage')}
                                    />
                                </div>
                                {renderIsisImageUploadingFile()}
                            </div>
                        </TerrasachaTableCell>

                        {/* Columna Vista Previa */}
                        <TerrasachaTableCell>
                            <div className="flex justify-center">
                                {renderProductImage(image)}
                            </div>
                        </TerrasachaTableCell>

                        {/* Columna URL */}
                        <TerrasachaTableCell variant="secondary">
                            <div className="max-w-32">
                                <p className="text-xs text-terrasacha-secondary1 truncate font-mono" title={image.imageURL}>
                                    {image.imageURL || "Sin URL"}
                                </p>
                            </div>
                        </TerrasachaTableCell>

                        {/* Columna Título */}
                        <TerrasachaTableCell>
                            <input
                                type="text"
                                placeholder="Ej. Imagen del bosque"
                                name="newProductImageTitle"
                                value={image.title || ''}
                                className="form-terrasacha-input text-sm w-full"
                                onChange={(e) => this.handleChangeProductImageProperty(e, image, 'newProductImageTitle')}
                            />
                        </TerrasachaTableCell>

                        {/* Columna Orden */}
                        <TerrasachaTableCell>
                            <input
                                type="number"
                                placeholder="1"
                                name="newProductImageOrder"
                                value={image.order || ''}
                                className="form-terrasacha-input text-sm w-20"
                                onChange={(e) => this.handleChangeProductImageProperty(e, image, 'newProductImageOrder')}
                            />
                        </TerrasachaTableCell>

                        {/* Columna En Carrusel */}
                        <TerrasachaTableCell>
                            <TerrasachaBadge variant={image.isOnCarousel ? 'success' : 'neutral'}>
                                <button
                                    className="bg-transparent border-none text-inherit font-inherit cursor-pointer font-bold"
                                    onClick={(e) => this.handleChangeProductImageProperty(e, image, 'isOnCarousel')}
                                >
                                    {image.isOnCarousel ? '✅ Sí' : '❌ No'}
                                </button>
                            </TerrasachaBadge>
                        </TerrasachaTableCell>

                        {/* Columna Etiqueta Carrusel */}
                        <TerrasachaTableCell>
                            {renderCarouselLabelForm(image)}
                        </TerrasachaTableCell>

                        {/* Columna Descripción Carrusel */}
                        <TerrasachaTableCell>
                            {renderCarouselDescriptionForm(image)}
                        </TerrasachaTableCell>
                    </>
                )}
            />
        )
    }
    const renderIsisImageUploadingFile = () => {
        if (this.state.isImageUploadingFile) {
            return (
                <div className="flex items-center justify-center space-x-2 mt-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-terrasacha-primary"></div>
                    <span className="text-sm text-terrasacha-secondary1 font-typographica">Subiendo...</span>
                </div>
            )
        }
    }
    const renderProductImage = (pImage) => {
        if (pImage.imageURL !== '' && !isImageUploadingFile) {
            return (
                <div className="relative group">
                    <img
                        src={urlS3Image + pImage.imageURL}
                        alt={pImage.title || pImage.id}
                        className="h-20 w-20 object-cover rounded-lg shadow-terrasacha border border-terrasacha-light/20 group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200"></div>
                </div>
            )
        } else {
            return (
                <div className="h-20 w-20 flex items-center justify-center bg-terrasacha-light/10 border border-terrasacha-light/20 rounded-lg">
                    <span className="text-xs text-terrasacha-secondary1 font-typographica">Sin imagen</span>
                </div>
            )
        }
    }
    const renderCarouselLabelForm = (pImage) => {
        if (pImage.isOnCarousel) {
            return (
                <div className="space-y-1">
                    <label className="form-terrasacha-label text-xs">
                        🏷️ Etiqueta
                    </label>
                    <input
                        type="text"
                        placeholder="Ej. Bosque Primario"
                        name="carouselLabel"
                        value={pImage.carouselLabel || ''}
                        className="form-terrasacha-input text-sm w-full"
                        onChange={(e) => this.handleChangeProductImageProperty(e, pImage, 'carouselLabel')}
                    />
                </div>
            )
        } else {
            return (
                <div className="flex items-center justify-center h-12">
                    <TerrasachaBadge variant="neutral">
                        No disponible
                    </TerrasachaBadge>
                </div>
            )
        }
    }
    const renderCarouselDescriptionForm = (pImage) => {
        if (pImage.isOnCarousel) {
            return (
                <div className="space-y-1">
                    <label className="form-terrasacha-label text-xs">
                        📝 Descripción
                    </label>
                    <textarea
                        placeholder="Ej. Imagen que muestra la biodiversidad del bosque..."
                        name="carouselDescription"
                        value={pImage.carouselDescription || ''}
                        rows="3"
                        className="form-terrasacha-input text-sm w-full resize-none"
                        onChange={(e) => this.handleChangeProductImageProperty(e, pImage, 'carouselDescription')}
                    />
                </div>
            )
        } else {
            return (
                <div className="flex items-center justify-center h-12">
                    <TerrasachaBadge variant="neutral">
                        No disponible
                    </TerrasachaBadge>
                </div>
            )
        }
    }

    return (
      <div className="space-y-6 animate-fade-in">
        {renderCRUDProductImages()}
      </div>
    )
  }
}
