const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })
const cognito = new AWS.CognitoIdentityServiceProvider()

const USER_POOL_ID = process.env.USER_POOL_ID;

exports.handler = async (event) => {
  for (const record of event.Records) {
    console.log(record.eventID);
    console.log(record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);
    if (record.eventName === 'REMOVE' && record.dynamodb.OldImage && record.dynamodb.OldImage.role.S === 'validator' && record.dynamodb.OldImage.isProfileUpdated.BOOL) {
      const id = record.dynamodb.OldImage.id.S;
      const usuario = record.dynamodb.OldImage.name.S;

      console.log(id, usuario);

      const params = {
        UserPoolId: USER_POOL_ID,
        Username: usuario.toLowerCase(),
      };

      try {
        await cognito.adminDeleteUser(params).promise();
        console.log('Usuario eliminado exitosamente');
        return { status: 'success', msg: 'User deleted from Cognito' };
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        return { status: 'error', msg: 'An error occurred during processing' };
      }
    }
  }
};
