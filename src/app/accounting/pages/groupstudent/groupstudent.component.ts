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
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
pdfMake.vfs = pdfFonts.pdfMake.vfs; 

@Component({
  selector: 'app-groupstudent',
  templateUrl: './groupstudent.component.html',
  styleUrls: ['./groupstudent.component.css']
})
export class GroupstudentComponent implements OnInit{
  feeStructures: [] = [];
  filterVal: string = '';
  searchNotifier = new Subject();
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
    this.searchNotifier
    .pipe(debounceTime(500))
    .subscribe((data) =>
      this.getStudentsGroup()
        
    );
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
    this.groupstudentService.getGroupStudentsbyname(this.filterVal).subscribe(
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
    this.createForm()
    this.clrModalOpen3= false;
  }
  closeModal() {
    this.createForm1();
    this.dataSource = new MatTableDataSource([]);
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

getBase64ImageFromURL(url) {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = error => {
      reject(error);
    };
    img.src = url;
  });
}



//Generate pdf 
async generateFacture(element:any) {  

  let discount = this.onefeestructure[0].amount - (this.onefeestructure[0].amount*20 / 100)
  let docDefinition = {  
    
    
    content: [
        // Header
        {
            columns: [
                {
                      image: await this.getBase64ImageFromURL(
                        "../../assets/eunoia-logo.png"
                      ),
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
