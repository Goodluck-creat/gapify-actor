import { log } from 'apify';

const SIMILARITY_THRESHOLD = 0.8;
const EMBEDDING_MODEL = 'openai/text-embedding-3-small';
const PROXY_URL = 'https://openrouter.apify.actor/api/v1/embeddings';

function cosineSimilarity(a, b) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function getEmbeddings(texts) {
    const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.APIFY_TOKEN}`,
        },
        body: JSON.stringify({
            model: EMBEDDING_MODEL,
            input: texts,
        }),
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenRouter embeddings request failed: ${response.status} ${errText}`);
    }

    const data = await response.json();
    return data.data.map((d) => d.embedding);
}

export async function clusterSignals(signals) {
    if (signals.length === 0) return [];

    log.info('Generating embeddings via Apify OpenRouter proxy...');
    const texts = signals.map((s) => s.text || ' ');
    const vectors = await getEmbeddings(texts);

    const used = new Array(signals.length).fill(false);
    const clusters = [];

    for (let i = 0; i < signals.length; i++) {
        if (used[i]) continue;
        const cluster = { members: [signals[i]] };
        used[i] = true;
        for (let j = i + 1; j < signals.length; j++) {
            if (used[j]) continue;
            if (cosineSimilarity(vectors[i], vectors[j]) >= SIMILARITY_THRESHOLD) {
                cluster.members.push(signals[j]);
                used[j] = true;
            }
        }
        clusters.push(cluster);
    }

    clusters.sort((a, b) => b.members.length - a.members.length);
    return clusters;
}