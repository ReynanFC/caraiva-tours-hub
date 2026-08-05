import { FileSizePipe } from './file-size.pipe';

describe('FileSizePipe', () => {
  const pipe = new FileSizePipe();

  it('should format bytes using an appropriate unit', () => {
    expect(pipe.transform(512)).toBe('512 B');
    expect(pipe.transform(1024)).toBe('1 KB');
    expect(pipe.transform(1.5 * 1024 * 1024)).toBe('1.5 MB');
  });

  it('should handle an empty size', () => {
    expect(pipe.transform(null)).toBe('0 B');
  });
});
