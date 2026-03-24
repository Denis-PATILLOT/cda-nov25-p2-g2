import type React from "react";

type MenuLine = {
  label: string;
  value: string;
};

type PlanningItem = {
  icon?: string;
  title: string;
  description?: string;
  menu?: MenuLine[];
};

type PlanningSection = {
  label: string;
  items: PlanningItem[];
};

type Props = {
  apiPlanning: {
    date: string;
    morning_activities?: string | null;
    morning_nap?: string | null;
    meal?: string | null;
    afternoon_activities?: string | null;
    afternoon_nap?: string | null;
    snack?: string | null;
    group?: { name: string } | null;
  };
};

export default function PlanningCard({ apiPlanning }: Props) {
  const formattedDate = new Date(apiPlanning.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const planning: PlanningSection[] = [
    {
      label: "MATIN",
      items: [
        {
          icon: "/boutons/puzzle_activite.png",
          title: "Activité",
          description: apiPlanning.morning_activities ?? "Non renseigné",
        },
        {
          icon: "/boutons/dormir.png",
          title: "Sieste",
          description: apiPlanning.morning_nap ?? "Non renseigné",
        },
      ],
    },
    {
      label: "MIDI",
      items: [
        {
          icon: "/boutons/repas.png",
          title: "Menu du jour",
          description: apiPlanning.meal ?? "Non renseigné",
        },
      ],
    },
    {
      label: "APRÈS-MIDI",
      items: [
        {
          icon: "/boutons/puzzle_activite.png",
          title: "Activité",
          description: apiPlanning.afternoon_activities ?? "Non renseigné",
        },
        {
          icon: "/boutons/dormir.png",
          title: "Sieste",
          description: apiPlanning.afternoon_nap ?? "Non renseigné",
        },
        {
          icon: "/boutons/gouter.png",
          title: "Goûter",
          description: apiPlanning.snack ?? "Non renseigné",
        },
      ],
    },
  ];

  return (
    <section className="w-full max-w-md rounded-[42px] border-[4px] border-yellow-300 bg-[#fdfcfc]/88 px-6 py-5 shadow-[0_14px_28px_rgba(20,40,90,0.10)]">
      <div className="flex items-start gap-3">
        <img
          src="/boutons/calendrier.png"
          alt=""
          className="mt-1 h-10 w-10 shrink-0 object-contain"
        />

        <div className="min-w-0">
          <h2 className="text-[30px] font-extrabold leading-none text-blue-900">
            Planning du jour
          </h2>

          <p className="mt-1 text-[12px] font-semibold capitalize text-blue-900/55">
            {apiPlanning.group?.name ? `${apiPlanning.group.name} • ` : ""}
            {formattedDate}
          </p>
        </div>
      </div>

      <div className="mt-2">
        {planning.map((section) => (
          <div key={section.label}>
            <SectionTitle>{section.label}</SectionTitle>

            {section.items.map((item, idx) => (
              <PlanningCardItem key={`${section.label}-${idx}`} {...item} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 flex items-center gap-3">
      <img src="/boutons/etoile.png" alt="" className="h-7 w-7 shrink-0 object-contain" />
      <h3 className="text-[18px] font-extrabold tracking-tight text-blue-900">{children}</h3>
    </div>
  );
}

function PlanningCardItem({ icon, title, description, menu }: PlanningItem) {
  return (
    <div className="mt-3 rounded-[22px] border-[4px] border-yellow-300 bg-[#fdf1c7]/75 px-3 py-3">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white/45">
            <img src={icon} alt="" className="h-8 w-8 object-contain" />
          </div>
        )}

        <div className="flex-1 leading-tight">
          <p className="text-[18px] font-extrabold text-blue-900">{title}</p>

          {description && (
            <p className="mt-1 text-[16px] font-medium leading-[1.25] text-blue-900/85">
              {description}
            </p>
          )}

          {menu?.length && (
            <div className="mt-2 space-y-1 text-[16px] leading-[1.25] text-blue-900/90">
              {menu.map((line) => (
                <p key={line.label}>
                  <span className="font-extrabold">{line.label}</span>
                  <span className="font-medium"> : {line.value}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
