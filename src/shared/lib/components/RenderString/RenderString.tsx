export function RenderString({ htmlString }: { htmlString: string }) {
  const sanitizedHTML = { __html: htmlString };

  return <div dangerouslySetInnerHTML={sanitizedHTML} />;
}
