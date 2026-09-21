import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().superRefine((val, ctx) => {
    if (!val || val.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Email address is required',
      });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please enter a valid email address',
      });
    }
  }),
  password: z.string().superRefine((val, ctx) => {
    if (!val || val.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password is required',
      });
      return;
    }
    if (val.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password must be at least 8 characters',
      });
    }
  }),
});

export const registerSchema = z
  .object({
    displayName: z.string().superRefine((val, ctx) => {
      if (!val || val.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Display name is required',
        });
        return;
      }
      if (val.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Display name must be at least 2 characters',
        });
      }
      if (val.trim().length > 50) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Display name cannot exceed 50 characters',
        });
      }
    }),
    email: z.string().superRefine((val, ctx) => {
      if (!val || val.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email address is required',
        });
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter a valid email address',
        });
      }
    }),
    password: z.string().superRefine((val, ctx) => {
      if (!val || val.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password is required',
        });
        return;
      }
      if (val.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must be at least 8 characters',
        });
        return;
      }
      if (!/[A-Za-z]/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must contain at least one letter',
        });
      }
      if (!/[0-9]/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must contain at least one number',
        });
      }
    }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
