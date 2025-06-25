import { contentAccessKeyWithCustomWordingFlags, objectWithAppendedWordingFlags } from '../../business/wording-flags';

describe('Business wording-flags logic', () => {
  describe('contentAccessKeyWithCustomWordingFlags', () => {
    it('should add flags to content access key according userAgent', () => {
      //to avoid type error for global variable
      //@ts-ignore
      global.userAgent.mockReturnValue(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
      );
      const object = `{"tenantUrl":"abc","wordingFlags":["GMP","GMPINPAY"],"currentAge":"61Y6M"}`;
      const result = contentAccessKeyWithCustomWordingFlags(object);
      expect(result).toEqual(
        `{"tenantUrl":"abc","wordingFlags":["GMP","GMPINPAY","browser:Chrome","platform:Mac"],"currentAge":"61Y6M"}`,
      );
    });
  }),
    describe('objectWithAppendedWordingFlags', () => {
      it('should add flags to content access key to existing wording flags', () => {
        const object = `{"tenantUrl":"abc","wordingFlags":["GMP","GMPINPAY"],"currentAge":"61Y6M"}`;
        const flags = ['test2'];
        const result = objectWithAppendedWordingFlags(object, flags);
        expect(result).toEqual(`{"tenantUrl":"abc","wordingFlags":["GMP","GMPINPAY","test2"],"currentAge":"61Y6M"}`);
      });

      it('should add flags to content access key to empty wording flags', () => {
        const object = `{"tenantUrl":"abc","wordingFlags":[],"currentAge":"61Y6M"}`;
        const flags = ['test2'];
        const result = objectWithAppendedWordingFlags(object, flags);
        expect(result).toEqual(`{"tenantUrl":"abc","wordingFlags":["test2"],"currentAge":"61Y6M"}`);
      });

      it('should add flags to content access key to undefined wording flags', () => {
        const object = `{"tenantUrl":"abc","currentAge":"61Y6M"}`;
        const flags = ['test2'];
        const result = objectWithAppendedWordingFlags(object, flags);
        expect(result).toEqual(`{"tenantUrl":"abc","currentAge":"61Y6M","wordingFlags":["test2"]}`);
      });

      it('should sanitize flags', () => {
        const object = `{"tenantUrl":"abc","wordingFlags":["GMP","GMPINPAY"],"currentAge":"61Y6M"}`;
        const flags = ['test2!@#$%^&*()_+', '!@#$%^&*()_+test3'];
        const result = objectWithAppendedWordingFlags(object, flags);
        expect(result).toEqual(
          `{"tenantUrl":"abc","wordingFlags":["GMP","GMPINPAY","test2_","_test3"],"currentAge":"61Y6M"}`,
        );
      });
    });
});
