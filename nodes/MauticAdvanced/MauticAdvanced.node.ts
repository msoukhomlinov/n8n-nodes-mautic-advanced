import {
  type IExecuteFunctions,
  type ILoadOptionsFunctions,
  type INodeExecutionData,
  type INodePropertyOptions,
  type INodeType,
  type INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { executeContactOperation } from './operations/ContactOperations';
import { executeCompanyOperation } from './operations/CompanyOperations';
import { executeCampaignOperation } from './operations/CampaignOperations';
import { executeFieldOperation } from './operations/FieldOperations';
import { executeNotificationOperation } from './operations/NotificationOperations';
import { executeSegmentOperation } from './operations/SegmentOperations';
import {
  executeTagOperation,
  executeCategoryOperation,
  executeEmailOperation,
  executeContactSegmentOperation,
  executeCampaignContactOperation,
  executeCompanyContactOperation,
} from './operations/MiscellaneousOperations';

import { campaignContactFields, campaignContactOperations } from './CampaignContactDescription';
import { campaignFields, campaignOperations } from './CampaignDescription';
import { categoryFields, categoryOperations } from './CategoryDescription';
import { companyContactFields, companyContactOperations } from './CompanyContactDescription';
import { companyFields, companyOperations } from './CompanyDescription';
import { contactFields, contactOperations } from './ContactDescription';
import { contactSegmentFields, contactSegmentOperations } from './ContactSegmentDescription';
import { fieldFields, fieldOperations } from './FieldDescription';
import { mauticApiRequestAllItems } from './GenericFunctions';
import { notificationFields, notificationOperations } from './NotificationDescription';
import { segmentEmailFields, segmentEmailOperations } from './SegmentEmailDescription';
import { segmentFields, segmentOperations } from './SegmentDescription';
import { tagFields, tagOperations } from './TagDescription';

export class MauticAdvanced implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Mautic Advanced',
    name: 'mauticAdvanced',
    icon: 'file:MauticAdvanced.svg',
    group: ['output'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Consume Mautic API with advanced features',
    defaults: {
      name: 'Mautic Advanced',
    },
    usableAsTool: true,
    inputs: ['main'] as any,
    outputs: ['main'] as any,
    credentials: [
      {
        name: 'mauticAdvancedApi',
        required: true,
        displayOptions: {
          show: {
            authentication: ['credentials'],
          },
        },
      },
      {
        name: 'mauticAdvancedOAuth2Api',
        required: true,
        displayOptions: {
          show: {
            authentication: ['oAuth2'],
          },
        },
      },
    ],
    properties: [
      {
        displayName: 'Authentication',
        name: 'authentication',
        type: 'options',
        options: [
          {
            name: 'Credentials',
            value: 'credentials',
          },
          {
            name: 'OAuth2',
            value: 'oAuth2',
          },
        ],
        default: 'credentials',
      },
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Campaign',
            value: 'campaign',
            description: 'Create, update, and retrieve campaigns',
          },
          {
            name: 'Campaign Contact',
            value: 'campaignContact',
            description: 'Add/remove contacts to/from a campaign',
          },
          {
            name: 'Category',
            value: 'category',
            description: 'Create, update, and retrieve categories',
          },
          {
            name: 'Company',
            value: 'company',
            description: 'Create or modify a company',
          },
          {
            name: 'Company Contact',
            value: 'companyContact',
            description: 'Add/remove contacts to/from a company',
          },
          {
            name: 'Contact',
            value: 'contact',
            description: 'Create & modify contacts',
          },
          {
            name: 'Contact Segment',
            value: 'contactSegment',
            description: 'Add/remove contacts to/from a segment',
          },
          {
            name: 'Field',
            value: 'field',
            description: 'Manage custom fields for contacts and companies',
          },
          {
            name: 'Notification',
            value: 'notification',
            description: 'Create, update, and retrieve notifications',
          },
          {
            name: 'Segment',
            value: 'segment',
            description: 'Create, update, and retrieve segments',
          },
          {
            name: 'Segment Email',
            value: 'segmentEmail',
            description: 'Send an email',
          },
          {
            name: 'Tag',
            value: 'tag',
            description: 'Create, update, and retrieve tags',
          },
        ],
        default: 'contact',
      },
      ...companyOperations,
      ...companyFields,
      ...contactOperations,
      ...contactFields,
      ...contactSegmentOperations,
      ...contactSegmentFields,
      ...campaignOperations,
      ...campaignFields,
      ...campaignContactOperations,
      ...campaignContactFields,
      ...companyContactOperations,
      ...companyContactFields,
      ...fieldOperations,
      ...fieldFields,
      ...notificationOperations,
      ...notificationFields,
      ...segmentEmailOperations,
      ...segmentEmailFields,
      ...tagOperations,
      ...tagFields,
      ...categoryOperations,
      ...categoryFields,
      ...segmentOperations,
      ...segmentFields,
    ],
  };

  methods = {
    loadOptions: {
      // Get all the available tags to display them to user so that they can
      // select them easily
      async getTags(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];
        const tags = await mauticApiRequestAllItems.call(this, 'tags', 'GET', '/tags');
        for (const tag of tags) {
          returnData.push({
            name: tag.tag,
            value: tag.tag,
          });
        }
        return returnData;
      },
      // Get all the available stages to display them to user so that they can
      // select them easily
      async getStages(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];
        const stages = await mauticApiRequestAllItems.call(this, 'stages', 'GET', '/stages');
        for (const stage of stages) {
          returnData.push({
            name: stage.name,
            value: stage.id,
          });
        }
        return returnData;
      },
      // Get all the available company fields to display them to user so that they can
      // select them easily
      async getCompanyFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];
        const fields = await mauticApiRequestAllItems.call(
          this,
          'fields',
          'GET',
          '/fields/company',
        );
        for (const field of fields) {
          returnData.push({
            name: field.label,
            value: field.alias,
          });
        }
        return returnData;
      },
      async getIndustries(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];
        const fields = await mauticApiRequestAllItems.call(
          this,
          'fields',
          'GET',
          '/fields/company',
        );
        for (const field of fields) {
          if (field.alias === 'companyindustry') {
            for (const { label, value } of field.properties.list) {
              returnData.push({
                name: label,
                value,
              });
            }
          }
        }
        return returnData;
      },
      // Get all the available contact fields to display them to user so that they can
      // select them easily
      async getContactFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];

        // Add key system fields manually (except last_active, which is already present)
        const systemFields = [
          { name: 'Date Added', value: 'date_added' },
          { name: 'Date Modified', value: 'date_modified' },
          { name: 'ID', value: 'id' },
          { name: 'Owner ID', value: 'owner_id' },
        ];
        returnData.push(...systemFields);

        // Fetch custom and other fields from Mautic
        const fields = await mauticApiRequestAllItems.call(
          this,
          'fields',
          'GET',
          '/fields/contact',
        );
        for (const field of fields) {
          returnData.push({
            name: field.label,
            value: field.alias,
          });
        }
        return returnData;
      },
      // Get all the available segments to display them to user so that they can
      // select them easily
      async getSegments(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];
        const segments = await mauticApiRequestAllItems.call(this, 'segments', 'GET', '/segments');
        for (const segment of segments) {
          returnData.push({
            name: segment.name,
            value: segment.id,
          });
        }
        return returnData;
      },
      // Get all the available campaings to display them to user so that they can
      // select them easily
      async getCampaigns(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];
        const campaings = await mauticApiRequestAllItems.call(
          this,
          'campaigns',
          'GET',
          '/campaigns',
        );
        for (const campaign of campaings) {
          returnData.push({
            name: campaign.name,
            value: campaign.id,
          });
        }
        return returnData;
      },
      // Get all the available emails to display them to user so that they can
      // select them easily
      async getEmails(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];
        const emails = await mauticApiRequestAllItems.call(this, 'emails', 'GET', '/emails');
        for (const email of emails) {
          returnData.push({
            name: email.name,
            value: email.id,
          });
        }
        return returnData;
      },
      // Get all the available list / segment emails to display them to user so that they can
      // select them easily
      async getSegmentEmails(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];
        const emails = await mauticApiRequestAllItems.call(this, 'emails', 'GET', '/emails');
        for (const email of emails) {
          if (email.emailType === 'list') {
            returnData.push({
              name: email.name,
              value: email.id,
            });
          }
        }
        return returnData;
      },
      // Get all the available campaign / template emails to display them to user so that they can
      // select them easily
      async getCampaignEmails(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];
        const emails = await mauticApiRequestAllItems.call(this, 'emails', 'GET', '/emails');
        for (const email of emails) {
          if (email.emailType === 'template') {
            returnData.push({
              name: email.name,
              value: email.id,
            });
          }
        }
        return returnData;
      },
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const resource = this.getNodeParameter('resource', i) as string;
        const operation = this.getNodeParameter('operation', i) as string;

        let result: INodeExecutionData[] = [];
        switch (resource) {
          case 'contact':
            result = await executeContactOperation(this, operation, i);
            break;
          case 'company':
            result = await executeCompanyOperation(this, operation, i);
            break;
          case 'campaign':
            result = await executeCampaignOperation(this, operation, i);
            break;
          case 'segment':
            result = await executeSegmentOperation(this, operation, i);
            break;
          case 'tag':
            result = await executeTagOperation(this, operation, i);
            break;
          case 'category':
            result = await executeCategoryOperation(this, operation, i);
            break;
          case 'segmentEmail':
            result = await executeEmailOperation(this, operation, i);
            break;
          case 'contactSegment':
            result = await executeContactSegmentOperation(this, operation, i);
            break;
          case 'campaignContact':
            result = await executeCampaignContactOperation(this, operation, i);
            break;
          case 'companyContact':
            result = await executeCompanyContactOperation(this, operation, i);
            break;
          case 'field':
            result = await executeFieldOperation(this, operation, i);
            break;
          case 'notification':
            result = await executeNotificationOperation(this, operation, i);
            break;
          default:
            throw new NodeOperationError(
              this.getNode(),
              `Resource '${resource}' is not supported.`,
              { itemIndex: i },
            );
        }
        returnData.push(...result);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push(...this.helpers.returnJsonArray({ error: (error as Error).message }));
          continue;
        }
        throw error;
      }
    }
    return [returnData];
  }
}
