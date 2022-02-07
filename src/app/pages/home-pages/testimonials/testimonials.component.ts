import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  settings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: false,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          arrows: false,
          slidesToShow: 2
        }
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          slidesToShow: 1
        }
      }
    ]
  }

  testimonials=[
  {
        "id": 1,
        "author": [
            1
        ],
        "rating": 5,
        "client": [
            1
        ],
        "comment": "Sed ut perspicia unde omnis natus error sit volupt accusantium doloremque laudantium totam rem aperiam eaque quae"
    },
    {
        "id": 2,
        "author": [
            2
        ],
        "rating": 5,
        "client": [
            2
        ],
        "comment": "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae conse quatur vellum rem"
    },
    {
        "id": 3,
        "author": [
            3
        ],
        "rating": 4,
        "client": [
            3
        ],
        "comment": "On the other hand denounce with righteous indignation dislike men who are so beguiled and demoralized by charms"
    },
    {
        "id": 4,
        "author": [
            4
        ],
        "rating": 4,
        "client": [
            4
        ],
        "comment": "Sed ut perspicia unde omnis natus error sit volupt accusantium doloremque laudantium totam rem aperiam eaque quae"
    },
    {
        "id": 5,
        "author": [
            5
        ],
        "rating": 4,
        "client": [
            5
        ],
        "comment": "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae conse quatur vellum rem"
    },
    {
        "id": 6,
        "author": [
            7
        ],
        "rating": 3,
        "client": [
            6
        ],
        "comment": "On the other hand denounce with righteous indignation dislike men who are so beguiled and demoralized by charms"
    }
]
images = [
  { path: '../../../../assets/profs/prof.jpg' },
  { path: '../../../../assets/profs/prof2.jpg' },
  { path: '../../../../assets/profs/prof3.jpg' },
  { path: '../../../../assets/profs/prof4.jpg' },
  { path: '../../../../assets/profs/prof5.jpg' },
  { path: '../../../../assets/profs/prof6.jpg' },
  { path: '../../../../assets/profs/prof7.jpg' },
  { path: '../../../../assets/profs/prof8.jpg' },
]

}
