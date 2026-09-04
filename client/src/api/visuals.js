export const fetchVisualArtifact = async (capsules) => {
  const featured = capsules.find(
    (capsule) => capsule.image_url && capsule.historical_content,
  );

  if (!featured) {
    return {
      url: null,
      title: 'No Visual Record',
      explanation: 'Verified imagery not available for this date.',
      source: 'placeholder',
    };
  }

  return {
    url: featured.image_url,
    title: featured.title,
    explanation: featured.description,
    source: 'zamani_curated',
  };
};
