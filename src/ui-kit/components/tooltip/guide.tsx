import { themeVal } from "../../../infra/utils/tailwindcss";
import "rc-tooltip/assets/bootstrap_white.css";
import { CSSProperties, FC } from "react";
import { SvgIconEnum, SvgImg } from "../svg-img";
import "./index.css";
import classNames from "classnames";
import { FcrToolTip, FcrToolTipProps } from ".";
const colors = themeVal("theme.colors");
const borderRadius = themeVal("theme.borderRadius");
const boxShadow = themeVal("theme.boxShadow");
const defaultGuideOverlayInnerStyle: CSSProperties = {
  padding: "0",
  background: `${colors["brand"]["DEFAULT"]}`,
  border: `1px solid ${colors["brand"]["DEFAULT"]}`,
  fontFamily: "Helvetica Neue",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "40px",
  color: "#fff",
  borderRadius: `${borderRadius[8]}`,
  boxShadow: `${boxShadow[2]}`,
};

interface FcrGuideToolTipProps extends FcrToolTipProps {
  closeable?: boolean;
}
const GuideToolTipCloseableOverlayWrap: FC<
  Pick<FcrGuideToolTipProps, "closeable" | "content">
> = (props) => {
  const { content, closeable } = props;
  return (
    <div className={classNames("fcr-guide-tooltip-overlay-content")}>
      <div
        style={{
          padding: closeable ? "0px 8px" : "0px 24px",
        }}
        className={classNames("fcr-guide-tooltip-overlay-content-inner")}
      >
        {content}
      </div>
      {closeable && (
        <div
          className={classNames("fcr-guide-tooltip-overlay-content-closeable")}
        >
          <SvgImg type={SvgIconEnum.CLOSE} size={24}></SvgImg>
        </div>
      )}
    </div>
  );
};
export const FcrGuideToolTip: FC<FcrGuideToolTipProps> = (props) => {
  const { closeable, content, ...others } = props;
  return (
    <FcrToolTip
      arrowContent={
        <SvgImg
          type={SvgIconEnum.TOOLTIP_ARROW}
          colors={{
            iconPrimary: colors["brand"]["DEFAULT"],
            iconSecondary: colors["brand"]["DEFAULT"],
          }}
          size={16}
        ></SvgImg>
      }
      content={
        <GuideToolTipCloseableOverlayWrap
          content={content}
          closeable={closeable}
        ></GuideToolTipCloseableOverlayWrap>
      }
      overlayInnerStyle={{
        ...defaultGuideOverlayInnerStyle,
        ...props.overlayInnerStyle,
      }}
      {...others}
    ></FcrToolTip>
  );
};
