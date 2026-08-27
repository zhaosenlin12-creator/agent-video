import subprocess, os, numpy as np
from PIL import Image

src = r'D:\kaifa-teacher\moneyprinter\agent-video\out\water-rocket-h264.mp4'
out_dir = r'D:\kaifa-teacher\moneyprinter\agent-video\qa\verify_v14'
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
    yellow_clipped = (yellow[:, 1060:1080].any(axis=1)).sum() > 50
    red_clipped = (red[:, 1060:1080].any(axis=1)).sum() > 50
    yellow_edge = (yellow[:, 1040:1080].any(axis=1)).sum() > 50
    title_edge = (title[:, 1040:1080].any(axis=1)).sum() > 50
    results.append({
        'scene': name,
        'time': '{:.1f}s'.format(t),
        'yellow': 'CLIP' if yellow_clipped else ('edge' if yellow_edge else 'ok'),
        'title': 'CLIP' if red_clipped else ('edge' if title_edge else 'ok'),
    })

print('scene          time   yellow_E   title_E')
print('-' * 55)
for r in results:
    print('{:<14} {:<6} {:<10} {}'.format(r['scene'], r['time'], r['yellow'], r['title']))
clipped = [r['scene'] for r in results if 'CLIP' in r['yellow'] or 'CLIP' in r['title']]
print('\nCLIPPED:', clipped if clipped else 'NONE')