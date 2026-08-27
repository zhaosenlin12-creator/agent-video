import subprocess, os, numpy as np
from PIL import Image

src = r'D:\kaifa-teacher\moneyprinter\agent-video\out\water-rocket-h264.mp4'
out_dir = r'D:\kaifa-teacher\moneyprinter\agent-video\qa\verify_v10'
os.makedirs(out_dir, exist_ok=True)

scenes = [
    (0, 5.0, '01_hook'),
    (5.0, 10.8, '02_materials'),
    (10.8, 15.8, '03_model'),
    (15.8, 20.8, '04_slice'),
    (20.8, 26.3, '05_print'),
    (26.3, 31.8, '06_layer'),
    (31.8, 36.8, '07_remove'),
    (36.8, 41.8, '08_servo'),
    (41.8, 46.8, '09_code'),
    (46.8, 51.8, '10_power'),
    (51.8, 55.3, '11_demo'),
    (55.3, 60.8, '12_roar'),
    (60.8, 66.0, '13_endcard'),
]

results = []
for start, end, name in scenes:
    t = start + min(3.0, (end - start) * 0.6)
    out = os.path.join(out_dir, name + '.png')
    subprocess.run(['ffmpeg','-y','-ss','{:.2f}'.format(t),'-i',src,'-frames:v','1','-update','1',out], capture_output=True)
    img = np.array(Image.open(out).convert('RGB'))
    yellow = (img[:,:,0] > 200) & (img[:,:,1] > 150) & (img[:,:,2] < 80)
    red = (img[:,:,0] > 150) & (img[:,:,1] < 100) & (img[:,:,2] < 100)
    title = yellow | red
    # Check right edge (x>=1040, last 40px)
    yellow_edge_rows = np.where(yellow[:, 1040:1080].any(axis=1))[0]
    title_edge_rows = np.where(title[:, 1040:1080].any(axis=1))[0]
    # Check left edge (x<40)
    title_left_rows = np.where(title[:, 0:40].any(axis=1))[0]
    # Check caption safe zone (y>1700)
    cap_zone = img[1700:1820]
    white_cap = (cap_zone[:,:,0] > 200) & (cap_zone[:,:,1] > 200) & (cap_zone[:,:,2] > 200)
    if white_cap.any():
        cols = np.where(white_cap.any(axis=0))[0]
        cap_left, cap_right = cols.min(), cols.max()
    else:
        cap_left, cap_right = -1, -1
    results.append({
        'scene': name,
        'time': '{:.1f}s'.format(t),
        'yellow_right': 'YES' if len(yellow_edge_rows) > 0 else 'ok',
        'title_right': 'YES' if len(title_edge_rows) > 0 else 'ok',
        'title_left': 'YES' if len(title_left_rows) > 0 else 'ok',
        'caption': 'x={}-{}'.format(cap_left, cap_right) if cap_left >= 0 else 'none',
    })

print('scene          time   yellow_R  title_R   title_L  caption')
print('-' * 70)
for r in results:
    print('{:<14} {:<6} {:<9} {:<9} {:<9} {}'.format(r['scene'], r['time'], r['yellow_right'], r['title_right'], r['title_left'], r['caption']))