/**
 * @param {{ page: { url: string } }} data
 * @returns {string}
 */
export function pageUrlSlug(data) {
  const pageUrl = data.page.url.replace(/\/$/, '') || 'index';

  return pageUrl.replace(/^\//, '').replace(/\//g, '-');
}
