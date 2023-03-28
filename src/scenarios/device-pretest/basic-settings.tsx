import { Button } from '@onlineclass/components/button';
import { Dropdown } from '@onlineclass/components/dropdown';
import { SvgIconEnum } from '@onlineclass/components/svg-img';

export const BasicSettings = () => {
  return (
    <div className="fcr-pretest-settings">
      <div className="fcr-pretest__settings__item">
        <span className="fcr-pretest__settings__label">Camera</span>
        <Dropdown options={[]} />
      </div>
      <div className="fcr-pretest__settings__item">
        <span className="fcr-pretest__settings__label">Microphone</span>
        <Dropdown options={[]} />
      </div>
      <div className="fcr-pretest__settings__item">
        <span className="fcr-pretest__settings__label">Speaker</span>
        <div className="fcr-pretest__settings__combined-item">
          <Dropdown options={[]} />
          <Button preIcon={SvgIconEnum.FCR_V2_LOUDER} size="S" shape="rounded">
            Test
          </Button>
        </div>
      </div>
    </div>
  );
};
