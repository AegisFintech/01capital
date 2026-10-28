import { raw } from '../lib/html.mjs';

const svg = (body, size = 24) =>
  raw(
    `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`,
  );

export const icons = {
  arrow: () => svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 18),
  arrowLeft: () => svg('<path d="M19 12H5M11 6l-6 6 6 6"/>', 18),
  external: () => svg('<path d="M14 5h5v5M19 5l-8 8M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4"/>', 16),
  globe: () =>
    svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>', 18),
  check: () => svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 18),
  chevron: () => svg('<path d="M6 9l6 6 6-6"/>', 16),
  mail: () => svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>', 20),
  x: () =>
    raw(
      '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M17.7 3h3.1l-6.8 7.8 8 10.2h-6.3l-4.9-6.4L5.2 21H2.1l7.3-8.3L1.7 3h6.4l4.4 5.9L17.7 3zm-1.1 16.2h1.7L7.5 4.7H5.7l10.9 14.5z"/></svg>',
    ),
  fintech: () =>
    svg('<path d="M3.5 8.5h14l-3.5-3.5M20.5 15.5h-14l3.5 3.5"/><circle cx="19.5" cy="8.5" r="1"/><circle cx="4.5" cy="15.5" r="1"/>', 28),
  blockchain: () =>
    svg(
      '<rect x="2.75" y="2.75" width="7.5" height="7.5" rx="1.75"/><rect x="13.75" y="13.75" width="7.5" height="7.5" rx="1.75"/><rect x="13.75" y="2.75" width="7.5" height="7.5" rx="1.75" opacity=".45"/><path d="M10.25 6.5h3.5M17.5 10.25v3.5M6.5 10.25v5a2 2 0 0 0 2 2h5.25"/>',
      28,
    ),
  ai: () =>
    svg(
      '<circle cx="12" cy="12" r="2.5"/><circle cx="5" cy="5.5" r="1.75"/><circle cx="19" cy="5.5" r="1.75"/><circle cx="5" cy="18.5" r="1.75"/><circle cx="19" cy="18.5" r="1.75"/><path d="M6.4 6.8l3.8 3.6M17.6 6.8l-3.8 3.6M6.4 17.2l3.8-3.6M17.6 17.2l-3.8-3.6"/>',
      28,
    ),
};
