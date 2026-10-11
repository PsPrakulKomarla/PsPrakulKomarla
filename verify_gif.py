from PIL import Image
im = Image.open('C:\\Users\\prakul\\Desktop\\projects\\PsPrakulKomarla\\assets\\hero.gif')
print('Size:', im.size)
print('Mode:', im.mode)
print('n_frames:', getattr(im, 'n_frames', 'unknown'))
print('Duration:', getattr(im, 'duration', 'unknown'))
for i in range(min(5, getattr(im, 'n_frames', 1))):
    im.seek(i)
    print('Frame', i, ': mode=' + im.mode, 'size=' + str(im.size))