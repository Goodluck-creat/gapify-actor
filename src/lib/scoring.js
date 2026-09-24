const FRUSTRATION_WORDS = ['frustrated', "can't find", 'wish', 'need', 'struggling', 'expensive', 'overpriced'];

export function computeScores({ clusters, supplyCount, rawSignals }) {
    const totalSignals = rawSignals.length || 1;
    const topCluster = clusters[0]?.members.length || 0;

    const demandScore = Math.min(100, Math.round((topCluster / totalSignals) * 300));
    const competitionScore = Math.min(100, supplyCount * 2);
    const gapScore = Math.max(0, demandScore - competitionScore);

    const frustrationHits = rawSignals.filter((s) =>
        FRUSTRATION_WORDS.some((w) => (s.text || '').toLowerCase().includes(w))
    ).length;
    const frustrationScore = Math.min(100, Math.round((frustrationHits / totalSignals) * 100));

    return {
        demandScore,
        competitionScore,
        gapScore,
        frustrationScore,
        supplyCount,
        totalSignalsFound: totalSignals,
        opportunities: clusters.slice(0, 10).map((c) => ({
            need: c.members[0].text.slice(0, 140),
            mentionCount: c.members.length,
            evidence: c.members.slice(0, 3).map((m) => ({ text: m.text, source: m.source, url: m.url })),
        })),
    };
}