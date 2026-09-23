import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Saved: undefined;
};

export type HomeStackParamList = {
  HomeList: undefined;
  HomeDetail: {
    id: string;
    name: string;
  };
};
