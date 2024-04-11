import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute } from '@angular/router';
import { EmailConfirmationPageService } from './services/email-confirmation.page.service';

@UntilDestroy()
@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrl: './email-confirmation.component.scss',
  providers: [EmailConfirmationPageService],
})
export class EmailConfirmationComponent implements OnInit {
  userId!: string;
  token!: string;
  confirmationSuccess$ = this.emailConfirmationPageService.emailConfirmed$;

  constructor(
    private route: ActivatedRoute,
    private emailConfirmationPageService: EmailConfirmationPageService,
  ) {}

  ngOnInit() {
    this.route.queryParams.pipe(untilDestroyed(this)).subscribe((params) => {
      this.userId = params['userId'];
      this.token = params['token'];

      if (this.userId && this.token) {
        this.emailConfirmationPageService.confirmEmail(this.userId, this.token);
      }
    });
  }
}
