"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconHeadset, IconSend } from "@tabler/icons-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { supportSchema, type SupportValues } from "../schemas/support.schema";

const subjectOptions = [
  "Order Support",
  "Product Question",
  "Returns & Refunds",
  "Shipping Information",
  "General Inquiry",
  "Other",
];

export default function SupportForm() {
  const { register, handleSubmit, reset, formState } = useForm<SupportValues>({
    defaultValues: { name: "", email: "", subject: "", message: "" },
    resolver: zodResolver(supportSchema),
  });

  const handleMessage: SubmitHandler<SupportValues> = () => {
    toast.success("Thanks for your message. We appreciate you reaching out.");
    reset();
  };

  return (
    <section
      id="contact-form"
      aria-labelledby="contact-form-heading"
      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7 lg:p-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
          <IconHeadset size={21} stroke={2.2} aria-hidden="true" />
        </span>
        <div>
          <h2 id="contact-form-heading" className="text-lg font-bold text-slate-900">
            Send us a Message
          </h2>
          <p className="text-sm text-slate-500">
            Fill out the form and we&apos;ll get back to you.
          </p>
        </div>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit(handleMessage)}
        className="space-y-5"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-2">
            <label htmlFor="contact-name" className="text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              id="contact-name"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              aria-invalid={Boolean(formState.errors.name)}
              aria-describedby={formState.errors.name ? "contact-name-error" : undefined}
              className="form-control min-h-11 w-full min-w-0 text-sm transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 sm:text-base"
              {...register("name")}
            />
            {formState.errors.name?.message && (
              <p id="contact-name-error" className="-mt-1 text-[13px] text-red-600">
                *{formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-2">
            <label htmlFor="contact-email" className="text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              id="contact-email"
              type="email"
              autoComplete="email"
              placeholder="john@example.com"
              aria-invalid={Boolean(formState.errors.email)}
              aria-describedby={formState.errors.email ? "contact-email-error" : undefined}
              className="form-control min-h-11 w-full min-w-0 text-sm transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 sm:text-base"
              {...register("email")}
            />
            {formState.errors.email?.message && (
              <p id="contact-email-error" className="-mt-1 text-[13px] text-red-600">
                *{formState.errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <label htmlFor="contact-subject" className="text-sm font-medium text-slate-700">
            Subject
          </label>
          <select
            id="contact-subject"
            aria-invalid={Boolean(formState.errors.subject)}
            aria-describedby={formState.errors.subject ? "contact-subject-error" : undefined}
            className="form-control min-h-11 w-full min-w-0 bg-white text-sm transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 sm:text-base"
            {...register("subject")}
          >
            <option value="">Select a subject</option>
            {subjectOptions.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          {formState.errors.subject?.message && (
            <p id="contact-subject-error" className="-mt-1 text-[13px] text-red-600">
              *{formState.errors.subject.message}
            </p>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <label htmlFor="contact-message" className="text-sm font-medium text-slate-700">
            Message
          </label>
          <textarea
            id="contact-message"
            rows={5}
            placeholder="How can we help you?"
            aria-invalid={Boolean(formState.errors.message)}
            aria-describedby={formState.errors.message ? "contact-message-error" : undefined}
            className="form-control min-h-32 w-full min-w-0 resize-y text-sm transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 sm:text-base"
            {...register("message")}
          />
          {formState.errors.message?.message && (
            <p id="contact-message-error" className="-mt-1 text-[13px] text-red-600">
              *{formState.errors.message.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="btn inline-flex min-h-11 items-center justify-center gap-2 bg-primary-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <IconSend size={17} aria-hidden="true" />
          {formState.isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </section>
  );
}
