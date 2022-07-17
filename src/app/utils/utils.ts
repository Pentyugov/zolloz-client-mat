
export class Utils {

  static readonly BASIC_COLORS = [
    { colorName: 'info' },
    { colorName: 'primary' },
    { colorName: 'warning' },
    { colorName: 'danger' },
    { colorName: 'success' },
  ]

  static readonly COLORS_PRIMARY = [
    '#1976d2',
    '#26dad2',
    '#ee1A67',
  ];

  static readonly COLORS_SECONDARY = [
    '#8549ba',
    '#f67019',
    '#f53794',
    '#537bc4',
    '#acc236',
    '#166a8f',
    '#00a950',
    '#58595b',
  ];

  static readonly COLORS_PRIMARY_TRANSPARENCY = [
    'rgba(25, 118, 210, 0.7)',
    'rgba(28, 218, 210, 0.7)',
    'rgba(238, 26, 103, 0.7)',
  ];

  static readonly COLORS_SECONDARY_TRANSPARENCY = [
    'rgba(133, 73, 186, 0.7)',
    'rgba(246, 112, 25, 0.7)',
    'rgba(245, 55, 148, 0.7)',
    'rgba(83, 123, 196, 0.7)',
    'rgba(172, 194, 54, 0.7)',
    'rgba(22, 106, 143, 0.7)',
    'rgba(0, 169, 80, 0.7)',
    'rgba(88, 89, 91, 0.7)',

    '#8549ba',
    '#f67019',
    '#f53794',
    '#537bc4',
    '#acc236',
    '#166a8f',
    '#00a950',
    '#58595b',
  ];

  static getColor(index: number): string {
    return this.COLORS_PRIMARY[index % this.COLORS_PRIMARY.length];
  }

  static getRandomColor(): string {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color
  }
}
