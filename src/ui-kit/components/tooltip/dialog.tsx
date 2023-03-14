import { themeVal } from "../../../infra/utils/tailwindcss";
import "rc-tooltip/assets/bootstrap_white.css";
import { CSSProperties, FC } from "react";
import { SvgIconEnum, SvgImg } from "../svg-img";
import "./index.css";
import { FcrToolTip, FcrToolTipProps } from ".";
import classNames from "classnames";
const colors = themeVal("theme.colors");
const borderRadius = themeVal("theme.borderRadius");
const boxShadow = themeVal("theme.boxShadow");
const defaultDialogOverlayInnerStyle: CSSProperties = {
  padding: "0",
  background: `${colors["block-2"]}`,
  border: `1px solid ${colors["line-1"]}`,
  color: "#fff",
  borderRadius: `${borderRadius[8]}`,
  boxShadow: `${boxShadow[2]}`,
};

interface FcrDialogToolTipProps extends FcrToolTipProps {
  onClose?: () => void;
}
const DialogToolTipCloseableOverlayWrap: FC<
  Pick<FcrDialogToolTipProps, "content">
> = (props) => {
  const { content } = props;
  return (
    <div className={classNames("fcr-dialog-tooltip-overlay-content")}>
      <div className={classNames("fcr-dialog-tooltip-overlay-close")}>
        <SvgImg type={SvgIconEnum.CLOSE} size={9.6}></SvgImg>
      </div>
      <div className={classNames("fcr-dialog-tooltip-overlay-content-inner")}>
        {content}
      </div>
    </div>
  );
};
export const FcrDialogToolTip: FC<FcrDialogToolTipProps> = (props) => {
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
      content={
        <DialogToolTipCloseableOverlayWrap
          content={content}
        ></DialogToolTipCloseableOverlayWrap>
      }
      overlayInnerStyle={{
        ...defaultDialogOverlayInnerStyle,
        ...props.overlayInnerStyle,
      }}
      {...others}
    ></FcrToolTip>
  );
};
