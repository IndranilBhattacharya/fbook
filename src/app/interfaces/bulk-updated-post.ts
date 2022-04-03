export interface BulkUpdatedPost {
  n: number;
  electionId: string;
  opTime: { ts: string; t: number };
  nModified: number;
  ok: number;
  $clusterTime: {
    clusterTime: string;
    signature: {
      hash: string;
      keyId: string;
    };
  };
  operationTime: string;
}
