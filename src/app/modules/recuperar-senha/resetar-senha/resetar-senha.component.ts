import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-resetar-senha',
  templateUrl: './resetar-senha.component.html',
})
export class ResetarSenhaComponent {
  password: string = '';
  confirmPassword: string = '';

  constructor(private http: HttpClient) {}

  resetarSenha() {
    if (this.password !== this.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    const headers = new HttpHeaders({
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6IkpXVCJ9.eyJyb2xlIjoiUkVTRVRfUEFTU1dPUkQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJlZHNvbjkwQGdtYWlsLmNvbSIsIm5iZiI6MTY5NzA1NDI4OSwiZXhwIjoxNjk3MTQwNjg5LCJpYXQiOjE2OTcwNTQyODksImlzcyI6Imh0dHBzOi8vYXBpbS1wb3J0YWxrZC1kZXYuYXp1cmUtYXBpLm5ldC9henVyZS1hZCIsImF1ZCI6Imh0dHBzOi8vYXBpbS1wb3J0YWxrZC1kZXYuYXp1cmUtYXBpLm5ldC9henVyZS1hZCJ9.BYcs_YkgA7D0n6L_waesEhYNnttC2_RjLUOhavczIRw',
      'Content-Type': 'application/json',
      'x-portal': 'DPK',
    });

    const body = {
      Password: this.password,
      ConfirmPassword: this.confirmPassword,
    };

    this.http
      .put(
        'https://apim-portalkd-dev.azure-api.net/azure-ad/api/account/reset-password',
        body,
        { headers: headers }
      )
      .subscribe(
        (response) => {
          alert('Senha redefinida com sucesso!');
        },
        (error) => {
          alert('Erro ao redefinir a senha. Por favor, tente novamente.');
        }
      );
  }
}
