"""Composes and renders the game's music and sound effects.

Music: one loop per world (melody/harmony stem + percussion stem, played in sync; percussion
fades in during waves), plus title, greenhouse, boss, victory and defeat. Sound effects: short WAVs.
Everything is synthesized here (additive plucks for harp/lyre/oud, breathy ney flute, string and
choir pads, bells, frame drums), so there are no third-party samples or licenses involved.

usage: python3 tools/audio/compose.py        (writes assets/audio/*.mp3, *.wav and music.json)
"""
import json, os, subprocess, sys, wave
import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'assets', 'audio')
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)

def hz(m):  # midi note to frequency
    return 440.0 * 2 ** ((m - 69) / 12)

def env(n, a, d, s, r, sr=SR):
    """ADSR envelope of n samples (a,d,r in seconds, s level)."""
    a, d, r = int(a * sr), int(d * sr), int(r * sr)
    e = np.full(n, s, dtype=np.float32)
    a = min(a, n); e[:a] = np.linspace(0, 1, a, endpoint=False) if a else e[:a]
    d2 = min(d, n - a)
    if d2 > 0: e[a:a + d2] = np.linspace(1, s, d2, endpoint=False)
    r = min(r, n)
    if r > 0: e[n - r:] *= np.linspace(1, 0, r)
    return e

def t_of(n): return np.arange(n, dtype=np.float32) / SR

# ---------- instruments: each returns a mono array for one note
def pluck(f, dur, bright=1.0, decay=3.0, harm=10, bend=0.0):
    """Harp / lyre / oud: harmonics that fade faster the higher they are."""
    n = int((dur + 1.2) * SR); t = t_of(n); y = np.zeros(n, np.float32)
    ph = 2 * np.pi * f * t * (1 + bend * np.exp(-t * 30))  # oud notes bend up into pitch
    for k in range(1, harm + 1):
        amp = (bright ** (k - 1)) / k ** 0.9
        y += amp * np.sin(k * ph) * np.exp(-t * decay * (0.6 + 0.35 * k))
    y *= np.minimum(1, t / 0.002)
    return y * 0.35

def ney(f, dur):
    """Breathy flute with delayed vibrato."""
    n = int((dur + 0.15) * SR); t = t_of(n)
    vib = 1 + 0.006 * np.sin(2 * np.pi * 5.2 * t) * np.minimum(1, t / 0.35)
    ph = 2 * np.pi * f * np.cumsum(vib) / SR
    y = np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)
    breath = np.convolve(rng.standard_normal(n).astype(np.float32), np.ones(30) / 30, 'same') * 0.12
    return (y + breath) * env(n, 0.06, 0.1, 0.8, 0.12) * 0.28

def strings(f, dur):
    """Soft string pad: detuned saws built from harmonics, slow attack."""
    n = int((dur + 0.6) * SR); t = t_of(n); y = np.zeros(n, np.float32)
    for det in (-0.004, 0.0, 0.005):
        for k in range(1, 9):
            y += np.sin(2 * np.pi * f * (1 + det) * k * t + k) / k ** 1.4
    return y * env(n, 0.35, 0.3, 0.75, 0.55) * 0.06

def choir(f, dur):
    """'Aah' pad: harmonics weighted by two vowel formants."""
    n = int((dur + 0.8) * SR); t = t_of(n); y = np.zeros(n, np.float32)
    vib = 1 + 0.004 * np.sin(2 * np.pi * 4.6 * t)
    for k in range(1, 16):
        fk = f * k
        w = np.exp(-((fk - 750) / 260) ** 2) + 0.7 * np.exp(-((fk - 1150) / 300) ** 2) + 0.25 * (k == 1)
        y += w * np.sin(2 * np.pi * fk * np.cumsum(vib) / SR)
    return y * env(n, 0.5, 0.3, 0.8, 0.7) * 0.12

def bell(f, dur):
    n = int((dur + 2.0) * SR); t = t_of(n)
    y = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * d) for r, a, d in ((1, 1, 1.4), (2.76, .45, 2.4), (5.4, .25, 4), (8.93, .12, 6)))
    return y * np.minimum(1, t / 0.003) * 0.16

def bass(f, dur):
    n = int((dur + 0.3) * SR); t = t_of(n)
    y = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t) + 0.1 * np.sin(6 * np.pi * f * t)
    return y * env(n, 0.005, 0.25, 0.55, 0.15) * 0.35

def brass(f, dur):
    n = int((dur + 0.2) * SR); t = t_of(n); y = np.zeros(n, np.float32)
    bright = np.minimum(1, t / 0.12)
    for k in range(1, 12):
        y += np.sin(2 * np.pi * f * k * t) / k * (bright ** (k * 0.3))
    return y * env(n, 0.05, 0.1, 0.85, 0.12) * 0.12

def noise(n): return rng.standard_normal(n).astype(np.float32)

def smooth(x, k):  # crude low-pass
    return np.convolve(x, np.ones(k) / k, 'same').astype(np.float32)

# ---------- percussion
def doum(dur=0.5):   # deep frame-drum hit
    n = int(dur * SR); t = t_of(n)
    f = 55 + 70 * np.exp(-t * 35)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) + smooth(noise(n), 40) * np.exp(-t * 30) * 0.4
    return y * 0.7

def tek(dur=0.12):   # rim / high hit
    n = int(dur * SR); t = t_of(n)
    y = (noise(n) - smooth(noise(n), 6)) * np.exp(-t * 60) + np.sin(2 * np.pi * 900 * t) * np.exp(-t * 50) * 0.4
    return y * 0.35

def riq(dur=0.25):   # tambourine jingles
    n = int(dur * SR); t = t_of(n); x = noise(n); hp = x - smooth(x, 3)
    return hp * (np.exp(-t * 25) + 0.5 * np.exp(-((t - 0.03) * 60) ** 2)) * 0.18

def shaker(dur=0.1):
    n = int(dur * SR); t = t_of(n); x = noise(n)
    return (x - smooth(x, 4)) * np.exp(-((t - 0.03) / 0.025) ** 2) * 0.12

def cymbal(dur=1.6):
    n = int(dur * SR); t = t_of(n); x = noise(n)
    return (x - smooth(x, 2)) * np.exp(-t * 2.5) * 0.12

def place(buf, y, t0, gain=1.0):
    i = int(t0 * SR)
    if i >= len(buf): return
    j = min(len(buf), i + len(y)); buf[i:j] += y[:j - i] * gain

def reverb(x, wet=0.25, length=1.8):
    n = int(length * SR); t = t_of(n)
    ir = noise(n) * np.exp(-t * 3.2); ir = smooth(ir, 3); ir /= np.sqrt((ir ** 2).sum())
    m = len(x) + n; fft = np.fft.rfft
    y = np.fft.irfft(fft(x, m) * fft(ir, m), m)[:len(x)].astype(np.float32)
    return x * (1 - wet) + y * wet * 1.6

def fold_loop(buf, L):
    """Wrap the tail past the loop point back onto the start, so the loop is seamless."""
    n = int(L * SR); out = buf[:n].copy(); tail = buf[n:]
    while len(tail):
        k = min(len(tail), n); out[:k] += tail[:k]; tail = tail[k:]
    return out

# ---------- composition
SCALES = {'ionian': [0, 2, 4, 5, 7, 9, 11], 'lydian': [0, 2, 4, 6, 7, 9, 11], 'dorian': [0, 2, 3, 5, 7, 9, 10],
          'aeolian': [0, 2, 3, 5, 7, 8, 10], 'hijaz': [0, 1, 4, 5, 7, 8, 10], 'phrygian': [0, 1, 3, 5, 7, 8, 10]}

def degree(scale, root, d):
    o, i = divmod(d, 7)
    return root + SCALES[scale][i] + 12 * o

def melody(seed, bars, scale, prog, rhythm_set):
    """Phrase-shaped melody: motif A, A' , B, A'' cadence; notes as (beat, len, degree)."""
    r = np.random.default_rng(seed); notes = []
    motifs = []
    for _ in range(3):
        rh = rhythm_set[r.integers(len(rhythm_set))]; steps = r.integers(-2, 3, len(rh)); motifs.append((rh, steps))
    plan = [0, 0, 1, 1, 0, 2, 1, 0]  # which motif each bar uses
    d = 4
    for b in range(bars):
        rh, steps = motifs[plan[b % 8]]; beat = b * 4; chord = prog[b % len(prog)]
        for k, (dur, st) in enumerate(zip(rh, steps)):
            if k == 0: d = chord + [0, 2, 4][int(r.integers(3))] + (7 if r.random() < .3 else 0)
            else: d = max(chord - 1, min(chord + 9, d + int(st)))
            if (b % 8 == 7) and k == len(rh) - 1: d = chord + 7 if r.random() < .5 else chord  # cadence on chord tone
            notes.append((beat, dur, d)); beat += dur
    return notes

def render_track(name, tempo, root, scale, prog, lead, harmony, perc, bars=16, lead_seed=1, extra=None):
    spb = 60 / tempo; L = bars * 4 * spb; n = int((L + 3) * SR)
    base = np.zeros(n, np.float32); drums = np.zeros(n, np.float32)
    rh = [[1, 1, 1, 1], [1.5, .5, 1, 1], [2, 1, 1], [.5, .5, 1, 2], [1, .5, .5, 2], [1, 1, 2]]
    # harmony: chords and bass per bar
    for b in range(bars):
        c = prog[b % len(prog)]; t0 = b * 4 * spb
        chord = [degree(scale, root, c + k) for k in (0, 2, 4)]
        place(base, bass(hz(degree(scale, root - 12, c)), 4 * spb * .9), t0)
        place(base, bass(hz(degree(scale, root - 12, c)), spb * .9), t0 + 2.5 * spb, .6)
        if 'pad' in harmony:
            for m in chord: place(base, harmony['pad'](hz(m), 4 * spb), t0, .8)
        if 'arp' in harmony:
            pat = harmony.get('pattern', [0, 1, 2, 1, 0, 2, 1, 2])
            for k in range(8):
                m = chord[pat[k % len(pat)]] + 12 * (k // 4 % 2)
                place(base, harmony['arp'](hz(m + 12), spb * .6), t0 + k * spb / 2, .55)
        if 'drone' in harmony and b % 2 == 0:
            place(base, harmony['drone'](hz(root - 12), 8 * spb), t0, .7)
    # melody: plays the second half an octave up for lift
    for beat, dur, d in melody(lead_seed, bars, scale, prog, rh):
        m = degree(scale, root + 12, d) + (12 if beat >= bars * 2 and lead is not ney else 0)
        place(base, lead(hz(m), dur * spb * .95), beat * spb, 0.9)
    if extra: extra(base, spb, bars)
    # percussion stem
    for b in range(bars):
        for beat_off, kind, g in perc:
            t0 = (b * 4 + beat_off) * spb
            place(drums, {'doum': doum, 'tek': tek, 'riq': riq, 'shaker': shaker}[kind](), t0, g)
        if b % 8 == 0 and perc: place(drums, cymbal(), b * 4 * spb, .5)
    base = reverb(base, .28); drums = reverb(drums, .12, 1.0)
    out = {}
    for stem, buf in (('', base), ('-perc', drums)):
        if stem and not perc: continue
        y = fold_loop(buf, L)
        y = y / (np.abs(y).max() + 1e-9) * (0.8 if not stem else 0.7)
        encode(f'{name}{stem}', y)
    return L

def encode(name, y, sr=SR):
    wav = os.path.join(OUT, name + '.tmp.wav'); write_wav(wav, y, sr)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', wav, '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '80k', os.path.join(OUT, name + '.mp3')], check=True)
    os.remove(wav)

def write_wav(path, y, sr):
    pcm = (np.clip(y, -1, 1) * 32767).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(pcm.tobytes())

def oud(f, dur): return pluck(f, dur, bright=.82, decay=4.5, harm=12, bend=.012)
def harp(f, dur): return pluck(f, dur, bright=.6, decay=2.2, harm=8)
def lyre(f, dur): return pluck(f, dur, bright=.7, decay=3.0, harm=9)

MAQSUM = [(0, 'doum', 1), (1, 'tek', .8), (1.5, 'tek', .6), (2.5, 'doum', .9), (3, 'tek', .8)] + [(k / 2, 'riq', .5) for k in range(8)]
SOFT = [(0, 'doum', .8), (2, 'doum', .5), (1, 'shaker', .6), (3, 'shaker', .6), (1.5, 'riq', .3), (3.5, 'riq', .3)]
MARCH = [(0, 'doum', 1), (1, 'tek', .7), (2, 'doum', 1), (3, 'tek', .7), (3.5, 'tek', .5)] + [(k / 2, 'shaker', .5) for k in range(8)]

def tumulo_extra(base, spb, bars):
    for b in range(0, bars, 2): place(base, bell(hz(86), spb * 2), b * 4 * spb + 3 * spb, .5)

def ressurreicao_extra(base, spb, bars):
    # morning bells climbing the scale every two bars, and a high shimmer
    for b in range(0, bars, 2):
        for k, m in enumerate((79, 83, 86, 91)): place(base, bell(hz(m), spb * 2), (b * 4 + 2 + k * .5) * spb, .32)

def sombra_extra(base, spb, bars):
    # a low funeral bell on every bar, a rising choir cluster before each phrase returns
    for b in range(bars): place(base, bell(hz(45), spb * 3), b * 4 * spb, .55)
    for b in range(3, bars, 4):
        for m in (57, 58, 64): place(base, choir(hz(m), spb * 4), b * 4 * spb, .5)

HEAVY = [(0, 'doum', 1), (0.75, 'doum', .7), (2, 'doum', 1), (2.5, 'tek', .8), (3, 'doum', .9), (3.5, 'tek', .7)] + [(k / 2, 'shaker', .45) for k in range(8)]

TRACKS = {
    'titulo':    dict(tempo=84, root=62, scale='ionian', prog=[0, 3, 4, 0, 5, 3, 4, 4], lead=ney, harmony={'pad': strings, 'arp': lyre}, perc=[], lead_seed=11),
    'eden':      dict(tempo=88, root=65, scale='lydian', prog=[0, 1, 4, 0, 3, 1, 4, 4], lead=ney, harmony={'pad': strings, 'arp': harp}, perc=SOFT, lead_seed=3),
    'jerico':    dict(tempo=98, root=62, scale='hijaz', prog=[0, 0, 6, 0, 3, 3, 6, 0], lead=ney, harmony={'arp': oud, 'pattern': [0, 2, 1, 2, 0, 1, 2, 1]}, perc=MAQSUM, lead_seed=8),
    'mar':       dict(tempo=90, root=60, scale='dorian', prog=[0, 3, 0, 6, 0, 3, 4, 6], lead=ney, harmony={'pad': strings, 'arp': harp, 'pattern': [0, 1, 2, 1, 2, 1, 0, 1]}, perc=SOFT, lead_seed=5),
    'sinai':     dict(tempo=76, root=57, scale='hijaz', prog=[0, 1, 0, 6, 0, 1, 3, 0], lead=ney, harmony={'pad': choir, 'drone': strings, 'arp': oud}, perc=MARCH, lead_seed=13),
    'babel':     dict(tempo=104, root=64, scale='phrygian', prog=[0, 1, 0, 6, 5, 6, 1, 0], lead=oud, harmony={'arp': lyre, 'pad': strings}, perc=MAQSUM, lead_seed=21),
    'getsemani': dict(tempo=66, root=57, scale='aeolian', prog=[0, 5, 3, 4, 0, 5, 6, 4], lead=ney, harmony={'pad': choir, 'arp': harp, 'pattern': [0, 1, 2, 0, 2, 1, 0, 1]}, perc=[], lead_seed=17),
    'estufa':    dict(tempo=76, root=67, scale='ionian', prog=[0, 5, 3, 4, 0, 5, 1, 4], lead=bell, harmony={'arp': harp, 'pad': strings}, perc=[], lead_seed=29),
    'chefe':     dict(tempo=120, root=57, scale='hijaz', prog=[0, 0, 1, 0, 6, 5, 1, 0], lead=brass, harmony={'arp': oud, 'pad': strings, 'pattern': [0, 0, 1, 0, 2, 0, 1, 0]}, perc=MAQSUM + [(0.5, 'doum', .7), (2, 'doum', 1)], lead_seed=33),
    'tumulo':    dict(tempo=72, root=67, scale='ionian', prog=[0, 3, 4, 0, 5, 3, 1, 4], lead=ney, harmony={'pad': choir, 'arp': harp}, perc=[], lead_seed=41, extra=tumulo_extra),
    # the seventh world: dawn after the long night, bright lydian with bells; and the last boss, the shadow of death
    'ressurreicao': dict(tempo=92, root=67, scale='lydian', prog=[0, 4, 5, 3, 0, 1, 4, 4], lead=ney, harmony={'pad': choir, 'arp': harp, 'pattern': [0, 1, 2, 1, 2, 1, 0, 2]}, perc=SOFT, lead_seed=47, extra=ressurreicao_extra),
    'sombra':    dict(tempo=104, root=50, scale='phrygian', prog=[0, 1, 0, 6, 0, 1, 5, 6], lead=brass, harmony={'pad': choir, 'drone': strings, 'arp': oud, 'pattern': [0, 0, 1, 0, 2, 1, 0, 1]}, perc=HEAVY, lead_seed=53, extra=sombra_extra),
}

def jingle(name, notes, inst, tempo=120):
    spb = 60 / tempo; n = int((sum(d for _, d in notes) * spb + 2.5) * SR); y = np.zeros(n, np.float32); t = 0
    for m, d in notes:
        if m is not None:
            for mm in (m if isinstance(m, tuple) else (m,)): place(y, inst(hz(mm), d * spb), t * spb, .8)
        t += d
    y = reverb(y, .3); y /= np.abs(y).max(); encode(name, y * .85)

# ---------- sound effects (22 kHz WAVs: tiny and gapless)
SFX_SR = 22050
def sfx_write(name, y):
    y = y / (np.abs(y).max() + 1e-9) * 0.9; write_wav(os.path.join(OUT, 'sfx-' + name + '.wav'), y, SFX_SR)

def S(dur): n = int(dur * SFX_SR); return n, np.arange(n, dtype=np.float32) / SFX_SR
def sweep(f0, f1, dur, shape='sin'):
    n, t = S(dur); f = f0 * (f1 / f0) ** (t / dur); ph = 2 * np.pi * np.cumsum(f) / SFX_SR
    return {'sin': np.sin(ph), 'sq': np.sign(np.sin(ph)) * .6, 'tri': 2 / np.pi * np.arcsin(np.sin(ph))}[shape].astype(np.float32), t
def nz(dur): n, t = S(dur); return rng.standard_normal(n).astype(np.float32), t
def lp(x, k): return np.convolve(x, np.ones(k) / k, 'same').astype(np.float32)

def make_sfx():
    y, t = sweep(300, 720, .12, 'tri'); sfx_write('jump', y * np.exp(-t * 14))
    a, t = sweep(180, 40, .35); b, _ = nz(.35); sfx_write('slam', a * np.exp(-t * 9) + lp(b, 8) * np.exp(-t * 16) * .7)
    b, t = nz(.09); a, _ = sweep(700, 300, .09, 'sq'); sfx_write('hit', (b - lp(b, 4)) * np.exp(-t * 45) + a * np.exp(-t * 40) * .5)
    a, t = sweep(500, 1400, .16, 'tri'); b, _ = nz(.16); sfx_write('kill', a * np.exp(-t * 14) + (b - lp(b, 3)) * np.exp(-t * 30) * .3)
    n, t = S(.32); sfx_write('coin', (np.sin(2 * np.pi * 988 * t) * (t < .07) + np.sin(2 * np.pi * 1318 * t) * (t >= .07)) * np.exp(-t * 9))
    b, t = nz(.25); a, _ = sweep(260, 620, .25, 'sin'); sfx_write('plant', lp(b, 20) * np.exp(-t * 18) * .8 + a * np.exp(-t * 10) * .6)
    b, t = nz(.45); a, _ = sweep(1800, 200, .45, 'sin'); sfx_write('beam', (b - lp(b, 6)) * np.exp(-t * 5) * .4 + a * np.exp(-t * 4))
    a, t = sweep(240, 90, .35, 'sq'); sfx_write('hurt', a * np.exp(-t * 7))
    n, t = S(.6); y = sum(np.sin(2 * np.pi * f * t) * np.exp(-(t - i * .07) * 6) * (t > i * .07) for i, f in enumerate([523, 659, 784, 1047, 1319])); sfx_write('super', y)
    a, t = sweep(200, 150, .2, 'sq'); sfx_write('no', a * np.exp(-t * 8) * .7)
    # shofar: a ram's horn call, slightly bent up
    n, t = S(1.1); f = 233 * (1 + .03 * np.minimum(1, t / .25)); ph = 2 * np.pi * np.cumsum(f) / SFX_SR
    y = sum(np.sin(k * ph) / k ** 1.1 for k in range(1, 10)) * np.minimum(1, t / .08) * np.exp(-np.maximum(0, t - .8) * 8); sfx_write('horn', y); sfx_write('wave', y)
    b, t = nz(.12); sfx_write('card', (b - lp(b, 5)) * np.exp(-((t - .04) / .03) ** 2))
    a, t = sweep(160, 90, .18, 'sq'); b, _ = nz(.18); sfx_write('stone', a * np.exp(-t * 25) + (b - lp(b, 3)) * np.exp(-t * 40) * .6)
    b, t = nz(.7); sfx_write('wind', lp(b, 30) * np.sin(np.pi * t / .7))
    n, t = S(.7); y = sum(np.sin(2 * np.pi * f * t) * np.exp(-(t - i * .1) * 5) * (t > i * .1) for i, f in enumerate([660, 880, 1320])); sfx_write('heal', y)
    n, t = S(1.0); y = sum(np.sin(2 * np.pi * f * t) * np.exp(-(t - i * .12) * 3) * (t > i * .12) for i, f in enumerate([523, 659, 784, 1047])); sfx_write('ach', y)
    # sheep: "béé" with a wobbling pitch and nasal formant
    n, t = S(.55); f = 380 * (1 + .06 * np.sin(2 * np.pi * 9 * t)); ph = 2 * np.pi * np.cumsum(f) / SFX_SR
    y = sum((np.exp(-((k * 380 - 1100) / 400) ** 2) + .3) * np.sin(k * ph) / k for k in range(1, 12)) * np.minimum(1, t / .05) * np.exp(-np.maximum(0, t - .35) * 12); sfx_write('bleat', y)
    b, t = nz(.3); sfx_write('splash', (b - lp(b, 3)) * np.exp(-t * 12) + lp(b, 15) * np.exp(-t * 8) * .5)
    b, t = nz(1.4); sfx_write('thunder', lp(b, 60) * (np.exp(-t * 2.2) + .6 * np.exp(-((t - .25) * 6) ** 2)))
    b, t = nz(.22); sfx_write('sling', (b - lp(b, 8)) * np.sin(np.pi * t / .22) * .6)
    a, t = sweep(900, 1500, .08, 'tri'); sfx_write('pop', a * np.exp(-t * 30))

if __name__ == '__main__':
    # python3 compose.py ressurreicao sombra  -> renders only those tracks and keeps the rest of music.json
    only = [a for a in sys.argv[1:] if a in TRACKS]
    mj = os.path.join(OUT, 'music.json')
    if only:
        meta = json.load(open(mj))
        for name in only:
            meta['loops'][name] = round(render_track(name, **TRACKS[name]), 4); print('track', name, meta['loops'][name], 's')
        meta['perc'] = [k for k, c in TRACKS.items() if c['perc'] and k in meta['loops']]
        json.dump(meta, open(mj, 'w'), indent=1); sys.exit()
    lengths = {}
    for name, cfg in TRACKS.items():
        lengths[name] = render_track(name, **cfg); print('track', name, round(lengths[name], 1), 's')
    jingle('vitoria', [((62, 66, 69), 1), (69, .5), (71, .5), ((74, 78, 81), 3)], lyre, 110)
    jingle('derrota', [((57, 60, 64), 1.5), ((55, 59, 62), 1.5), ((53, 57, 60), 3)], harp, 80)
    make_sfx(); print('sfx done')
    json.dump({'loops': {k: round(v, 4) for k, v in lengths.items()}, 'perc': [k for k, c in TRACKS.items() if c['perc']]},
              open(os.path.join(OUT, 'music.json'), 'w'), indent=1)
