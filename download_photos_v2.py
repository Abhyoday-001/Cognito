import urllib.request
import http.cookiejar
import re
import os

photo_map = [
    ("1fl1jGHLf2kjBY09lk77D7hJRxA3wKU6B", "mayur-jain"),
    ("1twC4OjEoktlPNIyK3v_vxIYXBbcyKhDG", "nikhith-gowda-s"),
    ("1sOD4puE6gEMU99tkxj55xKlOmJ3oWrqU", "alby-thomas"),
    ("15ZTcKdtiXcM_3RNPQvRPkFi9OV2t_n0X", "tr-samriddhi"),
    ("1oQeWGGPgQIG5lMLS4VlGSgD5n48lsmeX", "shinjini-pal"),
    ("1F_eMMjr2soztEpD4lLA5_ETWJjG1S5-s", "prachi-priya"),
    ("1NLyBc7Cm_TEtqEKnqUkpMi5-zNs_EOMe", "ashel-jonita-noronha"),
    ("12lcrVsy1rphiJ9aV_DYNH7CNIurZYp8E", "shorya-saxena"),
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
success = []
failed = []

def download_drive_file(fid, outpath):
    """Download from Google Drive, handling the virus scan confirmation page."""
    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    
    # First try: direct download
    url = f"https://drive.google.com/uc?export=download&id={fid}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    resp = opener.open(req, timeout=20)
    data = resp.read()
    
    # Check if it's the virus scan HTML page
    if data[:15].lower().startswith(b"<!doctype") or b"confirm=" in data[:5000] or b"virus scan" in data[:5000].lower() or b"download anyway" in data[:10000].lower():
        # Extract the confirm token or uuid
        html = data.decode("utf-8", errors="replace")
        
        # Look for confirm URL patterns
        # Pattern 1: /uc?export=download&confirm=TOKEN&id=...
        match = re.search(r'href="(/uc\?export=download[^"]*)"', html)
        if not match:
            match = re.search(r'action="(/uc\?export=download[^"]*)"', html)
        if not match:
            # Pattern 2: confirm=UUID
            match2 = re.search(r'confirm=([0-9a-zA-Z_-]+)', html)
            if match2:
                confirm_url = f"https://drive.google.com/uc?export=download&confirm={match2.group(1)}&id={fid}"
            else:
                # Pattern 3: uuid parameter  
                match3 = re.search(r'name="uuid"\s+value="([^"]+)"', html)
                if match3:
                    confirm_url = f"https://drive.google.com/uc?export=download&id={fid}&confirm=t&uuid={match3.group(1)}"
                else:
                    return False
        else:
            confirm_url = "https://drive.google.com" + match.group(1).replace("&amp;", "&")
        
        req2 = urllib.request.Request(confirm_url, headers={"User-Agent": "Mozilla/5.0"})
        resp2 = opener.open(req2, timeout=20)
        data = resp2.read()
    
    # Verify it's image data (JPEG starts with FF D8, PNG starts with 89 50 4E 47)
    if len(data) > 1000 and (data[:2] == b'\xff\xd8' or data[:4] == b'\x89PNG' or data[:4] == b'RIFF'):
        with open(outpath, "wb") as f:
            f.write(data)
        return True
    
    # Still might be valid even without magic bytes - check it's not HTML
    if len(data) > 1000 and not data[:50].lower().startswith(b"<!doctype") and not data[:50].lower().startswith(b"<html"):
        with open(outpath, "wb") as f:
            f.write(data)
        return True
    
    return False

for fid, name in photo_map:
    outpath = os.path.join(outdir, name + ".jpg")
    try:
        ok = download_drive_file(fid, outpath)
        if ok:
            size = os.path.getsize(outpath)
            print(f"OK   {name:30s} ({size:>8d} bytes)")
            success.append(name)
        else:
            print(f"FAIL {name:30s} (got HTML, not image)")
            failed.append(name)
    except Exception as e:
        print(f"FAIL {name:30s} ({e})")
        failed.append(name)

print(f"\n=== SUMMARY ===")
print(f"Downloaded: {len(success)}/{len(photo_map)}")
if failed:
    print(f"Failed: {', '.join(failed)}")
else:
    print("All photos downloaded successfully!")
