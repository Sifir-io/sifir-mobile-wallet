import {
  date,
  readonly,
  field,
  relation,
  json,
  children,
  nochange,
  text,
  lazy,
} from '@nozbe/watermelondb/decorators';
import {Model} from '@nozbe/watermelondb';
import {Q} from '@nozbe/watermelondb';

class LnNodes extends Model {
  static table = 'ln_nodes';
  static associations = {
    bolt11_records: {type: 'has_many', foreignKey: 'pubkey_id'},
  };
  @nochange @field('pubkey_id') pubkey;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;
  @field('alias') alias;
  @json('node_info', jsn => jsn) nodeInfo;

  @children('bolt11_records') transactions;
  @lazy invoices = this.transactions.extend(Q.where('type', Q.eq('invoice')));
  @lazy pays = this.transactions.extend(Q.where('type', Q.eq('pays')));
}

class LnNodeBolt11Records extends Model {
  static table = 'bolt11_records';
  static associations = {
    ln_nodes: {type: 'belongs_to', key: 'pubkey_id'},
  };
  @nochange @field('bolt11_id') bolt11;
  @field('type') type;
  @field('decoded_bolt11') decodedBolt11;
  @json('meta', jsn => jsn) meta;
  @readonly @date('created_at') createdAt;
  @relation('ln_nodes', 'pubkey_id') lnNodePubkey;
}

export {LnNodes, LnNodeBolt11Records};
