import sys
sys.path.insert(0, "/home/claude/dropout_risk")

from fastapi.testclient import TestClient
from app.main import app, DB_PATH

# fresh db each run
if DB_PATH.exists():
    DB_PATH.unlink()
    import app.main as m
    m.init_db()

client = TestClient(app)
data_dir = "/home/claude/dropout_risk/data"

# upload students
with open(f"{data_dir}/students.csv", "rb") as f:
    r = client.post("/upload/students", files={"file": ("students.csv", f, "text/csv")})
    print("students upload:", r.status_code, r.json())

# upload all snapshots
import glob
for path in sorted(glob.glob(f"{data_dir}/snapshot_*.csv")):
    with open(path, "rb") as f:
        r = client.post("/upload/snapshot", files={"file": (path.split("/")[-1], f, "text/csv")})
        print("snapshot upload:", path.split("/")[-1], r.status_code, r.json())

# grab a student id from the students csv and check deltas
import csv
with open(f"{data_dir}/students.csv") as f:
    first_student = next(csv.DictReader(f))["student_id"]

r = client.get(f"/students/{first_student}/deltas")
print("\ndelta check for", first_student)
print(r.status_code, r.json())
