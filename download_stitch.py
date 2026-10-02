import json
import os
import urllib.request

output_file = r"C:\Users\USER\.gemini\antigravity\brain\224f7acd-fb4f-4571-a7fb-16a681e50229\.system_generated\steps\17\output.txt"
target_dir = r"d:\USER\Desktop\csi 04\stitch_downloaded"
os.makedirs(target_dir, exist_ok=True)

with open(output_file, "r", encoding="utf-8") as f:
    data = json.load(f)

screens = data.get("screens", [])

for screen in screens:
    name = screen.get("name", "")
    screen_id = name.split("/")[-1] if "/" in name else name
    title = screen.get("title", screen_id)
    html_code = screen.get("htmlCode", {})
    download_url = html_code.get("downloadUrl")
    
    if download_url:
        print(f"Downloading HTML for screen: {title} ({screen_id})...")
        safe_title = "".join(c if c.isalnum() or c in (' ', '_', '-') else '_' for c in title)
        filename = f"{screen_id}_{safe_title}.html"
        file_path = os.path.join(target_dir, filename)
        
        try:
            req = urllib.request.Request(download_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response, open(file_path, 'wb') as out_file:
                out_file.write(response.read())
            print(f"Saved to {filename}")
        except Exception as e:
            print(f"Failed to download {screen_id}: {e}")

print("Download complete.")
