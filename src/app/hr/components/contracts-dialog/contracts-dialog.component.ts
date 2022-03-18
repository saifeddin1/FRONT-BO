import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { Contract } from '../../models/contract.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-contracts-dialog',
  templateUrl: './contracts-dialog.component.html',
  styleUrls: ['./contracts-dialog.component.css'],
})
export class ContractsDialogComponent implements OnInit {
  contract: Contract;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private summaryService: EmployeeSummaryService,
    private toaster: ToasterService
  ) {
    this.contract = data['contract'];
  }

  ngOnInit(): void {
    console.log(this.data);
  }

  updateContractWithSalary(contract) {
    console.log(contract['salaries']);

    this.summaryService
      .updateContractWithSalary(contract._id, contract)
      .subscribe((result) => {
        console.log('⚡ ~  updateContractWithSalary ~ result', result);
        this.toaster.success('Successfuly Updated');
      });
  }
  addContract(contract) {
    this.summaryService.createContract(contract).subscribe((result) => {
      console.log('⚡ ~   addContract ~ result', result);
      this.toaster.success('Successfuly Added');
    });
  }
}
