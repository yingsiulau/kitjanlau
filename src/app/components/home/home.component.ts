import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CanvasBoxComponent } from '../canvas-box/canvas-box.component';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CanvasBoxComponent, MaterialModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})


export class HomeComponent implements AfterViewInit {
  public currentScrollId: number = 2;
  public lastId: number = 2;

  ngAfterViewInit(): void {
    let first = document.getElementById('container')?.firstChild as HTMLElement
    let last = document.getElementById('container')?.lastChild as HTMLElement;
    first!.classList.add('first');
    last!.classList.add('last');

  }

  public scroll(amount: number): void {
    let nextId = this.currentScrollId + amount;
    console.log(nextId);

    if (nextId !== 1 && nextId !== 5) {
      this.currentScrollId = this.currentScrollId + amount;
      document.getElementById(this.currentScrollId.toString())?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }
}
