import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class MauticAdvancedOAuth2Api implements ICredentialType {
  name = 'mauticAdvancedOAuth2Api';

  extends = ['oAuth2Api'];

  displayName = 'Mautic Advanced OAuth2 API';

  documentationUrl = 'mautic';

  properties: INodeProperties[] = [
    {
      displayName: 'Grant Type',
      name: 'grantType',
      type: 'hidden',
      default: 'authorizationCode',
    },
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
      displayName: 'Authorization URL',
      name: 'authUrl',
      type: 'hidden',
      default:
        '={{$self["url"].endsWith("/") ? $self["url"].slice(0, -1) : $self["url"]}}/oauth/v2/authorize',
      required: true,
    },
    {
      displayName: 'Access Token URL',
      name: 'accessTokenUrl',
      type: 'hidden',
      default:
        '={{$self["url"].endsWith("/") ? $self["url"].slice(0, -1) : $self["url"]}}/oauth/v2/token',
      required: true,
    },
    {
      displayName: 'Scope',
      name: 'scope',
      type: 'hidden',
      default: '',
    },
    {
      displayName: 'Auth URI Query Parameters',
      name: 'authQueryParameters',
      type: 'hidden',
      default: '',
    },
    {
      displayName: 'Authentication',
      name: 'authentication',
      type: 'hidden',
      default: 'body',
    },
  ];
}
