import type React from "react";

type Props = {
  child: {
    firstName: string;
    lastName: string;
    birthDate: string | number;
    picture: string;
    group: { id: string; name: string };
  };
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function ChildCard({ child, onClick }: Props) {
  const birth = new Date(child.birthDate).toLocaleDateString("fr-FR");

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full text-left
        rounded-3xl border-2 border-sky-200
        bg-white/60 p-2
        shadow-[0_10px_16px_rgba(20,40,90,0.06)]
        backdrop-blur
        transition
        hover:scale-[1.02]
        active:scale-95
      "
    >
      <div className="flex items-center gap-4">
        <div className="h-24 w-24 rounded-full bg-gradient-to-b from-yellow-200 to-yellow-300 p-[6px] shadow-[0_14px_25px_rgba(255,200,60,0.25)]">
          {/* biome-ignore lint/performance/noImgElement: ok */}
          <img
            src={child.picture}
            alt={`${child.firstName} ${child.lastName}`}
            className="h-full w-full rounded-full border-4 border-white/90 object-cover"
          />
        </div>

        <div className="flex-1 rounded-3xl bg-yellow-100/80 px-5 py-4 shadow-[0_10px_16px_rgba(20,40,90,0.06)]">
          <p className="text-lg font-extrabold text-blue-900">
            {child.firstName} {child.lastName} {child.group.name}
          </p>

          <p className="text-base font-medium text-blue-900/90">{birth}</p>

          <p className="text-base font-medium text-blue-900/90">{child.group?.name ?? ""}</p>
        </div>
      </div>
    </button>
  );
}
