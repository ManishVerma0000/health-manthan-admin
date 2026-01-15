type ButtonProps = {
  label: string;
  onClick?: () => void;
  className?: string;
};

export default function Button({ label = "Click Me", onClick, className }: ButtonProps) {
  return (
    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
      Click Me
    </button>
  );
}