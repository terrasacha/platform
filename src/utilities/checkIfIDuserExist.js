import { listUsers } from "../graphql/queries";
import { API, graphqlOperation } from "aws-amplify";
import { v4 as uuidv4 } from 'uuid'

export default async function checkIfUserExists(id){
    const users = await API.graphql(graphqlOperation(listUsers))
        if (users.includes(id)) {
          // El ID existe en el array, generamos otro ID y volvemos a comprobar
          const nuevoId = uuidv4().split('-')[4];
          return checkIfUserExists(nuevoId);
        } else {
          // El ID no existe en el array
          return id;
        }
    }
      