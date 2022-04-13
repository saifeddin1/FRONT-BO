import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { Contract } from '../../models/contract.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';
import { formatDate } from '../../helpers/formatDate';
@Component({
  selector: 'app-contracts-dialog',
  templateUrl: './contracts-dialog.component.html',
  styleUrls: ['./contracts-dialog.component.css'],
})
export class ContractsDialogComponent implements OnInit {
  contract: Contract;
  isViewOperation: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private summaryService: EmployeeSummaryService,
    private toaster: ToasterService
  ) {
    this.contract = data['contract'];
    this.isViewOperation = data['dialogOperation'] === 'view';
  }

  ngOnInit(): void {
    console.log(this.data);
  }

  getFormatedDate(date) {
    formatDate(date);
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
