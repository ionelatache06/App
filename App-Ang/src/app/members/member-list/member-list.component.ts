import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user' 
import { UserService } from '../../_services/user.service'
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];
  user: User = JSON.parse(localStorage.getItem('user'));
  typeList = [
    { value: 'startup', display: 'Startups' },
    { value: 'investor', display: 'Investors' }
  ];
  userParams: any = {};
  pagination: Pagination;

  constructor( private userService: UserService, private alertify: AlertifyService, 
                private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data =>{
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
      console.log(this.pagination.currentPage);
    });

    this.userParams.type = this.user.type === 'startup' ? 'investor' : 'startup';
}

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  resetFilters(){
    this.userParams.type = this.user.type === 'startup' ? 'investor': 'startup';
    this.reset();
  }

  reset() {
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage)
        .subscribe((res: PaginatedResult<User[]>) => {
      this.users = res.result;
      this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    });
    this.clearUserParams(); 
  }

  clearUserParams(){
    this.userParams.country = null;
    this.userParams.city = null;
  }

  loadUsers() {
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
        .subscribe((res: PaginatedResult<User[]>) => {
      this.users = res.result;
      this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }
}