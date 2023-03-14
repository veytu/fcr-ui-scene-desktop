import { themeVal } from "../../../infra/utils/tailwindcss";
import "rc-tooltip/assets/bootstrap_white.css";
import { CSSProperties, FC } from "react";
import { SvgIconEnum, SvgImg } from "../svg-img";
import "./index.css";
import { FcrToolTip, FcrToolTipProps } from ".";
const colors = themeVal("theme.colors");
const borderRadius = themeVal("theme.borderRadius");
const boxShadow = themeVal("theme.boxShadow");
const defaultInfoOverlayInnerStyle: CSSProperties = {
  padding: "0 12px",
  background: `${colors["block-2"]}`,
  border: `1px solid ${colors["line-1"]}`,
  fontFamily: "Helvetica Neue",
  fontStyle: "normal",
  fontWeight: "600",
  fontSize: "13px",
  lineHeight: "50px",
  color: "#fff",
  borderRadius: `${borderRadius[8]}`,
  boxShadow: `${boxShadow[2]}`,
};

interface FcrInfoToolTipProps extends FcrToolTipProps {}

export const FcrInfoToolTip: FC<FcrInfoToolTipProps> = (props) => {
  const { content, ...others } = props;
  return (
    <FcrToolTip
      arrowContent={
        <SvgImg
          style={{
            strokeWidth: 1,
          }}
          type={SvgIconEnum.TOOLTIP_ARROW}
          colors={{
            iconPrimary: colors["block-2"],
            iconSecondary: colors["line-1"],
          }}
          size={16}
        ></SvgImg>
      }
      content={content}
      overlayInnerStyle={{
        ...defaultInfoOverlayInnerStyle,
        ...props.overlayInnerStyle,
      }}
      {...others}
    ></FcrToolTip>
  );
};
