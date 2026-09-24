# Gapify

Find real, unmet market demand before you build. Not a guess. Evidence.

## Try our web app

We built a standalone web app with a cleaner search experience than the raw Actor form below. Try it here:

**https://goodluck-creat.github.io/gapify-actor/gapify-web.html**

You will need your own free Apify API token to run a search there, or use the demo token option on the page if one is available. Getting your own token takes about a minute:

1. Create a free account at apify.com
2. Go to Settings, then API and Integrations
3. Copy your personal API token
4. Paste it into the token field on our web app

## What does Gapify do?

We built Gapify because most business ideas fail before they even launch, not because the idea was bad, but because nobody checked if people actually wanted it first. Gapify scans public web conversations, search results, reviews, forums, social mentions, for a city and industry you give it, and groups the ones that repeat into real demand signals. It then checks how many businesses already serve that need in the same area, so you can see how much people are asking for something versus how much supply already exists.

Every score comes with the actual quotes and links behind it, so you are not just trusting a number someone made up.

Works for any African city. Lagos, Nairobi, Accra, Cairo, wherever you are exploring.

## Why use Gapify?

Most new businesses launch on guesswork or by copying whatever a competitor already did. That is a big reason small businesses fail, especially for founders who cannot afford an expensive market research firm. Gapify replaces the guess with evidence that already exists online, just too scattered for one person to read through manually.

Use it to:

Validate a business idea before you spend money on it
Compare a few cities or product categories for the same idea
Back up a pitch deck or grant application with real numbers
Find an underserved niche inside a market you already know well

## How to use Gapify

Click Try for free
Enter a city, a country, and the industry or market you are exploring, for example Fashion, Fintech, Food
Optionally add a target audience, for example Women 25 to 40
Click Start and give it two to five minutes while it searches, groups signals, and checks supply
Read your results in the Output tab, or export as JSON, CSV, or Excel

## Input

location: the city to analyze, for example Lagos
country: the country the city is in, for example Nigeria
industry: the market or product category, for example Fashion
targetAudience: optional, describe who this is for
maxSignals: how many signals to analyze, between 10 and 100, default is 30

## Output

```json
{
  "location": "Lagos",
  "country": "Nigeria",
  "industry": "Fashion",
  "demandScore": 82,
  "competitionScore": 34,
  "frustrationScore": 76,
  "gapScore": 48,
  "supplyCount": 50,
  "totalSignalsFound": 20,
  "opportunities": [
    {
      "need": "affordable plus size work clothes",
      "mentionCount": 6,
      "evidence": [
        { "text": "majority of items in my size cost 2 to 3x more...", "source": "reddit.com", "url": "https://..." }
      ]
    }
  ]
}
```

You can download the full dataset as JSON, HTML, CSV, or Excel.

## Pricing

You pay $1.00 per completed gap analysis. One run, one price, nothing hidden. If a run fails before it finishes, you are not charged.

## Tips

More signals means a more reliable score, but it takes longer and costs a little more in platform usage
Try the same industry across two or three nearby cities and compare the results side by side
The search step occasionally hits a slow patch on the network. If a run times out, just run it again

## A note on how this works

Gapify only reads information that is already public. It does not access private accounts or anything behind a paywall. The results reflect what is publicly visible at the time you run it, and they are meant to inform your decision, not replace your own judgment about the market.

Found a bug or have an idea for what this should do next? Use the Issues tab above, we read them.

Built by our team for the Apify x She Code Africa BuildHer Hackathon 2026.