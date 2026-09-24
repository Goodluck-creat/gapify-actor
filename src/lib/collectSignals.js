import { Actor, log } from 'apify';

const QUERY_TEMPLATES = [
    (industry, location) => `"need" ${industry} ${location}`,
    (industry, location) => `"looking for" ${industry} ${location}`,
    (industry, location) => `"can't find" ${industry} ${location}`,
    (industry, location) => `"where can I get" ${industry} ${location}`,
    (industry, location) => `"wish there was" ${industry} ${location}`,
];

export async function collectSignals({ location, industry, maxSignals }) {
    const queries = QUERY_TEMPLATES.map((fn) => fn(industry, location));
    log.info('Running Google Search Results Scraper', { queries });

    const run = await Actor.call('apify/google-search-scraper', {
        queries: queries.join('\n'),
        maxPagesPerQuery: 1,
        resultsPerPage: Math.ceil(maxSignals / queries.length),
    });

    const { items } = await Actor.apifyClient.dataset(run.defaultDatasetId).listItems();

    const signals = [];
    for (const item of items) {
        const organicResults = item.organicResults || [];
        for (const r of organicResults) {
            if (!r.url) continue;
            signals.push({
                text: `${r.title || ''} ${r.description || ''}`.trim(),
                url: r.url,
                source: new URL(r.url).hostname,
            });
        }
    }

    return signals.slice(0, maxSignals);
}