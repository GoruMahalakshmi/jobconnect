import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { FormProvider, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";

const Form = ({ children, ...props }) => <FormProvider {...props}>{children}</FormProvider>;

const FormItem = ({ className, ...props }) => (
  <div className={cn("space-y-2", className)} {...props} />
);

const FormLabel = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn("text-sm font-medium", className)} {...props} />
));
FormLabel.displayName = "FormLabel";

const FormControl = ({ className, children }) => (
  <div className={cn("", className)}>{children}</div>
);

const FormDescription = ({ className, ...props }) => (
  <p className={cn("text-xs text-muted-foreground", className)} {...props} />
);

const FormMessage = ({ className, children }) => (
  children ? <p className={cn("text-xs text-destructive mt-1", className)}>{children}</p> : null
);

const FormField = ({ control, name, render }) => (
  <Controller name={name} control={control} render={render} />
);

export { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField };
