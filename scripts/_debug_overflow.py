from PIL import Image
import numpy as np

def measure_text(name, y_start, y_end):
    p = r'D:\kaifa-teacher\moneyprinter\agent-video\qa\verify_v11\\' + name + '.png'
    img = np.array(Image.open(p).convert('RGB'))
    yellow = (img[:,:,0] > 200) & (img[:,:,1] > 150) & (img[:,:,2] < 80)
    strip = yellow[y_start:y_end, :]
    cols = np.where(strip.any(axis=0))[0]
    if len(cols) > 0:
        print('{} yellow x={}-{} width={} left_margin={} right_margin={}'.format(name, cols.min(), cols.max(), cols.max()-cols.min()+1, cols.min(), 1080-cols.max()-1))

measure_text('04_slice', 1430, 1470)
measure_text('07_remove', 1410, 1470)
measure_text('12_roar', 1450, 1530)
measure_text('05_print', 1350, 1420)
measure_text('10_power', 1410, 1480)
measure_text('08_servo', 1410, 1470)