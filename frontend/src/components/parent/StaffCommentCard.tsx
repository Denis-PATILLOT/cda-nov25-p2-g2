type Mood = "bad" | "neutral" | "good" | "na" | string;

type Props = {
  text: string;
  mood?: Mood;
};

function moodEmoji(mood?: Mood) {
  switch (mood) {
    case "good":
      return "😊";
    case "neutral":
      return "😌";
    case "bad":
      return "😕";
    default:
      return "🙂";
  }
}

export default function StaffCommentCard({ text, mood }: Props) {
  return (
    <section className="w-full max-w-md rounded-[34px] border-4 border-yellow-200 bg-white/80 p-4 shadow-[0_20px_45px_rgba(20,40,90,0.15)]">
      <div className="flex items-center justify-between gap-3 rounded-3xl border-2 border-yellow-200 bg-white/60 px-5 py-4">
        <p className="text-base font-semibold text-blue-900/90">{text}</p>

        <div className="grid h-12 w-12 place-items-center rounded-full ">{moodEmoji(mood)}</div>
      </div>
    </section>
  );
}
