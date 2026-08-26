import React from "react";

// 通用动效辅助：根据 entrance 类型 + delay + 当前帧，计算 transform 和 opacity
// entrance: "spring-rise" | "spring-pop" | "axial-flyin" | "fade" | "shutter" | "sweep"

export interface ElementStyleOpts {
  f: number; // 当前帧
  delay: number; // 元素入场延迟（帧）
  duration?: number; // 元素入场动画时长（帧），默认 12
  entrance: "spring-rise" | "spring-pop" | "axial-flyin" | "fade" | "shutter" | "sweep" | "snap";
  fromX?: number;
  fromY?: number;
  fromScale?: number;
}

export interface ElementStyle {
  opacity: number;
  transform: string;
  filter?: string;
}

export function elementStyle(o: ElementStyleOpts): ElementStyle {
  const dur = o.duration ?? 12;
  const t = (o.f - o.delay) / dur;
  if (t < 0) {
    // 未到入场时间
    return { opacity: 0, transform: `translate(${o.fromX ?? 0}px, ${o.fromY ?? 40}px) scale(${o.fromScale ?? 0.6})` };
  }
  if (t > 1) {
    // 入场完毕
    return { opacity: 1, transform: "translate(0px, 0px) scale(1)" };
  }
  // Easing functions
  const ease = (x: number) => {
    // outCubic approximation
    return 1 - Math.pow(1 - x, 3);
  };
  const easeBack = (x: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  };
  const easeOutBack = (x: number) => easeBack(x);

  switch (o.entrance) {
    case "spring-rise": {
      const k = ease(t);
      const y = (1 - k) * (o.fromY ?? 60);
      const opacity = Math.min(1, k * 1.5);
      return { opacity, transform: `translate(0px, ${y}px) scale(1)` };
    }
    case "spring-pop": {
      const k = easeOutBack(t);
      const scale = (o.fromScale ?? 0.4) + (1 - (o.fromScale ?? 0.4)) * k;
      const opacity = Math.min(1, t * 4);
      return { opacity, transform: `scale(${scale})` };
    }
    case "axial-flyin": {
      const k = ease(t);
      const x = (1 - k) * (o.fromX ?? -300);
      const y = (1 - k) * (o.fromY ?? 200);
      // squash & stretch on landing (last 30% of duration)
      let stretch = 1.0;
      if (t > 0.7) {
        const landing = (t - 0.7) / 0.3;
        stretch = 1.0 + Math.sin(landing * Math.PI) * 0.08;
      }
      const opacity = Math.min(1, t * 3);
      return { opacity, transform: `translate(${x}px, ${y}px) scaleX(${stretch})` };
    }
    case "fade": {
      const opacity = Math.min(1, t * 2);
      return { opacity, transform: "translate(0px, 0px) scale(1)" };
    }
    case "shutter": {
      const opacity = t < 0.5 ? t * 2 : (1 - t) * 2;
      return { opacity: Math.max(0, opacity), transform: "scale(1.2)" };
    }
    case "sweep": {
      const k = ease(t);
      const y = (1 - k) * 40;
      const opacity = Math.min(1, k * 2);
      return { opacity, transform: `translate(0px, ${y}px) scale(1)` };
    }
    case "snap": {
      const k = ease(t);
      const opacity = Math.min(1, t * 5);
      const scale = (o.fromScale ?? 0.85) + 0.15 * k;
      return { opacity, transform: `scale(${scale})` };
    }
    default:
      return { opacity: 1, transform: "scale(1)" };
  }
}

// Hash-based deterministic random (no Math.random)
export function jitter(seed: number, range = 1): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return (x - Math.floor(x) - 0.5) * 2 * range;
}
