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
  const response = await makeApiRequest(context, 'POST', '/contacts/new', body);
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
  return processContactFields(contactData, options, (options as any).fieldsToReturn);
}

async function getAllContacts(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const returnAll = getOptionalParam(context, 'returnAll', itemIndex, false);
  const options = getOptionalParam(context, 'options', itemIndex, {});
  const qs: any = buildQueryFromOptions(options);
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
  return processContactFields(responseData, options, (options as any).fieldsToReturn);
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
  const emailId = getRequiredParam(context, 'emailId', itemIndex);
  const response = await makeApiRequest(
    context,
    'POST',
    `/emails/${emailId}/contact/${contactId}/send`,
  );
  return response;
}

async function editContactPoints(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const contactId = getRequiredParam(context, 'contactId', itemIndex);
  const value = getRequiredParam(context, 'value', itemIndex);
  const body: any = { value };
  const response = await makeApiRequest(
    context,
    'POST',
    `/contacts/${contactId}/points/edit`,
    body,
  );
  return response.contact;
}

async function editDoNotContactList(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const contactId = getRequiredParam(context, 'contactId', itemIndex);
  const action = getRequiredParam(context, 'action', itemIndex);
  const channel = getRequiredParam(context, 'channel', itemIndex);
  const body: any = { action, channel };
  const response = await makeApiRequest(
    context,
    'POST',
    `/contacts/${contactId}/dnc/${channel}/${action}`,
    body,
  );
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
  return await makePaginatedRequest(context, 'devices', 'GET', `/contacts/${contactId}/devices`);
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
  return await makePaginatedRequest(
    context,
    'events',
    'GET',
    `/contacts/${contactId}/activity`,
    {},
    qs,
  );
}

async function getContactNotes(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const contactId = getRequiredParam(context, 'contactId', itemIndex);
  const options = getOptionalParam(context, 'options', itemIndex, {});
  const qs: any = options;
  return await makePaginatedRequest(
    context,
    'notes',
    'GET',
    `/contacts/${contactId}/notes`,
    {},
    qs,
  );
}

async function getContactCompanies(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const contactId = getRequiredParam(context, 'contactId', itemIndex);
  return await makePaginatedRequest(
    context,
    'companies',
    'GET',
    `/contacts/${contactId}/companies`,
  );
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
