import React, { Component } from 'react';
import { Storage } from 'aws-amplify';

export default class Configure extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileToUpload: null,
            updatingLogo: false
        };
        this.handleInputUploadLogo = this.handleInputUploadLogo.bind(this);
        this.handleUploadLogo = this.handleUploadLogo.bind(this);
    }

    handleInputUploadLogo = (e) => {
        if (e.target.name === 'selected_file') {
            const { target: { files } } = e;
            const [file,] = files || [];
            if (!file) {
                return;
            }
            this.setState({ fileToUpload: file });
        }
    };

    handleUploadLogo = async () => {
        this.setState({ updatingLogo: true });
        let uploadImageResult = null;
        let fileNameSplitByDotfileArray = this.state.fileToUpload.name.split('.');
        // Obtener extensión
        let imageExtension = fileNameSplitByDotfileArray[fileNameSplitByDotfileArray.length - 1];
        let imageName = 'logo.' + imageExtension;
        // Subir la imagen
        uploadImageResult = await Storage.put(imageName, this.state.fileToUpload, {
            level: 'public/',
            contentType: 'image/jpeg',
        });
        console.log(uploadImageResult);
        this.cleanState();
    };

    cleanState() {
        this.setState({
            fileToUpload: null,
            updatingLogo: false
        });
    }

    render() {
        const modalDocument = () => {
            return (
                <div classname="card lg relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 relative flex flex-col relative flex-grow max-w-full flex-1 px-4">
                    <div classname="card-header relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 relative flex flex-col relative flex-grow max-w-full flex-1 px-4">
                        <h5 classname="card-title relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 relative flex flex-col relative flex-grow max-w-full flex-1 px-4">
                        Change Logo
                        </h5>
                    </div>
                    <div classname="card-body relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 relative flex flex-col relative flex-grow max-w-full flex-1 px-4">
                        <div className="mb-3">
                        <div className="form-group">
                            <label>Choose file</label>
                            <input
                            type="file"
                            name="selected_file"
                            onChange={(e) => this.handleInputUploadLogo(e)}
                            className="form-control"
                            />
                        </div>
                        </div>
                        <button
                        disabled={this.state.updatingLogo ? true : false}
                        onClick={() => this.handleUploadLogo()}
                        classname="btninline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline"
                        >
                        {this.state.updatingLogo ? 'Uploading' : 'Upload'}
                        </button>
                    </div>
                    </div>
            );
        };

        return <>{modalDocument()}</>;
    }
}
