import "react-image-gallery/styles/image-gallery.css";
import type { GalleryItem } from "react-image-gallery";
import ImageGallery from "react-image-gallery";
import { IconPhotoOff } from "@tabler/icons-react";
import type { Product } from "../../types/productDetails.types";

interface ProductGalleryProps {
  product: Product;
  onMainImageRef?: (image: HTMLImageElement | null) => void;
}

export default function ProductGallery({ product, onMainImageRef }: ProductGalleryProps) {
  const imageUrls = [product.imageCover, ...(product.images ?? [])].filter(
    (imageUrl): imageUrl is string =>
      typeof imageUrl === "string" && imageUrl.trim().length > 0,
  );
  const uniqueImageUrls = [...new Set(imageUrls)];

  if (uniqueImageUrls.length === 0) {
    return (
      <div
        role="status"
        className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-xl bg-slate-50 px-5 text-center text-slate-500 sm:min-h-[380px]"
      >
        <IconPhotoOff size={38} stroke={1.6} aria-hidden="true" />
        <p className="text-sm">Product images are not available.</p>
      </div>
    );
  }

  const items: GalleryItem[] = uniqueImageUrls.map((imageUrl, index) => ({
    original: imageUrl,
    thumbnail: imageUrl,
    originalAlt: `${product.title} — image ${index + 1}`,
    thumbnailAlt: `View ${product.title} image ${index + 1}`,
    thumbnailTitle: `Product image ${index + 1}`,
    loading: index === 0 ? "eager" : "lazy",
    thumbnailLoading: "lazy",
  }));

  return (
    <div className="product-image-gallery rounded-xl bg-white">
      <ImageGallery
        items={items}
        renderItem={(item) => (
          // react-image-gallery owns its image rendering and sizing semantics.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={onMainImageRef}
            src={item.original}
            alt={item.originalAlt ?? product.title}
            className="image-gallery-image"
            loading="eager"
          />
        )}
        additionalClass="freshcart-image-gallery"
        showNav={false}
        showThumbnails={items.length > 1}
        showFullscreenButton={false}
        showPlayButton={false}
        showBullets={false}
        thumbnailPosition="bottom"
        lazyLoad
        useBrowserFullscreen
      />
    </div>
  );
}
