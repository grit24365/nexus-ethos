import os
import json
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    RunReportRequest,
    OrderBy,
)

def get_top_performing_topics(property_id):
    """
    Fetches top performing pages from GA4 to understand user interest.
    Requires GOOGLE_APPLICATION_CREDENTIALS environment variable to be set.
    """
    try:
        client = BetaAnalyticsDataClient()

        request = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=[Dimension(name="pageTitle"), Dimension(name="pagePath")],
            metrics=[Metric(name="activeUsers"), Metric(name="screenPageViews")],
            date_ranges=[DateRange(start_date="7daysAgo", end_date="today")],
            order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="screenPageViews"), desc=True)],
            limit=10
        )

        response = client.run_report(request)
        
        insights = []
        for row in response.rows:
            # Skip home and category pages to find specific blog posts
            if "/blog/" in row.dimension_values[1].value:
                insights.append({
                    "title": row.dimension_values[0].value,
                    "views": row.metric_values[1].value,
                    "users": row.metric_values[0].value
                })
        
        return insights
    except Exception as e:
        print(f"Error fetching analytics data: {e}")
        return []

if __name__ == "__main__":
    # Test call (requires setup)
    # PROPERTY_ID = "YOUR_GA4_PROPERTY_ID"
    # print(get_top_performing_topics(PROPERTY_ID))
    pass
