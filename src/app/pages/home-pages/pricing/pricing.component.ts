import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  plans=[
    {
        "id":1,
        "planclass":"starter-plan",
        "plantitle":"Abonnement élimentaire",
        "icon":"assets/img/pricing/pricing-table-icon.png",

        "includes":[
            "video des cours",
            "Exercies et corrigés ",
            "Toutes les matières"
        ],

        "btnstyle":"single-heading-tag"
    },
    {
        "id":2,
        "planclass":"professional-plan",
        "plantitle":"Abonnement avancé",
        "icon":"assets/img/pricing/pricing-table-icon.png",

        "includes":[
          "video des cours",
          "Exercies et corrigés ",
          "Toutes les matières",
            "Enregistrement séances en direct ",
            "Seances en direct",
            "Révision fin d'année (BAC)"
        ],
        "excludes":[],
        "btnstyle":"single-heading-tag"
    },
    {
        "id":3,
        "planclass":"premium-plan",
        "plantitle":"Abonnement Standard",
        "icon":"assets/img/pricing/pricing-table-icon.png",
        "price":99.25,
        "period":"Monthly",
        "includes":[
          "video des cours",
          "Exercies et corrigés ",
          "Toutes les matières",
            "Enregistrement séances en direct ",
            "Révision fin d'année (BAC)"
        ],
        "excludes":[],
        "btnstyle":"single-heading-tag"
    }
]
}
