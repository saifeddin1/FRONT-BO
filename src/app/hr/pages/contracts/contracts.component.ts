import { Component, OnInit } from '@angular/core';
import { Contract } from '../../models/contract.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';
import { formatDate } from '../../helpers/formatDate';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css'],
})
export class ContractsComponent implements OnInit {
  public contracts: Contract[];

  constructor(private summaryService: EmployeeSummaryService) {}
  dataSource: MatTableDataSource<Contract> = new MatTableDataSource<Contract>();
  public isDisabled: boolean =
    this.summaryService.getUser()['type'] !== 'ADMIN';

  ngOnInit(): void {
    this.getContracts();
  }

  formatedDate(date) {
    return formatDate(date);
  }

  getContracts() {
    this.summaryService.getContractsWithSalary().subscribe((result) => {
      this.contracts = result['response'];
      console.log(
        '⚡  this.summaryService.getContractsWithSalary ~ this.contracts',
        this.contracts
      );
    });
  }
}
