import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { Contract } from '../../models/contract.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';
import { formatDate } from '../../helpers/formatDate';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { User } from 'src/app/eidentity/models/user.model';
import { contractType } from '../../models/ContractType.model';
@Component({
  selector: 'app-contracts-dialog',
  templateUrl: './contracts-dialog.component.html',
  styleUrls: ['./contracts-dialog.component.css'],
})
export class ContractsDialogComponent implements OnInit {
  contract: Contract;
  isViewOperation: boolean;
  myControl = new FormControl();
  filteredOptions: Observable<User[]>;
  typeItems: contractType[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private summaryService: EmployeeSummaryService,
    private toaster: ToasterService
  ) {
    this.contract = data['contract'];
    this.isViewOperation = data['dialogOperation'] === 'view';
    if (this.contract.userId !== '') this.myControl.disable();
  }

  ngOnInit(): void {
    console.log(this.data);
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.data['users'].slice()))
    );
    this.getAllContractTypeItems();
  }
  displayFn(id: string) {
    if (!id) return '';

    let index = this.data['users'].findIndex((user) => user._id === id);
    return this.data['users'][index].username;
  }
  private _filter(username: string): User[] {
    const filterValue = username.toLowerCase();

    return this.data['users'].filter((option) =>
      option?.username.toLowerCase().includes(filterValue)
    );
  }
  getFormatedDate(date) {
    formatDate(date);
  }
  updateContractWithSalary(contract) {
    console.log(contract);

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
  getAllContractTypeItems() {
    this.summaryService.getAllContractTypes().subscribe((result) => {
      console.log('⚡ ~ getAllWorkFromItems ~ result', result);
      this.typeItems = result['response'][0]['totalData'];
    });
  }
}
