import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { globalBlocker } from '@dz-web/axios-middlewares';
import { Language, RaiseMode, DEFAULT_RAISE_MODE, supportedLanguage, DEFAULT_LANGUAGE } from '@/constants/config';
import { IRawAppUserConfig, IUserInfo, accessToken } from '@mobile/customize';
import { SupportedThemes, ThemeValues } from '@mobile/constants/config';
import { initPageQuery } from '@/helpers/browser/init-page-query';
import { CacheStore } from '@dz-web/cache';
import { isSupportedLanguage, isSupportedTheme, isValidRaiseMode } from '@/utils/capacities';
import { CACHE_KEY_USER_CONFIG, CACHE_KEY_USER_INFO } from '@/constants/caches';
import { isBrowser } from '@/utils/platforms';
import { MinimalRootState } from '@mobile/model/minimal-store';

const getDefaultTheme = () => {
  const { theme } = initPageQuery;
  if (isSupportedTheme(theme)) return theme as ThemeValues;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? SupportedThemes.dark : SupportedThemes.light;
};

/**
 * 点证web app移动端标准用户设置
 * 代码里统一从redux中读取此用户配置，代码不应关心用户配置的来源，并且格式应该统一,
 * 需要读取原始配置，请读取raw字段
 */
export interface IStandardAppUserConfig {
  theme: ThemeValues;
  language: Language;
  raise: RaiseMode;
  deviceNo: string;
  raw: IRawAppUserConfig;
}

// Define a type for the slice state
interface IState {
  initialized: boolean;
  /**
   * 类型待定，暂无标准
   */
  userInfo: IUserInfo;
  /**
   * 标准dz web app用户设置, 不需要关心来源
   */
  userConfig: IStandardAppUserConfig;
}

function createInitializedState(): IState {
  const {
    theme,
    lang,
    raise,
  } = initPageQuery;

  function getValueButIgnoreInNative<T>(run: () => T | undefined | null, defaultValue: T) {
    if (isBrowser()) {
      const v = run();

      if (v) return v;

      return defaultValue;
    }

    return defaultValue;
  }

  const defaultState = {
    userInfo: getValueButIgnoreInNative(() => CacheStore.getItem(CACHE_KEY_USER_INFO), {
      sessionCode: '',
    } as IUserInfo),
    userConfig: getValueButIgnoreInNative(() => CacheStore.getItem(CACHE_KEY_USER_CONFIG), {
      theme: getDefaultTheme(),
      // TODO: 浏览器环境自动生成虚拟设备号
      deviceNo: '',
      language: DEFAULT_LANGUAGE,
      raise: DEFAULT_RAISE_MODE,
      raw: {} as IRawAppUserConfig,
    }),
  } as IState;

  // 从url中获取初始配置信息, 主题、语言、涨跌颜色
  if (isSupportedTheme(theme)) {
    defaultState.userConfig.theme = theme as ThemeValues;
  }

  if (isValidRaiseMode(raise)) {
    defaultState.userConfig.raise = raise as RaiseMode;
  }

  if (isSupportedLanguage(lang)) {
    defaultState.userConfig.language = lang as Language;
  }

  return defaultState;
}

export const slice = createSlice({
  name: 'app',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: createInitializedState(),
  reducers: {
    setUserConfig: (state, action: PayloadAction<IStandardAppUserConfig>) => {
      state.userConfig = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<IUserInfo>) => {
      state.userInfo = action.payload;

      const token = accessToken(action.payload);
      if (token) {
        globalBlocker.done();
      }
    },
    setLanguage: (state, action: PayloadAction<any>) => {
      const language = action.payload;

      const langs = Object.keys(supportedLanguage).map((key) => supportedLanguage[key]);
      if (langs.includes(language)) {
        state.userConfig.language = language;
      } else {
        console.error('无效语言设置: ', action.payload);
      }
    },
    setTheme(state, action: PayloadAction<ThemeValues>) {
      const theme = SupportedThemes[action.payload];

      // 判断主题是否有效
      if (theme) {
        state.userConfig.theme = theme;
      } else {
        console.error('无效主题设置: ', action.payload);
      }
    },
    setRaise(state, action: PayloadAction<RaiseMode>) {
      if (action.payload === 'green' || action.payload === 'red') {
        state.userConfig.raise = action.payload;
      } else {
        console.error('无效涨跌颜色设置: ', action.payload);
      }
    },
  },
});

export const {
  setUserConfig,
  setUserInfo,
  setTheme,
  setRaise,
} = slice.actions;

export const selectUserConfig = (state: MinimalRootState) => state.app.userConfig;
export const selectUserInfo = (state: MinimalRootState) => state.app.userInfo;
export const selectLanguage: (state: MinimalRootState) => string = (state) => state.app.userConfig.language;
export const selectInitialized = (state: MinimalRootState) => state.app.initialized;

export default slice.reducer;
