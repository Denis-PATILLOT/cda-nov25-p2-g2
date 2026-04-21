import type React from "react";

type Props = {
  child: {
    id?: number;
    firstName: string;
    lastName: string;
    birthDate: string | number;
    picture: string;
    group?: { id: string; name: string };
  };
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

function getAgeLabel(birthDate: string | number) {
  const birth = new Date(birthDate);
  const now = new Date();

  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());

  if (now.getDate() < birth.getDate()) {
    months -= 1;
  }

  if (months < 1) return "0 mois";
  if (months < 12) return `${months} mois`;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return years === 1 ? "1 an" : `${years} ans`;
  }

  return `${years} ans et ${remainingMonths} mois`;
}

export default function ChildCard({ child, onClick }: Props) {
  const ageLabel = getAgeLabel(child.birthDate);

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        relative flex w-full items-center text-left
        cursor-pointer
        transition-all duration-300
        hover:-translate-y-1 hover:scale-[1.02]
        active:scale-[0.98]
      "
    >
      {/* PHOTO */}
      <div
        className="
          relative z-10
          h-[95px] w-[95px]
          rounded-full
          bg-gradient-to-b from-yellow-200 to-yellow-400
          p-[6px]
          shadow-[0_10px_18px_rgba(255,200,60,0.35)]
          transition-all duration-300
          hover:shadow-[0_12px_22px_rgba(255,200,60,0.5)]
        "
      >
        <img
          src={child.picture}
          alt={`${child.firstName} ${child.lastName}`}
          className="
            h-full w-full
            rounded-full
            border-[4px] border-white
            object-cover
            transition-transform duration-300
            hover:scale-105
          "
        />
      </div>

      {/* CARD */}
      <div
        className="
          -ml-6
          flex-1
          rounded-full
          bg-[#f2dfa7]
          pl-14 pr-6 py-3
          shadow-[0_6px_12px_rgba(20,40,90,0.08)]
          transition-all duration-300
          hover:shadow-[0_10px_18px_rgba(20,40,90,0.15)]
        "
      >
        <p className="text-[18px] font-medium text-[#244389] leading-tight">
          {child.firstName} {child.lastName}
        </p>

        <p className="mt-1 text-[16px] leading-tight text-[#244389]">{ageLabel}</p>

        <p className="text-[16px] leading-tight text-[#244389]">{child.group?.name ?? ""}</p>
      </div>
    </button>
  );
}
