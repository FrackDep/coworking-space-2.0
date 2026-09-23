import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Favorites: undefined;
};

export type HomeStackParamList = {
  HomeList: undefined;
  HomeDetail: {
    id: string;
    name: string;
  };
};
