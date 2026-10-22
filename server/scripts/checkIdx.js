import { idxProvider } from '../src/integrations/idx/index.js';

try {
  const result = await idxProvider.search({ page: 1, limit: 1 });
  console.log(`IDX_STATUS=${result.providerStatus}`);
  console.log(`IDX_PROVIDER=${result.provider || 'not-configured'}`);
  console.log(`IDX_DATA_MODE=${result.dataMode || 'not-connected'}`);
  console.log(`IDX_AUTHORIZED_LISTINGS=${result.total || 0}`);
  if (result.notice) console.log(`IDX_NOTICE=${result.notice}`);
} catch (error) {
  console.error(`IDX_CHECK_FAILED=${error.message}`);
  if (error.details?.providerStatus) console.error(`IDX_PROVIDER_HTTP_STATUS=${error.details.providerStatus}`);
  process.exitCode = 1;
}
