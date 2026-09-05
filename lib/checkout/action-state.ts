import type { CheckoutFieldErrors } from "./contracts";

export type CheckoutActionState = {
  ok: boolean;
  message: string;
  fieldErrors: CheckoutFieldErrors;
  reference?: string;
};

export const initialCheckoutActionState: CheckoutActionState = {
  ok: false,
  message: "",
  fieldErrors: {},
};
