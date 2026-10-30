"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addToCartAction } from "../server/addToCart.action";
import { cartQueryPrefix } from "../cartQueryKey";

type CartTarget = "desktop" | "mobile";
type CartRect = { left: number; top: number; width: number; height: number };
type Flight = { id: number; image: string; from: CartRect; to: CartRect };
type CartAnimationContextValue = {
  addToCart: (
    productId: string,
    image: string,
    imageElement: HTMLElement | null,
    triggerElement: HTMLElement | null,
  ) => void;
  isBusy: boolean;
  registerCartTarget: (target: CartTarget, element: HTMLElement | null) => void;
  arrivalId: number;
};

const CartAnimationContext = createContext<CartAnimationContextValue | null>(null);

export function CartAnimationProvider({ children }: { children: ReactNode }) {
  const targets = useRef<Record<CartTarget, HTMLElement | null>>({ desktop: null, mobile: null });
  const flightId = useRef(0);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [arrivalId, setArrivalId] = useState(0);
  const reducedMotion = useReducedMotion();
  const pendingFlight = useRef<{ image: string; from: CartRect } | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (productId: string) => {
      const result = await addToCartAction(productId);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartQueryPrefix });
      const pending = pendingFlight.current;
      pendingFlight.current = null;
      if (!pending || reducedMotion) return;

      requestAnimationFrame(() => {
        const targetElement = Object.values(targets.current).find((element) => {
          if (!element) return false;
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        });
        if (!targetElement) return;
        const rect = targetElement.getBoundingClientRect();
        setIsAnimating(true);
        setFlight({
          id: ++flightId.current,
          image: pending.image,
          from: pending.from,
          to: { left: rect.left + rect.width / 2 - 22, top: rect.top + rect.height / 2 - 22, width: 44, height: 44 },
        });
      });
    },
    onError: (error) => {
      pendingFlight.current = null;
      toast.error(error.message || "We couldn't add this product to your cart.");
    },
  });

  const registerCartTarget = useCallback((target: CartTarget, element: HTMLElement | null) => {
    targets.current[target] = element;
  }, []);

  const addToCart = useCallback(
    (
      productId: string,
      image: string,
      imageElement: HTMLElement | null,
      triggerElement: HTMLElement | null,
    ) => {
      if (mutation.isPending || isAnimating) return;
      const triggerRect = triggerElement?.getBoundingClientRect();
      const imageRect = imageElement?.getBoundingClientRect();
      const originRect =
        triggerRect && triggerRect.width > 0 && triggerRect.height > 0
          ? triggerRect
          : imageRect;

      if (originRect && originRect.width > 0 && originRect.height > 0) {
        const size = Math.min(96, Math.max(76, Math.min(originRect.width, originRect.height)));
        pendingFlight.current = {
          image:
            imageElement instanceof HTMLImageElement
              ? imageElement.currentSrc || imageElement.src || image
              : image,
          from: {
            left: originRect.left + originRect.width / 2 - size / 2,
            top: originRect.top + originRect.height / 2 - size / 2,
            width: size,
            height: size,
          },
        };
      } else {
        pendingFlight.current = null;
      }
      mutation.mutate(productId);
    },
    [isAnimating, mutation],
  );

  const finishFlight = useCallback(() => {
    setFlight(null);
    setIsAnimating(false);
    setArrivalId((current) => current + 1);
  }, []);

  const contextValue = useMemo(
    () => ({ addToCart, isBusy: mutation.isPending || isAnimating, registerCartTarget, arrivalId }),
    [addToCart, arrivalId, isAnimating, mutation.isPending, registerCartTarget],
  );

  return (
    <CartAnimationContext.Provider value={contextValue}>
      {children}
      <AnimatePresence>
        {flight && (
          <motion.img
            key={flight.id}
            src={flight.image}
            alt=""
            aria-hidden="true"
            initial={{ left: flight.from.left, top: flight.from.top, width: flight.from.width, height: flight.from.height, opacity: 1, scale: 1 }}
            animate={{ left: flight.to.left, top: flight.to.top, width: flight.to.width, height: flight.to.height, opacity: 0.35, scale: 0.25 }}
            exit={{ opacity: 0, scale: 0.2 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            onAnimationComplete={finishFlight}
            className="pointer-events-none fixed z-[100] rounded-lg object-contain drop-shadow-xl"
            style={{ position: "fixed" }}
          />
        )}
      </AnimatePresence>
    </CartAnimationContext.Provider>
  );
}

export function useCartAnimation() {
  const context = useContext(CartAnimationContext);
  if (!context) throw new Error("useCartAnimation must be used within CartAnimationProvider.");
  return context;
}
