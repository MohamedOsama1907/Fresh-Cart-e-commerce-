"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import {
  IconBox,
  IconCheck,
  IconRefresh,
  IconShieldCheck,
  IconStar,
  IconStarFilled,
  IconStarHalfFilled,
  IconTruckDelivery,
} from "@tabler/icons-react";
import type { Product } from "../../types/productDetails.types";
import { getProductReviews } from "../../services/getProductReviews";
import { getReviewById } from "../../services/getReviewById";
import { createReviewAction } from "../../server/createReview.actions";
import { deleteReviewAction, updateReviewAction } from "../../server/manageReview.actions";
import type { Review } from "../../types/productDetails.types";
import type { ReviewActionResult } from "../../server/manageReview.actions";
import { createReviewSchema, type createReviewValues } from "../../schemas/createReview.schema";
import type { appState } from "@/store/store";

type ProductTabId = "details" | "reviews" | "shipping";

const tabs: { id: ProductTabId; label: string; Icon: typeof IconBox }[] = [
  { id: "details", label: "Product Details", Icon: IconBox },
  { id: "reviews", label: "Reviews", Icon: IconStarFilled },
  { id: "shipping", label: "Shipping & Returns", Icon: IconTruckDelivery },
];

interface ProductInformationTabsProps {
  product: Product;
}

function RatingStars({ rating, size = 16 }: { rating: number; size?: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: fullStars }, (_, index) => (
        <IconStarFilled key={`full-${index}`} size={size} aria-hidden="true" />
      ))}
      {hasHalfStar && <IconStarHalfFilled size={size} aria-hidden="true" />}
      {Array.from({ length: emptyStars }, (_, index) => (
        <IconStar key={`empty-${index}`} size={size} aria-hidden="true" />
      ))}
    </span>
  );
}

function DetailsPanel({ product }: ProductInformationTabsProps) {
  const description = product.description.replace(/\s+/g, " ").trim();
  const attributes = product.description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [label, ...valueParts] = line.split(/\t+/);
      return valueParts.length > 0
        ? { label: label.trim(), value: valueParts.join(" ").trim() }
        : { label: `Detail ${index + 1}`, value: line };
    });

  const information = [
    { label: "Category", value: product.category.name },
    {
      label: "Subcategory",
      value: product.subcategory.map(({ name }) => name).join(", ") || "—",
    },
    { label: "Brand", value: product.brand.name },
    { label: "Items Sold", value: `${product.sold.toLocaleString("en-US")}+ sold` },
  ];

  return (
    <div id="product-panel-details" role="tabpanel" aria-labelledby="product-tab-details" className="p-5 sm:p-7">
      <h2 className="text-lg font-semibold text-slate-900">About this Product</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
        {description || "No product description is available."}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section aria-labelledby="product-information-heading" className="rounded-xl bg-slate-50 p-4 sm:p-5">
          <h3 id="product-information-heading" className="font-medium text-slate-900">Product Information</h3>
          <dl className="mt-3 space-y-2.5 text-sm">
            {information.map(({ label, value }) => (
              <div key={label} className="flex items-start justify-between gap-4">
                <dt className="text-slate-500">{label}</dt>
                <dd className="text-right font-medium text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="product-features-heading" className="rounded-xl bg-slate-50 p-4 sm:p-5">
          <h3 id="product-features-heading" className="font-medium text-slate-900">Key Features</h3>
          {attributes.length > 0 ? (
            <dl className="mt-3 space-y-2.5 text-sm">
              {attributes.map(({ label, value }, index) => (
                <div key={`${label}-${index}`} className="flex items-start gap-2.5">
                  <IconCheck size={17} className="mt-0.5 shrink-0 text-primary-600" aria-hidden="true" />
                  <div className="flex flex-wrap gap-x-1.5">
                    <dt className="font-medium text-slate-700">{label}</dt>
                    <dd className="text-slate-600">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-3 text-sm text-slate-500">No additional product features are listed.</p>
          )}
        </section>
      </div>
    </div>
  );
}

function ReviewEditForm({
  review,
  isPending,
  onCancel,
  onSave,
}: {
  review: Review;
  isPending: boolean;
  onCancel: () => void;
  onSave: (reviewId: string, values: createReviewValues) => Promise<ReviewActionResult>;
}) {
  const [values, setValues] = useState<createReviewValues>({ review: review.review, rating: review.rating });
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;

    const validation = createReviewSchema.safeParse(values);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? "Please check your review and rating.");
      return;
    }

    setError(null);
    const result = await onSave(review._id, validation.data);
    if (!result.success) setError(result.message);
  };

  return (
    <form className="mt-4 rounded-xl border border-primary-100 bg-primary-50/40 p-4" onSubmit={submit}>
      <fieldset disabled={isPending}>
        <legend className="text-sm font-semibold text-slate-800">Edit your review</legend>
        <div className="mt-2 flex items-center gap-1" role="group" aria-label="Review rating">
          {Array.from({ length: 5 }, (_, index) => {
            const rating = index + 1;
            return (
              <button
                key={rating}
                type="button"
                aria-label={`Rate ${rating} out of 5 stars`}
                aria-pressed={values.rating === rating}
                onClick={() => setValues((current) => ({ ...current, rating }))}
                className="rounded p-1 text-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:opacity-60"
              >
                {rating <= values.rating ? <IconStarFilled size={22} aria-hidden="true" /> : <IconStar size={22} className="text-slate-300" aria-hidden="true" />}
              </button>
            );
          })}
          <span className="ml-2 text-xs text-slate-600">{values.rating} of 5</span>
        </div>
        <label htmlFor={`edit-review-${review._id}`} className="sr-only">Review text</label>
        <textarea
          id={`edit-review-${review._id}`}
          rows={3}
          required
          value={values.review}
          onChange={(event) => setValues((current) => ({ ...current, review: event.target.value }))}
          className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm leading-6 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100 disabled:opacity-60"
        />
      </fieldset>
      {error && <p role="alert" className="mt-2 text-sm text-rose-700">{error}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="submit" disabled={isPending} className="inline-flex min-h-10 items-center rounded-lg bg-primary-600 px-4 text-sm font-semibold text-white hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:cursor-wait disabled:opacity-60">
          {isPending ? "Saving…" : "Save changes"}
        </button>
        <button type="button" disabled={isPending} onClick={onCancel} className="inline-flex min-h-10 items-center rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-60">
          Cancel
        </button>
      </div>
    </form>
  );
}

function ReviewsPanel({ product }: ProductInformationTabsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const user = useSelector((state: appState) => state.authReducer.user);
  const queryClient = useQueryClient();
  const reviewByIdQuery = useQuery({
    queryKey: ["getReviewById", editingReviewId],
    queryFn: () => getReviewById(editingReviewId!),
    enabled: Boolean(editingReviewId),
  });

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<createReviewValues>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: { review: "", rating: 0 },
  });
  const createReviewMutation = useMutation({
    mutationFn: ({ productId, values }: { productId: string; values: createReviewValues }) =>
      createReviewAction(productId, values),
    onSuccess: async (result, variables) => {
      if (!result.success) return;

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["getProductReviews", variables.productId],
          exact: true,
        }),
        queryClient.invalidateQueries({
          queryKey: ["getProductDetails", variables.productId],
          exact: true,
        }),
      ]);
    },
  });
  const updateReviewMutation = useMutation({
    mutationFn: ({ reviewId, values }: { reviewId: string; values: createReviewValues }) =>
      updateReviewAction(reviewId, values),
    onSuccess: async (result, variables) => {
      if (!result.success) return;

      queryClient.setQueryData(
        ["getReviewById", variables.reviewId],
        (current: Awaited<ReturnType<typeof getReviewById>> | undefined) =>
          current ? { ...current, ...variables.values } : current,
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["getProductReviews", product._id], exact: true }),
        queryClient.invalidateQueries({ queryKey: ["getProductDetails", product._id], exact: true }),
      ]);
      setEditingReviewId(null);
      toast.success("Your review was updated.");
    },
  });
  const deleteReviewMutation = useMutation({
    mutationFn: deleteReviewAction,
    onSuccess: async (result, reviewId) => {
      if (!result.success) return;

      queryClient.removeQueries({ queryKey: ["getReviewById", reviewId], exact: true });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["getProductReviews", product._id], exact: true }),
        queryClient.invalidateQueries({ queryKey: ["getProductDetails", product._id], exact: true }),
      ]);
      toast.success("The review was deleted.");
    },
  });

  const startEditingReview = (review: (typeof product.reviews)[number]) => {
    setEditingReviewId(review._id);
  };

  const stopEditingReview = () => {
    setEditingReviewId(null);
  };

  const saveReviewEdits = async (reviewId: string, values: createReviewValues) => {
    if (updateReviewMutation.isPending) {
      return { success: false as const, message: "Your review is still being saved." };
    }
    const result = await updateReviewMutation.mutateAsync({ reviewId, values });
    if (!result.success) toast.error(result.message);
    return result;
  };

  const confirmDeleteReview = async (reviewId: string) => {
    if (deleteReviewMutation.isPending) return;
    if (!window.confirm("Delete this review? This action cannot be undone.")) return;

    const result = await deleteReviewMutation.mutateAsync(reviewId);
    if (!result.success) toast.error(result.message);
  };

  const handleReviewSubmit = handleSubmit(async (values) => {
    if (createReviewMutation.isPending) return;
    setSubmissionError(null);

    try {
      const result = await createReviewMutation.mutateAsync({
        productId: product._id,
        values,
      });

      if (!result.success) {
        if (result.fieldErrors?.review?.[0]) {
          setError("review", { type: "server", message: result.fieldErrors.review[0] });
        }
        if (result.fieldErrors?.rating?.[0]) {
          setError("rating", { type: "server", message: result.fieldErrors.rating[0] });
        }
        setSubmissionError(result.message);
        return;
      }

      reset({ review: "", rating: 0 });
      setHoveredRating(0);
      toast.success("Your review was submitted successfully.");
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "We couldn't submit your review. Please try again.",
      );
    }
  });
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    isFetchNextPageError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["getProductReviews", product._id],
    queryFn: ({ pageParam }) => getProductReviews(product._id, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.metadata.nextPage ?? undefined,
    enabled: isExpanded && product.ratingsQuantity > 0,
    refetchOnMount: false,
  });

  const reviews = data?.pages.flatMap((page) => page.data) ?? [];
  const ratingReviews = product.reviews ?? [];
  const distribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = ratingReviews.filter((review) => review.rating === rating).length;
    return {
      rating,
      count,
      percentage: ratingReviews.length ? Math.round((count / ratingReviews.length) * 100) : 0,
    };
  });

  return (
    <div id="product-panel-reviews" role="tabpanel" aria-labelledby="product-tab-reviews" className="p-5 sm:p-7">
      <section aria-label="Customer rating summary" className="grid gap-6 md:grid-cols-[minmax(150px,0.25fr)_minmax(0,1fr)] md:items-center md:gap-8">
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-5xl font-bold leading-none text-slate-900">{product.ratingsAverage.toFixed(1)}</span>
          <RatingStars rating={product.ratingsAverage} size={20} />
          <p className="mt-2 text-sm text-slate-500">
            {product.ratingsQuantity > 0
              ? `Based on ${product.ratingsQuantity.toLocaleString("en-US")} reviews`
              : "No reviews yet"}
          </p>
        </div>

        <div className="space-y-3" aria-label="Rating breakdown">
          {distribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="grid grid-cols-[3.5rem_minmax(0,1fr)_3rem] items-center gap-3 text-sm">
              <span className="text-slate-600">{rating} star</span>
              <div
                className="h-2.5 overflow-hidden rounded-full bg-slate-200"
                role="progressbar"
                aria-label={`${rating} star reviews: ${count} of ${ratingReviews.length}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percentage}
              >
                <div className="h-full rounded-full bg-amber-400 transition-[width] duration-300" style={{ width: `${percentage}%` }} />
              </div>
              <span className="text-right text-slate-500">{percentage}%</span>
            </div>
          ))}
        </div>
      </section>

      {product.ratingsQuantity > 0 && !isExpanded && (
        <div className="mt-5 flex justify-center border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
          >
            Show Reviews
          </button>
        </div>
      )}

      {isExpanded && (
        <>
          <div className="mt-7 border-t border-slate-200 pt-6">
            {isLoading ? (
              <p role="status" className="py-6 text-center text-sm text-slate-500">Loading reviews…</p>
            ) : isError && reviews.length === 0 ? (
              <div role="alert" className="py-6 text-center">
                <p className="text-sm text-rose-700">{error.message || "Reviews could not be loaded."}</p>
                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="mt-3 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Try again
                </button>
              </div>
            ) : reviews.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {reviews.map((review) => (
                  <li key={review._id} className="py-5 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium text-slate-900">{review.user.name}</p>
                      <time dateTime={review.createdAt} className="text-xs text-slate-500">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                    {editingReviewId === review._id ? (
                      reviewByIdQuery.isError ? (
                        <div role="alert" className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                          <p>{reviewByIdQuery.error.message || "This review could not be loaded."}</p>
                          <button type="button" onClick={() => void reviewByIdQuery.refetch()} className="mt-2 font-semibold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700">
                            Try again
                          </button>
                          <button type="button" onClick={stopEditingReview} className="ml-4 font-semibold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700">
                            Cancel
                          </button>
                        </div>
                      ) : reviewByIdQuery.isPending || !reviewByIdQuery.data ? (
                        <p role="status" className="mt-3 text-sm text-slate-500">Loading this review…</p>
                      ) : (
                        <ReviewEditForm
                          key={review._id}
                          review={reviewByIdQuery.data}
                          isPending={updateReviewMutation.isPending}
                          onCancel={stopEditingReview}
                          onSave={saveReviewEdits}
                        />
                      )
                    ) : (
                      <>
                        <div className="mt-1.5"><RatingStars rating={review.rating} /></div>
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                          {review.review.trim() || "No written comment."}
                        </p>
                      </>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {user?.id === review.user._id && editingReviewId !== review._id && (
                        <button type="button" onClick={() => startEditingReview(review)} className="rounded-md px-2 py-1 text-sm font-medium text-primary-700 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                          Edit review
                        </button>
                      )}
                      {(user?.id === review.user._id || user?.role === "admin") && (
                        <button
                          type="button"
                          disabled={deleteReviewMutation.isPending}
                          onClick={() => void confirmDeleteReview(review._id)}
                          className="rounded-md px-2 py-1 text-sm font-medium text-rose-700 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-wait disabled:opacity-60"
                        >
                          {deleteReviewMutation.isPending && deleteReviewMutation.variables === review._id ? "Deleting…" : "Delete review"}
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-center text-sm text-slate-500">No reviews are available right now.</p>
            )}

            {hasNextPage && (
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  disabled={isFetchingNextPage}
                  onClick={() => void fetchNextPage()}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-primary-600 px-6 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-wait disabled:opacity-60"
                >
                  {isFetchingNextPage ? "Loading more reviews…" : "Show More"}
                </button>
              </div>
            )}

            {isFetchNextPageError && (
              <div role="alert" className="mt-3 text-center">
                <p className="text-sm text-rose-700">More reviews could not be loaded.</p>
                <button
                  type="button"
                  onClick={() => void fetchNextPage()}
                  className="mt-2 text-sm font-medium text-primary-700 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Try again
                </button>
              </div>
            )}

            <form
              onSubmit={handleReviewSubmit}
              className="mt-8 rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 via-white to-amber-50/60 p-5 shadow-sm sm:p-7"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm">
                  <IconStarFilled size={21} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-slate-900">Create a Review</h2>
                  <p className="mt-1 text-sm leading-5 text-slate-600">Your experience helps others choose with confidence.</p>
                </div>
              </div>

              <div className="mt-6">
                <label id="new-review-rating-label" className="block text-sm font-semibold text-slate-800">How would you rate this product?</label>
                <Controller
                  name="rating"
                  control={control}
                  render={({ field }) => (
                    <div
                      role="group"
                      aria-labelledby="new-review-rating-label"
                      aria-describedby={errors.rating ? "new-review-rating-error" : undefined}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="mt-2 inline-flex items-center gap-1 rounded-xl border border-amber-100 bg-white/80 px-3 py-2 shadow-sm"
                    >
                      {Array.from({ length: 5 }, (_, index) => {
                        const rating = index + 1;
                        const isActive = rating <= (hoveredRating || field.value || 0);

                        return (
                          <button
                            key={rating}
                            type="button"
                            aria-label={`Rate ${rating} out of 5 stars`}
                            aria-pressed={field.value === rating}
                            disabled={createReviewMutation.isPending || isSubmitting}
                            onMouseEnter={() => setHoveredRating(rating)}
                            onFocus={() => setHoveredRating(rating)}
                            onBlur={() => setHoveredRating(0)}
                            onClick={() => field.onChange(rating)}
                            className="rounded-md p-1 text-amber-400 transition duration-150 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isActive ? (
                              <IconStarFilled size={28} aria-hidden="true" />
                            ) : (
                              <IconStar size={28} className="text-slate-300" aria-hidden="true" />
                            )}
                          </button>
                        );
                      })}
                      <span aria-live="polite" className="ml-2 min-w-24 text-xs font-medium text-slate-600">
                        {hoveredRating
                          ? `${hoveredRating} of 5`
                          : field.value
                            ? `${field.value} of 5 selected`
                            : "Choose a rating"}
                      </span>
                    </div>
                  )}
                />
                {errors.rating?.message && (
                  <p id="new-review-rating-error" role="alert" className="mt-1.5 text-sm text-rose-700">
                    {errors.rating.message}
                  </p>
                )}
              </div>

              <div className="mt-5">
                <label htmlFor="review-text" className="mb-1.5 block text-sm font-medium text-slate-700">Your review</label>
                <textarea
                  id="review-text"
                  rows={4}
                  placeholder="What did you love? How has it worked for you? Share the details that might help another shopper."
                  aria-invalid={Boolean(errors.review)}
                  aria-describedby={errors.review ? "review-text-error" : undefined}
                  disabled={createReviewMutation.isPending || isSubmitting}
                  {...register("review")}
                  className="w-full resize-y rounded-lg border border-slate-300 bg-white/90 px-3 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 disabled:cursor-wait disabled:opacity-70"
                />
                {errors.review?.message && (
                  <p id="review-text-error" role="alert" className="mt-1.5 text-sm text-rose-700">
                    {errors.review.message}
                  </p>
                )}
              </div>
              {submissionError && (
                <p role="alert" aria-live="polite" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-800">
                  {submissionError}
                </p>
              )}
              <button
                type="submit"
                disabled={createReviewMutation.isPending || isSubmitting}
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
              >
                {createReviewMutation.isPending ? "Submitting…" : "Submit Review"}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

function ShippingPanel() {
  const shippingSteps = [
    "Free shipping on orders over 500 EGP",
    "Standard delivery: 3–5 business days",
    "Express delivery may be available at checkout",
    "Track your order from your account",
  ];
  const returnSteps = [
    "14-day return window",
    "Refund or exchange available for eligible items",
    "Contact support to start a return",
    "Keep the item and packaging in good condition",
  ];

  const informationCards = [
    { title: "Shipping Information", Icon: IconTruckDelivery, items: shippingSteps },
    { title: "Returns & Refunds", Icon: IconRefresh, items: returnSteps },
  ];

  return (
    <div id="product-panel-shipping" role="tabpanel" aria-labelledby="product-tab-shipping" className="p-5 sm:p-7">
      <div className="grid gap-4 md:grid-cols-2">
        {informationCards.map(({ title, Icon, items }) => (
          <section key={title} className="rounded-xl bg-primary-50/80 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
                <Icon size={24} aria-hidden="true" />
              </span>
              <h2 className="font-semibold text-slate-900">{title}</h2>
            </div>
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-5 text-slate-700">
                  <IconCheck size={17} className="mt-0.5 shrink-0 text-primary-600" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4 rounded-xl bg-slate-50 p-5 sm:p-6">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
          <IconShieldCheck size={25} aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-semibold text-slate-900">Buyer Protection</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Contact FreshCart support if your order does not arrive or the product is not as described.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProductInformationTabs({ product }: ProductInformationTabsProps) {
  const [activeTab, setActiveTab] = useState<ProductTabId>("details");
  const visibleTabs = product.ratingsQuantity > 0
    ? tabs
    : tabs.filter(({ id }) => id !== "reviews");

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = visibleTabs.findIndex((tab) => tab.id === activeTab);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % visibleTabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + visibleTabs.length) % visibleTabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = visibleTabs.length - 1;
    else return;

    event.preventDefault();
    const nextTab = visibleTabs[nextIndex];
    setActiveTab(nextTab.id);
    document.getElementById(`product-tab-${nextTab.id}`)?.focus();
  };

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm sm:mt-8" aria-label="Product information">
      <div role="tablist" aria-label="Product information sections" className="flex overflow-x-auto border-b border-slate-200">
        {visibleTabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            id={`product-tab-${id}`}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            aria-controls={`product-panel-${id}`}
            tabIndex={activeTab === id ? 0 : -1}
            onClick={() => setActiveTab(id)}
            onKeyDown={handleTabKeyDown}
            className={`inline-flex min-h-14 shrink-0 items-center justify-center gap-2 border-b-2 px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-primary-600 sm:px-6 sm:text-base ${
              activeTab === id
                ? "border-primary-600 bg-primary-50/70 text-primary-700"
                : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Icon size={18} aria-hidden="true" />
            {label}{id === "reviews" ? ` (${product.ratingsQuantity})` : ""}
          </button>
        ))}
      </div>

      {activeTab === "details" && <DetailsPanel product={product} />}
      {activeTab === "reviews" && <ReviewsPanel product={product} />}
      {activeTab === "shipping" && <ShippingPanel />}
    </section>
  );
}
