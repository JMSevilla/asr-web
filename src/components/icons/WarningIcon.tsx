import { useTheme } from '@mui/material';

interface Props {
  customColor?: string;
}

export const WarningIcon = ({ customColor }: Props) => {
  const theme = useTheme();

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="31.999" height="32" viewBox="0 0 31.999 32">
      <g id="Icon_Warning" data-name="Icon/Warning" transform="translate(31.999 32) rotate(180)">
        <path
          id="Exclusion_1"
          data-name="Exclusion 1"
          // eslint-disable-next-line max-len
          d="M11663.388,4498.27a16,16,0,1,1,11.314-4.687A15.89,15.89,0,0,1,11663.388,4498.27Zm-2.028-18.05v10.35h4.109v-10.35Zm2.031-6.25a2.08,2.08,0,0,0,0,4.161,2.08,2.08,0,0,0,.082-4.159Z"
          transform="translate(-11647.39 -4466.27)"
          fill={customColor ?? theme.palette.warning.main}
        />
      </g>
    </svg>
  );
};
