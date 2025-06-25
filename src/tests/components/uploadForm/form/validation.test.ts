import { uploadFormSchema } from '../../../../components/blocks/uploadForm/form/validation';
import { renderHook } from '../../../common';

describe('uploadFormSchema', () => {
  it('should pass validation', () => {
    const { result } = renderHook(() => uploadFormSchema('test', ['png'], 2, 1000));
    expect(result.current.isValidSync({ files: [new File([], 'test.png', { type: 'png' })] })).toBe(true);
  });

  it('should fail validation (wrong file type)', () => {
    const { result } = renderHook(() => uploadFormSchema('test', ['png'], 2, 1000));
    expect(result.current.isValidSync({ files: [new File([], 'test.txt', { type: 'text/plain' })] })).toBe(false);
  });

  it('should fail validation (too much files)', () => {
    const { result } = renderHook(() => uploadFormSchema('test', ['png'], 2, 1000));
    expect(result.current.isValidSync({ files: [new File([], 'test.png'), new File([], 'test.png')] })).toBe(false);
  });

  it('should fail validation (too big file)', () => {
    const { result } = renderHook(() => uploadFormSchema('test', ['png'], 2, 1));
    expect(result.current.isValidSync({ files: [new File(['asdasdasd'], 'test.png')] })).toBe(false);
  });
});
