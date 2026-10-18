/**
 * Cover images for his books, keyed by the `slug` of each book in the dictionaries
 * (`books.items`). Put the image in /public/images/books and set its path here, e.g.
 * "/images/books/l-autorite-des-ecritures.jpg". Books without a cover show a styled
 * fallback card instead.
 */

/**
 * TEST PLACEHOLDER: a sample cover used to preview the cover-image card. Replace each
 * use with the book's real cover (or remove it to show the fallback card).
 */
const placeholderCover = "/images/books/placeholder-cover.jpg";

export const bookCovers: Record<string, string | undefined> = {
  "le-saint-esprit-et-l-eglise": placeholderCover,
  "vers-une-plus-grande-manifestation-de-la-puissance-de-dieu": undefined,
  "le-leadership-et-la-puissance-du-saint-esprit": placeholderCover,
  "l-autorite-des-ecritures": undefined,
};
