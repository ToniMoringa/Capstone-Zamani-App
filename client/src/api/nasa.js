export const fetchVisualArtifact = async (capsules) => {
  const featured = capsules.find((c) => c.image_url && c.historical_content);

  if (featured) {
    let imageUrl = featured.image_url;

    if (imageUrl.includes('upload.wikimedia.org')) {
      const encodedUrl = encodeURIComponent(imageUrl);
      imageUrl = `https://wsrv.nl/?url=${encodedUrl}&w=800&q=90&output=webp`;
    }

    return {
      url: imageUrl,
      title: featured.title,
      explanation: featured.description,
      source: 'zamani_curated',
    };
  }

  return {
    url: null,
    title: 'No Visual Record',
    explanation: 'Verified imagery not available for this date in our archive.',
    source: 'placeholder',
  };
};
