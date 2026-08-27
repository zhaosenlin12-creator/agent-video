
import sys
NL = chr(10)
Q = chr(34)

def img(id, src, delay, x, y, w, h, entrance='axial-flyin'):
    s = '  { id: ' + Q + id + Q + ', kind: ' + Q + 'image' + Q + ', src: ' + Q + src + Q
    s += ', entrance: ' + Q + entrance + Q + ', delay: ' + str(delay) + ', x: ' + str(x)
    s += ', y: ' + str(y) + ', w: ' + str(w) + ', h: ' + str(h) + ' },'
    return s

def lbl(id, text, color, size, x, y, delay, hl=False):
    h = ', highlight: true' if hl else ''
    s = '  { id: ' + Q + id + Q + ', kind: ' + Q + 'label' + Q + ', entrance: ' + Q + 'spring-rise' + Q
    s += ', delay: ' + str(delay) + ', text: ' + Q + text + Q + ', textColor: ' + Q + color + Q
    s += ', textSize: ' + str(size) + ', x: ' + str(x) + ', y: ' + str(y) + h + ' },'
    return s

def tag(id, text, color, size, x, y, delay):
    s = '  { id: ' + Q + id + Q + ', kind: ' + Q + 'tag' + Q + ', entrance: ' + Q + 'spring-pop' + Q
    s += ', delay: ' + str(delay) + ', text: ' + Q + text + Q + ', textColor: ' + Q + color + Q
    s += ', textSize: ' + str(size) + ', x: ' + str(x) + ', y: ' + str(y) + ' },'
    return s

def burst(id, text, color, size, x, y, delay):
    s = '  { id: ' + Q + id + Q + ', kind: ' + Q + 'burst' + Q + ', entrance: ' + Q + 'spring-pop' + Q
    s += ', delay: ' + str(delay) + ', text: ' + Q + text + Q + ', textColor: ' + Q + color + Q
    s += ', textSize: ' + str(size) + ', x: ' + str(x) + ', y: ' + str(y) + ' },'
    return s

def spark(id, x, y, delay):
    return '  { id: ' + Q + id + Q + ', kind: ' + Q + 'sparkle' + Q + ', entrance: ' + Q + 'spring-pop' + Q + ', delay: ' + str(delay) + ', x: ' + str(x) + ', y: ' + str(y) + ' },'

def step(id, text):
    s = '  { id: ' + Q + id + Q + ', kind: ' + Q + 'step' + Q + ', entrance: ' + Q + 'spring-pop' + Q
    s += ', delay: 0, text: ' + Q + text + Q + ', textColor: ' + Q + '#FFD400' + Q + ', textSize: 54 },'
    return s

def cap(id, text, delay):
    s = '  { id: ' + Q + id + Q + ', kind: ' + Q + 'label' + Q + ', entrance: ' + Q + 'fade' + Q
    s += ', delay: ' + str(delay) + ', text: ' + Q + text + Q
    s += ', textColor: ' + Q + '#FFFFFF' + Q + ', textSize: 44, x: 540, y: 1730 },'
    return s

def line(id, entrance, delay):
    return '  { id: ' + Q + id + Q + ', kind: ' + Q + 'line' + Q + ', entrance: ' + Q + entrance + Q + ', delay: ' + str(delay) + ' },'

def icon(id, shape, text, color, size, x, y, delay):
    s = '  { id: ' + Q + id + Q + ', kind: ' + Q + 'icon' + Q + ', entrance: ' + Q + 'spring-pop' + Q
    s += ', delay: ' + str(delay) + ', iconShape: ' + Q + shape + Q
    s += ', text: ' + Q + text + Q + ', textColor: ' + Q + color + Q
    s += ', textSize: ' + str(size) + ', x: ' + str(x) + ', y: ' + str(y) + ' },'
    return s

def sfx(frame, sound):
    return '      { frame: ' + str(frame) + ', sound: ' + Q + sound + Q + ' },'

# Build header
H = []
H.append('// All scene data for the ' + Q + chr(0x4e00) + chr(0x8282) + chr(0x8bfe) + chr(0x6253) + chr(0x5370) + chr(0x53ea) + chr(0x6d3b) + chr(0x6050) + chr(0x9f99) + Q + ' 3D printing dinosaur video.')
H.append('// v15: layout refactor + cropped subject + cartoon vibe')
H.append('')

# Types
H.append('export type SceneKey =')
H.append('  | ' + Q + '01_hook' + Q + ' | ' + Q + '02_materials' + Q + ' | ' + Q + '03_model' + Q + ' | ' + Q + '04_slice' + Q + ' | ' + Q + '05_print' + Q)
H.append('  | ' + Q + '06_layer' + Q + ' | ' + Q + '07_remove' + Q + ' | ' + Q + '08_servo' + Q + ' | ' + Q + '09_code' + Q + ' | ' + Q + '10_power' + Q)
H.append('  | ' + Q + '11_demo' + Q + ' | ' + Q + '12_roar' + Q + ' | ' + Q + '13_endcard' + Q + ';')
H.append('')

# Footer function
def footer():
    f = []
    f.append('')
    f.append('export const FPS = 30;')
    f.append('')
    f.append('export function durToFrames(sec: number): number {')
    f.append('  return Math.max(1, Math.round(sec * FPS));')
    f.append('}')
    f.append('')
    f.append('export function sceneFrames(s: SceneDef): number {')
    f.append('  const dur = Math.max(s.minDur, s.voiceSec + 0.4);')
    f.append('  return durToFrames(dur);')
    f.append('}')
    f.append('')
    f.append('export function totalFrames(): number {')
    f.append('  let total = 0;')
    f.append('  for (const s of SCENES) total += sceneFrames(s);')
    f.append('  return total;')
    f.append('')
    f.append('export function sceneFrameRange(idx: number): { start: number; duration: number } {')
    f.append('  let start = 0;')
    f.append('  for (let i = 0; i < idx; i++) start += sceneFrames(SCENES[i]);')
    f.append('  return { start, duration: sceneFrames(SCENES[idx]) };')
    f.append('}')
    return chr(10).join(f)

with open(r'D:\kaifa-teacher\moneyprintergent-video\qa\debug_v15\_helpers.py', 'w', encoding='utf-8') as f:
    f.write(chr(10).join(H) + chr(10) + chr(10) + footer())
print('helpers saved')
