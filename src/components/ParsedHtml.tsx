import { Box, BoxProps, Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import { Element } from 'domhandler';
import parse, { HTMLReactParserOptions } from 'html-react-parser';
import { Parser } from 'simple-text-parser';
import { BadgeBlock, ContentButtonBlock, CountdownTimer, EvaIcon, InformationModalBlock, Tooltip } from '.';
import { constructUniversalUrlPath } from '../business/url';
import { injectTokensToText, useTokenEnrichedValue } from '../cms/inject-tokens';
import { InterpolationTokens } from '../cms/types';
import { config } from '../config';
import { useGlobalsContext } from '../core/contexts/GlobalsContext';
import { useTenantContext } from '../core/contexts/TenantContext';
import { useRouter } from '../core/router';
import { SvgDataIcon } from './SvgDataIcon';

type EventTarget = React.MouseEvent<HTMLDivElement, MouseEvent>['target'];

interface HTMLBoxEvent extends React.MouseEvent<HTMLDivElement, MouseEvent> {
  target: EventTarget & { tagName: string; href: string; target: string };
}

interface Props extends Omit<BoxProps, 'dangerouslySetInnerHTML' | 'onClick'> {
  html: string;
  isWithMargin?: boolean;
  smallerFonts?: boolean;
  disableEmptyLineRule?: boolean;
  disableOverrideLinkColors?: boolean;
  alternateTableStyle?: string;
  tokens?: InterpolationTokens;
}

const parser = new Parser();

parser.addRule(/\[\[modal:([^\]]*)]]/gi, (modal: string) => ({
  type: 'modal',
  text: modal.replace(/\[\[modal:([^\]]*)]]/, '<span id="$1" class="replace-modal">$1</span>'),
}));

parser.addRule(/\[\[tooltip:([^\]]*)]]/gi, (tooltip: string) => ({
  type: 'tooltip',
  text: tooltip.replace(/\[\[tooltip:([^\]]*)]]/, '<span id="$1" class="replace-tooltip">$1</span>'),
}));

parser.addRule(/\[\[message:([^\]]*)]]/gi, (message: string) => ({
  type: 'message',
  text: message.replace(/\[\[message:([^\]]*)]]/, '<span id="$1" class="replace-message">$1</span>'),
}));

parser.addRule(/\[\[button:([^\]]*)]]/gi, (button: string) => ({
  type: 'button',
  text: button.replace(/\[\[button:([^\]]*)]]/, '<span id="$1" class="replace-button">$1</span>'),
}));

parser.addRule(/\[\[timer:([^\]]*)]]/gi, (timer: string) => ({
  type: 'timer',
  text: timer.replace(/\[\[timer:([^\]]*)]]/, '<span id="$1" class="replace-timer">$1</span>'),
}));

parser.addRule(/<h\d>(.+)<\/h\d>/gi, (text: string) => ({
  type: 'text',
  text: text.replace(/<h\d>(.+)<\/h\d>/gi, '<h2>$1</h2>'),
}));

parser.addRule(/\[\[icon:([^\]]*)]]/gi, (icon: string) => ({
  type: 'icon',
  text: icon.replace(/\[\[icon:([^\]]*)]]/, '<span id="$1" class="replace-icon">$1</span>'),
}));

parser.addRule(/\[\[badge:([^\]]*)]]/gi, (badge: string) => ({
  type: 'badge',
  text: badge.replace(/\[\[badge:([^\]]*)]]/, '<span id="$1" class="replace-badge">$1</span>'),
}));

parser.addRule(/<li>(?:(?!<\/li>).)*?\[\[.*?\]\](?:(?!<\/li>).)*?<\/li>/g, ''); // remove li elements which values not injected

parser.addRule(/<li>\s*<\/li>/g, ''); // remove empty li elements

parser.addRule(/<p>\s<\/p>/gi, ''); // remove empty lines

const addColorSwapRule = (color: string = '#000') =>
  parser.addRule(/color:\s?(#FF0000|rgb\(\s?255,\s?0,\s?0\s?\))/gi, () => `color: ${color}`);

export const ParsedHtml: React.FC<Props> = ({
  html,
  isWithMargin = true,
  sx = {},
  smallerFonts = false,
  disableOverrideLinkColors = false,
  disableEmptyLineRule,
  fontSize,
  alternateTableStyle,
  tokens,
  ...props
}) => {
  const router = useRouter();
  const { tenant } = useTenantContext();
  const increasedAccessibility = tenant?.increasedAccessibility?.value;
  addColorSwapRule(tenant?.primaryColor.value);
  const { buttonByKey, tooltipByKey, badgeByKey, messageByKey, modalByKey, iconByKey } = useGlobalsContext();
  const tenantUrl = tenant?.tenantUrl.value.split('/')?.[1];
  const enrichedHtml = useTokenEnrichedValue(html);
  const htmlWithParsedTokens = tokens && enrichedHtml ? injectTokensToText(enrichedHtml, tokens) : enrichedHtml;
  const finalHtml = parse(parser.render(fixImagesInHtml(htmlWithParsedTokens!)), { replace } as HTMLReactParserOptions);
  const tableHasHeader = Boolean((html.match(/<thead[\s\S]*?<\/thead>/g) ?? []).length);
  const isTransparentTableStyle = alternateTableStyle === 'Transparent';
  const tableStyles = isTransparentTableStyle ? transparentTableStyles() : defaultTableStyles(tableHasHeader);

  return (
    <Box
      className="html-container"
      onClick={handleInnerLinkClick}
      sx={
        {
          ...textStyles(smallerFonts, disableOverrideLinkColors, fontSize, !!increasedAccessibility),
          ...tableStyles,
          ...sx,
          '& p': { display: isWithMargin ? 'block' : 'inline' },
        } as SxProps<Theme>
      }
      {...props}
    >
      {finalHtml}
    </Box>
  );

  function replace({ attribs }: Element) {
    if (!attribs) {
      return;
    }

    if (tenantUrl && attribs.href) {
      attribs.href = '/' + tenantUrl + attribs.href;
    }

    switch (attribs.class) {
      case 'replace-button': {
        const button = buttonByKey(attribs.id);
        return button ? <ContentButtonBlock {...button} /> : null;
      }
      case 'replace-tooltip': {
        const tooltip = tooltipByKey(attribs.id);

        if (!tooltip) {
          return attribs.id;
        }

        return (
          <Tooltip
            className={tooltip.makeInline ? 'inline-tooltip' : ''}
            header={tooltip?.header}
            html={tooltip?.html}
            underlinedText
            inheritFontSize
          >
            {tooltip?.text}
          </Tooltip>
        );
      }
      case 'replace-message': {
        return messageByKey(attribs.id);
      }
      case 'replace-badge': {
        const badge = badgeByKey(attribs.id);

        if (!badge) {
          return attribs.id;
        }

        return (
          <BadgeBlock
            {...badge}
            id={badge.key}
            tokens={tokens}
            className={badge.makeInline ? 'badge inline-badge' : 'badge'}
          />
        );
      }
      case 'replace-timer': {
        return <CountdownTimer timeInMinutes={+attribs.id} />;
      }
      case 'replace-modal': {
        const modal = modalByKey(attribs.id);

        if (!(modal?.text || modal?.panel)) {
          return attribs.id;
        }

        return (
          <InformationModalBlock
            header={modal.header}
            linkText={modal.linkText}
            text={modal.text}
            buttons={modal.buttons}
            isAlternateStyle={modal.isAlternateStyle}
            hideCloseInAlternateStyle={modal.hideCloseInAlternateStyle}
            panel={modal.panel}
          />
        );
      }
      case 'replace-icon': {
        const icon = iconByKey(attribs.id, tenant?.primaryColor.value);

        if (!icon) {
          return attribs.id;
        }

        if (icon.svgData) {
          return <SvgDataIcon svgData={icon.svgData} swapColor={icon.color} width={icon.width} height={icon.height} />;
        }

        return (
          <EvaIcon
            name={icon.name}
            fill={icon.color}
            width={icon.width}
            height={icon.height}
            ariaHidden
            className="eva-icon-inline"
          />
        );
      }
      default: {
        return null;
      }
    }
  }

  function handleInnerLinkClick(e: HTMLBoxEvent) {
    if (e.target.tagName !== 'A') return;
    if (e.target.target !== '_blank') {
      e.preventDefault();
    }
    if (e.target.target === '_self') {
      router.push(constructUniversalUrlPath(e.target.href));
    }
  }
};

const fixImagesInHtml = (html: string) =>
  html.replace(/<img([^>]+)\ssrc=(['"])([^'"]+)\2/gi, `<img$1 src=$2${config.value.CMS_URL}/$3$2`);

const textStyles = (
  smallerFonts: boolean,
  disableOverrideLinkColors: boolean,
  fontSize: Props['fontSize'],
  increasedAccessibility: boolean,
): SxProps<Theme> => ({
  display: 'inline',
  fontSize: fontSize || (theme => theme.typography.body1.fontSize),
  lineHeight: theme => theme.typography.body1.lineHeight,
  wordWrap: 'normal',
  '& h2': {
    fontWeight: 'normal',
    fontSize: fontSize || (theme => (smallerFonts ? theme.typography.body1 : theme.typography.h2).fontSize),
    lineHeight: theme => (smallerFonts ? theme.typography.body1 : theme.typography.h2).lineHeight,
    marginBlockStart: 0,
    marginBlockEnd: 6,
    '&:not(:first-of-type)': {
      marginBlockStart: 12,
    },
    '&:last-child': {
      marginBlockEnd: 0,
    },
    '&.info-message-header': {
      fontSize: 'inherit',
      fontWeight: 'bold',
    },
  },
  '& * + h2': {
    marginBlockStart: 12,
  },
  '& ul, li, p, p>span': {
    fontSize: fontSize || (theme => theme.typography.body1.fontSize),
    lineHeight: theme => theme.typography.body1.lineHeight,
    marginBlockStart: 0,
    '&:last-child': {
      marginBlockEnd: 0,
    },
  },
  '& li:not(:last-child)': {
    marginBlockEnd: 2,
  },
  '& span:not(.tooltip-link, .badge), pre': {
    fontSize: fontSize || (theme => theme.typography.body1.fontSize),
    lineHeight: theme => theme.typography.body1.lineHeight,
    marginBlockStart: 0,
  },
  '& caption': {
    fontSize: fontSize || (theme => theme.typography.caption.fontSize),
    lineHeight: theme => theme.typography.caption.lineHeight,
    marginBlockStart: 0,
  },
  '& button:not(.MuiTypography-body1)': {
    fontSize: fontSize || (theme => theme.typography.button.fontSize),
    lineHeight: theme => theme.typography.button.lineHeight,
    marginBlockStart: 0,
  },
  '& a': {
    fontSize: theme => (increasedAccessibility ? theme.typography.accessibleText : 'inherit'),
    whiteSpace: 'break-spaces',
    ...(disableOverrideLinkColors ? { color: 'inherit !important', textDecorationColor: 'inherit' } : {}),
  },
  '& img': {
    maxWidth: '100%',
    height: 'auto',
  },
  '& .eva-icon-inline': {
    marginBottom: -1.25,
  },
  '& .inline-tooltip': {
    display: 'inline-flex',
    verticalAlign: 'sub',
    '& svg': {
      marginLeft: 0.5,
      verticalAlign: 'middle',
    },
  },
  '& .badge': {
    fontSize: theme => theme.typography.badge.fontSize,
    '&.inline-badge': {
      display: 'inline-block',
      verticalAlign: 'middle',
    },
  },
});

const defaultTableStyles = (hasHeader: boolean): SxProps<Theme> => ({
  table: {
    borderCollapse: 'collapse',
    thead: {
      tr: {
        borderBottom: theme => `1px solid ${theme.palette.appColors.incidental['075']}`,
        color: theme => theme.palette.common.black,

        th: {
          paddingX: theme => `${theme.spacing(6)}!important`,
          paddingY: theme => `${theme.spacing(2)}!important`,
        },
      },
    },
    tbody: {
      'tr:nth-of-type(odd)': {
        backgroundColor: theme =>
          hasHeader ? theme.palette.appColors.support80.transparentLight : theme.palette.common.white,
      },
      'tr:nth-of-type(even)': {
        backgroundColor: theme =>
          hasHeader ? theme.palette.common.white : theme.palette.appColors.support80.transparentLight,
      },
      tr: {
        td: {
          paddingX: theme => `${theme.spacing(6)}!important`,
          paddingY: theme => `${theme.spacing(3)}!important`,
          borderBottom: theme => `1px solid ${theme.palette.appColors.incidental['075']}`,
        },
        th: {
          paddingX: theme => `${theme.spacing(6)}!important`,
          paddingY: theme => `${theme.spacing(3)}!important`,
          borderBottom: theme => `1px solid ${theme.palette.appColors.incidental['075']}`,
        },
        '&:hover': {
          backgroundColor: theme => theme.palette.appColors.support60.transparentLight,
        },
        '&:active': {
          backgroundColor: theme => theme.palette.appColors.primary,
          td: {
            color: theme => theme.palette.common.white,
          },
          th: {
            color: theme => theme.palette.common.white,
          },
        },
      },
    },
  },
  '& table:not(:last-child)': {
    marginBlockEnd: 6,
  },
});

const transparentTableStyles = (): SxProps<Theme> => ({
  table: {
    borderCollapse: 'collapse',
    thead: {
      tr: {
        th: {
          paddingY: theme => `${theme.spacing(2)}!important`,
        },
      },
    },
    tbody: {
      tr: {
        td: {
          alignContent: 'flex-start',
          paddingY: theme => `${theme.spacing(3)}!important`,
        },
        'td:nth-of-type(odd)': {
          paddingRight: theme => `${theme.spacing(6)}!important`,
        },
        th: {
          paddingY: theme => `${theme.spacing(3)}!important`,
        },
        'th:nth-of-type(odd)': {
          paddingRight: theme => `${theme.spacing(6)}!important`,
        },
      },
    },
  },
  '& table:not(:last-child)': {
    marginBlockEnd: 6,
  },
});
