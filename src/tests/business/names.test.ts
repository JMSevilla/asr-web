import { Membership } from '../../api/mdp/types';
import { formatFirstName, formatFullName, formatInitials } from '../../business/names';

describe('Business names logic', () => {
  describe('formatFirstName', () => {
    it('should return empty string if forenames is null', () => {
      expect(formatFirstName(null)).toBe('');
    });

    it('should return empty string if forenames is undefined', () => {
      expect(formatFirstName(undefined)).toBe('');
    });

    it('should return the capitalized first name from a single forename', () => {
      expect(formatFirstName('john')).toBe('John');
    });

    it('should return only the first name if multiple forenames are provided', () => {
      expect(formatFirstName('john david')).toBe('John');
    });

    it('should handle already capitalized names', () => {
      expect(formatFirstName('John')).toBe('John');
    });

    it('should handle mixed case names', () => {
      expect(formatFirstName('jOhN')).toBe('John');
    });

    it('should trim whitespace', () => {
      expect(formatFirstName(' john ')).toBe('John');
    });
  });

  describe('formatFullName', () => {
    it('should return a dash if membership is null', () => {
      expect(formatFullName(null)).toBe('-');
    });

    it('should format first name and surname correctly', () => {
      const membership: Membership = {
        forenames: 'john',
        surname: 'doe',
        schemeName: 'Test Scheme',
        hasAdditionalContributions: false,
        dateOfBirth: null,
        title: null,
        age: null,
        floorRoundedAge: null,
        referenceNumber: null,
        normalRetirementAge: null,
        normalRetirementDate: null,
        datePensionableServiceCommenced: null,
        dateOfLeaving: null,
        transferInServiceYears: null,
        transferInServiceMonths: null,
        totalPensionableServiceYears: null,
        totalPensionableServiceMonths: null,
        finalPensionableSalary: null,
        membershipNumber: null,
        insuranceNumber: null,
        status: null,
        payrollNumber: null,
        dateJoinedScheme: null,
        dateLeftScheme: null,
        category: null,
        datePensionableServiceStarted: null,
      };

      expect(formatFullName(membership)).toBe('John Doe');
    });

    it('should take only the first name if multiple forenames are provided', () => {
      const membership: Membership = {
        forenames: 'john david',
        surname: 'doe',
        schemeName: 'Test Scheme',
        hasAdditionalContributions: false,
        dateOfBirth: null,
        title: null,
        age: null,
        floorRoundedAge: null,
        referenceNumber: null,
        normalRetirementAge: null,
        normalRetirementDate: null,
        datePensionableServiceCommenced: null,
        dateOfLeaving: null,
        transferInServiceYears: null,
        transferInServiceMonths: null,
        totalPensionableServiceYears: null,
        totalPensionableServiceMonths: null,
        finalPensionableSalary: null,
        membershipNumber: null,
        insuranceNumber: null,
        status: null,
        payrollNumber: null,
        dateJoinedScheme: null,
        dateLeftScheme: null,
        category: null,
        datePensionableServiceStarted: null,
      };

      expect(formatFullName(membership)).toBe('John Doe');
    });

    it('should handle null forenames', () => {
      const membership: Membership = {
        forenames: null,
        surname: 'doe',
        schemeName: 'Test Scheme',
        hasAdditionalContributions: false,
        dateOfBirth: null,
        title: null,
        age: null,
        floorRoundedAge: null,
        referenceNumber: null,
        normalRetirementAge: null,
        normalRetirementDate: null,
        datePensionableServiceCommenced: null,
        dateOfLeaving: null,
        transferInServiceYears: null,
        transferInServiceMonths: null,
        totalPensionableServiceYears: null,
        totalPensionableServiceMonths: null,
        finalPensionableSalary: null,
        membershipNumber: null,
        insuranceNumber: null,
        status: null,
        payrollNumber: null,
        dateJoinedScheme: null,
        dateLeftScheme: null,
        category: null,
        datePensionableServiceStarted: null,
      };

      expect(formatFullName(membership)).toBe('Doe');
    });

    it('should handle null surname', () => {
      const membership: Membership = {
        forenames: 'john',
        surname: null,
        schemeName: 'Test Scheme',
        hasAdditionalContributions: false,
        dateOfBirth: null,
        title: null,
        age: null,
        floorRoundedAge: null,
        referenceNumber: null,
        normalRetirementAge: null,
        normalRetirementDate: null,
        datePensionableServiceCommenced: null,
        dateOfLeaving: null,
        transferInServiceYears: null,
        transferInServiceMonths: null,
        totalPensionableServiceYears: null,
        totalPensionableServiceMonths: null,
        finalPensionableSalary: null,
        membershipNumber: null,
        insuranceNumber: null,
        status: null,
        payrollNumber: null,
        dateJoinedScheme: null,
        dateLeftScheme: null,
        category: null,
        datePensionableServiceStarted: null,
      };

      expect(formatFullName(membership)).toBe('John');
    });

    it('should handle both null forenames and surname', () => {
      const membership: Membership = {
        forenames: null,
        surname: null,
        schemeName: 'Test Scheme',
        hasAdditionalContributions: false,
        dateOfBirth: null,
        title: null,
        age: null,
        floorRoundedAge: null,
        referenceNumber: null,
        normalRetirementAge: null,
        normalRetirementDate: null,
        datePensionableServiceCommenced: null,
        dateOfLeaving: null,
        transferInServiceYears: null,
        transferInServiceMonths: null,
        totalPensionableServiceYears: null,
        totalPensionableServiceMonths: null,
        finalPensionableSalary: null,
        membershipNumber: null,
        insuranceNumber: null,
        status: null,
        payrollNumber: null,
        dateJoinedScheme: null,
        dateLeftScheme: null,
        category: null,
        datePensionableServiceStarted: null,
      };

      expect(formatFullName(membership)).toBe('');
    });
  });

  describe('formatInitials', () => {
    it('should return a dash if membership is null', () => {
      expect(formatInitials(null)).toBe('-');
    });

    it('should return initials from forenames and surname', () => {
      const membership: Membership = {
        forenames: 'john',
        surname: 'doe',
        schemeName: 'Test Scheme',
        hasAdditionalContributions: false,
        dateOfBirth: null,
        title: null,
        age: null,
        floorRoundedAge: null,
        referenceNumber: null,
        normalRetirementAge: null,
        normalRetirementDate: null,
        datePensionableServiceCommenced: null,
        dateOfLeaving: null,
        transferInServiceYears: null,
        transferInServiceMonths: null,
        totalPensionableServiceYears: null,
        totalPensionableServiceMonths: null,
        finalPensionableSalary: null,
        membershipNumber: null,
        insuranceNumber: null,
        status: null,
        payrollNumber: null,
        dateJoinedScheme: null,
        dateLeftScheme: null,
        category: null,
        datePensionableServiceStarted: null,
      };

      expect(formatInitials(membership)).toBe('JD');
    });

    it('should return initials from multiple forenames if no surname', () => {
      const membership: Membership = {
        forenames: 'john david',
        surname: null,
        schemeName: 'Test Scheme',
        hasAdditionalContributions: false,
        dateOfBirth: null,
        title: null,
        age: null,
        floorRoundedAge: null,
        referenceNumber: null,
        normalRetirementAge: null,
        normalRetirementDate: null,
        datePensionableServiceCommenced: null,
        dateOfLeaving: null,
        transferInServiceYears: null,
        transferInServiceMonths: null,
        totalPensionableServiceYears: null,
        totalPensionableServiceMonths: null,
        finalPensionableSalary: null,
        membershipNumber: null,
        insuranceNumber: null,
        status: null,
        payrollNumber: null,
        dateJoinedScheme: null,
        dateLeftScheme: null,
        category: null,
        datePensionableServiceStarted: null,
      };

      expect(formatInitials(membership)).toBe('JD');
    });

    it('should return single initial if only forename is available', () => {
      const membership: Membership = {
        forenames: 'john',
        surname: null,
        schemeName: 'Test Scheme',
        hasAdditionalContributions: false,
        dateOfBirth: null,
        title: null,
        age: null,
        floorRoundedAge: null,
        referenceNumber: null,
        normalRetirementAge: null,
        normalRetirementDate: null,
        datePensionableServiceCommenced: null,
        dateOfLeaving: null,
        transferInServiceYears: null,
        transferInServiceMonths: null,
        totalPensionableServiceYears: null,
        totalPensionableServiceMonths: null,
        finalPensionableSalary: null,
        membershipNumber: null,
        insuranceNumber: null,
        status: null,
        payrollNumber: null,
        dateJoinedScheme: null,
        dateLeftScheme: null,
        category: null,
        datePensionableServiceStarted: null,
      };

      expect(formatInitials(membership)).toBe('J');
    });

    it('should handle null forenames and surname', () => {
      const membership: Membership = {
        forenames: null,
        surname: null,
        schemeName: 'Test Scheme',
        hasAdditionalContributions: false,
        dateOfBirth: null,
        title: null,
        age: null,
        floorRoundedAge: null,
        referenceNumber: null,
        normalRetirementAge: null,
        normalRetirementDate: null,
        datePensionableServiceCommenced: null,
        dateOfLeaving: null,
        transferInServiceYears: null,
        transferInServiceMonths: null,
        totalPensionableServiceYears: null,
        totalPensionableServiceMonths: null,
        finalPensionableSalary: null,
        membershipNumber: null,
        insuranceNumber: null,
        status: null,
        payrollNumber: null,
        dateJoinedScheme: null,
        dateLeftScheme: null,
        category: null,
        datePensionableServiceStarted: null,
      };

      expect(formatInitials(membership)).toBe('-');
    });

    it('should handle empty forenames', () => {
      const membership: Membership = {
        forenames: '',
        surname: 'doe',
        schemeName: 'Test Scheme',
        hasAdditionalContributions: false,
        dateOfBirth: null,
        title: null,
        age: null,
        floorRoundedAge: null,
        referenceNumber: null,
        normalRetirementAge: null,
        normalRetirementDate: null,
        datePensionableServiceCommenced: null,
        dateOfLeaving: null,
        transferInServiceYears: null,
        transferInServiceMonths: null,
        totalPensionableServiceYears: null,
        totalPensionableServiceMonths: null,
        finalPensionableSalary: null,
        membershipNumber: null,
        insuranceNumber: null,
        status: null,
        payrollNumber: null,
        dateJoinedScheme: null,
        dateLeftScheme: null,
        category: null,
        datePensionableServiceStarted: null,
      };

      expect(formatInitials(membership)).toBe('-');
    });
  });
});
