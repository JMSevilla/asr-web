import { ContentFund } from '../../../api/content/types/funds';
import { RetirementDCContributions } from '../../../api/mdp/types';
import { parseDisplayableFunds, parseGroupedFunds } from '../../../components/blocks/funds/parsing';

describe('Funds parsing', () => {
  test('should parse funds', () => {
    const contributions: RetirementDCContributions = {
      contributionTypes: [
        {
          contributionType: 'EMPLOYEE',
          funds: [
            { code: 'A', name: 'Fund A' },
            { code: 'B', name: 'Fund B' },
          ],
        },
        {
          contributionType: 'EMPLOYER',
          funds: [
            { code: 'C', name: 'Fund C' },
            { code: 'D', name: 'Fund D' },
          ],
        },
      ],
    };
    const contentFunds: ContentFund[] = [
      { fundCode: 'A', fundGroup: 'Group A', fundName: 'Fund A', factsheetUrl: 'https://www.fund-a.com' },
      { fundCode: 'B', fundGroup: 'Group B', fundName: 'Fund B', factsheetUrl: 'https://www.fund-b.com' },
      { fundCode: 'D', fundGroup: 'Group D', fundName: 'Fund D', factsheetUrl: 'https://www.fund-d.com' },
    ];
    const funds = parseDisplayableFunds(contributions, contentFunds);
    expect(funds).toEqual([
      { fundCode: 'A', fundGroup: 'Group A', fundName: 'Fund A', factsheetUrl: 'https://www.fund-a.com' },
      { fundCode: 'B', fundGroup: 'Group B', fundName: 'Fund B', factsheetUrl: 'https://www.fund-b.com' },
      { fundCode: 'D', fundGroup: 'Group D', fundName: 'Fund D', factsheetUrl: 'https://www.fund-d.com' },
    ]);
  });

  test('should group funds', () => {
    const funds: ContentFund[] = [
      { fundCode: 'B', fundGroup: 'Group 1', fundName: 'Fund B', factsheetUrl: 'https://www.fund-b.com' },
      { fundCode: 'A', fundGroup: 'Group 1', fundName: 'Fund A', factsheetUrl: 'https://www.fund-a.com' },
      { fundCode: 'C', fundGroup: 'Group 2', fundName: 'Fund C', factsheetUrl: 'https://www.fund-c.com' },
    ];
    const groupedFunds = {
      'Group 1': [
        { fundCode: 'A', fundGroup: 'Group 1', fundName: 'Fund A', factsheetUrl: 'https://www.fund-a.com' },
        { fundCode: 'B', fundGroup: 'Group 1', fundName: 'Fund B', factsheetUrl: 'https://www.fund-b.com' },
      ],
      'Group 2': [{ fundCode: 'C', fundGroup: 'Group 2', fundName: 'Fund C', factsheetUrl: 'https://www.fund-c.com' }],
    };
    expect(parseGroupedFunds(funds)).toEqual(groupedFunds);
  });

  test('should sort funds', () => {
    const funds: ContentFund[] = [
      { fundCode: 'A', fundGroup: 'Group 2', fundName: 'Fund A', factsheetUrl: 'https://www.fund-a.com', orderNo: 3 },
      { fundCode: 'B', fundGroup: 'Group 1', fundName: 'Fund B', factsheetUrl: 'https://www.fund-b.com', orderNo: 1 },
      { fundCode: 'C', fundGroup: 'Group 2', fundName: 'Fund C', factsheetUrl: 'https://www.fund-c.com', orderNo: 2 },
      { fundCode: 'D', fundGroup: 'Group 1', fundName: 'Fund D', factsheetUrl: 'https://www.fund-b.com' },
      { fundCode: 'E', fundGroup: 'Group 1', fundName: 'Fund E', factsheetUrl: 'https://www.fund-b.com' },
    ];
    const sortedFunds = { 'Group 2': [funds[2], funds[0]], 'Group 1': [funds[1], funds[3], funds[4]] };

    expect(
      parseGroupedFunds(funds, [
        { label: 'Group 2', value: 'Group 2' },
        { label: 'Group 1', value: 'Group 1' },
      ]),
    ).toEqual(sortedFunds);
  });
});
