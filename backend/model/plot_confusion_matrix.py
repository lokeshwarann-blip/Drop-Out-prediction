import pandas as pd
import glob
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import GroupShuffleSplit
from sklearn.metrics import confusion_matrix
import joblib
import os

print("Generating Confusion Matrix plot...")

# Load datasets
base_path = r"C:\Projects\sih\backend\data"
students = pd.read_csv(os.path.join(base_path, "students.csv"))
dropout = pd.read_csv(os.path.join(base_path, "dropout.csv"))
snapshot_files = glob.glob(os.path.join(base_path, "snapshot_*.csv"))

snapshot_list = [pd.read_csv(f) for f in snapshot_files]
snapshots = pd.concat(snapshot_list, ignore_index=True)

data = students.merge(snapshots, on="student_id", how="inner")
data = data.merge(dropout, on="student_id", how="inner")

program_encoder = LabelEncoder()
income_encoder = LabelEncoder()
data["program"] = program_encoder.fit_transform(data["program"])
data["family_income_bracket"] = income_encoder.fit_transform(data["family_income_bracket"])

fee_map = {"paid": 0, "pending": 1, "overdue": 2}
data["fee_status"] = data["fee_status"].map(fee_map)
data["snapshot_date"] = pd.to_datetime(data["snapshot_date"])

data.sort_values(by=["student_id", "snapshot_date"], inplace=True)
data["attendance_delta_30d"] = data.groupby("student_id")["attendance_pct"].diff().fillna(0)
data["score_delta_30d"] = data.groupby("student_id")["avg_score"].diff().fillna(0)
data["fee_status_worsening"] = data.groupby("student_id")["fee_status"].diff().fillna(0).apply(lambda x: 1 if x > 0 else 0)

data["month"] = data["snapshot_date"].dt.month
data["year"] = data["snapshot_date"].dt.year
data.drop(columns=["snapshot_date"], inplace=True)

X = data.drop(columns=["student_id", "dropout"])
y = data["dropout"]

gss = GroupShuffleSplit(n_splits=1, test_size=0.2, random_state=42)
train_idx, test_idx = next(gss.split(X, y, groups=data["student_id"]))
X_test = X.iloc[test_idx]
y_test = y.iloc[test_idx]

# Load saved model or predict
model_path = r"C:\Projects\sih\backend\model\xgboost_model.pkl"
model = joblib.load(model_path)
y_pred = model.predict(X_test)

cm = confusion_matrix(y_test, y_pred)
print("Confusion Matrix:")
print(cm)

# Plotting with Seaborn and Matplotlib
plt.figure(figsize=(7, 6))
sns.set_theme(style="white")

ax = sns.heatmap(
    cm, 
    annot=True, 
    fmt="d", 
    cmap="Blues", 
    cbar=True,
    xticklabels=["Retained (0)", "Dropout (1)"],
    yticklabels=["Retained (0)", "Dropout (1)"],
    annot_kws={"size": 16, "weight": "bold"}
)

plt.title("XGBoost Confusion Matrix - Student Dropout Prediction", fontsize=14, fontweight="bold", pad=15)
plt.xlabel("Predicted Label", fontsize=12, fontweight="bold", labelpad=10)
plt.ylabel("Actual Label", fontsize=12, fontweight="bold", labelpad=10)

# Add breakdown annotations
tn, fp, fn, tp = cm.ravel()
stats_text = f"True Negatives: {tn}  |  False Positives: {fp}\nFalse Negatives: {fn}  |  True Positives: {tp}"
plt.figtext(0.5, -0.05, stats_text, wrap=True, horizontalalignment='center', fontsize=11, bbox=dict(boxstyle='round,pad=0.5', facecolor='#f1f5f9', edgecolor='#cbd5e1'))

output_path = r"C:\Projects\sih\backend\model\confusion_matrix.png"
plt.savefig(output_path, dpi=300, bbox_inches="tight")
plt.close()

print(f"Confusion matrix saved successfully to: {output_path}")
