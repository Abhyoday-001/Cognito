import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Add <script src="members.js"></script> before the first script
content = content.replace("</body>", "<script src=\"members.js\"></script>\n</body>")

# But wait, it should be loaded BEFORE the main script that uses it. 
# There are three script blocks:
# 1. Logo Animation
# 2. Background Constellation
# 3. Scroll Reveal
# 4. TEAMS & CAROUSEL LOGIC
# Let's replace the last one.
