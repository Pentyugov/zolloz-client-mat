import * as moment from "moment";
import {ThemePalette} from "@angular/material/core";

export class CalendarConfig {
  date: moment.Moment | undefined;
  disabled = false;
  showSpinners = true;
  showSeconds = false;
  touchUi = false;
  enableMeridian = false;
  minDate: moment.Moment | undefined;
  maxDate: moment.Moment | undefined;
  stepHour = 1;
  stepMinute = 30;
  stepSecond = 1;
  color: ThemePalette = 'primary';


  static readonly color: any = {
    red: {
      primary: '#fc4b6c',
      secondary: '#f9e7eb',
    },
    blue: {
      primary: '#1e88e5',
      secondary: '#D1E8FF',
    },
    yellow: {
      primary: '#ffb22b',
      secondary: '#FDF1BA',
    },
  }

}
