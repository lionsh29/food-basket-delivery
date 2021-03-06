import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { BusyService, AndFilter } from '@remult/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FilterBase } from '@remult/core';
import { Context } from '@remult/core';
import { DeliveryStatus } from '../families/DeliveryStatus';
import { ActiveFamilyDeliveries } from '../families/FamilyDeliveries';
import { ApplicationSettings } from '../manage/ApplicationSettings';
import { MatCheckboxChange } from '@angular/material/checkbox';


@Component({
  selector: 'app-select-family',
  templateUrl: './select-family.component.html',
  styleUrls: ['./select-family.component.scss']
})
export class SelectFamilyComponent implements OnInit {

  public args: {
    where: (f: ActiveFamilyDeliveries) => FilterBase,
    onSelect: (selectedValue: ActiveFamilyDeliveries[]) => void,
    selectStreet: boolean,
    distCenter: string,
    allowShowAll?: boolean
  };
  @ViewChild("search", { static: true }) search: ElementRef;
  constructor(private busy: BusyService, private dialogRef: MatDialogRef<any>, private context: Context, public settings: ApplicationSettings) { }
  searchString: string = '';
  families = this.context.for(ActiveFamilyDeliveries).gridSettings({ knowTotalRows: true });
  pageSize = 7;
  showAll = false;
  selectFirst() {

  }
  selected: ActiveFamilyDeliveries[] = [];
  countSelected() {
    return this.selected.length;
  }
  getSelected(f: ActiveFamilyDeliveries): hasSelectState {
    let x: any = f;
    let self = this;
    if (x.selectState === undefined) {
      x.selectState = {
        get selected() { return !!self.selected.find(y => y.id.value == f.id.value) },
        set selected(value: boolean) {
          if (DeliveryStatus.IsAResultStatus(f.deliverStatus.value))
            return;
          if (value)
            self.selected.push(f)
          else
            self.selected.splice(self.selected.findIndex(y => y.id.value == f.id.value), 1);

        }
      }
    }
    return x;

  }


  async doFilter() {
    await this.busy.donotWait(async () => this.getRows());
  }
  async getRows() {

    await this.families.get({
      where: f => {
        let result = f.filterDistCenterAndAllowed(this.args.distCenter);
        {
          let r = f.name.isContains(this.searchString);
          if (this.args.selectStreet)
            r = f.address.isContains(this.searchString);
          result = new AndFilter(result, r);
        }
        if (this.args.where && !this.showAll) {
          let x = this.args.where(f);
          if (x)
            return new AndFilter(result, x);
        }
        return result;
      },
      orderBy: f => f.name,
      limit: this.pageSize
    });


  }


  clearHelper() {
    this.dialogRef.close();
  }

  async doSelection() {
    if (this.selected.length > 0) {
      this.args.onSelect(this.selected);
    }
    else if (this.searchString && this.searchString.length > 0) {

      this.pageSize = 200;
      await this.getRows();

      this.args.onSelect(this.families.items);
    }

    this.dialogRef.close();

  }
  showStatus(f: ActiveFamilyDeliveries) {
    if (f.deliverStatus.value == DeliveryStatus.ReadyForDelivery) {
      if (f.courier.value) {
        return this.settings.lang.assignedToVolunteer + " " + f.courier.getValue();
      } else {
        return '';
      }
    }
    return f.deliverStatus.displayValue;
  }
  async ngOnInit() {
    this.busy.donotWait(async () =>
      await this.getRows());
    this.search.nativeElement.focus();
  }
  moreFamilies() {
    this.pageSize += 7;
    this.getRows();
  }


}

interface selected {
  selected: boolean;
}
interface hasSelectState {
  selectState: selected;
}