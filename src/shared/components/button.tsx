import cls from "classnames";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  hidden?: boolean;
  size?: "default" | "small";
  color?: "danger" | "warning" | "success" | "info" | "neutral";
};

export default function Button({
  children,
  hidden,
  size = "default",
  color = "neutral",
  ...props
}: Props) {
  return (
    <button
      className={cls(
        "rounded shadow-sm px-3 py-2 font-semibold transition-colors disabled:bg-slate-200 disabled:text-black disabled:opacity-50",
        {
          hidden,
          "text-base": size === "default",
          "text-xs": size === "small",
          "bg-slate-300 hover:bg-slate-400": color === "neutral",
          "bg-red-500 hover:bg-red-600": color === "danger",
          "bg-blue-500 hover:bg-blue-600": color === "info",
          "bg-orange-500 hover:bg-orange-600": color === "warning",
          "bg-green-500 hover:bg-green-600": color === "success",
        }
      )}
      {...props}
    >
      {children}
    </button>
  );
}
