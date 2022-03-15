import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-work-process',
  templateUrl: './work-process.component.html',
  styleUrls: ['./work-process.component.css']
})
export class WorkProcessComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
 workprocess= [
    {

        "id":1,
        "icon":"assets/img/feature/flaticon-headphones.png",
        "title":"Vidéos",
        "text":"Les Vidéos : cours | correction d’exercices et des devoirs Enregistrement des séances en directs.",
        "boxstyle":"exclusive-iconic-box-1"
    },
    {
        "id":2,
        "icon":"assets/img/feature/flaticon-share.png",
        "title":"Offres",
        "text":"Nous proposons des offres trés intéressants comme les abonnements: élémentaire, standard, avancé                    ",
        "boxstyle":"exclusive-iconic-box-2"
    },
    {
        "id":3,
        "icon":"assets/img/feature/flaticon-chatting.png",
        "title":"Conseils",
        "text":"vous trouverez les conseils et les instructions les plus importants nécessaires pour atteindre le succès",
        "boxstyle":"exclusive-iconic-box-3"
    },
    {
        "id":4,
        "icon":"assets/img/feature/flaticon-satisfaction.png",
        "title":"professionnalisme",
        "text":"les enseignants ont toutes les qualités requises pour assurer un enseignement efficace, performant et attractif",
        "boxstyle":"exclusive-iconic-box-4"
    }
]
}
