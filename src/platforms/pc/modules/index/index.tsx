import { CacheStore } from '@dz-web/cache';
import { useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import './index.scss';
import { increase, selectCount } from './model/hello/slice';
import { useAppDispatch, useAppSelector } from './model/store';

const AppHome: React.FC = () => {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectCount);
  const queryClient = useQueryClient();
  CacheStore.setItem('userInfoTest', { name: 'test' });

  console.log('query client: ', queryClient);

  return (
    <div>
      <p styleName={classNames({ test: true })} className="text-bold mt-10 text-white">
        <FormattedMessage id="global.mobile.page.quantity" />: {count}
      </p>

      <button onClick={() => dispatch(increase(1))} type="button">
        <FormattedMessage id="global.mobile.page.increase" />
      </button>
    </div>
  );
};

export default AppHome;
