import { Program } from './../../models/program.model';
import { Academicterm } from './../../models/academicterm.model';
import { AcademicyearService } from './../../services/academicyear.service';
import { GroupstudentService } from './../../services/groupstudent.service';
import { Academicyear } from './../../models/acadmicyear.model';
import { FeeStructure } from './../../models/feeStructure.model';
import { FeestructureService } from './../../services/feestructure.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { MatTableDataSource } from '@angular/material/table';
import { Student } from '../../models/student.model';
import { AcademictermService } from '../../services/academicterm.service';
import { ProgramService } from '../../services/program.service';
import { MatPaginator } from '@angular/material/paginator';
import { UsersService } from 'src/app/eidentity/services/users.service';
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts"; 
import moment from 'moment';
pdfMake.vfs = pdfFonts.pdfMake.vfs; 

@Component({
  selector: 'app-groupstudent',
  templateUrl: './groupstudent.component.html',
  styleUrls: ['./groupstudent.component.css']
})
export class GroupstudentComponent implements OnInit{
  feeStructures: [] = [];
  feestructidforfacture:string;
  onefeestructure: any;
  ismatch:boolean= false;
  students:[]=[];
  studentsmodal3:any []=[];
  studentsId:any []=[];
  academicterms:Academicterm []=[];
  academicyears:Academicyear []=[];
  studentgroup: any []=[];
  form2:FormGroup;
  programs :any []=[];
  form1:FormGroup;
  clrModalOpen: boolean = false;
  clrModalOpen1: boolean = false;
  clrModalOpen3: boolean = false;
  clrModalOpenEdit: boolean = false;
  form: FormGroup;
  p: number = 1;
  limit: number = 7;
  total: number = 7;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns2 : string[]=[
    '#',
    
    'name',
    'groupRollNumber',
    'action'
     
    
  ];
  displayedColumns3 : string[]=[
    '#',
    
    'name',
    'groupRollNumber',
    
     
    
  ];
  displayedColumns1 : string[]=[
    
    
    'name',
    'program',
    'academicyear',
    'academicterm',
    'maxsize',
    
    'action' 
  ];
 

  displayedOptionColumns: string[] = ['name', 'action'];

  

  constructor( private programService: ProgramService, private usersService:UsersService,private academictermService : AcademictermService,private formBuilder: FormBuilder,private toasterService: ToasterService,
     private feeStructureService: FeestructureService, private groupstudentService: GroupstudentService,
     private academicyearService:AcademicyearService) {
      this.getallacademicyears();
      this.getallprograms();
      this.getStudentsGroup();
      this.getDisabledStudentsGroup();
      this.getfeeStructure();
   }

  ngOnInit(): void {
    this.createForm();
    this.createForm1();
    this.createForm2();
  }

  changePage(event) {
    console.log(event);
    this.p = event.pageIndex;
    this.limit = event.pageSize;
    this.getStudentsGroup();

  }
 
  dataSource1: MatTableDataSource<any> = new MatTableDataSource<any>();
  getStudentsGroup(){
    this.dataSource1 = new MatTableDataSource([]);
    this.groupstudentService.getGroupStudentsbyname().subscribe(
      (res)=>{
       console.log(" get all student group", res.response)
      this.dataSource1 = new MatTableDataSource(res.response);
      this.dataSource.paginator = this.paginator;
      setTimeout(() => {
        this.paginator.pageIndex = this.p;
        this.paginator.length =
          res.response.length || 0;
      });
    
      this.total = res.response.length || 0;
    },
      (error)=>{
        console.error("get studentgroup error :",error)
      }

    )
  }
  dataSource4: MatTableDataSource<any> = new MatTableDataSource<any>();
  getDisabledStudentsGroup(){
    this.dataSource4 = new MatTableDataSource([]);
    this.groupstudentService.getDisabledGroupStudents().subscribe(
      (res)=>{
       console.log(" get disabled all student group", res.response)
       this.dataSource4 = new MatTableDataSource(res.response);
    },
      (error)=>{
        console.error("get studentgroup error :",error)
      }

    )
  }
  dataSource: MatTableDataSource<FeeStructure> = new MatTableDataSource<FeeStructure>();
  getStudents(){
    this.dataSource = new MatTableDataSource([]);
    this.usersService.getUsers().subscribe(
      
      (res)=>{
        console.log("students list:",res.response)
        console.log("program :",this.form1.value.program)
        
        const filterStudent= (student)=>{
    
          
          if(  student.studentNiveauId == this.form1.value.program && Number(this.form1.value.maxsize) >0 )
          {
              this.form1.value.maxsize--;
              console.log("student id hani hnee",student._id)
              this.studentsId.push(student._id)
              return student;
      
          }
          
      
        }
      
       
         
        this.students = res.response.filter(filterStudent);
        this.dataSource = new MatTableDataSource(this.students);

        console.log("studentsId:",this.students)
      },
      (error)=>{
        console.error("get students error :",error)
      }
    )
  }
 createForm1(){
  this.form1 = this.formBuilder.group({
    _id: '',
    program: ['', [Validators.required]],
    name: ['', [Validators.required]],
    academicyear: ['', [Validators.required]],
    academicterm: ['', [Validators.required]],
    feeStructureId: ['', [Validators.required]],
    maxsize: ['', [Validators.required]],
    
    
   
  }) as FormGroup ; 
 }

 createForm2(){
  this.form2 = this.formBuilder.group({
    _id: '',
    program: ['', [Validators.required]],
    name: ['', [Validators.required]],
    academicyear: ['', [Validators.required]],
    academicterm: ['', [Validators.required]],
    maxsize: ['', [Validators.required]],
    feeStructureId: ['', [Validators.required]],
    
    
    
   
  }) as FormGroup ; 
 }

 
  createForm() {
    this.form = this.formBuilder.group({
      _id: '',
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      grouprollnumber: ['', [Validators.required]],
      
      
     
    }) as FormGroup & Student; 
  }

  fillFormModel(body) {
    this.form2.patchValue({
      _id: body._id,
      name: body.name,
      program: body.program,
      academicyear: body.academicyear._id,
      academicterm: body.academicterm._id,
      maxsize : body.maxsize,
      feeStructureId:body.feeStructureId
     
    });
    console.log("form2 patch value",this.form2.value)
  }

  modalType: string ;
  openModal(type ='add') {
    this.clrModalOpen = true;
    if (type == 'add') {
      this.modalType = 'add';
      this.createForm();
    } else {
      this.modalType = 'edit';
    }
  }
  dataSource3: MatTableDataSource<any> = new MatTableDataSource<any>();
  openModal3 (id:string, feestructid:string) {
    
     this.feestructidforfacture = feestructid;
     this.getOnefeestructure();
     this.groupstudentService.getOneStudentgroup(id).subscribe(

      (res)=>{
        
        console.log("groups students :students =>",res.response.students)
        this.dataSource3 = new MatTableDataSource(res.response.students);
      

      },
      (error)=>{
        console.log("get stuednts",error)
      }
    )
    this.clrModalOpen3 = true;
  }
  closemodal3(){
    this.clrModalOpen3= false;
  }
  closeModal() {
    this.createForm();
    this.clrModalOpen = false;
  }
  closeModaledit(){
    this.createForm2();
    this.clrModalOpenEdit = false;
  }

  openModal1() {
    
    this.clrModalOpen1 = true;
  }
  closeModal1() {
   
    this.clrModalOpen1 = false;
  }

  onSubmit(){
    if(this.form.value){
      console.log('this.formModel.value : ', this.form.value);

     
      const student={
        _id:this.form.value._id,
        name : this.form.value.name,
        code : this.form.value.code,
        grouprollnumber: this.form.value.grouprollnumber,
      }
     
      
        this.groupstudentService.editStudent(student._id,student).subscribe(
          (result)=>{
            console.log('edited successfully:',result);
            this.toasterService.success('Edited Successfully');
            location.reload();

          
          },(err)=>{
            console.log(err)
            this.toasterService.error('Something wrong')
          }
        )
      }
    
  }

  editById(body: Partial<Student>) {
    console.log("edit by id element",body)
    this.fillFormModel(body);
    this.getallacademicterms('form2');
    this.clrModalOpenEdit = true
    
  }

  editstudentgroup(){

    const studentgroup={
      name:this.form2.value.name,
      program : this.form2.value.program,
      academicyear : this.form2.value.academicyear,
      academicterm: this.form2.value.academicterm,
      studentCategory: this.form2.value.studentCategory,
      feeStructureId:this.form2.value.feeStructureId,
      maxsize: this.form2.value.maxsize,
      
  }
  console.log()

  this.groupstudentService.editStudentgroup(this.form2.value._id, studentgroup).subscribe(
    (result)=>{
      console.log('edited successfully:',result);
      this.toasterService.success('Edited Successfully');
      this.getStudentsGroup();

    },(err)=>{
      console.log("edit error :",err)
      this.toasterService.error('Something wrong')
    }
  )

  }

  deleteStudent(id:string){
    this.groupstudentService.deleteStudent(id).subscribe(
      (res)=>{
        this.toasterService.success("Deleted successfully")
        this.getStudents();
     

      },
      (err)=>{
        this.toasterService.error('Something wrong ')
      }
    )
  }


// Save student group first save 
saveStudentGroup(){
  const program={
    name : this.form1.value.name,
    program : this.form1.value.program,
    academicyear : this.form1.value.academicyear,
    academicterm: this.form1.value.academicterm,
    maxsize: this.form1.value.maxsize,
    feeStructureId: this.form1.value.feeStructureId,
    students: this.students}
    console.log("test students id", program.feeStructureId)
    
  this.groupstudentService.createStudentGroup(program).subscribe
  (
    (result)=>{
            
      console.log(result)
      this.toasterService.success("Created successfully")
      this.getStudentsGroup();
      

    },
    (err)=>{
      console.log(err)
      this.toasterService.error('Something wrong ')
    }
  )
  

}
 




/* select option part */

 getallacademicyears(){
   this.academicyearService.getAcademicyears().subscribe(
     (res) =>{
       this.academicyears = res.response;
     }
   )
 }

 getallacademicterms(form='form1'){

   if(form== 'form2'){
    this.academicyearService.getOneAcademicyearterms(this.form2.value.academicyear).subscribe(
      (res)=>{
       
        this.academicterms = res.response.terms ;
      }
    )

   
   
  }else{
    this.academicyearService.getOneAcademicyearterms(this.form1.value.academicyear).subscribe(
      (res)=>{
       
        this.academicterms = res.response.terms ;
      }
    )


  }
 }

 

 deletestudentgroup(id:string){
   this.groupstudentService.deleteStudentgroup(id).subscribe(
     (res)=> {
       this.toasterService.success("deleted successfully")
       this.getStudentsGroup();
       this.getDisabledStudentsGroup();
     },
     (error)=>{
       this.toasterService.error('something wrong')
       console.log("delete group student error",error)
     }
   )

   

 }

 //Get all programs
  getallprograms(){
  this.programService.getPrograms().subscribe(
    (res) =>{
      this.programs = res.response;
    }
  )
}


restore(id:string){
  this.groupstudentService.restore(id).subscribe(
    (res)=>{
      this.getDisabledStudentsGroup();
      this.getStudentsGroup();
      
      
      this.toasterService.success("restored successfully")
    
    
    },
    (err)=>{
      console.log("restore errror", err)
      this.toasterService.error('restore error');
    }
  )
}
getfeeStructure() {
  this.feeStructureService.getFeestructures().subscribe(
    (res) => {
      this.feeStructures = res.response;
      console.log('fee structures:', this.feeStructures);
    },
    (error) => {
      console.error(error);
    }
  );
}
getOnefeestructure(){
  this.feeStructureService.getOneFeestructure(this.feestructidforfacture).subscribe(
    (res)=>{
      
      this.onefeestructure = res.response
      console.log("successfully get one fee structure",this.onefeestructure)
    },
    (err)=>{
      console.log("error get one fee structure")
    }
  )
}
//Generate pdf 
generateFacture(element:any) {  

  let discount = this.onefeestructure[0].amount - (this.onefeestructure[0].amount*20 / 100)
  let docDefinition = {  
    
    
    content: [
        // Header
        {
            columns: [
                {
                      image: 'data:image/png;base64,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',
                      width: 150
                },
                    
                [
                    {
                        text: 'Invoice', 
                        style: 'invoiceTitle',
                        width: '*'
                    },
                    {
                      stack: [
                          
                           {
                               columns: [
                                   {
                                       text:'Date Issued',
                                       style:'invoiceSubTitle',
                                       width: '*'
                                   }, 
                                   {
                                       text:moment(Date.now()).format('YYYY-MM-DD'),
                                       style:'invoiceSubValue',
                                       width: 100
                                   }
                                   ]
                           },
                          //  {
                          //      columns: [
                          //          {
                          //              text:'Due Date',
                          //              style:'invoiceSubTitle',
                          //              width: '*'
                          //          }, 
                          //          {
                          //              text:'June 05, 2016',
                          //              style:'invoiceSubValue',
                          //              width: 100
                          //          }
                          //          ]
                          //  },
                       ]
                    }
                ],
            ],
        },
        // Billing Headers
        {
            columns: [
                {
                    text: 'Billing From',
                    style:'invoiceBillingTitle',
                    
                },
                {
                    text: 'Billing To',
                    style:'invoiceBillingTitle',
                    
                },
            ]
        },
        // Billing Details
        {
            columns: [
                {
                    text: 'Move up',
                    style: 'invoiceBillingDetails'
                },
                {
                    text: element.username,
                    style: 'invoiceBillingDetails'
                },
            ]
        },
        // Billing Address Title
        {
            columns: [
                {
                    text: 'Address',
                    style: 'invoiceBillingAddressTitle'
                },
                {
                    text: 'Address',
                    style: 'invoiceBillingAddressTitle'
                },
            ]
        },
        // Billing Address
        {
            columns: [
                {
                    text: 'Street 34 hbib bourgiba \n  tunis',
                    style: 'invoiceBillingAddress'
                },
                {
                    text: 'Street 34 hbib bourgiba \n  tunis',
                    style: 'invoiceBillingAddress'
                },
            ]
        },
          // Line breaks
        '\n\n',
        // Items
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ '*', 70 ],
      
              body: [
                // Table Header
                [ 
                    {
                        text: 'Element',
                        style: 'itemsHeader'
                    }, 
                    {
                        text: 'Details',
                        style: [ 'itemsHeader', 'center']
                    }, 
                    
                ],
                // Items
                // Item 1
                [ 
                    [
                        {
                            text: 'Feestructure',
                            style:'itemTitle'
                        },
                        
                    ], 
                    {
                        text:this.onefeestructure[0].name,
                        style:'itemNumber'
                    }, 
                    
                ],
                // Item 2
                [ 
                    [
                        {
                            text: 'Academic term',
                            style:'itemTitle'
                        }, 
                       
                    ], 
                    {
                        text:this.onefeestructure[0].academicterm.name,
                        style:'itemNumber'
                    }, 
                    
                
                ],
                [ 
                  [
                      {
                          text: 'Academic year',
                          style:'itemTitle'
                      }, 
                     
                  ], 
                  {
                      text:this.onefeestructure[0].academicyear.name,
                      style:'itemNumber'
                  }, 
               
              ],
              [ 
                [
                    {
                        text: 'Program',
                        style:'itemTitle'
                    }, 
                   
                ], 
                {
                    text:this.onefeestructure[0].programname.name,
                    style:'itemNumber'
                }, 
               
            ],
            [ 
              [
                  {
                      text: 'Amount',
                      style:'itemTitle'
                  }, 
                 
              ], 
              {
                  text:this.onefeestructure[0].amount +"TND",
                  style:'itemNumber'
              }, 
             
          ],
                // END Items
              ]
            }, // table
          //  layout: 'lightHorizontalLines'
          },
       // TOTAL
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              widths: [ '*', '*' ],
      
              body: [
               
                [ 
                    {
                        text:' Discount',
                        style:'itemsFooterSubTitle'
                    },
                    {
                        text: '20%',
                        style:'itemsFooterSubValue'
                    }
                ],
                [ 
                    {
                        text:'TOTAL',
                        style:'itemsFooterTotalTitle'
                    }, 
                    {
                        text: discount+" tnd",
                        style:'itemsFooterTotalValue'
                    }
                ],
              ]
            }, // table
            layout: 'lightHorizontalLines'
          },
        // Signature
        {
            columns: [
                {
                    text:'',
                },
                {
                    stack: [
                        { 
                            text: '_________________________________',
                            style:'signaturePlaceholder'
                        },
                        { 
                            text: 'Yassine ouni',
                            style:'signatureName'
                            
                        },
                        { 
                            text: 'accounting manager',
                            style:'signatureJobTitle'
                            
                        }
                        ],
                   width: 180
                },
            ]
        },
          { 
              text: 'NOTES',
              style:'notesTitle'
          },
          { 
              text: 'Please respect the rules \n Verify before the expiry date',
              style:'notesText'
          }
    ],
    styles: {
        // Document Header
        documentHeaderLeft: {
            fontSize: 10,
            margin: [5,5,5,5],
            alignment:'left'
        },
        documentHeaderCenter: {
            fontSize: 10,
            margin: [5,5,5,5],
            alignment:'center'
        },
        documentHeaderRight: {
            fontSize: 10,
            margin: [5,5,5,5],
            alignment:'right'
        },
        // Document Footer
        documentFooterLeft: {
            fontSize: 10,
            margin: [5,5,5,5],
            alignment:'left'
        },
        documentFooterCenter: {
            fontSize: 10,
            margin: [5,5,5,5],
            alignment:'center'
        },
        documentFooterRight: {
            fontSize: 10,
            margin: [5,5,5,5],
            alignment:'right'
        },
        // Invoice Title
      invoiceTitle: {
        fontSize: 22,
        bold: true,
        alignment:'right',
        margin:[0,0,0,15]
      },
      // Invoice Details
      invoiceSubTitle: {
        fontSize: 12,
        alignment:'right'
      },
      invoiceSubValue: {
        fontSize: 12,
        alignment:'right'
      },
      // Billing Headers
      invoiceBillingTitle: {
        fontSize: 14,
        bold: true,
        alignment:'left',
        margin:[0,20,0,5],
      },
      // Billing Details
      invoiceBillingDetails: {
        alignment:'left'
  
      },
      invoiceBillingAddressTitle: {
          margin: [0,7,0,3],
          bold: true
      },
      invoiceBillingAddress: {
          
      },
      // Items Header
      itemsHeader: {
          margin: [0,5,0,5],
          bold: true
      },
      // Item Title
      itemTitle: {
          bold: true,
      },
      itemSubTitle: {
              italics: true,
              fontSize: 11
      },
      itemNumber: {
          margin: [0,5,0,5],
          alignment: 'center',
      },
      itemTotal: {
          margin: [0,5,0,5],
          bold: true,
          alignment: 'center',
      },
  
      // Items Footer (Subtotal, Total, Tax, etc)
      itemsFooterSubTitle: {
          margin: [0,5,0,5],
          bold: true,
          alignment:'right',
      },
      itemsFooterSubValue: {
          margin: [0,5,0,5],
          bold: true,
          alignment:'center',
      },
      itemsFooterTotalTitle: {
          margin: [0,5,0,5],
          bold: true,
          alignment:'right',
      },
      itemsFooterTotalValue: {
          margin: [0,5,0,5],
          bold: true,
          alignment:'center',
      },
      signaturePlaceholder: {
          margin: [0,70,0,0],   
      },
      signatureName: {
          bold: true,
          alignment:'center',
      },
      signatureJobTitle: {
          italics: true,
          fontSize: 10,
          alignment:'center',
      },
      notesTitle: {
        fontSize: 10,
        bold: true,  
        margin: [0,50,0,3],
      },
      notesText: {
        fontSize: 10
      },
      center: {
          alignment:'center',
      },
    },
    defaultStyle: {
      columnGap: 20,
    }
  };
 
  pdfMake.createPdf(docDefinition).open();  
}  


}
