import csv, json, re

in_file = "cognito - Form responses 1 (1).csv"
out_file = "members.js"

members = []

with open(in_file, "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    next(reader) # skip header
    for row in reader:
        # Pad row just in case
        row = row + [""] * (12 - len(row))
        
        # 1: Name
        name = row[1].strip()
        if not name:
            continue
            
        # 6: Position
        position_raw = row[6].strip()
        
        # 7: Team Domain
        team_domain = row[7].strip()
        
        # 8: Photo
        photo_raw = row[8].strip()
        
        # 10: LinkedIn, fallback 11
        linkedin_raw = row[10].strip() or row[11].strip()
        
        # Clean Photo
        photo = None
        if "drive.google.com/open?id=" in photo_raw:
            file_id = photo_raw.split("id=")[1].split("&")[0]
            photo = f"https://drive.google.com/thumbnail?id={file_id}&sz=w800"
        
        # Clean LinkedIn
        linkedin = None
        if linkedin_raw:
            linkedin = linkedin_raw.split("?")[0].strip()
            if linkedin and not linkedin.startswith("http"):
                linkedin = "https://" + linkedin
                
        # Clean Team Names
        if team_domain.lower() == "operation team":
            team_domain = "Operations Team"
        
        # Role & Tier Logic
        role = position_raw
        tier = 2
        
        pos_lower = position_raw.lower()
        
        if team_domain == "" and pos_lower in ["president", "secretary", "club lead", "secratary", "president / club lead"]:
            team_domain = "Core Committee"
        
        if pos_lower == "secratary":
            role = "Secretary"
        
        if pos_lower in ["tech co lead", "co-lead", "event management co-lead", "operations co-lead"]:
            role = "Co-Lead"
            tier = 1
        elif pos_lower in ["tech lead", "operation lead", "social media lead", "event management lead", "photography team lead", "design team lead"]:
            role = "Lead"
            tier = 1
        elif pos_lower in ["member", "tech member", "technical team member", "club member", ""]:
            role = "Member"
            tier = 2
        elif pos_lower == "outreach and marketing team":
            role = "Outreach and marketing team"
            tier = 2
            
        if role in ["President / Club Lead", "President", "Secretary", "Club Lead"]:
            tier = 1
        
        if team_domain == "Core Committee":
            tier = 1
            
        members.append({
            "name": name,
            "team": team_domain,
            "role": role,
            "tier": tier,
            "photo": photo,
            "linkedin": linkedin
        })

print("| Name | Team | Role | Tier | Photo? | LinkedIn? |")
print("| --- | --- | --- | --- | --- | --- |")
for m in members:
    has_photo = "Yes" if m["photo"] else "No"
    has_li = "Yes" if m["linkedin"] else "No"
    print(f"| {m['name']} | {m['team']} | {m['role']} | {m['tier']} | {has_photo} | {has_li} |")

with open(out_file, "w", encoding="utf-8") as f:
    f.write("const members = " + json.dumps(members, indent=2) + ";\n")
