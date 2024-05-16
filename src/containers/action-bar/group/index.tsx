import { SvgIconEnum, SvgImg } from "@components/svg-img"
import { ToolTip } from "@components/tooltip";
import { useStore } from "@ui-scene/utils/hooks/use-store";
import { useI18n } from 'agora-common-libs';
import { observer } from "mobx-react";
import './index.css'

export const GroupDiscuss = observer(() => {
    const transI18n = useI18n();
    const {
        breakoutUIStore: { helpRequestList },
      } = useStore();
    const {  breakoutUIStore } = useStore();
    const handleClick = () => {
        breakoutUIStore.setDialogVisible(true);
    };
    return (
        <ToolTip
            trigger="hover" 
            content={!helpRequestList.length ? transI18n('fcr_group_label_breakout_rooms_open') : transI18n('fcr_group_label_breakout_rooms_open_help', {
            reason1: helpRequestList.length })}
            overlayInnerStyle={{
                fontSize: '14px',
                fontWeight: 400,
            }}
        >
            <div className="fcr-action-bar-item-wrapper group" onClick={handleClick}>
                <div className="fcr-action-bar-item">
                    <div className="fcr-action-bar-item-icon">
                        <SvgImg type={SvgIconEnum.FCR_GROUP} size={32}></SvgImg>
                    </div>
                    {helpRequestList.length > 0 && <span className="fcr-group-bar-item-count">{helpRequestList.length}</span>}
                    <div className="fcr-action-bar-item-text">{transI18n('fcr_group_label_breakout_rooms')}</div>
                </div>
            </div>
        </ToolTip>
        
    )
})