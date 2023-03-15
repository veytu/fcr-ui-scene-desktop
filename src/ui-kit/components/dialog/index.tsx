import RcDialog from 'rc-dialog';
import 'rc-dialog/assets/index.css';
interface FcrDialogProps {
  visible?: boolean;
  onClose?: () => void;
}
export const FcrDialog = (props: FcrDialogProps) => {
  const { visible, onClose } = props;
  return (
    <RcDialog animation={'zoom'} maskAnimation={'fade'} visible={visible} onClose={onClose}>
      <div>dialog</div>
    </RcDialog>
  );
};
