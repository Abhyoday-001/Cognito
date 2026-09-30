import gdown
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

for fid, name in photo_map:
    outpath = os.path.join(outdir, name + ".jpg")
    url = f"https://drive.google.com/uc?id={fid}"
    try:
        result = gdown.download(url, outpath, quiet=True, fuzzy=True)
        if result and os.path.exists(outpath):
            size = os.path.getsize(outpath)
            # Check it's not HTML
            with open(outpath, "rb") as f:
                header = f.read(50)
            if header[:9].lower().startswith(b"<!doctype") or header[:5].lower().startswith(b"<html"):
                os.remove(outpath)
                print(f"FAIL {name:30s} (HTML response)")
                failed.append(name)
            else:
                print(f"OK   {name:30s} ({size:>8d} bytes)")
                success.append(name)
        else:
            print(f"FAIL {name:30s} (no output)")
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
