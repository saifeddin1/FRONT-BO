import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as Highcharts from 'highcharts';

import * as HighchartsMore from "highcharts/highcharts-more";
import { UsersService } from 'src/app/eidentity/services/users.service';
import { UserService } from 'src/app/lms/services/user.service';
import { ProgramService } from '../../services/program.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  p: number = 1;
  limit: number = 7;
  total: number = 7;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  programs:any []=[];
  percentage: number = Math.floor(Math.random() * 100) +1;
  displayedColumns : string[]=[
 
    'username',
    'email',
    'type',
    'phone',
    'action' 
  ];

  displayedOptionColumns: string[] = ['name', 'action'];

  constructor(
    private programService: ProgramService,
    private usersService:UsersService) {
    // this.getallprograms()
    this.getallUsers();
   }

  ngOnInit(): void {
  }

  changePage(event) {
    console.log(event);
    this.p = event.pageIndex;
    this.limit = event.pageSize;
    this.getallUsers();

  }

  getallUsers(){
    this.usersService.getUsers().subscribe(
      (res)=>{
        this.dataSource = new MatTableDataSource(res.response);
        this.dataSource.paginator = this.paginator;
        setTimeout(() => {
          this.paginator.pageIndex = this.p;
          this.paginator.length =
            res.response.length || 0;
        });
      
        this.total = res.response.length || 0;
      },
      (error)=>{
        console.error(error)
      }
    )
  }

  
  getallprograms(){
    this.programService.getPrograms().subscribe(
      (res)=>{
           

          
      },(err)=>{
        console.log("failed to get all programs")
      }
    )
  }
  //table
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();


  highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    title: {
      text: "Average Income"
    },
    xAxis: {
      title: {
        text: 'Months'
      },
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    },
    yAxis: {
      title: {
        text: "TND"
      },
     
    },
    series: [{
      data: [5000, 30000, 15000, 20000, 40000, 60000, 30000, 45000, 50000, 55000, 42000, 80000],
      type: 'spline'
    }]
  }



  //Pie chart
  highchartspie = Highcharts;
  chartOptionspie = {   
     chart : {
        plotBorderWidth: null,
        plotShadow: false
     },
     title : {
        text: 'The largest education programs'   
     },
     tooltip : {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
     },
     plotOptions : {
        pie: {
           allowPointSelect: true,
           cursor: 'pointer',
           dataLabels: {
              enabled: true,
              format: '<b>{point.name}%</b>: {point.percentage:.1f} %',
              style: {
                 color: (Highcharts.theme )||
                 'black'
              }
           }
        }
     },
     series : [{
        type: 'pie',
        name: 'Browser share',
        data: 
         [
           ['Mathematique',   45.0],
           ['TI',       26.8],
           {
              name: 'Chrome',
              y: 12.8,
              sliced: true,
              selected: true
           },
           ['Economie',    8.5],
           ['Gestion',     6.2],
           ['Others',      0.7]
        ]
     }]
  };

//percenteg area
highchartspercent = Highcharts;
chartOptionspercent = {   
   chart: {
      type: "area"
   },
   title: {
     text: 'Employees and Students by Region'
   },
  
   xAxis:{
     categories: ['1885','1990', '1995', '2000', '2005', '2010', '2015'],
     tickmarkPlacement: 'on',
     title: {
        enabled: false
     }
   },
   yAxis : {
     title: {
        text: ''
     },
     labels: {
        formatter: function () {
           return this.value / 1000;
        }
     }
   },
   tooltip : {
     shared: true,
     valueSuffix: ' millions'
   },
   plotOptions : {
     area: {
        stacking: 'percent',
        lineColor: '#666666',
        lineWidth: 1,
        
        marker: {
           lineWidth: 1,
           lineColor: '#666666'
        }
     }
   },
   credits:{
     enabled: false
   },
   series: [
      {
         name: 'Tunis',
         data: [502, 635, 809, 947, 1402, 3634, 5268]
      }, 
      {
         name: 'Mednine',
         data: [106, 107, 111, 133, 221, 767, 1766]
      }, 
      {
         name: 'Gabes',
         data: [163, 203, 276, 408, 547, 729, 628]
      }, 
      {
         name: 'Sousse',
         data: [18, 31, 54, 156, 339, 818, 1201]
      }, 
      {
         name: 'Sfax',
         data: [2, 2, 2, 6, 13, 30, 46]
      }
   ]
};

//3D CHART
highcharts3D = Highcharts;
chartOptions3D = {      
   chart: {
      renderTo: 'container',
      type: 'column',
      margin: 75,
      options3d: {
         enabled: true,
         alpha: 15,
         beta: 15,
         depth: 50,
         viewDistance: 25
      }
   },         
   title : {
      text: 'Chart rotation demo'   
   },
   plotOptions : {
      column: {
         depth: 25
      }
   },
   series : [{
      data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
              194.1, 95.6, 54.4]
   }]
};
}



