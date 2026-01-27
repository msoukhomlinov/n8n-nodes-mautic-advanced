import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class MauticAdvancedApi implements ICredentialType {
  name = 'mauticAdvancedApi';

  displayName = 'Mautic Advanced API';

  documentationUrl = 'mautic';

  properties: INodeProperties[] = [
    {
      displayName: 'URL',
      name: 'url',
      type: 'string',
      default: '',
      placeholder: 'https://name.mautic.net',
    },
    {
      displayName: 'Mautic Version',
      name: 'mauticVersion',
      type: 'options',
      default: 'v6',
      options: [
        {
          name: 'v6 or lower',
          value: 'v6',
          description: 'Use legacy v1 API endpoints.',
        },
        {
          name: 'v7 or higher',
          value: 'v7',
          description: 'Use v2 API endpoints where available.',
        },
      ],
      description:
        'Select the major Mautic version of this instance so the node can route API calls correctly.',
    },
    {
      displayName: 'Username',
      name: 'username',
      type: 'string',
      default: '',
    },
    {
      displayName: 'Password',
      name: 'password',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      auth: {
        username: '={{$credentials.username}}',
        password: '={{$credentials.password}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.url.replace(new RegExp("/$"), "")}}',
      url: '/api/users/self',
    },
  };
}
