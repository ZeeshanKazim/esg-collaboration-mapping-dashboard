# Data Dictionary (Dashboard)

## initiatives.csv (CLEAN subset, 111 rows)
Key columns used by dashboard:
- initiative_id, report_id
- company_name_fixed, company_canonical
- industry_sector, ownership_type, year_of_report
- collab_type_short (BG/BN/BS), ESG_block_norm (E/S/G/X), theme_tag
- initiative_title, initiative_description, outputs_or_outcomes
- KPI_present, KPI_list, geography, actors_involved
- evidence_file_name, page_primary, evidence_quote_15w, evidence_excerpt

## initiatives2.csv (FULL extraction, 501 rows)
Key columns used by dashboard:
- initiative_id, report_id, company_name_english
- collaboration_type (BG/BN/BS/BB), ESG_block, theme_tag
- initiative_title, initiative_description, outputs_or_outcomes
- KPI_present, KPI_list, geography, actors_involved
- evidence_file_name, evidence_page_numbers, evidence_excerpt

## Precomputed pattern files (computed on CLEAN subset)
- generic_patterns_brief_top10.csv: top patterns with examples
- patterns_mechanism_counts.csv: mechanism counts
- patterns_partner_types_from_initiatives.csv: partner type distribution (counts are edges/mentions)
- patterns_topic_cluster_assignments.csv: initiative_id → cluster_id mapping
- patterns_topic_clusters_summary.csv: cluster labels and top terms
