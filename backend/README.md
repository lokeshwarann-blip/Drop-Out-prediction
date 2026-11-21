# Dropout Risk — Mock ERP/LMS Pipeline

## What's here

```
data/                      synthetic CSVs standing in for the ERP/LMS feed
  students.csv              static student facts (income, distance, program)
  snapshot_YYYY-MM-DD.csv   one file per "pull" — attendance/scores/fees/attempts
scripts/
  generate_synthetic_data.py   regenerate the synthetic dataset
  smoke_test.py                sanity-check the upload + delta API end to end
app/
  main.py                   FastAPI mock-ERP ingestion + delta API
```

## Why it's shaped this way

**Two tables, not one.** `students` is slow-changing (income bracket, distance,
program). `snapshots` is one row per student per pull date — attendance, avg
score, fee status, exam attempts. Splitting them is what makes delta tracking
free: a delta is just two snapshot rows for the same student_id, subtracted.

**Snapshots, not overwrites.** Every CSV upload is a new dated snapshot. Old
data is never destroyed, so "30/60 day delta" isn't a special pipeline —
it's a query over history you already have. This is also what a real ERP/LMS
integration would give you (period pulls or an audit log), so swapping the
mock upload for a live REST poller later doesn't change anything downstream.

**Idempotent upload.** Re-uploading the same `(student_id, snapshot_date)`
overwrites that row instead of duplicating it — safe to re-run a corrected
export.

## Running it

```bash
pip install fastapi uvicorn python-multipart
cd dropout_risk
python3 scripts/generate_synthetic_data.py     # (re)build data/*.csv
uvicorn app.main:app --reload
```

Then:
```bash
curl -F "file=@data/students.csv" http://localhost:8000/upload/students
curl -F "file=@data/snapshot_2026-02-01.csv" http://localhost:8000/upload/snapshot
curl -F "file=@data/snapshot_2026-03-03.csv" http://localhost:8000/upload/snapshot
curl http://localhost:8000/students/STU.../deltas
```

Or open `http://localhost:8000/docs` for the interactive Swagger UI — good
for demoing the "upload endpoint instead of live REST API" part.

## Next step: turning deltas into a risk score

You now have, per student per snapshot: raw levels (attendance_pct, avg_score,
fee_status, exam_attempts) AND 30d/60d deltas (trend). A first-pass risk score
doesn't need ML — a weighted rule is a legitimate v1 and is easy to explain
to non-technical stakeholders:

```
risk_score = w1*(100 - attendance_pct)
           + w2*(100 - avg_score)
           + w3*(fee_status_penalty)          # paid=0, pending=15, overdue=35
           + w4*(exam_attempts_this_term * 8)
           + w5*max(0, -attendance_pct_delta_30d) * 2   # declining trend penalizes more
           + w6*max(0, -avg_score_delta_30d) * 2
```

The point of separating "level" from "delta" terms: two students can have
the same 60% attendance, but one is *stable* at 60% and one *fell* from 85%
to 60% in a month — the second is a much sharper warning sign, and your
score should reflect that only if you're tracking deltas, which is exactly
what the snapshot table gives you for free.

Once you're ready to move past rules, this same table shape (levels + deltas
as features, one row per student per snapshot) drops directly into a
logistic regression or gradient-boosted tree with `label = dropped_out`
as your training target, no re-architecture needed.

## Swapping in the real ERP later

Only `app/main.py`'s upload endpoints change — replace the CSV `UploadFile`
handlers with a scheduled job that calls the real REST API and writes into
the same `snapshots`/`students` SQLite tables (or your real DB). Everything
downstream (`/students/{id}/deltas`, risk scoring) is unaffected because it
only depends on the table shape, not the ingestion method.
