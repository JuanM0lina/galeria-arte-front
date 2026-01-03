import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { Navbar } from './components/navbar/navbar';

interface Cloud {
  id: number;
  src: string;
  top: number;
  size: number;
  duration: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  clouds: Cloud[] = [];
  readonly CLOUD_COUNT = 8;
  private id = 0;

  ngOnInit() {
    this.initClouds();
  }

  initClouds() {
    this.clouds = Array.from({ length: this.CLOUD_COUNT }, () =>
      this.createCloud()
    );
  }

  createCloud(): Cloud {
    return {
      id: this.id++,
      src: 'assets/cloud1.png',
      top: this.random(5, 50),
      size: this.random(150, 350),
      duration: this.random(40, 80)
    };
  }

  trackCloud(_: number, cloud: Cloud) {
    return cloud.id;
  }

  recycleCloud(index: number) {
    this.clouds[index] = this.createCloud();
  }

  random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
}
