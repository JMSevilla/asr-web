export const TextWithBoldedFirstWord: React.FC<{ text: string }> = ({ text }) => {
  const firstSpaceIndex = text.indexOf(' ');

  return (
    <>
      <strong>{text.substring(0, firstSpaceIndex)}</strong>
      <span style={{whiteSpace: 'pre'}}>{text.substring(firstSpaceIndex)}</span>
    </>
  );
};
