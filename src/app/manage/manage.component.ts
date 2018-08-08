import { Component, OnInit } from '@angular/core';
import { BasketType, FamilySources, ApplicationSettings, ApplicationImages } from '../models';
import { GridSettings } from 'radweb';
import { SelectService } from '../select-popup/select-service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  basketType = new GridSettings(new BasketType(), {
    columnSettings: x => [
      x.name
    ],
    allowUpdate: true,
    allowInsert: true,
    allowDelete: true,
    confirmDelete: (h, yes) => this.dialog.confirmDelete(h.name.value, yes)
  });
  sources = new GridSettings(new FamilySources(), {
    columnSettings: s => [
      s.name,
      s.phone,
      s.contactPerson
    ], allowUpdate: true,
    allowInsert: true,
    allowDelete: true,
    confirmDelete: (h, yes) => this.dialog.confirmDelete(h.name.value, yes)
  });
  settings = new GridSettings(new ApplicationSettings(), {
    numOfColumnsInGrid: 0,
    allowUpdate: true,
    columnSettings: s => [
      s.organisationName,
      s.logoUrl


    ]

  });
  images = new GridSettings(new ApplicationImages(), {
    numOfColumnsInGrid: 0,
    allowUpdate:true,
    columnSettings: i => [
      i.base64Icon,
      i.base64PhoneHomeImage

    ]
  });
  constructor(private dialog: SelectService) { }

  ngOnInit() {
    this.settings.getRecords();
    this.images.getRecords();
  }

}
