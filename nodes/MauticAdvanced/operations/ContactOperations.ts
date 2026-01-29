import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { snakeCase } from 'change-case';
import {
  handleApiError,
  makeApiRequest,
  makePaginatedRequest,
  getOptionalParam,
  getRequiredParam,
} from '../utils/ApiHelpers';
import {
  buildQueryFromOptions,
  processContactFields,
  validateJsonParameter,
  wrapSingleItem,
  convertNumericStrings,
} from '../utils/DataHelpers';

export async function executeContactOperation(
  context: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  let responseData: any;
  try {
    switch (operation) {
      case 'create':
        responseData = await createContact(context, i);
        break;
      case 'update':
        responseData = await updateContact(context, i);
        break;
      case 'get':
        responseData = await getContact(context, i);
        break;
      case 'getAll':
        responseData = await getAllContacts(context, i);
        break;
      case 'delete':
        responseData = await deleteContact(context, i);
        break;
      case 'sendEmail':
        responseData = await sendEmailToContact(context, i);
        break;
      case 'editContactPoint':
        responseData = await editContactPoints(context, i);
        break;
      case 'editDoNotContactList':
        responseData = await editDoNotContactList(context, i);
        break;
      case 'addUtm':
        responseData = await addUtmTags(context, i);
        break;
      case 'removeUtm':
        responseData = await removeUtmTags(context, i);
        break;
      case 'getDevices':
        responseData = await getContactDevices(context, i);
        break;
      case 'getActivity':
        responseData = await getContactActivity(context, i);
        break;
      case 'getNotes':
        responseData = await getContactNotes(context, i);
        break;
      case 'getCompanies':
        responseData = await getContactCompanies(context, i);
        break;
      case 'getCampaigns':
        responseData = await getContactCampaigns(context, i);
        break;
      case 'getSegments':
        responseData = await getContactSegments(context, i);
        break;
      case 'addToSegments':
        responseData = await addContactToSegments(context, i);
        break;
      case 'removeFromSegments':
        responseData = await removeContactFromSegments(context, i);
        break;
      case 'addToCampaigns':
        responseData = await addContactToCampaigns(context, i);
        break;
      case 'removeFromCampaigns':
        responseData = await removeContactFromCampaigns(context, i);
        break;
      case 'getAllActivity':
        responseData = await getAllContactActivity(context, i);
        break;
      case 'getOwners':
        responseData = await getContactOwners(context);
        break;
      case 'getFields':
        responseData = await getContactFields(context);
        break;
      default:
        throw new NodeOperationError(
          context.getNode(),
          `Operation '${operation}' is not supported for Contact resource.`,
          { itemIndex: i },
        );
    }
    return context.helpers.returnJsonArray(wrapSingleItem(responseData));
  } catch (error) {
    return handleApiError(context, error, operation, 'Contact');
  }
}

async function createContact(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const options = getOptionalParam(context, 'options', itemIndex, {});
  const additionalFields = getOptionalParam(context, 'additionalFields', itemIndex, {});
  const jsonActive = getOptionalParam(context, 'jsonParameters', itemIndex, false);
  let body: any = {};
  if (!jsonActive) {
    body.email = getOptionalParam(context, 'email', itemIndex, '');
    body.firstname = getOptionalParam(context, 'firstName', itemIndex, '');
    body.lastname = getOptionalParam(context, 'lastName', itemIndex, '');
    body.company = getOptionalParam(context, 'company', itemIndex, '');
    body.position = getOptionalParam(context, 'position', itemIndex, '');
    body.title = getOptionalParam(context, 'title', itemIndex, '');
  } else {
    body = validateJsonParameter(context, 'bodyJson', itemIndex);
  }
  addContactFields(body, additionalFields);

  // Data sanitization: Remove empty string values and validate email format
  const sanitizedBody: any = {};
  Object.entries(body).forEach(([key, value]) => {
    // Skip empty strings as Mautic sometimes rejects them
    if (value !== '' && value !== null && value !== undefined) {
      sanitizedBody[key] = value;
    }
  });

  // Basic email validation if email is provided
  if (sanitizedBody.email && typeof sanitizedBody.email === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedBody.email)) {
      throw new NodeOperationError(
        context.getNode(),
        `Invalid email format: ${sanitizedBody.email}`,
        { itemIndex },
      );
    }
  }

  // Log the sanitized body for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log(
      'Mautic Contact Creation - Sanitized Body:',
      JSON.stringify(sanitizedBody, null, 2),
    );
  }

  const response = await makeApiRequest(context, 'POST', '/contacts/new', sanitizedBody);
  const contactData = [response.contact];
  return processContactFields(contactData, options);
}

async function updateContact(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const options = getOptionalParam(context, 'options', itemIndex, {});
  const updateFields = getOptionalParam(context, 'updateFields', itemIndex, {}) as {
    [key: string]: any;
  };
  const contactId = getRequiredParam(context, 'contactId', itemIndex);
  let body: any = {};
  if (updateFields.email) body.email = updateFields.email;
  if (updateFields.firstName) body.firstname = updateFields.firstName;
  if (updateFields.lastName) body.lastname = updateFields.lastName;
  if (updateFields.company) body.company = updateFields.company;
  if (updateFields.position) body.position = updateFields.position;
  if (updateFields.title) body.title = updateFields.title;
  if ((updateFields as any).bodyJson) {
    body = validateJsonParameter(context, 'updateFields.bodyJson', itemIndex);
  }
  addContactFields(body, updateFields);
  const response = await makeApiRequest(context, 'PATCH', `/contacts/${contactId}/edit`, body);
  const contactData = [response.contact];
  return processContactFields(contactData, options);
}

async function getContact(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const options = getOptionalParam(context, 'options', itemIndex, {});
  const contactId = getRequiredParam(context, 'contactId', itemIndex);
  const response = await makeApiRequest(context, 'GET', `/contacts/${contactId}`);
  const contactData = [response.contact];
  const processedData = processContactFields(contactData, options, (options as any).fieldsToReturn);
  return convertNumericStrings(processedData);
}

async function getAllContacts(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const returnAll = getOptionalParam(context, 'returnAll', itemIndex, false);
  const options = getOptionalParam(context, 'options', itemIndex, {});
  const qs: any = buildQueryFromOptions(options);

  // Build search expression from structured filters
  const searchParts: string[] = [];

  // Segment filter
  const segments = (options as any).segments as string[] | undefined;
  if (Array.isArray(segments) && segments.length > 0) {
    const segmentMatchType = ((options as any).segmentMatchType as 'any' | 'all') || 'any';
    const filterExpr = buildSearchFilterExpression(segments, 'segment', segmentMatchType);
    if (filterExpr) searchParts.push(filterExpr);
  }

  // Tag filter
  const tags = (options as any).tags as string[] | undefined;
  if (Array.isArray(tags) && tags.length > 0) {
    const tagMatchType = ((options as any).tagMatchType as 'any' | 'all') || 'any';
    const filterExpr = buildSearchFilterExpression(tags, 'tag', tagMatchType);
    if (filterExpr) searchParts.push(filterExpr);
  }

  // Owner filter (always OR for multiple owners - a contact can only have one owner)
  const owners = (options as any).owners as string[] | undefined;
  if (Array.isArray(owners) && owners.length > 0) {
    const filterExpr = buildSearchFilterExpression(owners, 'owner', 'any');
    if (filterExpr) searchParts.push(filterExpr);
  }

  // Stage filter (always OR for multiple stages - a contact can only be in one stage)
  const stages = (options as any).stages as string[] | undefined;
  if (Array.isArray(stages) && stages.length > 0) {
    const filterExpr = buildSearchFilterExpression(stages, 'stage', 'any');
    if (filterExpr) searchParts.push(filterExpr);
  }

  // Campaign filter (OR for multiple campaigns)
  const campaigns = (options as any).campaigns as string[] | undefined;
  if (Array.isArray(campaigns) && campaigns.length > 0) {
    const filterExpr = buildSearchFilterExpression(campaigns, 'campaign', 'any');
    if (filterExpr) searchParts.push(filterExpr);
  }

  // Combine all structured filters with AND
  if (searchParts.length > 0) {
    const structuredSearch =
      searchParts.length === 1
        ? searchParts[0]
        : searchParts.map((part) => `(${part})`).join(' AND ');

    // Merge with raw search if provided
    const rawSearch = (options as any).search as string | undefined;
    if (rawSearch && rawSearch.trim().length > 0) {
      qs.search = `${structuredSearch} AND (${rawSearch})`;
    } else {
      qs.search = structuredSearch;
    }
  }

  if (!qs.orderBy) qs.orderBy = 'id';
  if (!qs.orderByDir) qs.orderByDir = 'asc';
  if (qs.orderBy) {
    qs.orderBy = snakeCase(qs.orderBy);
  }
  const whereObj = (options as any).where;
  if (whereObj && Array.isArray(whereObj.conditions)) {
    const filteredWhere = whereObj.conditions.filter(
      (condition: any) => condition.col && condition.val !== undefined && condition.val !== '',
    );
    if (filteredWhere.length > 0) {
      qs.where = filteredWhere;
    }
  }
  let responseData: any[];
  const emailDncOnly = (options as any).emailDncOnly === true;
  const smsDncOnly = (options as any).smsDncOnly === true;
  const anyDncOnly = (options as any).anyDncOnly === true;
  const useDncPostFilter = emailDncOnly || smsDncOnly || anyDncOnly;
  if (useDncPostFilter) {
    responseData = await getContactsWithDncFilter(
      context,
      qs,
      options,
      returnAll ? undefined : (options as any).limit,
    );
  } else {
    if (returnAll) {
      responseData = await makePaginatedRequest(context, 'contacts', 'GET', '/contacts', {}, qs);
    } else {
      qs.limit = getOptionalParam(context, 'limit', itemIndex, 30);
      const response = await makeApiRequest(context, 'GET', '/contacts', {}, qs);
      responseData = response.contacts ? Object.values(response.contacts) : [];
    }
  }
  const processedData = processContactFields(
    responseData,
    options,
    (options as any).fieldsToReturn,
  );
  return convertNumericStrings(processedData);
}

async function deleteContact(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const options = getOptionalParam(context, 'options', itemIndex, {});
  const contactId = getRequiredParam(context, 'contactId', itemIndex);
  try {
    let responseData: any[];
    const response = await makeApiRequest(context, 'DELETE', `/contacts/${contactId}/delete`);
    if (response && response.contact !== undefined) {
      responseData = [response.contact];
    } else {
      responseData = [{ success: true, message: 'Contact deleted successfully.' }];
    }
    return processContactFields(responseData, options);
  } catch (error) {
    throw error;
  }
}

async function sendEmailToContact(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const contactId = getRequiredParam(context, 'contactId', itemIndex);
  const emailId = getRequiredParam(context, 'campaignEmailId', itemIndex);
  const tokensUi = getOptionalParam(context, 'tokensUi', itemIndex, {}) as any;
  const assetAttachments = getOptionalParam(context, 'assetAttachments', itemIndex, '') as string;

  // Build request body
  const body: any = {};

  // Process tokens from key-value pairs UI
  if (tokensUi?.tokenValues && Array.isArray(tokensUi.tokenValues)) {
    const tokens: any = {};
    for (const tokenItem of tokensUi.tokenValues) {
      if (tokenItem.tokenKey && tokenItem.tokenValue !== undefined) {
        tokens[tokenItem.tokenKey] = tokenItem.tokenValue;
      }
    }
    if (Object.keys(tokens).length > 0) {
      body.tokens = tokens;
    }
  }

  // Process asset attachments
  if (assetAttachments && assetAttachments.trim()) {
    body.assetAttachments = assetAttachments
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id.length > 0);
  }

  // Only send body if it has content
  const requestBody = Object.keys(body).length > 0 ? body : {};

  const response = await makeApiRequest(
    context,
    'POST',
    `/emails/${emailId}/contact/${contactId}/send`,
    requestBody,
  );
  return response;
}

async function editContactPoints(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const contactId = getRequiredParam(context, 'contactId', itemIndex);
  const action = getRequiredParam(context, 'action', itemIndex);
  const points = getRequiredParam(context, 'points', itemIndex);
  const eventName = getOptionalParam(context, 'eventName', itemIndex, '');
  const actionName = getOptionalParam(context, 'actionName', itemIndex, '');

  const body: any = {};
  if (eventName) body.eventName = eventName;
  if (actionName) body.actionName = actionName;

  const endpoint =
    action === 'add'
      ? `/contacts/${contactId}/points/plus/${points}`
      : `/contacts/${contactId}/points/minus/${points}`;

  const response = await makeApiRequest(context, 'POST', endpoint, body);
  return response.contact;
}

async function editDoNotContactList(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const contactId = getRequiredParam(context, 'contactId', itemIndex);
  const action = getRequiredParam(context, 'action', itemIndex);
  const channel = getRequiredParam(context, 'channel', itemIndex);
  const reason = getOptionalParam(context, 'reason', itemIndex, 3); // Default to Manual (3)
  const channelId = getOptionalParam(context, 'channelId', itemIndex, '');
  const comments = getOptionalParam(context, 'comments', itemIndex, '');

  const body: any = {};
  if (reason !== undefined) body.reason = reason;
  if (channelId) body.channelId = channelId;
  if (comments) body.comments = comments;

  const endpoint =
    action === 'add'
      ? `/contacts/${contactId}/dnc/${channel}/add`
      : `/contacts/${contactId}/dnc/${channel}/remove`;

  const response = await makeApiRequest(context, 'POST', endpoint, body);
  return response.contact;
}

async function addUtmTags(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const contactId = getRequiredParam(context, 'contactId', itemIndex);
  const utmFields = getOptionalParam(context, 'utmFields', itemIndex, {});
  const body: any = {};
  if ((utmFields as any).utmSource) body.utm_source = (utmFields as any).utmSource;
  if ((utmFields as any).utmMedium) body.utm_medium = (utmFields as any).utmMedium;
  if ((utmFields as any).utmCampaign) body.utm_campaign = (utmFields as any).utmCampaign;
  if ((utmFields as any).utmContent) body.utm_content = (utmFields as any).utmContent;
  if ((utmFields as any).utmTerm) body.utm_term = (utmFields as any).utmTerm;
  if ((utmFields as any).userAgent) body.useragent = (utmFields as any).userAgent;
  if ((utmFields as any).url) body.url = (utmFields as any).url;
  if ((utmFields as any).referer) body.referer = (utmFields as any).referer;
  if ((utmFields as any).query) body.query = (utmFields as any).query;
  if ((utmFields as any).remoteHost) body.remotehost = (utmFields as any).remoteHost;
  if ((utmFields as any).lastActive) body.lastActive = (utmFields as any).lastActive;
  const response = await makeApiRequest(context, 'POST', `/contacts/${contactId}/utm/add`, body);
  return response.contact;
}

async function removeUtmTags(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const contactId = getRequiredParam(context, 'contactId', itemIndex);
  const utmId = getRequiredParam(context, 'utmId', itemIndex);
  const response = await makeApiRequest(
    context,
    'POST',
    `/contacts/${contactId}/utm/${utmId}/remove`,
  );
  return response.contact;
}

async function getContactDevices(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const contactId = getRequiredParam(context, 'contactId', itemIndex);
  const result = await makePaginatedRequest(
    context,
    'devices',
    'GET',
    `/contacts/${contactId}/devices`,
  );
  return convertNumericStrings(result);
}

async function getContactActivity(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const contactId = getRequiredParam(context, 'contactId', itemIndex);
  const options = getOptionalParam(context, 'options', itemIndex, {});
  const qs: any = {};
  const filters: any = {};
  if ((options as any).search) filters.search = (options as any).search;
  if ((options as any).includeEvents)
    filters.includeEvents = (options as any).includeEvents.split(',');
  if ((options as any).excludeEvents)
    filters.excludeEvents = (options as any).excludeEvents.split(',');
  if ((options as any).dateFrom) filters.dateFrom = (options as any).dateFrom;
  if ((options as any).dateTo) filters.dateTo = (options as any).dateTo;
  qs['filters'] = filters;
  if ((options as any).orderBy)
    qs.order = [(options as any).orderBy, (options as any).orderByDir ?? 'asc'];
  if ((options as any).limit) qs.limit = (options as any).limit;
  const result = await makePaginatedRequest(
    context,
    'events',
    'GET',
    `/contacts/${contactId}/activity`,
    {},
    qs,
  );
  return convertNumericStrings(result);
}

async function getContactNotes(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const contactId = getRequiredParam(context, 'contactId', itemIndex);
  const options = getOptionalParam(context, 'options', itemIndex, {});
  const qs: any = options;
  const result = await makePaginatedRequest(
    context,
    'notes',
    'GET',
    `/contacts/${contactId}/notes`,
    {},
    qs,
  );
  return convertNumericStrings(result);
}

async function getContactCompanies(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const contactId = getRequiredParam(context, 'contactId', itemIndex);
  const result = await makePaginatedRequest(
    context,
    'companies',
    'GET',
    `/contacts/${contactId}/companies`,
  );
  return convertNumericStrings(result);
}

async function getContactCampaigns(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const contactId = getRequiredParam(context, 'contactId', itemIndex);
  const result = await makePaginatedRequest(
    context,
    'campaigns',
    'GET',
    `/contacts/${contactId}/campaigns`,
  );
  return convertNumericStrings(result);
}

async function getContactSegments(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const contactId = getRequiredParam(context, 'contactId', itemIndex);
  const result = await makePaginatedRequest(
    context,
    'segments',
    'GET',
    `/contacts/${contactId}/segments`,
  );
  return convertNumericStrings(result);
}

async function addContactToSegments(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const contactId = getRequiredParam(context, 'contactId', itemIndex);
  const segmentIds = getRequiredParam(context, 'segmentIds', itemIndex);
  const body = { segments: segmentIds };
  const response = await makeApiRequest(
    context,
    'POST',
    `/contacts/${contactId}/segments/add`,
    body,
  );
  return response.contact;
}

async function removeContactFromSegments(
  context: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const contactId = getRequiredParam(context, 'contactId', itemIndex);
  const segmentIds = getRequiredParam(context, 'segmentIds', itemIndex);
  const body = { segments: segmentIds };
  const response = await makeApiRequest(
    context,
    'POST',
    `/contacts/${contactId}/segments/remove`,
    body,
  );
  return response.contact;
}

async function addContactToCampaigns(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const contactId = getRequiredParam(context, 'contactId', itemIndex);
  const campaignIds = getRequiredParam(context, 'campaignIds', itemIndex);
  const body = { campaigns: campaignIds };
  const response = await makeApiRequest(
    context,
    'POST',
    `/contacts/${contactId}/campaigns/add`,
    body,
  );
  return response.contact;
}

async function removeContactFromCampaigns(
  context: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const contactId = getRequiredParam(context, 'contactId', itemIndex);
  const campaignIds = getRequiredParam(context, 'campaignIds', itemIndex);
  const body = { campaigns: campaignIds };
  const response = await makeApiRequest(
    context,
    'POST',
    `/contacts/${contactId}/campaigns/remove`,
    body,
  );
  return response.contact;
}

async function getAllContactActivity(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const options = getOptionalParam(context, 'options', itemIndex, {});
  const qs: any = {};
  const filters: any = {};
  if ((options as any).search) filters.search = (options as any).search;
  if ((options as any).includeEvents)
    filters.includeEvents = (options as any).includeEvents.split(',');
  if ((options as any).excludeEvents)
    filters.excludeEvents = (options as any).excludeEvents.split(',');
  if ((options as any).dateFrom) filters.dateFrom = (options as any).dateFrom;
  if ((options as any).dateTo) filters.dateTo = (options as any).dateTo;
  qs['filters'] = filters;
  if ((options as any).orderBy)
    qs.order = [(options as any).orderBy, (options as any).orderByDir ?? 'asc'];
  if ((options as any).limit) qs.limit = (options as any).limit;
  const result = await makePaginatedRequest(context, 'events', 'GET', `/contacts/activity`, {}, qs);
  return convertNumericStrings(result);
}

/**
 * Build a Mautic search filter expression from an array of values.
 * @param values Array of filter values (IDs, aliases, or names)
 * @param filterType The Mautic search filter type (e.g., 'segment', 'tag', 'owner', 'stage', 'campaign')
 * @param matchType 'any' for OR logic, 'all' for AND logic
 * @returns The search expression string, or empty string if no valid values
 */
function buildSearchFilterExpression(
  values: string[],
  filterType: string,
  matchType: 'any' | 'all',
): string {
  const filters = values
    .map((value) => `${filterType}:${value}`)
    .filter((expr) => expr.trim().length > 0);

  if (filters.length === 0) {
    return '';
  }

  if (filters.length === 1) {
    return filters[0];
  }

  const operator = matchType === 'all' ? ' AND ' : ' OR ';
  return filters.join(operator);
}

function normalizeTagsInput(tagsInput: any): string[] {
  // Handle different input formats for tags

  // If it's already an array of strings, return as is
  if (Array.isArray(tagsInput) && tagsInput.every((tag) => typeof tag === 'string')) {
    return tagsInput;
  }

  // If it's a string, split by comma
  if (typeof tagsInput === 'string') {
    return tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }

  // If it's an array of objects with 'tag' property
  if (Array.isArray(tagsInput) && tagsInput.every((item) => typeof item === 'object' && item.tag)) {
    return tagsInput.map((item) => item.tag);
  }

  // If it's a complex object (like user's input with inputA/inputB)
  if (typeof tagsInput === 'object' && tagsInput !== null) {
    const tags: string[] = [];

    // Handle inputA and inputB structure
    if (tagsInput.inputA && Array.isArray(tagsInput.inputA)) {
      tags.push(...tagsInput.inputA.map((item: any) => item.tag || item).filter(Boolean));
    }
    if (tagsInput.inputB && Array.isArray(tagsInput.inputB)) {
      tags.push(...tagsInput.inputB.map((item: any) => item.tag || item).filter(Boolean));
    }

    // If no inputA/inputB, try to extract from any array properties
    if (tags.length === 0) {
      Object.values(tagsInput).forEach((value: any) => {
        if (Array.isArray(value)) {
          tags.push(...value.map((item: any) => item.tag || item).filter(Boolean));
        }
      });
    }

    // Remove duplicates and return
    return [...new Set(tags)];
  }

  // Fallback: return empty array
  return [];
}

function addContactFields(body: any, fields: any) {
  const addressUi = fields.addressUi as any;
  if (addressUi?.addressValues) {
    const { addressValues } = addressUi;
    body.address1 = addressValues.address1;
    body.address2 = addressValues.address2;
    body.city = addressValues.city;
    body.state = addressValues.state;
    body.country = addressValues.country;
    body.zipcode = addressValues.zipCode;
  }
  const socialMediaUi = fields.socialMediaUi as any;
  if (socialMediaUi?.socialMediaValues) {
    const { socialMediaValues } = socialMediaUi;
    const data = socialMediaValues.reduce(
      (obj: any, value: any) =>
        Object.assign(obj, { [`social_${value.socialMediaField}`]: value.value }),
      {},
    );
    Object.assign(body, data);
  }
  if (fields.company) body.company = fields.company;
  if (fields.position) body.position = fields.position;
  if (fields.ipAddress) body.ipAddress = fields.ipAddress;
  if (fields.lastActive) body.lastActive = fields.lastActive;
  if (fields.owner) body.owner = fields.owner;
  if (fields.perspective) body.perspective = fields.perspective;
  if (fields.points) body.points = fields.points;
  if (fields.preferredChannel) body.preferred_channel = fields.preferredChannel;
  if (fields.tags) body.tags = normalizeTagsInput(fields.tags);
  const customFieldsUi = fields.customFieldsUi as any;
  if (customFieldsUi?.customFieldValues) {
    const { customFieldValues } = customFieldsUi;
    const data = customFieldValues.reduce(
      (obj: any, value: any) => Object.assign(obj, { [`${value.fieldId}`]: value.fieldValue }),
      {},
    );
    Object.assign(body, data);
  }
}

async function getContactsWithDncFilter(
  context: IExecuteFunctions,
  qs: any,
  options: any,
  limit?: number,
): Promise<any[]> {
  const emailDncOnly = options.emailDncOnly === true;
  const smsDncOnly = options.smsDncOnly === true;
  const anyDncOnly = options.anyDncOnly === true;
  const start = qs.start || 0;
  const finalLimit = limit || qs.limit || 30;
  const contacts: any[] = [];
  let remaining = finalLimit;
  let currentStart = start;
  while (remaining > 0) {
    const pageLimit = Math.min(remaining, 30);
    const pageQs = { ...qs, start: currentStart, limit: pageLimit };
    const pageResponse = await makeApiRequest(context, 'GET', '/contacts', {}, pageQs);
    const pageContacts = pageResponse.contacts ? Object.values(pageResponse.contacts) : [];
    const filtered = pageContacts.filter((contact: any) => {
      const dnc = contact.doNotContact || [];
      const hasEmailDnc = dnc.some((d: any) => d.channel === 'email');
      const hasSmsDnc = dnc.some((d: any) => d.channel === 'sms');
      if (emailDncOnly) return hasEmailDnc;
      if (smsDncOnly) return hasSmsDnc;
      if (anyDncOnly) return hasEmailDnc || hasSmsDnc;
      return true;
    });
    contacts.push(...filtered);
    if (pageContacts.length < pageLimit) break;
    remaining -= filtered.length;
    currentStart += pageLimit;
  }
  return contacts;
}

async function getContactOwners(context: IExecuteFunctions): Promise<any> {
  const response = await makeApiRequest(context, 'GET', '/contacts/list/owners');
  return convertNumericStrings(response);
}

async function getContactFields(context: IExecuteFunctions): Promise<any> {
  const response = await makeApiRequest(context, 'GET', '/contacts/list/fields');
  return convertNumericStrings(response);
}
