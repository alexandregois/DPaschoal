import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrls: ['./financeiro.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinanceiroComponent {
  tabIndex = 0;
  isActive: boolean = true;
  ngOnInit(): void {
    var data = localStorage.getItem('dataEmAberto');
    if (data) this.isActive = true;
  }

  changeFinancialTab(event: any) {
    this.tabIndex = event.index;
  }
}
