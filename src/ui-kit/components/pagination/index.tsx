import React, { FC } from 'react';
import classNames from 'classnames';
import { SvgIconEnum, SvgImg } from '../svg-img';
import './index.css';
import { FcrClickableIcon } from '../svg-img/clickable-icon';

type PaginationProps = {
  current: number;
  total: number;
  onChange?: (current: number) => void;
};

export const Pagination: FC<PaginationProps> = ({ current, total, onChange }) => {
  const cls = classNames('fcr-pagination', {});

  return (
    <div className={cls}>
      <div className="fcr-pagination__prev">
        <button className="fcr-pagination__btn fcr-btn-click-effect">
          <SvgImg type={SvgIconEnum.FCR_LEFT4} />
        </button>
      </div>
      <div className="fcr-divider" />
      <div className="fcr-pagination__page">
        {current ?? 0}/{total ?? 0}
      </div>
      <div className="fcr-divider" />
      <div className="fcr-pagination__next">
        <button className="fcr-pagination__btn fcr-btn-click-effect">
          <SvgImg type={SvgIconEnum.FCR_RIGHT4} />
        </button>
      </div>
    </div>
  );
};

export const HalfRoundedPagination: FC<PaginationProps> = ({ current, total, onChange }) => {
  const cls = classNames('fcr-pagination fcr-pagination-half-r', {});

  return (
    <div className={cls}>
      <div className="fcr-pagination__extra">
        <FcrClickableIcon icon={SvgIconEnum.FCR_V2_PHONE_MORE1} />
      </div>
      <div className="fcr-divider" />
      <div className="fcr-pagination__prev">
        <button className="fcr-pagination__btn fcr-btn-click-effect">
          <SvgImg type={SvgIconEnum.FCR_LEFT4} size={30} />
        </button>
      </div>
      <div className="fcr-pagination__page">
        {current ?? 0}/{total ?? 0}
      </div>
      <div className="fcr-pagination__next">
        <button className="fcr-pagination__btn fcr-btn-click-effect">
          <SvgImg type={SvgIconEnum.FCR_RIGHT4} size={30} />
        </button>
      </div>
    </div>
  );
};
