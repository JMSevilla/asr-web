import { useTheme } from '@mui/material';

interface Props {
  customColor?: string;
}

export const SuccessIcon = ({ customColor }: Props) => {
  const theme = useTheme();

  return (
    <svg
      id="Icon_Success"
      data-name="Icon/Success"
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <path
        id="Icon_Success-2"
        data-name="Icon/Success"
        // eslint-disable-next-line max-len
        d="M12062,4983a16,16,0,1,1,11.315-4.687A15.889,15.889,0,0,1,12062,4983Zm-8.608-16.845h0l-2.067,1.955,7.023,6.654,14.331-13.574-2.067-1.958-12.264,11.615-4.956-4.692Z"
        transform="translate(-12046.001 -4951.001)"
        fill={customColor ?? theme.palette.success.main}
      />
    </svg>
  );
};
