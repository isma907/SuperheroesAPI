export interface SuperHeroState {
  list: Hero[];
  loading: boolean;
}

export interface Hero {
  _id: string;
  name: string;
  biography: Biography;
  imageUrl: string;
}

interface Biography {
  firstAppearance: string;
  publisher: string;
}
