import { useTheme } from '@mui/material';

interface Props {
  customColor?: string;
}

export const CloseIcon = ({ customColor }: Props) => {
  const theme = useTheme();

  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_974:1006)">
        <mask
          id="mask0_974:1006"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="26"
          height="26"
        >
          <path
            d="M25.6719 3.08138L15.7719 12.9999L25.6719 22.9184L22.8419 25.7537L12.9419 15.8352L3.04191 25.7537L0.211914 22.9184L10.1119 12.9999L0.211914 3.08138L3.04191 0.246094L12.9419 10.1646L22.8419 0.246094L25.6719 3.08138Z"
            fill="black"
          />
        </mask>
        <g mask="url(#mask0_974:1006)">
          <mask
            id="mask1_974:1006"
            style={{ maskType: 'alpha' }}
            maskUnits="userSpaceOnUse"
            x="-245"
            y="-296"
            width="1601"
            height="903"
          >
            <rect x="-244.058" y="-295.576" width="1600" height="901.682" fill="black" />
          </mask>
          <g mask="url(#mask1_974:1006)">
            <mask
              id="mask2_974:1006"
              style={{ maskType: 'alpha' }}
              maskUnits="userSpaceOnUse"
              x="-1"
              y="-1"
              width="27"
              height="28"
            >
              <rect x="-0.0581055" y="-0.0253906" width="26" height="26.0486" fill="black" />
            </mask>
            <g mask="url(#mask2_974:1006)">
              <mask
                id="mask3_974:1006"
                style={{ maskType: 'alpha' }}
                maskUnits="userSpaceOnUse"
                x="-1"
                y="-1"
                width="27"
                height="28"
              >
                <rect x="-0.0581055" y="-0.0253906" width="26" height="26.0486" fill="black" />
              </mask>
              <g mask="url(#mask3_974:1006)">
                <rect
                  x="-16.7559"
                  y="12.998"
                  width="42.0392"
                  height="42.0392"
                  transform="rotate(-45 -16.7559 12.998)"
                  fill="#00759B"
                />
                <rect
                  x="-8.05811"
                  y="-8.04102"
                  width="42"
                  height="42.0785"
                  fill={customColor ?? theme.palette.primary.main}
                />
              </g>
            </g>
          </g>
        </g>
      </g>
      <defs>
        <clipPath id="clip0_974:1006">
          <rect width="25.46" height="25.5076" fill="white" transform="translate(0.211914 0.246094)" />
        </clipPath>
      </defs>
    </svg>
  );
};
