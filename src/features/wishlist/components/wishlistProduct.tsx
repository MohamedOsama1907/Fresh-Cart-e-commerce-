
import Image from "next/image";
import Link from "next/link";
import { IconHeartOff, IconShoppingCart } from "@tabler/icons-react";
import type { WishlistProduct as WishlistProductData } from "../types/wishlist.types";

interface WishlistProductProps {
  product: WishlistProductData;
  isRemoving: boolean;
  onRemove: (productId: string) => void;
}

export default function WishlistProduct({ product, isRemoving, onRemove }: WishlistProductProps) {
  return (
    <article className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-4 border-t border-slate-100 p-4 sm:grid-cols-[minmax(0,1fr)_7rem_8rem_11rem] sm:gap-5 sm:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <Link
          href={`/products/${product._id}`}
          aria-label={`View ${product.title}`}
          className="relative size-[76px] shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:size-[82px]"
        >
          <Image src={product.imageCover} alt={product.title} fill unoptimized sizes="82px" className="object-contain p-2" />
        </Link>
        <div className="min-w-0">
          <Link href={`/products/${product._id}`} className="line-clamp-2 text-sm font-medium leading-5 text-slate-900 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:text-base">
            {product.title}
          </Link>
          <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">{product.category.name}</p>
        </div>
      </div>

      <p className="text-right text-sm font-semibold text-slate-900 sm:text-left">
        {product.price.toLocaleString("en-US")} EGP
        <span className="mt-1 block text-xs font-normal text-slate-500 sm:hidden">Price</span>
      </p>

      <p className="col-start-1 row-start-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 sm:col-auto sm:row-auto">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-primary-600" />
        {product.quantity > 0 ? "In Stock" : "Out of Stock"}
      </p>

      <div className="col-start-2 row-start-2 flex items-center justify-end gap-2 sm:col-auto sm:row-auto">
        <Link
          href={`/products/${product._id}`}
          aria-label={`View ${product.title} to add it to your cart`}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 sm:px-4 sm:text-sm"
        >
          <IconShoppingCart size={16} aria-hidden="true" />
          <span className="hidden min-[420px]:inline">Add to Cart</span>
          <span className="min-[420px]:hidden">View</span>
        </Link>
        <button
          type="button"
          aria-label={`Remove ${product.title} from wishlist`}
          disabled={isRemoving}
          onClick={() => onRemove(product._id)}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-wait disabled:opacity-60"
        >
          {isRemoving ? <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-rose-600" /> : <IconHeartOff size={17} aria-hidden="true" />}
        </button>
      </div>
    </article>
  );
}
