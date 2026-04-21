import PencilIcon from "./PencilIcon";

type EditableRowProps = {
  onToggle: () => void;
  borderBottom?: boolean;
  children: React.ReactNode;
};

export default function EditableRow({ onToggle, borderBottom, children }: EditableRowProps) {
  return (
    <div
      className="flex items-center justify-between py-2"
      style={borderBottom ? { borderBottom: "1px solid var(--color-primary)" } : undefined}
    >
      {children}
      <button type="button" className="cursor-pointer" onClick={onToggle}>
        <PencilIcon />
      </button>
    </div>
  );
}
