import test from 'node:test';
import assert from 'node:assert/strict';
import { deploySolanaDevnetAgentToken } from '../contracts/solana/scripts/deploy_solana_devnet';

test('Solana helper never represents local key generation as a deployment', async () => {
  const result = await deploySolanaDevnetAgentToken('Quantum Agent', 'QAI', 'demo');
  assert.equal(result.success, false);
  assert.equal(result.status, 'NOT_DEPLOYED');
  assert.match(result.reason, /does not submit a transaction/i);
  assert.match(result.endpoint, /^https:\/\//);
  assert.match(result.explorerUrl, /cluster=devnet$/);
});
