type Props = {
  name: string;
  successMessage: string;
  success: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteModal({ name, successMessage, success, onCancel, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onCancel}
        aria-label="Fermer"
      />
      <div className="relative w-full max-w-[340px] rounded-3xl bg-[#FEF9F6] border-2 border-(--color-primary) p-6 shadow-xl flex flex-col items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 border-2 border-red-200">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </div>
        {success ? (
          <p className="text-[14px] font-semibold text-green-600">{successMessage}</p>
        ) : (
          <div className="text-center">
            <p className="text-[15px] font-semibold">Êtes-vous sûr de vouloir supprimer</p>
            <p className="text-[15px] font-semibold">{name} ?</p>
            <p className="mt-1 text-[12px] opacity-60">Cette action est irréversible.</p>
          </div>
        )}
        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border-2 border-(--color-tertiary) bg-white py-2 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl border-2 border-red-200 bg-white py-2 text-[13px] text-red-500 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
