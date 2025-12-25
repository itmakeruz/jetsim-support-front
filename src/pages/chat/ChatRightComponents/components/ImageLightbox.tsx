import { useMemo } from "react";
import type { Message } from "@/types/chat";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

interface ImageLightboxProps {
  open: boolean;
  onClose: () => void;
  index: number;
  messages: Message[];
}

export default function ImageLightbox({
  open,
  onClose,
  index,
  messages,
}: ImageLightboxProps) {
  const lightboxSlides = useMemo(() => {
    return messages
      .filter((msg) => msg.content_type === "photo")
      .map((msg) => ({
        src: `${msg.base_url}/${msg.message.content}`,
        alt: "Photo",
      }));
  }, [messages]);

  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={lightboxSlides}
      plugins={[Zoom]}
      controller={{ closeOnBackdropClick: true }}
      zoom={{
        maxZoomPixelRatio: 5,
        minZoom: 0.5,
        zoomInMultiplier: 2,
        doubleTapDelay: 300,
        doubleClickDelay: 300,
        doubleClickMaxStops: 2,
        wheelZoomDistanceFactor: 100,
        pinchZoomDistanceFactor: 100,
      }}
      styles={{
        container: { backgroundColor: "rgba(0, 0, 0, 0.75)" },
      }}
    />
  );
}
