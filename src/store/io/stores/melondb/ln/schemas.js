import {tableSchema} from '@nozbe/watermelondb';
const lnNodesTableSchema = tableSchema({
  name: 'ln_nodes',
  columns: [
    {name: 'pubkey_id', type: 'string', isIndexed: true},
    {name: 'alias', type: 'string', isIndexed: true},
    {name: 'node_info', type: 'string'},
    {name: 'updated_at', type: 'number'},
    {name: 'created_at', type: 'number'},
  ],
});
const bolt11Table = tableSchema({
  name: 'bolt11_records',
  columns: [
    {name: 'bolt11_id', type: 'string', isIndexed: true},
    {name: 'pubkey_id', type: 'string', isIndexed: true},
    {name: 'type', type: 'string', isIndexed: true},
    {name: 'decoded_bolt11', type: 'string'},
    {name: 'meta', type: 'string'},
  ],
});

export {bolt11Table, lnNodesTableSchema};
