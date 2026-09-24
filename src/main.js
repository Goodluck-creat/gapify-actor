import 'dotenv/config';
import { Actor, log } from 'apify';
import { collectSignals } from './lib/collectSignals.js';
import { clusterSignals } from './lib/clusterSignals.js';
import { checkSupply } from './lib/supplyCheck.js';
import { computeScores } from './lib/scoring.js';

await Actor.init();

const {
    location,
    country,
    industry,
    targetAudience = '',
    maxSignals = 30,
} = (await Actor.getInput()) ?? {};

if (!location || !country || !industry) {
    throw new Error('"location", "country", and "industry" are all required inputs.');
}

log.info(`Gapify analyzing "${industry}" in "${location}, ${country}"`);

const rawSignals = await collectSignals({ location, country, industry, maxSignals });
log.info(`Collected ${rawSignals.length} raw signals`);

const clusters = await clusterSignals(rawSignals);
log.info(`Grouped into ${clusters.length} demand clusters`);

const supplyCount = await checkSupply({ location, country, industry });
log.info(`Found ${supplyCount} existing businesses`);

const result = computeScores({ clusters, supplyCount, rawSignals });

try {
    await Actor.charge({ eventName: 'gap-analysis-completed' });
} catch (err) {
    log.warning('Charge skipped (monetization not yet configured on platform)', { error: err.message });
}

await Actor.pushData({
    location,
    country,
    industry,
    targetAudience,
    ...result,
    generatedAt: new Date().toISOString(),
});

log.info('Gapify analysis complete.');
await Actor.exit();