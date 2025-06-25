export const AddIcon = ({ color }: { color?: string }) => {
  return (
    <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.5 0.5C5.6 0.5 0 6.1 0 13C0 19.9 5.6 25.5 12.5 25.5C19.4 25.5 25 19.9 25 13C25 6.1 19.4 0.5 12.5 0.5ZM18.75 14.25H13.75V19.25H11.25V14.25H6.25V11.75H11.25V6.75H13.75V11.75H18.75V14.25Z"
        fill={color}
      />
    </svg>
  );
};
