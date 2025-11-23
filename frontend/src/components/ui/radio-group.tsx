import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid grid-cols-3 lg:grid-cols-4 gap-3 py-1", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "border-input hover:border-indigo-300 data-[state=checked]:border-indigo-600 data-[state=checked]:bg-indigo-50 px-4 py-3 rounded-lg border-2 shadow-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
        className
      )}
      {...props}
    />
  )
}

export { RadioGroup, RadioGroupItem }
