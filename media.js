// Fetch animation previews as they approach the viewport.
const previews = document.querySelectorAll('video source[data-src]');

function playPreview(video) {
  const source = video.querySelector('source[data-src]');
  if (!source.src) {
    source.src = source.dataset.src;
    video.load();
  }
  if (!document.hidden) {
    video.play().catch(() => {
      // Keep the poster visible when browser policy prevents autoplay.
    });
  }
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const { target: video, isIntersecting } of entries) {
      video.dataset.nearViewport = String(isIntersecting);
      if (isIntersecting) {
        playPreview(video);
      } else {
        video.pause();
      }
    }
  }, { rootMargin: '200px 0px' });

  for (const source of previews) {
    observer.observe(source.parentElement);
  }
} else {
  for (const source of previews) {
    source.parentElement.dataset.nearViewport = 'true';
    playPreview(source.parentElement);
  }
}

document.addEventListener('visibilitychange', () => {
  for (const source of previews) {
    const video = source.parentElement;
    if (document.hidden) {
      video.pause();
    } else if (video.dataset.nearViewport === 'true') {
      playPreview(video);
    }
  }
});
