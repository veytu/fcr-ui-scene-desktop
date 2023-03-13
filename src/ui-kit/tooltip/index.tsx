import ToolTip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";
import { CSSProperties, FC, ReactElement, ReactNode } from "react";
import { SvgIconEnum, SvgImg } from "../svg-img";
import "./index.css";
const defaultOverlayInnerStyle: CSSProperties = {
  padding: "0 10px",
  background: "#000",
  border: "1px solid rgba(74, 76, 95, 1)",
  fontFamily: "Helvetica Neue",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "32px",
  color: "#fff",
  borderRadius: "8px",
  boxShadow: "0px 4px 50px rgba(143, 143, 143, 0.3)",
};
const defaultGuideOverlayInnerStyle: CSSProperties = {
  padding: "0 24px",
  background: "#0056FD",
  border: "1px solid #0056FD",
  fontFamily: "Helvetica Neue",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "40px",
  color: "#fff",
  borderRadius: "8px",
  boxShadow: "0px 4px 50px rgba(143, 143, 143, 0.3)",
};
type FcrToolTipActionType = "hover" | "focus" | "click" | "contextMenu";
interface FcrToolTipProps {
  content?: ReactNode;
  trigger?: FcrToolTipActionType;
  placement?: string;
  arrowContent?: ReactNode;
  overlayInnerStyle?: CSSProperties;
}
interface FcrGuideToolTipProps extends FcrToolTipProps {}

export const FcrGuideToolTip: FC<FcrGuideToolTipProps> = (props) => {
  const {} = props;
  return (
    <FcrToolTip
      overlayInnerStyle={{
        ...defaultGuideOverlayInnerStyle,
        ...props.overlayInnerStyle,
      }}
      {...props}
    ></FcrToolTip>
  );
};
export const FcrToolTip: FC<FcrToolTipProps> = (props) => {
  const {
    content,
    children,
    trigger,
    placement,
    arrowContent,
    overlayInnerStyle,
  } = props;

  return (
    <ToolTip
      arrowContent={
        arrowContent || (
          <SvgImg type={SvgIconEnum.TOOLTIP_ARROW} size={16}></SvgImg>
        )
      }
      trigger={trigger}
      placement={placement}
      overlay={content}
      overlayInnerStyle={{ ...overlayInnerStyle, ...defaultOverlayInnerStyle }}
    >
      {(children as ReactElement) || <></>}
    </ToolTip>
  );
};
