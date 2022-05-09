import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { TimesheetDeclaration } from '../../models/timesheetDeclaration.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-declarations',
  templateUrl: './declarations.component.html',
  styleUrls: ['./declarations.component.css'],
})
export class DeclarationsComponent implements OnInit {
  timesheetDeclarations: MatTableDataSource<TimesheetDeclaration>;
  timesheetDeclarationsdisplayedColumns: string[] = ['title', 'ACTION'];
  timesheetDeclarationsdisplayedOptionColumns: string[] = ['name', 'action'];

  isLoading: boolean = true;
  total: number;
  constructor(
    private employeeService: EmployeeSummaryService,
    private dialog: MatDialog,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.getAllDeclarations();
  }

  getAllDeclarations() {
    this.employeeService.getAllDeclarations().subscribe((result) => {
      console.log(result['response']);
    });
  }

  deleteDeclaration() {}

  approveDeclaration() {}
  declineDeclaration() {}
}
