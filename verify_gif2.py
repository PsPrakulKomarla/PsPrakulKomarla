from PIL import Image
im = Image.open('C:\\Users\\prakul\\Desktop\\projects\\PsPrakulKomarla\\assets\\hero.gif')
print('Size:', im.size)
print('Mode:', im.mode)
print('n_frames:', getattr(im, 'n_frames', 'unknown'))
d = getattr(im, 'duration', None)
if d:
    print('Duration per frame:', d, 'ms')
    print('Total duration:', d * im.n_frames / 1000, 'seconds')
else:
    print('Frame count:', im.n_frames)
    print('Expected duration at 12fps:', im.n_frames / 12, 'seconds')
for i in range(min(5, getattr(im, 'n_frames', 1))):
    im.seek(i)
    print('Frame', i, ': mode=' + im.mode, 'size=' + str(im.size))