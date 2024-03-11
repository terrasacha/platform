import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';
import { getUser } from '../../../graphql/queries';
import { v4 as uuidv4 } from 'uuid';

class AdmonProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        id: uuidv4(),
        name: '',
        dateOfBirth: '',
        isProfileUpdated: false,
        addresss: '',
        latitude: '',
        longitude: '',
        cellphone: '',
      },
      isRenderCompleteOrUpdateProfile: false,
      isNewUser: false,
    };
    this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this);
    this.handleCUUser = this.handleCUUser.bind(this);
    this.handleRenderCompleteOrUpdateProfile = this.handleRenderCompleteOrUpdateProfile.bind(this);
  }

  async componentDidMount() {
    await this.loadActualLoggedUser();
  }

  async loadActualLoggedUser() {
    const actualUser = await Auth.currentAuthenticatedUser();
    if (actualUser !== undefined) {
      this.props.setUserIDUsingCognitoSignedUser(actualUser.attributes.sub);
      const filterByUserID = {
        id: actualUser.attributes.sub,
      };
      const result = await API.graphql(graphqlOperation(getUser, filterByUserID));
      if (result.data.getUser === null) {
        await this.setState({ isRenderCompleteOrUpdateProfile: true, isNewUser: true });
      } else {
        if (result.data.getUser.isProfileUpdated === null || !result.data.getUser.isProfileUpdated) {
          await this.setState({ isRenderCompleteOrUpdateProfile: true, isNewUser: false });
        } else {
          await this.setState({
            isRenderCompleteOrUpdateProfile: false,
            isNewUser: false,
          });
          await this.props.setUserGraphQLUser(result.data.getUser);
        }
      }
    }
  }

  async handleOnChangeInputForm(event) {
    this.props.handleOnChangeInputForm(event);
  }

  async handleCUUser(pIsNewUser) {
    this.props.handleCUUser(this.state.isNewUser);
    this.setState({ isRenderCompleteOrUpdateProfile: false });
  }

  async handleRenderCompleteOrUpdateProfile() {
    this.setState({ isRenderCompleteOrUpdateProfile: !this.state.isRenderCompleteOrUpdateProfile });
  }

  render() {
    let { isRenderCompleteOrUpdateProfile } = this.state;
    let { user } = this.props;

    const renderCompleteProfile = () => {
      if (isRenderCompleteOrUpdateProfile) {
        return (
          <div className="container mx-auto p-5">
            <div className='card'>
            <form>
              <div className="mb-3">
                <label htmlFor="formGridUserContactName" className="form-label">
                  Nombre
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="formGridUserContactName"
                  placeholder="Nombre Contacto"
                  name="user.name"
                  value={user.name}
                  onChange={(e) => this.handleOnChangeInputForm(e)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="formGridUserCellphone" className="form-label">
                  Celular
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="formGridUserCellphone"
                  placeholder="573102231282"
                  name="user.cellphone"
                  value={user.cellphone}
                  onChange={(e) => this.handleOnChangeInputForm(e)}
                />
              </div>

              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={this.handleCUUser}
              >
                Actualizar
              </button>
            </form>
            </div>
          </div>
        );
      } else {
        return (
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Celular</th>
                <th>Dirección</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.cellphone}</td>
                <td>{user.addresss}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={(e) => this.handleRenderCompleteOrUpdateProfile(e)}
                  >
                    Actualizar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        );
      }
    };

    return <>{renderCompleteProfile()}</>;
  }
}

export default AdmonProfile;
