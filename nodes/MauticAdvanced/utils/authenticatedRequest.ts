import type {
  ICredentialDataDecryptedObject,
  IDataObject,
  IExecuteFunctions,
  IHookFunctions,
  ILoadOptionsFunctions,
  INode,
  IRequestOptions,
  ISupplyDataFunctions,
} from 'n8n-workflow';
import { runWithCredentialLock } from './oauthRequestQueue';

export type MauticRequestContext =
  | IHookFunctions
  | IExecuteFunctions
  | ILoadOptionsFunctions
  | ISupplyDataFunctions;

type AuthenticatedRequestHelper = {
  call(
    context: MauticRequestContext,
    credentialType: string,
    options: IRequestOptions,
    oAuth2Options?: IDataObject,
  ): Promise<unknown>;
};

type AuthenticatedRequestContext = MauticRequestContext & {
  helpers: {
    requestWithAuthentication: AuthenticatedRequestHelper;
    requestOAuth2: AuthenticatedRequestHelper;
  };
};

function trimTrailingSlash(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function withCredentialBaseUrl(
  options: IRequestOptions,
  credentials: ICredentialDataDecryptedObject,
): IRequestOptions {
  const requestOptions = { ...options };

  if (typeof requestOptions.uri === 'string' && requestOptions.uri.startsWith('/')) {
    const baseUrl = trimTrailingSlash(credentials.url as string);
    requestOptions.uri = `${baseUrl}${requestOptions.uri}`;
  }

  return requestOptions;
}

function credentialRefPart(value: unknown): string | undefined {
  if (typeof value === 'string' && value) {
    return value;
  }

  if (typeof value !== 'object' || value === null) {
    return undefined;
  }

  const credentialRef = value as { id?: string | null; name?: string | null };

  if (credentialRef.id) {
    return credentialRef.id;
  }

  if (credentialRef.name) {
    return credentialRef.name;
  }

  return undefined;
}

function getOAuthCredentialQueueKey(node: INode): string {
  const credentialRef = node.credentials?.mauticAdvancedOAuth2Api;
  const keyPart = credentialRefPart(credentialRef) ?? 'unknown';

  return `mauticAdvancedOAuth2Api:${keyPart}`;
}

export async function requestMauticAuthenticated<T = unknown>(
  context: MauticRequestContext,
  authenticationMethod: string,
  options: IRequestOptions,
): Promise<T> {
  const credentialType =
    authenticationMethod === 'credentials' ? 'mauticAdvancedApi' : 'mauticAdvancedOAuth2Api';
  const credentials = await context.getCredentials(credentialType);
  const requestOptions = withCredentialBaseUrl(options, credentials);
  const helperContext = context as AuthenticatedRequestContext;

  if (authenticationMethod === 'credentials') {
    return (await helperContext.helpers.requestWithAuthentication.call(
      context,
      'mauticAdvancedApi',
      requestOptions,
    )) as T;
  }

  const queueKey = getOAuthCredentialQueueKey(context.getNode());

  return await runWithCredentialLock(queueKey, async () => {
    return (await helperContext.helpers.requestOAuth2.call(
      context,
      'mauticAdvancedOAuth2Api',
      requestOptions,
      {
        includeCredentialsOnRefreshOnBody: true,
      },
    )) as T;
  });
}
