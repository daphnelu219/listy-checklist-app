import stickerTL from "@/assets/sticker-corner-tl.png";
import stickerBR from "@/assets/sticker-corner-br.png";
import stickerBL from "@/assets/sticker-corner-bl.png";

export function StickerDecorations() {
  return (
    <>
      {/* Top-left peeking sticker */}
      <img
        src={stickerTL}
        alt=""
        loading="lazy"
        width={80}
        height={80}
        className="pointer-events-none fixed top-2 left-2 z-50 opacity-90"
        style={{ transform: "rotate(-12deg)" }}
      />
      {/* Bottom-right sleeping sticker */}
      <img
        src={stickerBR}
        alt=""
        loading="lazy"
        width={90}
        height={90}
        className="pointer-events-none fixed bottom-2 right-2 z-50 opacity-90"
        style={{ transform: "rotate(8deg)" }}
      />
      {/* Bottom-left shy sticker */}
      <img
        src={stickerBL}
        alt=""
        loading="lazy"
        width={70}
        height={70}
        className="pointer-events-none fixed bottom-4 left-4 z-50 opacity-90"
        style={{ transform: "rotate(5deg)" }}
      />
    </>
  );
}
