import { Component, OnInit } from '@angular/core';
import { GridSettings } from 'radweb';
import { Projects, ProjectHelpers } from '../models';
import { AuthService } from '../auth/auth-service';
import { ProjectHelperItemsComponent } from '../project-helper-items/project-helper-items.component';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.scss']
})
export class MyProjectsComponent implements OnInit {

  projects = new GridSettings(new Projects(), {
    onNewRow: p => p.id.setToNewId()
  });

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.projects.getRecords();
  }
  getProjectHelper(p: Projects) {
    let ph = p.lookup(new ProjectHelpers(), ph => ph.helperId.isEqualTo(this.auth.auth.info.helperId).and(ph.projectId.isEqualTo(p.id.value)));
    if (ph.isNew()) {
      if (!ph.id.value) {
        ph.id.setToNewId();
      }
      ph.projectId.value = p.id.value;
      ph.helperId.value = this.auth.auth.info.helperId;
    }
    return ph;
  }
  saveAll( projectItems:ProjectHelperItemsComponent,p:Projects){
    this.getProjectHelper(p).save();
    projectItems.saveAll();
  }

}