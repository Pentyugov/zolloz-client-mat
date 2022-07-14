import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Chart, ChartOptions} from "chart.js";
import {Task} from 'src/app/model/task';
import {Subscription} from "rxjs";
import {TaskService} from "../../../service/task.service";


@Component({
  selector: 'app-widgets-my-productivity',
  templateUrl: './widgets-my-productivity.component.html',
  styleUrls: ['./widgets-my-productivity.component.scss']
})
export class WidgetsMyProductivityComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('chart') private chart: any;
  pieChart: any;
  private tasks: Task[] = [];
  private subscriptions: Subscription[] = [];

  private totalCount: number = 0;
  private onTimeCount: number = 0;
  private notCompletedCount: number = 0;
  private overdueCount: number = 0;

  ngAfterViewInit(): void {
    this.updateChart();
  }

  constructor(private taskService: TaskService) {

  }

  private updateChart(): void {
    this.pieChart = new Chart(this.chart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Not completed', 'On time', 'Overdue'],
        datasets: [{
          label: '# of Votes',
          data: [this.notCompletedCount, this.onTimeCount, this.overdueCount],
          backgroundColor: [
            '#1976d2',
            '#26dad2',
            '#ee1A67'
          ],
          borderColor: [
            '#1976d2',
            '#26dad2',
            '#ee1A67'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'My tasks',
          },
        },
      }
    });
  }

  private updateChartData(chart:any, data: number[]): void {
    chart.options.plugins.title.text = 'My tasks: ' + this.totalCount;
    chart.data.datasets.forEach((dataset: any) => {
      dataset.data = data;
    });
    chart.update();
  }

  ngOnInit(): void {
    this.loadTaskProductivity();
  }

  private loadTaskProductivity(): void {
    this.subscriptions.push(this.taskService.getProductivityData().subscribe((response: Task[]) => {
      this.tasks = response;
      this.filterData();
    }));
  }

  private filterData(): void {
    this.totalCount = this.tasks.length;
    this.tasks.forEach(task => {
      if (!task.started && !task.overdue) {
        this.onTimeCount++;
      } else {
        if (task.overdue)
          this.overdueCount++;
        if (task.started)
          this.notCompletedCount++
      }
    });

    let data = [this.notCompletedCount, this.onTimeCount, this.overdueCount];
    this.updateChartData(this.pieChart, data);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


}
