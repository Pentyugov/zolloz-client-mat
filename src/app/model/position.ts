import {Entity} from "./entity";
import {ApplicationConstants} from "../modules/shared/application-constants";

export class Position extends Entity {
  name: string;
  code: string;

  constructor() {
    super(ApplicationConstants.POSITION)
    this.name = '';
    this.code = '';
  }

}
