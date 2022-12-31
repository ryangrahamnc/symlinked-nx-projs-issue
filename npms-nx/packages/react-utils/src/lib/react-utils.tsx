import styles from './react-utils.module.scss';

import { isString } from '@my/utils';

export const Comp1 = (val: any) => {
  return <div>isString: {isString(val)}</div>;
};

/* eslint-disable-next-line */
export interface ReactUtilsProps {}

export function ReactUtils(props: ReactUtilsProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ReactUtils!</h1>
    </div>
  );
}

export default ReactUtils;
