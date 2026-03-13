import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import AddChildModal from "@/components/admin/AddChildModal";
import AddParentModal from "@/components/admin/AddParentModal";
import AddStaffModal from "@/components/admin/AddStaffModal";
import Layout from "@/components/Layout";
import { useAdminCountsQuery } from "@/graphql/generated/schema";
import { useAdminGuard } from "@/hooks/useAdminGuard";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, authLoading, isAdmin, shouldSkip } = useAdminGuard();
  const { data, loading: countsLoading } = useAdminCountsQuery({
    fetchPolicy: "network-only",
    skip: shouldSkip,
  });
  const [openParentModal, setOpenParentModal] = useState(false);
  const [openChildModal, setOpenChildModal] = useState(false);
  const [openStaffModal, setOpenStaffModal] = useState(false);
  const counts = data?.adminCounts;

  if (authLoading) return null;
  if (!user || !isAdmin) return null;

  return (
    <Layout pageTitle="admin dashboard">
      <div className="mx-auto w-full max-w-[620px] px-2">
        <p className="mt-6 text-center text-[14px] font-semibold">
          Bonjour {user?.first_name ?? "Admin"},
        </p>

        <div className="mt-3 grid grid-cols-3 gap-4">
          <button
            type="button"
            className="
    flex items-center gap-2
    border-2 border-(--color-primary)
    bg-white/80
    rounded-2xl
    px-2 py-2
    shadow-sm
    transition-all duration-200
    hover:shadow-md
    hover:scale-[1.03]
    active:scale-95
    focus:outline-none
  "
            onClick={() => router.push("/admin/childrenHistory")}
          >
            <Image
              src="/admin/bbavatar.png"
              width={64}
              height={64}
              className="w-16 h-16 object-contain"
              alt="Enfants"
            />
            <div className="text-left">
              <div className="text-[18px]">
                {countsLoading ? "..." : (counts?.childrenCount ?? 0)}
              </div>
              <div className="text-[12px]">Enfants</div>
            </div>
          </button>

          <button
            type="button"
            className="
    flex items-center gap-2
    border-2 border-(--color-primary)
    bg-white/80
    rounded-2xl
    px-2 py-2
    shadow-sm
    transition-all duration-200
    hover:shadow-md
    hover:scale-[1.03]
    active:scale-95
    focus:outline-none
  "
            onClick={() => router.push("/admin/staffHistory")}
          >
            <Image
              src="/admin/staffavatar.png"
              width={64}
              height={64}
              className="w-16 h-16 object-contain"
              alt="Staff"
            />
            <div className="text-left">
              <div className="text-[18px]">{countsLoading ? "..." : (counts?.staffCount ?? 0)}</div>
              <div className="text-[12px]">Staff</div>
            </div>
          </button>

          <button
            type="button"
            className="
    flex items-center gap-2
    border-2 border-(--color-primary)
    bg-white/80
    rounded-2xl
    px-2 py-2
    shadow-sm
    transition-all duration-200
    hover:shadow-md
    hover:scale-[1.03]
    active:scale-95
    focus:outline-none
  "
            onClick={() => router.push("/admin/parentsHistory")}
          >
            <Image
              src="/admin/parentavatar.png"
              width={64}
              height={64}
              className="w-16 h-16 object-contain"
              alt="Parents"
            />
            <div className="text-left">
              <div className="text-[18px]">
                {countsLoading ? "..." : (counts?.parentCount ?? 0)}
              </div>
              <div className="text-[12px]">Parents</div>
            </div>
          </button>
        </div>

        {/* Gestion */}
        <div className="mt-7">
          <p className="text-[12px] font-semibold">Gestion</p>

          <div className="mt-4 grid grid-cols-2 gap-4">
            {/* Enfant */}
            <button
              onClick={() => setOpenChildModal(true)}
              type="button"
              className="relative w-full h-[85px] rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
            >
              <span
                className="
    absolute -top-2 -right-2
    h-6 w-6
    rounded-full
    bg-white/80
    border-2 border-(--color-primary)
    flex items-center justify-center
    text-[14px]
    shadow-sm
  "
              >
                +
              </span>
              <div className="flex items-center gap-6 h-full">
                <div className="h-10 w-10 flex items-center justify-center">
                  <Image
                    src="/admin/bbavatar.png"
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain"
                    alt="Enfants"
                  />
                </div>
                <div className="text-left text-[12px] leading-tight">
                  Ajouter <br /> un enfant
                </div>
              </div>
            </button>

            {/* Staff */}
            <button
              onClick={() => setOpenStaffModal(true)}
              type="button"
              className="relative w-full h-[85px] rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
            >
              <span
                className="
    absolute -top-2 -right-2
    h-6 w-6
    rounded-full
    bg-white/80
    border-2 border-(--color-primary)
    flex items-center justify-center
    text-[14px] font-bold text-slate-500
    shadow-sm
  "
              >
                +
              </span>
              <div className="flex items-center gap-6 h-full">
                <div className="h-10 w-10 flex items-center justify-center">
                  <Image
                    src="/admin/staffavatar.png"
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain"
                    alt="Staff"
                  />
                </div>
                <div className="text-left text-[12px] leading-tight">
                  Ajouter <br /> un membre <br /> du staff
                </div>
              </div>
            </button>

            {/* Parent */}
            <div className="col-span-2 flex justify-center">
              <div className="w-[50%]">
                <button
                  onClick={() => setOpenParentModal(true)}
                  type="button"
                  className="relative w-full h-[85px] rounded-2xl bg-white/70 border-2 border-(--color-secondary) px-4 py-3 shadow-sm     transition-all duration-200
                    hover:shadow-md
                    hover:scale-[1.03]
                    active:scale-95
                    focus:outline-none
                    "
                >
                  <span
                    className="
    absolute -top-2 -right-2
    h-6 w-6
    rounded-full
    bg-white/80
    border-2 border-(--color-primary)
    flex items-center justify-center
    text-[14px] font-bold text-slate-500
    shadow-sm
  "
                  >
                    +
                  </span>
                  <div className="flex items-center gap-6 h-full">
                    <div className="h-10 w-10 flex items-center justify-center">
                      <Image
                        src="/admin/parentavatar.png"
                        width={64}
                        height={64}
                        className="w-16 h-16 object-contain"
                        alt="Parents"
                      />
                    </div>
                    <div className="text-left text-[12px] leading-tight">
                      Ajouter <br /> un parent
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Suivi */}
        <div className="mt-7">
          <p className="text-[12px] font-semibold">Suivi</p>
          <button
            type="button"
            onClick={() => router.push("/admin/reportsHistory")}
          className="mt-4 w-full rounded-2xl bg-white/80 py-3 text-[13px] shadow-sm border-2 border-(--color-primary) transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
          >
            Voir tous les rapport
          </button>
        </div>
      </div>
      <AddChildModal open={openChildModal} onClose={() => setOpenChildModal(false)} />
      <AddParentModal open={openParentModal} onClose={() => setOpenParentModal(false)} />
      <AddStaffModal open={openStaffModal} onClose={() => setOpenStaffModal(false)} />
    </Layout>
  );
}
