# Tender Tracker Dashboard - Project Structure

## 1. Project Goal

Build a simple, concise, and informative tender tracker dashboard for senior
management. The dashboard should make tender status, deadlines, ownership,
commercial value, and key risks easy to understand at a glance.

## 2. Initial Scope

- Track all tenders in one structured register.
- Show summary KPIs for management.
- Filter and search tenders by status, owner, customer, sector, and deadline.
- Highlight overdue and upcoming deadlines.
- Provide a detailed view for each tender.
- Generate a concise tender summary suitable for Word export.
- Keep the first version simple enough to maintain without technical support.

## 3. Suggested Technology

- **Frontend:** Streamlit
- **Language:** Python
- **Data source:** Excel workbook initially
- **Data processing:** pandas
- **Charts:** Plotly
- **Document output:** Existing Word template with `python-docx`
- **Deployment:** Local first; Azure deployment can be considered later

This choice keeps the first release focused on business value and avoids
building a separate backend before the data model is proven.

## 4. Proposed Directory Structure

```text
Tender tracker dashboard/
|-- app.py
|-- requirements.txt
|-- README.md
|-- project structure.md
|-- .gitignore
|
|-- data/
|   |-- tenders.xlsx
|   |-- sample_tenders.xlsx
|
|-- src/
|   |-- __init__.py
|   |-- config.py
|   |-- data_loader.py
|   |-- data_validation.py
|   |-- kpi_calculations.py
|   |-- filters.py
|   |-- tender_summary.py
|   |-- word_export.py
|
|-- pages/
|   |-- dashboard.py
|   |-- tender_register.py
|   |-- tender_details.py
|
|-- assets/
|   |-- logo/
|   |-- styles/
|
|-- Tender Summery Pattern/
|   |-- Tender Summery Prompt.txt
|   |-- Tender_Summary_Master_Template.docx
|
|-- tests/
|   |-- test_data_validation.py
|   |-- test_kpi_calculations.py
|   |-- test_tender_summary.py
```

## 5. Tender Data Model

Each tender should contain at least:

| Field | Purpose |
|---|---|
| Tender ID | Unique reference |
| Tender title | Short tender name |
| Customer | Issuing organization |
| Sector | Business or market category |
| Tender owner | Responsible person |
| Status | Current tender stage |
| Issue date | Date the tender was issued |
| Submission deadline | Final submission date and time |
| Days remaining | Calculated deadline indicator |
| Estimated value | Expected contract value |
| Currency | Value currency |
| Probability | Current win probability |
| Weighted value | Estimated value multiplied by probability |
| Priority | Management priority |
| Next action | Immediate required action |
| Next action owner | Person responsible for next action |
| Notes | Additional context |
| Last updated | Data freshness indicator |

## 6. Standard Status Values

- Identified
- Pre-qualified
- In preparation
- Internal review
- Submitted
- Clarification
- Won
- Lost
- Withdrawn

## 7. Dashboard Layout

### Header

- Dashboard title
- Last refresh date
- Data quality warning, if applicable

### KPI Cards

- Total active tenders
- Tenders due within 7 days
- Overdue actions or deadlines
- Total estimated pipeline value
- Weighted pipeline value
- Win rate for completed tenders

### Main Visuals

- Tender count by status
- Pipeline value by sector
- Deadline calendar or weekly deadline view
- Tender workload by owner
- Priority and risk summary

### Management Table

Show the most important tenders first:

- Tender title
- Customer
- Owner
- Status
- Submission deadline
- Days remaining
- Estimated value
- Priority
- Next action

Use clear visual indicators for overdue, urgent, and high-value tenders.

## 8. Key Business Rules

- Active tenders exclude Won, Lost, and Withdrawn records.
- A tender is **overdue** when its submission deadline has passed and it is
  still active.
- A tender is **due soon** when its deadline is within the next 7 calendar
  days.
- A missing deadline must be flagged as a data-quality issue, not silently
  ignored.
- Weighted value equals estimated value multiplied by probability.
- Invalid status, dates, values, or probabilities must be reported clearly.
- The dashboard must display the data refresh date.

## 9. Tender Summary Output

The Word summary should contain:

- Tender title and reference
- Customer and sector
- Current status
- Tender owner
- Submission deadline
- Estimated and weighted value
- Executive recommendation
- Key requirements
- Main risks and dependencies
- Immediate next actions

The existing template in `Tender Summery Pattern/` should be reused rather
than replaced.

## 10. Implementation Phases

### Phase 1 - Foundation

- Confirm the Excel columns and status values.
- Create sample data.
- Build loading and validation functions.

### Phase 2 - Dashboard

- Build KPI calculations.
- Add filters and management tables.
- Add status, value, owner, and deadline visuals.

### Phase 3 - Tender Details and Export

- Add a tender detail view.
- Generate the Word tender summary from the existing template.
- Validate required fields before export.

### Phase 4 - Quality and Deployment

- Add targeted tests.
- Document how to update the Excel file.
- Package the dashboard for local use.
- Assess Azure deployment after the local workflow is accepted.

## 11. Decisions to Confirm Before Implementation

- Whether Excel should remain the long-term data source.
- The approved tender status list.
- Currency and value formatting rules.
- The definition of win probability.
- Which users can edit tender data.
- Whether Word export is required for every tender or only selected tenders.
