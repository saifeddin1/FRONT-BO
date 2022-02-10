import { Component, OnInit } from '@angular/core';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-collabortors',
  templateUrl: './collaborators.component.html',
  styleUrls: ['./collaborators.component.css'],
})
export class CollaboratorsComponent implements OnInit {
  public collaborators: File[];

  constructor(private summaryService: EmployeeSummaryService) {}

  ngOnInit(): void {
    this.getCollaborators();
  }
  getCollaborators() {
    this.summaryService
      .getCollaborators()
      .subscribe(
        (result) => (this.collaborators = result['response'][0]?.totalData)
      );
  }
}
