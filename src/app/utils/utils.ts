export class Utils {
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
