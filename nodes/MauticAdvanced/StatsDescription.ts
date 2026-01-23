import type { INodeProperties } from 'n8n-workflow';

export const statsOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['stats'],
      },
    },
    options: [
      {
        name: 'Get Available Tables',
        value: 'getAvailableTables',
        description: 'Get list of available statistical tables',
        action: 'Get available tables',
      },
      {
        name: 'Get Stats',
        value: 'get',
        description: 'Get statistics from a specific table',
        action: 'Get stats from a table',
      },
    ],
    default: 'getAvailableTables',
  },
];

export const statsFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------- */
  /*                           stats:getAvailableTables                         */
  /* -------------------------------------------------------------------------- */
  // No additional fields needed for getAvailableTables

  /* -------------------------------------------------------------------------- */
  /*                                  stats:get                                 */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Table Name',
    name: 'table',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['stats'],
        operation: ['get'],
      },
    },
    options: [
      { name: 'Asset Downloads', value: 'asset_downloads' },
      { name: 'Audit Log', value: 'audit_log' },
      { name: 'Campaign Lead Event Log', value: 'campaign_lead_event_log' },
      { name: 'Campaign Leads', value: 'campaign_leads' },
      { name: 'Channel URL Trackables', value: 'channel_url_trackables' },
      { name: 'Companies Leads', value: 'companies_leads' },
      { name: 'Dynamic Content Lead Data', value: 'dynamic_content_lead_data' },
      { name: 'Dynamic Content Stats', value: 'dynamic_content_stats' },
      { name: 'Email Stat Replies', value: 'email_stat_replies' },
      { name: 'Email Stats', value: 'email_stats' },
      { name: 'Email Stats Devices', value: 'email_stats_devices' },
      { name: 'Focus Stats', value: 'focus_stats' },
      { name: 'Form Submissions', value: 'form_submissions' },
      { name: 'IP Addresses', value: 'ip_addresses' },
      { name: 'Lead Categories', value: 'lead_categories' },
      { name: 'Lead Companies Change Log', value: 'lead_companies_change_log' },
      { name: 'Lead Devices', value: 'lead_devices' },
      { name: 'Lead Do Not Contact', value: 'lead_donotcontact' },
      { name: 'Lead Event Log', value: 'lead_event_log' },
      { name: 'Lead Frequency Rules', value: 'lead_frequencyrules' },
      { name: 'Lead Lists Leads', value: 'lead_lists_leads' },
      { name: 'Lead Points Change Log', value: 'lead_points_change_log' },
      { name: 'Lead Stages Change Log', value: 'lead_stages_change_log' },
      { name: 'Lead UTM Tags', value: 'lead_utmtags' },
      { name: 'Page Hits', value: 'page_hits' },
      { name: 'Page Redirects', value: 'page_redirects' },
      { name: 'Plugin Citrix Events', value: 'plugin_citrix_events' },
      { name: 'Point Lead Action Log', value: 'point_lead_action_log' },
      { name: 'Point Lead Event Log', value: 'point_lead_event_log' },
      { name: 'Push Notification Stats', value: 'push_notification_stats' },
      { name: 'SMS Message Stats', value: 'sms_message_stats' },
      { name: 'Stage Lead Action Log', value: 'stage_lead_action_log' },
      { name: 'Tweet Stats', value: 'tweet_stats' },
      { name: 'Video Hits', value: 'video_hits' },
      { name: 'Webhook Logs', value: 'webhook_logs' },
    ],
    default: 'email_stats',
    description: 'The statistical table to retrieve data from',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['stats'],
        operation: ['get'],
      },
    },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['stats'],
        operation: ['get'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
    },
    default: 50,
    description: 'Max number of results to return',
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['stats'],
        operation: ['get'],
      },
    },
    options: [
      {
        displayName: 'Order By',
        name: 'orderBy',
        type: 'string',
        default: 'id',
        description: 'Column to sort by (e.g. id, date_sent, lead_id)',
      },
      {
        displayName: 'Order Direction',
        name: 'orderByDir',
        type: 'options',
        options: [
          {
            name: 'ASC',
            value: 'asc',
          },
          {
            name: 'DESC',
            value: 'desc',
          },
        ],
        default: 'asc',
        description: 'Sort direction',
      },
      {
        displayName: 'Start',
        name: 'start',
        type: 'number',
        typeOptions: {
          minValue: 0,
        },
        default: 0,
        description: 'Row offset to start from',
      },
      {
        displayName: 'Where Conditions (JSON)',
        name: 'where',
        type: 'json',
        default: '[]',
        description:
          'JSON array of where conditions. Example: [{"col": "lead_id", "expr": "eq", "val": 123}]. Available expressions: eq, neq, gt, gte, lt, lte, like, notLike, in, notIn, isNull, isNotNull.',
      },
    ],
  },
];
