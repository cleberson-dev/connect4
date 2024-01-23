import MoonLoader from "react-spinners/MoonLoader";

export default function LoadingModal({ open }: { open: boolean }) {
  if (!open) return null;

  return (
    <div className="z-50 fixed w-full h-full flex flex-col items-center justify-center">
      <MoonLoader color="blue" />
    </div>
  );
}
