export abstract class Entity {
  id: string;
  metaClass: string;
  protected constructor(metaClass: string) {
    this.metaClass = metaClass;
    this.id = ''
  }
}
