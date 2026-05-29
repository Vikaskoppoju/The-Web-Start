import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full glass rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm",
            "border border-white/10 focus:border-purple-500/60 focus:outline-none focus:ring-1 focus:ring-purple-500/40",
            "transition-all duration-200",
            icon && "pl-10",
            error && "border-red-500/60",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      )}
      <textarea
        ref={ref}
        className={cn(
          "w-full glass rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm resize-none",
          "border border-white/10 focus:border-purple-500/60 focus:outline-none focus:ring-1 focus:ring-purple-500/40",
          "transition-all duration-200",
          error && "border-red-500/60",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
);
Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      )}
      <select
        ref={ref}
        className={cn(
          "w-full glass rounded-xl px-4 py-3 text-white text-sm",
          "border border-white/10 focus:border-purple-500/60 focus:outline-none focus:ring-1 focus:ring-purple-500/40",
          "transition-all duration-200 bg-[#08081a] appearance-none",
          error && "border-red-500/60",
          className
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#08081a]">
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
);
Select.displayName = "Select";
