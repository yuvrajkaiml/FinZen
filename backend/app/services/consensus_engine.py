"""
Consensus and outlier logic for trust scoring.
"""

from collections import Counter
from typing import Dict, List, Tuple

SENTIMENT_TO_SCORE = {
    "negative": 0.0,
    "neutral": 50.0,
    "positive": 100.0,
}


def _agreement_level(consensus_score: float) -> str:
    if consensus_score >= 70:
        return "high"
    if consensus_score >= 45:
        return "medium"
    return "low"


def calculate_consensus(articles: List[Dict[str, str]]) -> Tuple[float, str, str, List[Dict[str, str]]]:
    """Calculate consensus score, dominant sentiment, and outliers."""
    if not articles:
        return 50.0, "medium", "neutral", []

    sentiments = [a.get("sentiment", "neutral").lower() for a in articles]
    sentiment_counts = Counter(sentiments)
    consensus_sentiment, majority_count = sentiment_counts.most_common(1)[0]

    consensus_score = round((majority_count / len(articles)) * 100, 2)
    level = _agreement_level(consensus_score)

    # Outlier: sentiment numeric deviation > 30 from average sentiment index.
    avg_sentiment_score = sum(SENTIMENT_TO_SCORE.get(s, 50.0) for s in sentiments) / len(sentiments)
    outliers: List[Dict[str, str]] = []
    for article in articles:
        src = article.get("source", "unknown")
        sentiment = article.get("sentiment", "neutral").lower()
        s_score = SENTIMENT_TO_SCORE.get(sentiment, 50.0)
        # Outlier if source significantly deviates numerically and disagrees with consensus sentiment.
        is_outlier = abs(s_score - avg_sentiment_score) > 30 and sentiment != consensus_sentiment
        outliers.append(
            {
                "source": src,
                "is_outlier": is_outlier,
                "reason": "Sentiment deviates from consensus" if is_outlier else "Within consensus range",
            }
        )

    return consensus_score, level, consensus_sentiment, outliers


def sentiment_consistency_score(article_sentiment: str, consensus_sentiment: str) -> float:
    """Score sentiment alignment against consensus."""
    if article_sentiment == consensus_sentiment:
        return 100.0
    if "neutral" in {article_sentiment, consensus_sentiment}:
        return 60.0
    return 30.0
