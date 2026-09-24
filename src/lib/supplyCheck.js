import { Actor, log } from 'apify';

export async function checkSupply({ location, industry }) {
    log.info('Checking existing business supply via Google Maps scraper');

    const run = await Actor.call('compass/crawler-google-places', {
        searchStringsArray: [industry],
        locationQuery: `${location}, Nigeria`,
        countryCode: 'ng',
        language: 'en',
        maxCrawledPlacesPerSearch: 50,
    });

    const { items } = await Actor.apifyClient.dataset(run.defaultDatasetId).listItems();
    return items.length;
}