import { AfterViewInit, Component, OnInit, Renderer2, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import Player from '@vimeo/player';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})


export class HomeComponent implements OnInit, AfterViewInit {
  public currentScrollId: number = 2;
  public lastId: number = 2;
  videos = [
    { id: 242936757, title:'text1' },
    { id: 241874417, title:'text2' },
    { id: 198843122, title:'text3' },
    { id: 241874277, title:'text4' },
    { id: 241874256, title:'text5' },
    { id: 241873726, title:'text6' },
    // Add more video IDs as needed
  ];
  safeUrls: SafeResourceUrl[] = [];
  players: Player[] = [];
  @ViewChildren('vimeoIframe') iframes!: QueryList<ElementRef>;


  constructor(private renderer: Renderer2, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.videos.forEach(video => {
      this.safeUrls.push(this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.vimeo.com/video/${video.id}?autoplay=0&background=1&muted=1#t=5s`));
    });
  }

  ngAfterViewInit(): void {
    this.iframes.forEach((iframe, index) => {
      const player = new Player(iframe.nativeElement, {
        id: this.videos[index].id,
        background: true,
        muted: true,
        autoplay: false
      });
      this.players.push(player);

      this.renderer.listen(iframe.nativeElement, 'mouseenter', () => this.playVideo(index));
      this.renderer.listen(iframe.nativeElement, 'mouseleave', () => this.stopVideo(index));
    });

    let first = document.getElementById('container')?.firstChild as HTMLElement
    let last = document.getElementById('container')?.lastChild as HTMLElement;
    first!.classList.add('first');
    last!.classList.add('last');

  }

  playVideo(index: number): void {
    this.players[index].setVolume(0); // Ensure the video is muted
    this.players[index].play();
  }

  stopVideo(index: number): void {
    this.players[index].pause();
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
