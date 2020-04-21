import {db as _melondb} from './melondb';
import {bolt11Table, lnNodesTableSchema} from './melondb/ln/schemas';
import {LnNodes, LnNodeBolt11Records} from './melondb/ln/models';
import {Q} from '@nozbe/watermelondb';
import {log} from '@io/events';
const db = _melondb({
  tableSchemas: [bolt11Table, lnNodesTableSchema],
  modelClasses: [LnNodes, LnNodeBolt11Records],
});
const lnStore = {
  async getLnNodes() {
    try {
      const wallet = await db.collections
        .get('ln_nodes')
        .query()
        .fetch();
      return wallet;
    } catch (err) {
      log('lnstore:getLnWalletByLabel:', err);
      return null;
    }
  },
  async insertLnNode({alias, id, nodeInfo}) {
    await db.action(async () => {
      await db.collections.get('ln_nodes').create(node => {
        node.pubkey = id;
        node.alias = alias;
        node.nodeInfo = nodeInfo;
      });
    });
  },
  async upsertLnNodeByPubkey(pubkey, {alias, id, nodeInfo}) {
    await db.action(async () => {
      const [node] = await db.collections
        .get('ln_nodes')
        .query(Q.where('pubkey_id', Q.eq(pubkey)))
        .fetch();
      if (!node) {
        await db.collections.get('ln_nodes').create(lnNode => {
          lnNode.pubkey = id;
          lnNode.alias = alias;
          lnNode.nodeInfo = nodeInfo;
        });
      } else {
        await node.update(lnNode => {
          lnNode.alias = alias;
          lnNode.nodeInfo = nodeInfo;
        });
      }
    });
  },
  async getLnNodeByAlias(alias) {
    try {
      const [node] = await db.collections
        .get('ln_nodes')
        .query(Q.where('alias', Q.eq(alias)))
        .fetch();
      return node;
    } catch (err) {
      log('lnstore:getLnWalletByLabel:', err);
      return null;
    }
  },
  async getLnNodeByPubkey(pubkey) {
    try {
      const [node] = await db.collections
        .get('ln_nodes')
        .query(Q.where('pubkey_id', Q.eq(pubkey)))
        .fetch();
      return node;
    } catch (err) {
      log('lnstore:getLnWalletByLabel:', err);
      return null;
    }
  },
  async insertLnNodeDecodedBolt({
    lnNodePubkey,
    bolt11,
    type,
    decodedBolt11,
    meta,
  }) {
    const node = await this.getLnNodeByPubkey(lnNodePubkey);
    await db.action(async () => {
      await db.collections.get('bolt11_records').create(bolt => {
        bolt.bolt11 = bolt11;
        bolt.type = type;
        bolt.decodedBolt11 = decodedBolt11;
        bolt.meta = meta;
        bolt.lnNodePubkey.set(node);
      });
    });
  },
  async batchInsertLnNodeDecodedBolts(lnNodePubkey, payload) {
    const node = await this.getLnNodeByPubkey(lnNodePubkey);
    await db.action(async () => {
      const collection = await db.collections.get('bolt11_records');
      const batch = payload
        .filter(x => !!x)
        .map(({bolt11, type, decodedBolt11, meta}) =>
          collection.prepareCreate(bolt => {
            bolt.bolt11 = bolt11;
            bolt.type = type;
            bolt.decodedBolt11 = decodedBolt11;
            bolt.meta = meta;
            bolt.lnNodePubkey.set(node);
            return bolt;
          }),
        );
      await db.batch(...batch);
    });
  },
  async getBoltByBolt11(bolt11) {
    try {
      const txnsByType = await db.collections
        .get('bolt11_records')
        .query(Q.where('bolt11_id', Q.eq(bolt11)))
        .fetch();
      return txnsByType;
    } catch (err) {
      log('lnstore:txnsByBolt11:', err);
      return null;
    }
  },
  async getBoltsByType(type) {
    try {
      const txnsByType = await db.collections
        .get('bolt11_records')
        .query(Q.where('type', Q.eq(type)))
        .fetch();
      return txnsByType;
    } catch (err) {
      log('lnstore:getTxnByType', err);
      return null;
    }
  },
};
export {db, lnStore};
