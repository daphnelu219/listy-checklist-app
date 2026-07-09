// Home route
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CheckSquare } from "lucide-react";
import heartSticker from "@/assets/sticker-heart-tr.png";

export const Route = createFileRoute("/")({
  component: Index,
function Index() {
  return (
    <View style={styles.flex}>
      <Image
        src={heartSticker}
        alt=""
        loading="lazy"
        width={70}
        height={70}
        style={styles.pointer_events_none}
        style={{ transform: "rotate(6deg)" }}
      />
      <View style={styles.mb_6}>
        <CheckSquare style={styles.h_10} />
        <Text style={styles.text_3xl}>Checklists</Text>