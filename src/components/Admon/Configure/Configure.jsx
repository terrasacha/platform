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
                <div className="max-w-lg mx-auto p-4">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Change Logo</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Choose file
                            </label>
                            <input
                                type="file"
                                name="selected_file"
                                onChange={(e) => this.handleInputUploadLogo(e)}
                                className="mt-1 p-2 border rounded-md w-full"
                            />
                        </div>
                        <button
                            disabled={this.state.updatingLogo ? true : false}
                            onClick={() => this.handleUploadLogo()}
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
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
