import { addDays, subDays } from 'date-fns';
import { personFormSchema } from '../../../components/blocks/personForm/validation';

describe('personFormSchema', () => {
  it('should validate required fields', async () => {
    const schema = personFormSchema(['name', 'surname', 'email', 'relationship'], 'errorKeyPrefix', 180);
    const validData = {
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      relationship: 'friend',
      phoneCode: 'GB',
    };
    const invalidData = {
      name: '',
      surname: '',
      email: '',
      relationship: '',
    };

    await expect(schema.validate(validData)).resolves.toBe(validData);
    await expect(schema.validate(invalidData)).rejects.toThrow();
  });

  it('should validate phone number fields', async () => {
    const schema = personFormSchema(['phone'], 'errorKeyPrefix', 180);
    const validData = {
      phoneCode: 'GB',
      phoneNumber: '1234567890',
    };
    const invalidData = {
      phoneCode: 'GB',
      phoneNumber: '000123123123',
    };

    await expect(schema.validate(validData)).resolves.toBe(validData);
    await expect(schema.validate(invalidData)).rejects.toThrow();
  });

  it('should invalidate phone numbers with incorrect format', async () => {
    const schema = personFormSchema(['phone'], 'errorKeyPrefix', 180);
    const invalidFormatData = {
      phoneCode: 'GB',
      phoneNumber: '123-ABC-7890',
    };

    await expect(schema.validate(invalidFormatData)).rejects.toThrow('errorKeyPrefix_phone_invalid_format');
  });

  it('should validate phone numbers with valid formats', async () => {
    const schema = personFormSchema(['phone'], 'errorKeyPrefix', 180);
    const validDataWithPlus = {
      phoneCode: 'GB',
      phoneNumber: '+44 123 456 7890',
    };
    const validDataWithParentheses = {
      phoneCode: 'GB',
      phoneNumber: '(123) 456 7890',
    };

    await expect(schema.validate(validDataWithPlus)).resolves.toEqual(validDataWithPlus);
    await expect(schema.validate(validDataWithParentheses)).resolves.toEqual(validDataWithParentheses);
  });

  it('should validate comment field as required if mandatory_comment is passed', async () => {
    const schema = personFormSchema(['mandatory_comment'], 'errorKeyPrefix', 180);
    const validData = { comment: 'comment', phoneCode: 'GB' };
    const invalidData = { comment: '' };

    await expect(schema.validate(validData)).resolves.toBe(validData);
    await expect(schema.validate(invalidData)).rejects.toThrow();
  });

  describe('Date of birth and death validation', () => {
    const schema = personFormSchema(['date_of_birth', 'date_of_death'], 'errorKeyPrefix', 180);
    const today = new Date();

    it('should validate when dateOfDeath is after dateOfBirth', async () => {
      const pastDate = subDays(today, 10);
      const deathDate = subDays(today, 5);

      const validData = {
        dateOfBirth: pastDate,
        dateOfDeath: deathDate,
        phoneCode: 'GB',
      };

      await expect(schema.validate(validData)).resolves.toBeTruthy();
    });

    it('should reject when dateOfDeath is the same as dateOfBirth', async () => {
      const sameDate = subDays(today, 5);

      const invalidData = {
        dateOfBirth: sameDate,
        dateOfDeath: new Date(sameDate),
        phoneCode: 'GB',
      };

      await expect(schema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject when dateOfDeath is before dateOfBirth', async () => {
      const birthDate = subDays(today, 5);
      const deathDate = subDays(today, 10);

      const invalidData = {
        dateOfBirth: birthDate,
        dateOfDeath: deathDate,
        phoneCode: 'GB',
      };

      await expect(schema.validate(invalidData)).rejects.toThrow();
    });

    it('should validate when dateOfBirth is null and dateOfDeath is in the past', async () => {
      const validData = {
        dateOfBirth: null,
        dateOfDeath: subDays(today, 5),
        phoneCode: 'GB',
      };

      await expect(schema.validate(validData)).resolves.toBeTruthy();
    });

    it('should reject when dateOfDeath is in the future', async () => {
      const invalidData = {
        dateOfBirth: subDays(today, 10),
        dateOfDeath: addDays(today, 5),
        phoneCode: 'GB',
      };

      await expect(schema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject when dateOfBirth is in the future', async () => {
      const futureDate = addDays(today, 5);
      const laterFutureDate = addDays(today, 10);

      const invalidData = {
        dateOfBirth: futureDate,
        dateOfDeath: laterFutureDate,
        phoneCode: 'GB',
      };

      await expect(schema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject when dates are the same day', async () => {
      const date1 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5);
      const date2 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5);

      const invalidData = {
        dateOfBirth: date1,
        dateOfDeath: date2,
        phoneCode: 'GB',
      };

      await expect(schema.validate(invalidData)).rejects.toThrow();
    });
  });
});
