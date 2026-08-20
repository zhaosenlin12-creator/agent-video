import React from "react";

// 1080x1920 vertical stage wrapper.
export const Stage: React.FC<React.PropsWithChildren<{ bg?: string }>> = ({ children, bg = "#0f1018" }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        background: bg,
        overflow: "hidden",
        fontFamily: "Microsoft YaHei, PingFang SC, sans-serif",
      }}
    >
      {children}
    </div>
  );
};

