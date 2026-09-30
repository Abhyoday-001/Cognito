import urllib.request
import json
import os
import sys

# Map of file_id -> filename (from CSV data)
photo_map = [
    ("1fl1jGHLf2kjBY09lk77D7hJRxA3wKU6B", "mayur-jain"),
    ("1twC4OjEoktlPNIyK3v_vxIYXBbcyKhDG", "nikhith-gowda-s"),
    ("1sOD4puE6gEMU99tkxj55xKlOmJ3oWrqU", "alby-thomas"),
    ("15ZTcKdtiXcM_3RNPQvRPkFi9OV2t_n0X", "tr-samriddhi"),
    ("1oQeWGGPgQIG5lMLS4VlGSgD5n48lsmeX", "shinjini-pal"),
    ("1F_eMMjr2soztEpD4lLA5_ETWJjG1S5-s", "prachi-priya"),
    ("1NLyBc7Cm_TEtqEKnqUkpMi5-zNs_EOMe", "ashel-jonita-noronha"),
    ("12lcrVsy1rphiJ9aV_DYNH7CNIurZYp8E", "shorya-saxena"),
    # Spoorthi has no photo (CSV column 8 was "Tech Team")
    ("1O3K4D9__XsLYVhHBUNzZWXdQhvGLfIn5", "aryan-bhojgaria"),
    ("1_F0JrZ3tz-vB4gFcJw3UC_qk5RDD7AFl", "sibaprasad-panigrahy"),
    ("1sJiUEUnLaRNIscGhhxarM0Z-8MVpg8F_", "prathick-raj-p"),
    ("1sMOoVOru74y0cPTKUQTv3vx219iSmSTl", "pushpanjali-gupta"),
    ("1cJGfiJXDlPD3zOL5J45fX2JLrWZ-lvG4", "vishwajeet-kshirsagar"),
    ("1hg3BU3dYCYIVrb19V49KK1JVz1WbGIFj", "abhyoday-kumar"),
    ("1dk3uG_mjbrZ398nmRkWi4h0pUXpimOSI", "vaibhav-jain"),
    ("1c1J2IJjaOWuIGk12asJvBslekqTktfsQ", "anjishth-anand"),
    ("1POhbV_y6lhWigTK88LRR4_5Mv8tfRpuZ", "yati-mehta"),
]

outdir = "assets/team"
results = {"success": [], "failed": []}

url_templates = [
    "https://lh3.googleusercontent.com/d/{fid}=w800",
    "https://drive.google.com/uc?export=view&id={fid}",
    "https://drive.google.com/thumbnail?id={fid}&sz=w800",
]

for fid, name in photo_map:
    outpath = os.path.join(outdir, name + ".jpg")
    downloaded = False
    for tmpl in url_templates:
        url = tmpl.format(fid=fid)
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            resp = urllib.request.urlopen(req, timeout=15)
            data = resp.read()
            # Check it's actually image data (not an HTML error page)
            if len(data) > 1000 and not data[:50].lower().startswith(b"<!doctype"):
                with open(outpath, "wb") as f:
                    f.write(data)
                results["success"].append(name)
                downloaded = True
                print(f"OK  {name} ({len(data)} bytes) via {tmpl.split('/')[2]}")
                break
            else:
                print(f"SKIP {name} from {tmpl.split('/')[2]} (got HTML or tiny response, {len(data)} bytes)")
        except Exception as e:
            print(f"FAIL {name} from {tmpl.split('/')[2]}: {e}")
    if not downloaded:
        results["failed"].append(name)
        print(f"FAILED ALL for {name}")

print(f"\n=== SUMMARY ===")
print(f"Downloaded: {len(results['success'])}")
print(f"Failed: {len(results['failed'])}")
if results["failed"]:
    print(f"Failed members: {', '.join(results['failed'])}")
