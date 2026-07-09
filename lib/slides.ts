export function getPresentationUrl(presentationId: string): string {
  return `https://docs.google.com/presentation/d/${presentationId}/edit?usp=sharing`;
}

export function getPresentationThumbnailUrl(presentationId: string): string {
  return `https://drive.google.com/thumbnail?id=${presentationId}&sz=w640-h480`;
}
