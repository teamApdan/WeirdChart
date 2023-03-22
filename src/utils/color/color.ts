export type Theme = 'pastel' | 'dark' | 'light' | 'default';
export type DefaultColors = {
  [key in Theme]: string[];
};

export class Color {
  defaultTheme: Theme = 'pastel';
  colors: string[] = defaultColors.pastel;

  // constructor(customColors?: string[]) {
  //   if (customColors) {
  //     if (this.isValidColors(customColors)) {
  //       this.colors = customColors;
  //     } else {
  //       this.err('Invalid color is included in customColors');
  //     }
  //   }
  // }

  constructor(colors?: string[] | Theme) {
    if (colors) {
      if (Array.isArray(colors)) {
        if (this.isValidColors(colors)) {
          this.colors = colors;
        } else {
          this.err('Invalid color is included in colors');
          this.setColors();
        }
      } else {
        this.setColors(colors);
      }
    }
  }

  err(message: string) {
    console.error(message);
  }

  isValidColors(colors: string[]) {
    return colors.every((color) => this.isValidColor(color));
  }

  isValidColor(color: string) {
    const s = new Option().style;
    s.color = color;
    return s.color !== '';
  }

  setColors(theme: keyof typeof defaultColors = this.defaultTheme) {
    this.colors = defaultColors[theme];
  }

  getColors() {
    return this.colors;
  }

  getColor(index: number) {
    return this.colors[index % this.colors.length];
  }
}

const defaultColors: DefaultColors = {
  pastel: [
    '#c8a2c8',
    '#f7cac9',
    '#f3e5ab',
    '#ffb6c1',
    '#98fb98',
    '#e6e6fa',
    '#ccccff',
    '#ffdab9',
    '#ff7f50',
    '#ffb6c1',
    '#6699cc',
    '#c69c88',
  ],
  dark: [
    '#333333',
    '#555555',
    '#777777',
    '#999999',
    '#aaaaaa',
    '#cccccc',
    '#dddddd',
    '#eeeeee',
    '#f2f2f2',
    '#f5f5f5',
    '#f8f8f8',
    '#fafafa',
  ],
  light: [
    '#ffffff',
    '#f9f9f9',
    '#f2f2f2',
    '#e5e5e5',
    '#d8d8d8',
    '#cccccc',
    '#b2b2b2',
    '#999999',
    '#7f7f7f',
    '#666666',
    '#4c4c4c',
    '#333333',
  ],
  default: [
    '#2196F3',
    '#F44336',
    '#4CAF50',
    '#FF9800',
    '#9C27B0',
    '#3F51B5',
    '#009688',
    '#FFEB3B',
    '#795548',
    '#607D8B',
    '#E91E63',
    '#00BCD4',
  ],
};
