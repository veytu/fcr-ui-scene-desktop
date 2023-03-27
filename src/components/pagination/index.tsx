import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { SvgIconEnum, SvgImg } from '../svg-img';
import './index.css';
import { ClickableIcon } from '../svg-img/clickable-icon';

type PaginationProps = {
  current: number;
  total: number;
  onChange?: (current: number) => void;
};

const usePageCounter = (context: { current: number; total: number }) => {
  const [current, setCurrent] = useState(context.current);
  useEffect(() => {
    setCurrent(current);
  }, [context.current]);

  const handlePrev = () => {
    if (current <= 1) {
      return;
    }
    setCurrent(current - 1);
  };

  const handleNext = () => {
    if (current >= context.total) {
      return;
    }
    setCurrent(current + 1);
  };

  return {
    current,
    handlePrev,
    handleNext,
  };
};

export const Pagination: FC<PaginationProps> = ({ current, total, onChange = () => {} }) => {
  const cls = classNames('fcr-pagination', {});

  const { handleNext, handlePrev, current: innerCurrent } = usePageCounter({ current, total });

  useEffect(() => {
    onChange(innerCurrent);
  }, [innerCurrent]);

  const prevCls = classNames(
    'fcr-pagination__btn',
    innerCurrent <= 1 ? 'fcr-pagination_btn--disabled' : 'fcr-btn-click-effect',
  );

  const nextCls = classNames(
    'fcr-pagination__btn',
    innerCurrent >= total ? 'fcr-pagination_btn--disabled' : 'fcr-btn-click-effect',
  );

  return (
    <div className={cls}>
      <div className="fcr-pagination__prev">
        <button className={prevCls} onClick={handlePrev}>
          <SvgImg type={SvgIconEnum.FCR_LEFT4} />
        </button>
      </div>
      <div className="fcr-divider" />
      <div className="fcr-pagination__page">
        {current ?? 0}/{total ?? 0}
      </div>
      <div className="fcr-divider" />
      <div className="fcr-pagination__next">
        <button className={nextCls} onClick={handleNext}>
          <SvgImg type={SvgIconEnum.FCR_RIGHT4} />
        </button>
      </div>
    </div>
  );
};

export const HalfRoundedPagination: FC<PaginationProps> = ({
  current,
  total,
  onChange = () => {},
}) => {
  const cls = classNames('fcr-pagination fcr-pagination-half-r', {});

  const { handleNext, handlePrev, current: innerCurrent } = usePageCounter({ current, total });

  useEffect(() => {
    onChange(innerCurrent);
  }, [innerCurrent]);

  const prevCls = classNames(
    'fcr-pagination__btn',
    innerCurrent <= 1 ? 'fcr-pagination_btn--disabled' : 'fcr-btn-click-effect',
  );

  const nextCls = classNames(
    'fcr-pagination__btn',
    innerCurrent >= total ? 'fcr-pagination_btn--disabled' : 'fcr-btn-click-effect',
  );

  return (
    <div className={cls}>
      <div className="fcr-pagination__extra">
        <ClickableIcon icon={SvgIconEnum.FCR_V2_PHONE_MORE1} />
      </div>
      <div className="fcr-divider" />
      <div className="fcr-pagination__prev">
        <button className={prevCls} onClick={handlePrev}>
          <SvgImg type={SvgIconEnum.FCR_LEFT4} size={30} />
        </button>
      </div>
      <div className="fcr-pagination__page">
        {current ?? 0}/{total ?? 0}
      </div>
      <div className="fcr-pagination__next">
        <button className={nextCls} onClick={handleNext}>
          <SvgImg type={SvgIconEnum.FCR_RIGHT4} size={30} />
        </button>
      </div>
    </div>
  );
};

export const FloatPagination: FC<PaginationProps> = ({ current, total, onChange = () => {} }) => {
  const { current: innerCurrent, handleNext, handlePrev } = usePageCounter({ current, total });

  useEffect(() => {
    onChange(innerCurrent);
  }, [innerCurrent]);

  const prevCls = classNames(
    'fcr-pagination-float__btn',
    innerCurrent <= 1 ? 'fcr-pagination_btn--disabled' : 'fcr-btn-click-effect',
  );

  const nextCls = classNames(
    'fcr-pagination-float__btn',
    innerCurrent >= total ? 'fcr-pagination_btn--disabled' : 'fcr-btn-click-effect',
  );

  return (
    <div className="fcr-pagination-float">
      <div className="fcr-pagination-float__prev">
        <button className={prevCls} onClick={handlePrev}>
          <SvgImg type={SvgIconEnum.FCR_LEFT3} />
        </button>
        <div className="fcr-pagination-float__page">
          {current ?? 0}/{total ?? 0}
        </div>
      </div>
      <div className="fcr-pagination-float__next">
        <button className={nextCls} onClick={handleNext}>
          <SvgImg type={SvgIconEnum.FCR_RIGHT3} />
        </button>
        <div className="fcr-pagination-float__page">
          {current ?? 0}/{total ?? 0}
        </div>
      </div>
    </div>
  );
};
