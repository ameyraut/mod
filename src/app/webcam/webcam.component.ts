import { Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as coco from '@tensorflow-models/coco-ssd';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { PredictionType } from '../model/prediction-type';
import { PredictionResult } from '../model/prediction-result';
import { Prediction } from '../model/prediction';

import confetti from 'canvas-confetti';
import { findLast } from '@angular/compiler/src/directive_resolver';

const SNAPSHOT_INTERVAL =1000;

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.scss']
})
export class WebcamComponent implements OnInit {

  @Input() predictionThreshold: number;
  @Input() objectToPredict: PredictionType;
  @Output() predictionChange = new EventEmitter<PredictionResult[]>();
  @ViewChild('canvas', {read: ElementRef, static: false}) canvas: ElementRef<any>;
  webcamImage: WebcamImage;
  predictions: Prediction[] = [];

  private trigger: Subject<void> = new Subject<void>();
  private model: any;
  private found = false;
  public viewPortWidth: number = 480;
  public showSpinner: boolean = true;
  public isCocoLoaded: boolean;
  ngOnInit(): void {
    this.getViewPortWidth();
    // For debugging purposes
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) =>{
        console.log('Detected devices:', mediaDevices)
        this.showSpinner = false;
      } );

    // Load CocoSsd model
    coco.load()
      .then((model) =>{
        this.model = model;
        console.log( this.model,'model loaded');
        this.isCocoLoaded = true;
      })
      .catch((err) => {
        console.log('Cannot load model', err);
        this.isCocoLoaded = true;
      });

    // Render predictions for snapshots, based on the provided model
    this.trigger.subscribe(() => {
      if (this.webcamImage && this.webcamImage.imageData && this.model) {
        this.model.detect(this.webcamImage.imageData)
          .then(predictions => {
            this.renderPredictions(predictions);
            this.predictions = predictions;

            const results = this.mapPredictionsToResults(predictions);
            this.emitResults(results);
          });
      }
    });

    // Snapshot interval
    setInterval(() => this.trigger.next(), SNAPSHOT_INTERVAL);
  }

  public getViewPortWidth() {
  this.viewPortWidth = window.innerWidth;
}

  error(error: WebcamInitError): void {
    console.error('Cannot initialize:', error);
  }

  capture(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }


  isCocoLoadCompletd(){
     return !this.isCocoLoaded;
  }


  /**
   * Emit prediction results to listeners.
   * @param results
   */
  private emitResults(results): void {
    if (!this.found) {
      console.log('prediction', results);
      this.predictionChange.emit(results);
    }
  }

  private mapPredictionsToResults(predictions): PredictionResult[] {
    return predictions.map(p => (
      {
        correct: p.score > this.predictionThreshold
          && p.class === this.objectToPredict,
        object: p.class,
        certainty: p.score
      }
    ));
  }

  private renderPredictions(predictions: any): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    predictions.forEach(prediction => {

      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];

      const text =  prediction['class'] + ' - ' + (prediction['score']*100).toFixed(0) + '%';

      const  color = 'green';
      ctx.strokeStyle = color;
      ctx.font = '18px Arial';
      ctx.fillStyle = color;

      ctx.beginPath();
        ctx.globalAlpha = 0.7;
        ctx.fillRect(x,y,width,18);
        ctx.fillStyle = 'white';
        ctx.fillText(text,x+3,y+14);
        ctx.rect(x,y,width,height);
        ctx.stroke();
    });
  }
}
