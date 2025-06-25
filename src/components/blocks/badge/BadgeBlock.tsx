import { InterpolationTokens } from '../../../cms/types';
import { useApi } from '../../../core/hooks/useApi';
import { useDataReplacerApi } from '../../../core/hooks/useDataReplacerApi';
import { AnimatedBoxSkeleton } from '../../animations';
import { Badge } from './Badge';

interface Props {
  id?: string;
  text?: string;
  backgroundColor?: string;
  color?: string;
  accessibilityText?: string;
  urls?: string;
  className?: string;
  addBorder?: boolean;
  tokens?: InterpolationTokens;
}
export const BadgeBlock: React.FC<Props> = ({
  id,
  text,
  backgroundColor,
  color,
  accessibilityText,
  urls,
  className,
  addBorder,
  tokens,
  ...props
}) => {
  const badgeData = useApi<{ data: Record<string, object> }, [sourceUrl: string | undefined]>(
    async api => {
      if (!urls) {
        return { data: {} };
      }

      const dataUrls = urls
        .split(';')
        .filter(Boolean)
        .map(url => api.mdp.dataSummary<Record<string, object>>(url));
      const results = await Promise.all(dataUrls);
      const data = results.reduce((acc, response) => ({ ...acc, ...response.data }), {}) || {};
      return { data };
    },
    [urls],
  );
  const replacer = useDataReplacerApi(badgeData?.result?.data);

  if (badgeData.loading || replacer.loading) {
    return <AnimatedBoxSkeleton height={26} data-testid="skeleton-loader" />;
  }

  return (
    <Badge
      id={id}
      accessibilityText={accessibilityText}
      text={replacer.replaceDataInText(text)}
      backgroundColor={backgroundColor}
      borderColor={addBorder ? color : undefined}
      borderRadius="4px"
      color={color}
      className={className}
      tokens={tokens}
      {...props}
    />
  );
};
