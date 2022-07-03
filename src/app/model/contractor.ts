import {Entity} from "./entity";
import {ApplicationConstants} from "../modules/shared/application-constants";

export class Contractor extends Entity {
  name: string;
  fullName: string;
  okpo: string;
  kpp: string;
  inn: string;
  postalAddress: string;
  legalAddress: string;
  phone: string;
  fax: string;
  email: string;
  comment: string;
  website: string;
  nonResident: boolean;
  supplier: boolean;
  customer: boolean;
  isOrganization: boolean;

  constructor() {
    super(ApplicationConstants.CONTRACTOR);
    this.name = '';
    this.fullName = '';
    this.okpo = '';
    this.kpp = '';
    this.inn = '';
    this.postalAddress = '';
    this.legalAddress = '';
    this.phone = '';
    this.fax = '';
    this.email = '';
    this.comment = '';
    this.website = '';
    this.nonResident = false;
    this.supplier = false;
    this.customer = false;
    this.isOrganization = false;
  }
}
