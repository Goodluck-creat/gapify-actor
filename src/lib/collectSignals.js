import { Actor, log } from 'apify';

const QUERY_TEMPLATES = [
    (industry, location, country) => `"need" ${industry} ${location} ${country}`,
    (industry, location, country) => `"looking for" ${industry} ${location} ${country}`,
    (industry, location, country) => `"can't find" ${industry} ${location} ${country}`,
    (industry, location, country) => `"where can I get" ${industry} ${location} ${country}`,
    (industry, location, country) => `"wish there was" ${industry} ${location} ${country}`,
];

export async function collectSignals({ location, country, industry, maxSignals }) {
    const queries = QUERY_TEMPLATES.map((fn) => fn(industry, location, country));
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