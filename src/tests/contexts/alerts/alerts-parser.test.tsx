import { Alert } from '../../../api/mdp/types';
import { MessageType } from '../../../components';
import { areAlertsListsEmpty, fixLinksInAlertHtml, parseAlerts } from '../../../core/contexts/alerts/alerts-parser';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

describe('alerts-parser', () => {
  describe('parseAlerts', () => {
    it('should sort alerts by alertID', () => {
      const alerts: Alert[] = [
        { alertID: 3, messageText: 'alert 3', effectiveDate: '2023-01-03' },
        { alertID: 1, messageText: 'alert 1', effectiveDate: '2023-01-01' },
        { alertID: 2, messageText: 'alert 2', effectiveDate: '2023-01-02' },
      ];

      const result = parseAlerts(alerts);

      expect(result.nonPriority[0].alertID).toBe(1);
      expect(result.nonPriority[1].alertID).toBe(2);
      expect(result.nonPriority[2].alertID).toBe(3);
    });

    it('should separate priority alerts with [[type:]] pattern', () => {
      const alerts: Alert[] = [
        { alertID: 1, messageText: '[[type:Info]] This is an info alert', effectiveDate: '2023-01-01' },
        { alertID: 2, messageText: 'This is a non-priority alert', effectiveDate: '2023-01-02' },
      ];

      const result = parseAlerts(alerts);

      expect(result.priority.length).toBe(1);
      expect(result.nonPriority.length).toBe(1);
      expect(result.priority[0].type).toBe(MessageType.Info);
      expect(result.priority[0].messageText).toBe('This is an info alert');
    });

    it('should default to PrimaryTenant type if MessageType not found', () => {
      const alerts: Alert[] = [
        { alertID: 1, messageText: '[[type:NonExistentType]] Test alert', effectiveDate: '2023-01-01' },
      ];

      const result = parseAlerts(alerts);

      expect(result.priority[0].type).toBe(MessageType.PrimaryTenant);
    });

    it('should process non-priority alerts with [[title:]] pattern', () => {
      const alerts: Alert[] = [
        {
          alertID: 1,
          messageText: '[[title:Test Title]]<p>Intro paragraph</p><p>Content paragraph</p>',
          effectiveDate: '2023-01-01',
        },
      ];

      const result = parseAlerts(alerts);

      expect(result.nonPriority.length).toBe(1);
      expect(result.nonPriority[0].title).toBe('Test Title');
      expect(result.nonPriority[0].introText).toBe('<p>Intro paragraph</p>');
      expect(result.nonPriority[0].messageText).toBe('<p>Content paragraph</p>');
    });

    it('should handle non-priority alerts without patterns', () => {
      const alerts: Alert[] = [{ alertID: 1, messageText: 'Simple alert text', effectiveDate: '2023-01-01' }];

      const result = parseAlerts(alerts);

      expect(result.nonPriority.length).toBe(1);
      expect(result.nonPriority[0].title).toBe('');
      expect(result.nonPriority[0].introText).toBe('');
      expect(result.nonPriority[0].messageText).toBe('Simple alert text');
    });

    it('should handle empty alerts array', () => {
      const result = parseAlerts([]);

      expect(result.priority.length).toBe(0);
      expect(result.nonPriority.length).toBe(0);
    });
  });

  describe('areAlertsListsEmpty', () => {
    it('returns false when no list is available', () => {
      const result = areAlertsListsEmpty(undefined, { priority: false, nonPriority: false });
      expect(result).toBe(false);
    });

    it('returns true when both priority and non-priority blocks are present but both lists are empty', () => {
      const list = { priority: [], nonPriority: [] };
      const blocksInPage = { priority: true, nonPriority: true };

      const result = areAlertsListsEmpty(list, blocksInPage);
      expect(result).toBe(true);
    });

    it('returns false when both priority and non-priority blocks are present and priority list has items', () => {
      const list = {
        priority: [{ alertID: 1, messageText: 'Alert', effectiveDate: '2023-01-01', type: MessageType.Info }],
        nonPriority: [],
      };
      const blocksInPage = { priority: true, nonPriority: true };

      const result = areAlertsListsEmpty(list, blocksInPage);
      expect(result).toBe(false);
    });

    it('returns false when both priority and non-priority blocks are present and non-priority list has items', () => {
      const list = {
        priority: [],
        nonPriority: [{ alertID: 1, messageText: 'Alert', effectiveDate: '2023-01-01', title: 'Test', introText: '' }],
      };
      const blocksInPage = { priority: true, nonPriority: true };

      const result = areAlertsListsEmpty(list, blocksInPage);
      expect(result).toBe(false);
    });

    it('returns false when both priority and non-priority blocks are present and both lists have items', () => {
      const list = {
        priority: [{ alertID: 1, messageText: 'Priority Alert', effectiveDate: '2023-01-01', type: MessageType.Info }],
        nonPriority: [
          { alertID: 2, messageText: 'Non-priority Alert', effectiveDate: '2023-01-02', title: 'Test', introText: '' },
        ],
      };
      const blocksInPage = { priority: true, nonPriority: true };

      const result = areAlertsListsEmpty(list, blocksInPage);
      expect(result).toBe(false);
    });

    it('returns true when only priority block is present and priority list is empty', () => {
      const list = {
        priority: [],
        nonPriority: [{ alertID: 1, messageText: 'Alert', effectiveDate: '2023-01-01', title: 'Test', introText: '' }],
      };
      const blocksInPage = { priority: true, nonPriority: false };

      const result = areAlertsListsEmpty(list, blocksInPage);
      expect(result).toBe(true);
    });

    it('returns false when only priority block is present and priority list has items', () => {
      const list = {
        priority: [{ alertID: 1, messageText: 'Alert', effectiveDate: '2023-01-01', type: MessageType.Info }],
        nonPriority: [],
      };
      const blocksInPage = { priority: true, nonPriority: false };

      const result = areAlertsListsEmpty(list, blocksInPage);
      expect(result).toBe(false);
    });

    it('returns true when only non-priority block is present and non-priority list is empty', () => {
      const list = {
        priority: [{ alertID: 1, messageText: 'Alert', effectiveDate: '2023-01-01', type: MessageType.Info }],
        nonPriority: [],
      };
      const blocksInPage = { priority: false, nonPriority: true };

      const result = areAlertsListsEmpty(list, blocksInPage);
      expect(result).toBe(true);
    });

    it('returns false when only non-priority block is present and non-priority list has items', () => {
      const list = {
        priority: [],
        nonPriority: [{ alertID: 1, messageText: 'Alert', effectiveDate: '2023-01-01', title: 'Test', introText: '' }],
      };
      const blocksInPage = { priority: false, nonPriority: true };

      const result = areAlertsListsEmpty(list, blocksInPage);
      expect(result).toBe(false);
    });

    it('returns false when no alert blocks are present in page', () => {
      const list = { priority: [], nonPriority: [] };
      const blocksInPage = { priority: false, nonPriority: false };

      const result = areAlertsListsEmpty(list, blocksInPage);
      expect(result).toBe(false);
    });

    it('returns false when no alert blocks are present in page even with alerts in lists', () => {
      const list = {
        priority: [{ alertID: 1, messageText: 'Priority Alert', effectiveDate: '2023-01-01', type: MessageType.Info }],
        nonPriority: [
          { alertID: 2, messageText: 'Non-priority Alert', effectiveDate: '2023-01-02', title: 'Test', introText: '' },
        ],
      };
      const blocksInPage = { priority: false, nonPriority: false };

      const result = areAlertsListsEmpty(list, blocksInPage);
      expect(result).toBe(false);
    });
  });

  describe('fixLinksInAlertHtml', () => {
    it('should add target="_self" to links without target attribute', () => {
      const html = '<p>Check out <a href="https://example.com">Link</a></p>';
      const result = fixLinksInAlertHtml(html);

      expect(result).toContain('<a href="https://example.com" target="_self">Link</a>');
    });

    it('should add rel="noopener noreferrer" to links with target="_blank" but no rel attribute', () => {
      const html = '<p>Check out <a href="https://example.com" target="_blank">Link</a></p>';
      const result = fixLinksInAlertHtml(html);

      expect(result).toContain('target="_blank"');
      expect(result).toContain('rel="noopener noreferrer"');
    });

    it('should not modify links that already have target="_self"', () => {
      const html = '<p>Check out <a href="https://example.com" target="_self">Link</a></p>';
      const result = fixLinksInAlertHtml(html);

      expect(result).toBe(html); // Should remain unchanged
    });

    it('should not modify links that already have target="_blank" and rel="noopener noreferrer"', () => {
      const html = '<p>Check out <a href="https://example.com" target="_blank" rel="noopener noreferrer">Link</a></p>';
      const result = fixLinksInAlertHtml(html);

      expect(result).toBe(html); // Should remain unchanged
    });

    it('should handle links with other target values without adding rel', () => {
      const html = '<p>Check out <a href="https://example.com" target="_parent">Link</a></p>';
      const result = fixLinksInAlertHtml(html);

      expect(result).toBe(html); // Should remain unchanged
      expect(result).not.toContain('rel="noopener noreferrer"');
    });

    it('should handle links with other attributes correctly', () => {
      const html = '<p>Check out <a href="https://example.com" class="link-class" id="link-id">Link</a></p>';
      const result = fixLinksInAlertHtml(html);

      expect(result).toContain('href="https://example.com"');
      expect(result).toContain('class="link-class"');
      expect(result).toContain('id="link-id"');
      expect(result).toContain('target="_self"');
      expect(result).not.toContain('rel="noopener noreferrer"');
    });

    it('should handle multiple links with different configurations', () => {
      const html = `
        <p>
          <a href="https://example1.com">Link 1</a>
          <a href="https://example2.com" target="_blank">Link 2</a>
          <a href="https://example3.com" target="_self">Link 3</a>
          <a href="https://example4.com" target="_blank" rel="noopener noreferrer">Link 4</a>
          <a href="https://example5.com" target="_parent">Link 5</a>
        </p>
      `;

      const result = fixLinksInAlertHtml(html);

      // Link 1: should get target="_self"
      expect(result).toMatch(/<a[^>]*href=["'][^"']*example1\.com[^"']*["'][^>]*target=["']_self["'][^>]*>Link 1<\/a>/);
      expect(result).not.toMatch(/<a[^>]*href=["'][^"']*example1\.com[^"']*["'][^>]*rel=/);

      // Link 2: should get rel="noopener noreferrer" added
      expect(result).toMatch(
        /<a[^>]*href=["'][^"']*example2\.com[^"']*["'][^>]*target=["']_blank["'][^>]*rel=["']noopener noreferrer["'][^>]*>Link 2<\/a>/,
      );

      // Link 3: should remain unchanged (already has target="_self")
      expect(result).toMatch(/<a[^>]*href=["'][^"']*example3\.com[^"']*["'][^>]*target=["']_self["'][^>]*>Link 3<\/a>/);
      expect(result).not.toMatch(/<a[^>]*href=["'][^"']*example3\.com[^"']*["'][^>]*rel=/);

      // Link 4: should remain unchanged (already has both attributes)
      expect(result).toMatch(
        /<a[^>]*href=["'][^"']*example4\.com[^"']*["'][^>]*target=["']_blank["'][^>]*rel=["']noopener noreferrer["'][^>]*>Link 4<\/a>/,
      );

      // Link 5: should remain unchanged (has target="_parent")
      expect(result).toMatch(
        /<a[^>]*href=["'][^"']*example5\.com[^"']*["'][^>]*target=["']_parent["'][^>]*>Link 5<\/a>/,
      );
      expect(result).not.toMatch(/<a[^>]*href=["'][^"']*example5\.com[^"']*["'][^>]*rel=/);
    });

    it('should handle mixed quote styles in attributes', () => {
      const html = `
        <p>
          <a href='https://example1.com'>Single quotes</a>
          <a href="https://example2.com" target='_blank'>Mixed quotes</a>
        </p>
      `;

      const result = fixLinksInAlertHtml(html);

      expect(result).toContain('target="_self"');
      expect(result).toContain('rel="noopener noreferrer"');
    });

    it('should preserve existing rel attributes on non-blank targets', () => {
      const html = '<p>Check out <a href="https://example.com" target="_self" rel="bookmark">Link</a></p>';
      const result = fixLinksInAlertHtml(html);

      expect(result).toBe(html); // Should remain unchanged
      expect(result).toContain('rel="bookmark"');
      expect(result).not.toContain('rel="noopener noreferrer"');
    });
  });
});
