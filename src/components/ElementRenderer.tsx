import React from "react";
import { useCurrentFrame, Img, staticFile, interpolate } from "remotion";
import { elementStyle, ElementStyleOpts } from "./motion";
import { IconRenderer } from "./Icons";
import type { SceneElement } from "../data";

interface Props {
  el: SceneElement;
  frame?: number;
}

export const ElementRenderer: React.FC<Props> = ({ el, frame }) => {
  const cf = useCurrentFrame();
  const f = frame ?? cf;

  const style: ElementStyleOpts = {
    f,
    delay: el.delay,
    entrance: (el.entrance as any) || "spring-rise",
    fromY: 60,
    fromScale: 0.5,
  };

  if (el.entrance === "axial-flyin" && el.id) {
    const seed = el.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    style.fromX = (seed % 2 === 0) ? -800 : 800;
    style.fromY = 100;
  }

  const s = elementStyle(style);

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: typeof el.x === "number" ? el.x : el.x ? el.x : "50%",
    top: typeof el.y === "number" ? el.y : el.y ? el.y : "50%",
    transform: s.transform,
    opacity: s.opacity,
    transformOrigin: "center",
    willChange: "transform, opacity",
  };

  if ((typeof el.x === "string" && el.x.endsWith("%")) || (typeof el.y === "string" && el.y.endsWith("%"))) {
    baseStyle.translate = "-50% -50%";
  }

  switch (el.kind) {
    case "title":
    case "subtitle": {
      return (
        <div
          style={{
            ...baseStyle,
            fontSize: el.textSize || 120,
            color: el.textColor || "#FFD400",
            fontWeight: 900,
            textShadow: el.highlight
              ? "0 6px 0 rgba(0,0,0,0.5), 0 0 30px rgba(255,212,0,0.6)"
              : "0 4px 0 rgba(0,0,0,0.5)",
            WebkitTextStroke: el.highlight ? "4px #B81F1F" : "0",
            whiteSpace: "nowrap",
            textAlign: "center",
            fontFamily: "Microsoft YaHei, PingFang SC, sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          {el.text}
        </div>
      );
    }

    case "step": {
      return (
        <div
          style={{
            ...baseStyle,
            top: 140,
            left: 60,
            translate: "0 0",
            fontSize: el.textSize || 56,
            color: el.textColor || "#FFD400",
            fontWeight: 800,
            fontFamily: "Microsoft YaHei, PingFang SC, sans-serif",
            background: "rgba(15,16,24,0.85)",
            padding: "12px 28px",
            borderRadius: 12,
            borderLeft: "6px solid #FFD400",
          }}
        >
          {el.text}
        </div>
      );
    }

    case "label": {
      return (
        <div
          style={{
            ...baseStyle,
            fontSize: el.textSize || 60,
            color: el.textColor || "#FFFFFF",
            fontWeight: 700,
            textAlign: "center",
            fontFamily: "Microsoft YaHei, PingFang SC, sans-serif",
            textShadow: el.highlight
              ? "0 4px 0 rgba(0,0,0,0.6), 0 0 20px rgba(255,212,0,0.5)"
              : "0 2px 0 rgba(0,0,0,0.5)",
            whiteSpace: "nowrap",
          }}
        >
          {el.text}
        </div>
      );
    }

    case "image": {
      const w = el.w ? el.w : Math.min(1080 * (el.scale || 0.65), 1000);
      const h = el.h ? el.h : Math.min(w * 1.4, 1180);
      const entranceT = (f - el.delay) / 12;
      const postEntrance = entranceT > 1;
      const pulseScale = postEntrance ? 1 + Math.sin((f - el.delay - 12) * 0.08) * 0.015 : 1;
      const swayRot = postEntrance ? Math.sin((f - el.delay - 12) * 0.05) * 1.2 : 0;
      const combinedTransform = s.transform.includes("scale(") ? s.transform : "scale(" + pulseScale + ") rotate(" + swayRot + "deg) " + s.transform;
      return (
        <div
          style={{
            ...baseStyle,
            transform: combinedTransform,
            width: typeof w === "number" ? w : undefined,
            height: h,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <Img
            src={staticFile(el.src || "")}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.4))",
            }}
          />
        </div>
      );
    }

    case "icon": {
      const iconSize = el.iconShape === "rocket" ? 100 : 180;
      return (
        <div
          style={{
            ...baseStyle,
            width: 240,
            height: 280,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 16,
            padding: 20,
            background: "linear-gradient(135deg, rgba(15,16,24,0.95), rgba(30,32,48,0.9))",
            borderRadius: 20,
            border: "2px solid rgba(255,212,0,0.3)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          <IconRenderer shape={el.iconShape || "tool"} size={iconSize} color="#FFD400" />
          <div
            style={{
              fontSize: el.textSize || 50,
              color: el.textColor || "#FFFFFF",
              fontWeight: 800,
              fontFamily: "Microsoft YaHei, PingFang SC, sans-serif",
              textAlign: "center",
              textShadow: "0 2px 0 rgba(0,0,0,0.5)",
            }}
          >
            {el.text}
          </div>
        </div>
      );
    }

    case "sparkle": {
      const spinT = (f - el.delay) / 12;
      const spin = spinT > 0 ? spinT * 90 : 0;
      const twinkle = 1 + Math.sin((f - el.delay) * 0.3) * 0.3;
      const sparkleTransform = s.transform.includes("scale(")
        ? s.transform
        : "scale(" + twinkle + ") rotate(" + spin + "deg) " + s.transform;
      return (
        <div
          style={{
            ...baseStyle,
            transform: sparkleTransform,
            width: 80,
            height: 80,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            filter: "drop-shadow(0 0 12px rgba(255,212,0,0.9))",
          }}
        >
          <svg viewBox="0 0 100 100" width="80" height="80">
            <polygon points="50,5 61,40 95,50 61,60 50,95 39,60 5,50 39,40" fill="#FFD400" stroke="#FFEB6B" strokeWidth="2" />
            <polygon points="50,20 56,44 80,50 56,56 50,80 44,56 20,50 44,44" fill="#FFFFFF" opacity="0.85" />
          </svg>
        </div>
      );
    }

    case "line": {
      return <div style={{ ...baseStyle, display: "none" }}>{el.text}</div>;
    }

    case "cta": {
      return (
        <div
          style={{
            ...baseStyle,
            fontSize: el.textSize || 80,
            color: el.textColor || "#FFD400",
            fontWeight: 900,
            fontFamily: "Microsoft YaHei, PingFang SC, sans-serif",
            padding: "20px 40px",
            background: "rgba(15,16,24,0.9)",
            borderRadius: 16,
            border: "3px solid #FFD400",
            textShadow: "0 4px 0 rgba(0,0,0,0.6)",
          }}
        >
          {el.text}
        </div>
      );
    }

    case "tag": {
      return (
        <div
          style={{
            ...baseStyle,
            fontSize: el.textSize || 80,
            color: el.textColor || "#FFFFFF",
            fontWeight: 700,
            fontFamily: "Microsoft YaHei, PingFang SC, sans-serif",
            padding: "10px 24px",
            background: "rgba(255,212,0,0.15)",
            borderRadius: 999,
            border: "2px solid #FFD400",
            backdropFilter: "blur(8px)",
          }}
        >
          {el.text}
        </div>
      );
    }

    default:
      return null;
  }
};