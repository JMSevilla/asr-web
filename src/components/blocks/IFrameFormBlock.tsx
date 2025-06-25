interface Props {
  id: string;
  parameters: { key: string; value: string }[];
}
export const IFrameFormBlock: React.FC<Props> = ({ id, parameters }) => {
  const iframeParams = parameters.reduce((curr, { key, value }) => ({ ...curr, [key]: value }), {});

  return <iframe role="iframe" id={id} width={'100%'} height={'100%'} {...iframeParams} allowFullScreen />;
};
