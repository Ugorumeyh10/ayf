export const GALLERY_ALBUMS = [
  { id: "dinner-award-night", label: "AYF Dinner and Award Night" },
  { id: "hangout-2024", label: "2024 Hangout" },
] as const;

export type GalleryAlbumId = (typeof GALLERY_ALBUMS)[number]["id"];

export function galleryAlbumLabel(id: string | null | undefined) {
  return GALLERY_ALBUMS.find((album) => album.id === id)?.label ?? "Chapter photos";
}
