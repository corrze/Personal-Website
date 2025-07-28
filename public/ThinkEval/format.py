import json

with open('games/cot.json', 'r') as f:
    cot = json.load(f)

with open('games/tot.json', 'r') as f:
    tot = json.load(f)

for i in range(len(cot)):
    cot[i]["id"] = i
    cot[i]["method"] = "cot"

for i in range(len(tot)):
    tot[i]["id"] = i + len(cot)
    tot[i]["method"] = "tot"

merged = cot + tot
with open('exp.json', 'w') as f:
    json.dump(merged, f, indent=2)