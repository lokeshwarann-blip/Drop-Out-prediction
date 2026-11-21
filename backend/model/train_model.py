import pandas as pd
import glob




import shap
import joblib

print("Script started...")

# Load students dataset
students = pd.read_csv("../data/students.csv")
dropout = pd.read_csv("../data/dropout.csv")

# Load all snapshot files
snapshot_files = glob.glob("../data/snapshot_*.csv")
# Merge dropout labels


snapshot_list = []

for file in snapshot_files:
    print(f"Loading {file}...")
    snapshot_list.append(pd.read_csv(file))

# Combine all snapshots
snapshots = pd.concat(snapshot_list, ignore_index=True)

print(f"\nLoaded {len(snapshot_files)} snapshot files.")
print(f"Total snapshot records: {len(snapshots)}")

# Merge students with snapshots
data = students.merge(snapshots, on="student_id", how="inner")
# Merge dropout labels
data = data.merge(dropout, on="student_id", how="inner")

print("\nMerged Dataset:")
print(data.head())

print("\nDataset Shape:")
print(data.shape)

print("\nColumns:")
print(data.columns.tolist())
print("\nMissing values:")
print(data.isnull().sum())

print("\nData types:")
print(data.dtypes)

print("\nFirst 10 rows:")
print(data.head(10))
print("\nPreprocessing data...")
from sklearn.preprocessing import LabelEncoder

program_encoder = LabelEncoder()
income_encoder = LabelEncoder()

data["program"] = program_encoder.fit_transform(data["program"])
data["family_income_bracket"] = income_encoder.fit_transform(
    data["family_income_bracket"]
)

fee_map = {
    "paid": 0,
    "pending": 1,
    "overdue": 2
}

data["fee_status"] = data["fee_status"].map(fee_map)
data["snapshot_date"] = pd.to_datetime(data["snapshot_date"])

data.sort_values(by=["student_id", "snapshot_date"], inplace=True)
data["attendance_delta_30d"] = data.groupby("student_id")["attendance_pct"].diff().fillna(0)
data["score_delta_30d"] = data.groupby("student_id")["avg_score"].diff().fillna(0)
data["fee_status_worsening"] = data.groupby("student_id")["fee_status"].diff().fillna(0).apply(lambda x: 1 if x > 0 else 0)

data["month"] = data["snapshot_date"].dt.month
data["year"] = data["snapshot_date"].dt.year

data.drop(columns=["snapshot_date"], inplace=True)
X = data.drop(columns=[
    "student_id",
    "dropout"
])

y = data["dropout"]
from sklearn.model_selection import GroupShuffleSplit

gss = GroupShuffleSplit(n_splits=1, test_size=0.2, random_state=42)
train_idx, test_idx = next(gss.split(X, y, groups=data["student_id"]))

X_train = X.iloc[train_idx]
X_test = X.iloc[test_idx]
y_train = y.iloc[train_idx]
y_test = y.iloc[test_idx]
from xgboost import XGBClassifier

model = XGBClassifier(
    random_state=42,
    n_estimators=200,
    max_depth=5,
    learning_rate=0.1,
    eval_metric="logloss"
)
print("\nTraining XGBoost model...")

model.fit(X_train, y_train)

print("Training completed!")

from sklearn.metrics import (
    accuracy_score, classification_report, confusion_matrix,
    average_precision_score
)
from sklearn.calibration import calibration_curve
import numpy as np

y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

print("\nAccuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:")
print(classification_report(y_test, y_pred))
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

pr_auc = average_precision_score(y_test, y_prob)
print(f"\nPR-AUC: {pr_auc:.4f}")

# Recall at top-15 (for counselor capacity)
k = 15
top_k_idx = np.argsort(y_prob)[::-1][:k]
top_k_y = y_test.iloc[top_k_idx]
recall_at_k = top_k_y.sum() / y_test.sum()
print(f"Recall@{k}: {recall_at_k:.4f}")

# Calibration curve
prob_true, prob_pred = calibration_curve(y_test, y_prob, n_bins=10)
import matplotlib.pyplot as plt
plt.figure()
plt.plot(prob_pred, prob_true, marker='o', label='XGBoost')
plt.plot([0, 1], [0, 1], linestyle='--', label='Perfectly calibrated')
plt.xlabel('Mean predicted probability')
plt.ylabel('Fraction of positives')
plt.title('Calibration Curve')
plt.legend()
plt.savefig("../model/calibration_curve.png", dpi=300, bbox_inches="tight")
plt.close()
print("\nGenerating SHAP explanations...")

explainer = shap.TreeExplainer(model)

shap_values = explainer.shap_values(X_test)

print("SHAP values generated successfully!")
risk_scores = model.predict_proba(X_test)[:, 1]
results = X_test.copy()

results["student_id"] = data.loc[X_test.index, "student_id"].values

results["risk_score"] = risk_scores


def get_risk_level(score):
    if score >= 0.75:
        return "High"
    elif score >= 0.40:
        return "Medium"
    return "Low"


results["risk_level"] = results["risk_score"].apply(get_risk_level)
feature_names = X_test.columns.tolist()

top_factors = []

for row in shap_values:
    ranked = sorted(
        zip(feature_names, row),
        key=lambda x: abs(x[1]),
        reverse=True
    )

    top_factors.append(
        [feature for feature, value in ranked[:3]]
    )

results["top_factors"] = top_factors
results[
    [
        "student_id",
        "risk_score",
        "risk_level",
        "top_factors"
    ]
].to_csv(
    "../model/student_risk_scores.csv",
    index=False
)

print(results.head())
joblib.dump(model, "../model/xgboost_model.pkl")

print("Model saved successfully!")
joblib.dump(program_encoder, "../model/program_encoder.pkl")
joblib.dump(income_encoder, "../model/income_encoder.pkl")

print("Encoders saved successfully!")
results.to_csv("../model/student_risk_scores.csv", index=False)
import matplotlib.pyplot as plt

shap.summary_plot(shap_values, X_test, show=False)
plt.savefig("../model/shap_summary.png", dpi=300, bbox_inches="tight")
plt.close()
importance = pd.DataFrame({
    "feature": X.columns,
    "importance": model.feature_importances_
})

importance = importance.sort_values(
    "importance",
    ascending=False
)

print(importance)