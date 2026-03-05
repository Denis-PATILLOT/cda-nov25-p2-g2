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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 flex items-center gap-3">
      <img src="/boutons/etoile.png" alt="" className="h-7 w-7" />
      <h3 className="text-lg font-extrabold tracking-wide text-blue-900">{children}</h3>
    </div>
  );
}

function PlanningCardItem({ icon, title, description, menu }: PlanningItem) {
  return (
    <div className="mt-3 rounded-2xl border-4 border-yellow-200 bg-yellow-50/90 px-4 py-3 shadow-[0_10px_18px_rgba(20,40,90,0.06)]">
      <div className="flex items-start gap-3">
        {icon ? (
          <div className="mt-0.5 grid h-11 w-11 place-items-center rounded-xl bg-white/70">
            <img src={icon} alt="" className="h-8 w-8 object-contain" />
          </div>
        ) : null}

        <div className="flex-1">
          <p className="text-lg font-extrabold text-blue-900">{title}</p>

          {description ? (
            <p className="text-base font-medium text-blue-900/80">{description}</p>
          ) : null}

          {menu?.length ? (
            <div className="mt-2 space-y-1 text-base text-blue-900/85">
              {menu.map((l) => (
                <p key={l.label}>
                  <span className="font-extrabold">{l.label}</span>
                  <span className="font-medium"> : {l.value}</span>
                </p>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function PlanningCard({ apiPlanning }: Props) {
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
    <section className="w-full max-w-md rounded-[34px] border-4 border-yellow-200 bg-white/80 p-5 shadow-[0_20px_45px_rgba(20,40,90,0.15)]">
      {/* Header */}
      <div className="flex items-center justify-center gap-3">
        <img src="/boutons/calendrier.png" alt="" className="h-9 w-9" />
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-blue-900">Planning du jour</h2>
          <p className="text-sm font-semibold text-blue-900/70">
            {apiPlanning.group?.name ? `${apiPlanning.group.name} • ` : ""}
            {apiPlanning.date}
          </p>
        </div>
      </div>

      {/* Sections */}
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
