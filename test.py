import yt_dlp
import os

def download_tiktok(url, output_path="downloads/"):
    # Create folder if it doesn't exist
    os.makedirs(output_path, exist_ok=True)

    ydl_opts = {
        "outtmpl": os.path.join(output_path, "%(title)s.%(ext)s"),  # Save with video title
        "format": "mp4/best",  # Best mp4 available
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])


if __name__ == "__main__":
    # TikTok link you provided
    tiktok_url = "https://www.tiktok.com/@aehaunted2.0/video/7538796459722886422"
    download_tiktok(tiktok_url, "downloads/")
