import React, { Component } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';


class EmailVerification extends Component {
    render() {
        return (
            <div>
                
            </div>
        );
    }
}

export default withAuthenticator(EmailVerification, {
    includeGreetings: true,
    confirmVerifyUser: {
        confirmation_code: {
          label: 'New Label',
          placeholder: 'Enter your Confirmation Code Che!:',
          isRequired: false,
        },
    },
    socialProviders: ['amazon', 'apple', 'facebook', 'google'],
    signUpConfig: {
        hiddenDefaults: ['phone_number'],
        signUpFields: [
        { label: 'Name', key: 'name', required: true, type: 'string' }
    ]
}})