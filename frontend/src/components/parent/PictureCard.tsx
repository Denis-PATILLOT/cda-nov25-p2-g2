type Props = {
  title?: string;
  imageUrl?: string;
  onGalleryClick?: () => void;
};

export default function PictureCard({ title = "Photo du jour", imageUrl, onGalleryClick }: Props) {
  return (
    <section className="w-full max-w-md rounded-[34px] border-4 border-yellow-200 bg-white/80 p-4 shadow-[0_20px_45px_rgba(20,40,90,0.15)]">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-extrabold text-blue-900">{title}</h3>

        <button
          type="button"
          onClick={onGalleryClick}
          className="rounded-full border-2 border-yellow-200 bg-white/70 px-4 py-2 text-sm font-extrabold text-blue-900 shadow-[0_8px_14px_rgba(20,40,90,0.06)]"
        >
          📸 Galerie
        </button>
      </div>

      <div className="mt-3 overflow-hidden rounded-3xl border-4 border-yellow-200 bg-white/60">
        {imageUrl ? (
          // biome-ignore lint/performance/noImgElement: <explanation>
          <img src={imageUrl} alt={title} className="h-56 w-full object-cover" />
        ) : (
          <div className="grid h-56 place-items-center text-blue-900/70">
            Aucune photo pour aujourd’hui
          </div>
        )}
      </div>
    </section>
  );
}
