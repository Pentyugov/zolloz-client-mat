import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Chart} from "chart.js";
import {Task} from 'src/app/model/task';
import {Subscription} from "rxjs";
import {TaskService} from "../../../service/task.service";
import {Utils} from "../../../utils/utils";
import {TranslateService} from "@ngx-translate/core";
import {ApplicationService} from "../../../service/application.service";
import {Project} from "../../../model/project";


@Component({
  selector: 'app-widgets-my-productivity',
  templateUrl: './widgets-my-productivity.component.html',
  styleUrls: ['./widgets-my-productivity.component.scss']
})
export class WidgetsMyProductivityComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tasksChart')
  private chart: any;
  @ViewChild('chart_2')
  private chart_2: any;

  private tasksChart: any;
  private projectsChart: any;

  private tasks: Task[] = [];
  private projects: Project[] = [];
  private subscriptions: Subscription[] = [];

  public taskTotalCount: number = 0;
  private onTimeCount: number = 0;
  private notCompletedCount: number = 0;
  private overdueCount: number = 0;

  public projectsTotalCount: number = 0;
  public showProjectsChart = true;

  private tasksChartTitle: string = '';
  private notCompletedLabel: string = '';
  private onTimeLabel: string = '';
  private overdueLabel: string = '';

  constructor(private taskService: TaskService,
              private translateService: TranslateService,
              private applicationService: ApplicationService) {

  }

  ngOnInit(): void {
    this.loadTaskProductivity();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.applicationService.userSettings.subscribe(us => {
      this.translateService.use(us.locale);
      this.initLabels();
      this.initTasksChart();
      this.initProjectsChart();
    });

  }

  private initTasksChart(): void {
    this.tasksChart = new Chart(this.chart.nativeElement, {
      type: 'bar',
      data: {
        labels: [this.notCompletedLabel, this.onTimeLabel, this.overdueLabel],
        datasets: [
          {
            label: ' ',
            data: [this.notCompletedCount, this.onTimeCount, this.overdueCount],
            backgroundColor: Utils.COLORS_PRIMARY_TRANSPARENCY,
            borderColor: Utils.COLORS_PRIMARY,
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: false,
            text: this.tasksChartTitle,
          },
        },
        scales: {
          y: {
            ticks: {
              stepSize: 1
            }
          }
        }
      },

    });


  }

  private initProjectsChart(): void {
    this.projectsChart = new Chart(this.chart_2.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Not completed', 'On time', 'Overdue'],
        datasets: [{
          label: ' ',
          data: [this.notCompletedCount, this.onTimeCount, this.overdueCount],
          backgroundColor: Utils.COLORS_SECONDARY_TRANSPARENCY,
          borderColor: Utils.COLORS_SECONDARY,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: false,
            text: this.tasksChartTitle,
          },
        },
        scales: {
          y: {
            ticks: {
              stepSize: 1
            }
          }
        }
      },
    });
  }

  private updateChartData(chart:any, data: number[], title: string): void {
    chart.options.plugins.title.text = title;
    chart.data.datasets.forEach((dataset: any) => {
      dataset.data = data;
    });
    chart.update();
  }

  private updateChartLabels(chart: any, labels: string[], title: string): void {
    if (chart && chart.data) {
      chart.data.labels = labels;
      chart.options.plugins.title.text = title + ' ' + this.taskTotalCount;
      chart.update();
    }

  }

  private loadTaskProductivity(): void {
    this.subscriptions.push(this.taskService.getProductivityData().subscribe((response: Task[]) => {
      this.tasks = response;
      this.filterData();
    }));
  }

  private filterData(): void {
    this.taskTotalCount = this.tasks.length;
    this.tasks.forEach(task => {
      if (task.project) {
        this.addProject(task.project);
      }
      if (!task.started && !task.overdue) {
        this.onTimeCount++;
      } else {
        if (task.overdue)
          this.overdueCount++;
        if (task.started)
          this.notCompletedCount++
      }
    });

    let taskChartData = [this.notCompletedCount, this.onTimeCount, this.overdueCount];
    let taskChartTitle = this.tasksChartTitle + ' ' + this.taskTotalCount
    this.updateChartData(this.tasksChart, taskChartData, taskChartTitle);

    let projectsData: number[] = [];
    let projectsLabels: string[] = [];
    for (let project of this.projects) {
      projectsLabels.push(project.name);
      let taskCount: number = 0;
      this.tasks.forEach(task => {
        if (task.project && task.project.id === project.id) {
          taskCount++;
        }
      });

      projectsData.push(taskCount);
    }
    this.projectsTotalCount = this.projects.length;
    this.showProjectsChart = this.projectsTotalCount > 0;
    this.updateChartLabels(this.projectsChart, projectsLabels, 'test: ' + this.projectsTotalCount);
    this.updateChartData(this.projectsChart, projectsData, 'test: ' + this.projectsTotalCount);

  }

  private addProject(project: Project): void {
    let contains = false;
    this.projects.forEach(p => {
      if (p.id === project.id) {
        contains = true;
      }
    });

    if (!contains) {
      this.projects.push(project);
    }
  }

  private initLabels() {
    let labels: string[] = [];
    this.subscriptions.push(this.translateService.get('Widgets.Productivity.ChartTasks')
      .subscribe(m => {
        this.tasksChartTitle = m.Title;
        this.notCompletedLabel = m.NotCompleted;
        this.onTimeLabel = m.OnTime;
        this.overdueLabel = m.Overdue;

        labels.push(this.notCompletedLabel);
        labels.push(this.onTimeLabel);
        labels.push(this.overdueLabel);
        // if (this.notCompletedCount > 0)
        //   labels.push(this.notCompletedLabel);
        // if (this.onTimeCount > 0)
        //   labels.push(this.onTimeLabel);
        // if (this.overdueCount > 0)
        //   labels.push(this.overdueLabel);

        this.updateChartLabels(this.tasksChart, labels, this.tasksChartTitle);
      }));

  }


}
