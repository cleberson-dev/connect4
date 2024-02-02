import { forwardRef } from "react";
import cls from "classnames";

type InputProps = React.HTMLProps<HTMLInputElement> & { invalid?: boolean };

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ invalid, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cls(className, "p-2 bg-gray-100 rounded-md text-black", {
          "border border-solid border-red-500": invalid,
        })}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
