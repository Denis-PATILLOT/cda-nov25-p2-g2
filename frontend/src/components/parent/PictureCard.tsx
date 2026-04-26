import Image from "next/image";

type PictureCardProps = {
    imageUrl?: string | null;
    onGalleryClick: () => void;
};

export default function PictureCard({
    imageUrl,
    onGalleryClick,
}: PictureCardProps) {
    const hasImage = Boolean(imageUrl);

    return (
        <section className="w-full max-w-md rounded-[42px] border-[4px] border-yellow-300 bg-[#fdfcfc]/88 px-6 py-5 shadow-[0_14px_28px_rgba(20,40,90,0.10)] md:max-w-[75%] md:mx-auto md:mb-8">
            {/* HEADER */}
            <div className="flex items-center flex-col md:flex-row md:justify-between ">
                {/* TITRE (un peu réduit) */}
                <h2 className="text-[20px] sm:text-[24px] font-extrabold text-blue-900 whitespace-nowrap">
                    Photo du jour
                </h2>

                {/* BOUTON CENTRÉ VISUELLEMENT */}
                <div className="flex justify-center items-center">
                    <button
                        type="button"
                        onClick={onGalleryClick}
                        className="flex items-center gap-2 cursor-pointer rounded-full border-[3px] border-yellow-300 bg-white px-4 py-2 font-bold text-blue-900 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-yellow-50 hover:shadow-lg active:scale-95"
                    >
                        <span>📸</span>
                        <span>Galerie</span>
                    </button>
                </div>
            </div>

            {/* IMAGE / EMPTY */}
            {hasImage ? (
                <div className="mt-4 overflow-hidden rounded-[28px] border-[4px] border-yellow-300 bg-white">
                    <Image
                        src={imageUrl as string}
                        alt="Photo du jour"
                        width={1200}
                        height={800}
                        className="h-auto w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                    />
                </div>
            ) : (
                <div className="mt-4 flex h-[180px] items-center justify-center rounded-[28px] border-[4px] border-yellow-300 bg-white text-center font-semibold text-blue-900">
                    Aucune photo pour aujourd’hui 📷
                </div>
            )}
        </section>
    );
}
