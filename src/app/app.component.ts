import { Component } from "@angular/core";
import { PredictionConfig } from "./model/prediction-config";
import { PredictionResult } from "./model/prediction-result";
import { TranslateService } from "./services/translate.service";
import { Observable } from 'rxjs';
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  tranlationData: any;
  langArray: any = [];
  selectedLang: string = "de";
  private canCallAPI = true;
  public limitMessage :boolean = true;
  isTranslationAvailable :boolean = true;
  mar: any = [];
  hin: any = [];
  nl: any = [];
  de: any = [];
  fr: any = [];
  it: any = [];
  tr: any = [];
  pl: any = [];
  es: any = [];
  allVoices: any[];
  constructor(private translateService: TranslateService) {}
  data: PredictionConfig = {
    objectToDetect: "person",
    threshold: 0.7,
  };

  results: PredictionResult[] = [];

  ngOnInit() {
    this.langArray = [
      {
        name: "Dutch",
        code: "nl",
        lang: "nl-NL",
      },
      {
        name: "French",
        code: "fr",
        lang: "fr-FR",
      },
      {
        name: "German",
        code: "de",
        lang: "de-DE",
      },
      {
        name: "Hindi",
        code: "hin",
        lang: "hi-IN",
      },
      {
        name: "Italian",
        code: "it",
        lang: "it-IT",
      },
      {
        name: "Marathi",
        code: "mar",
        lang: "hi-IN",
      },
      {
        name: "Polish",
        code: "pl",
        lang: "pl-PL",
      },
      {
        name: "Spanish",
        code: "es",
        lang: "es-ES",
      },
      {
        name: "Turkis",
        code: "tr",
        lang: "tr-TR",
      },
    ];


    if (window.speechSynthesis) {
      if (speechSynthesis.onvoiceschanged !== undefined) {
        this.isTranslationAvailable = true;
        //Chrome gets the voices asynchronously so this is needed
         speechSynthesis.onvoiceschanged = this.getAllVoices;
      }
     this.getAllVoices(); //for all the other browsers
    }else{
      this.isTranslationAvailable = false;
    }
  }
   getAllVoices() {
    let voicesall = speechSynthesis.getVoices();
    let vuris = [];
    let voices = [];
    //unfortunately we have to check for duplicates
    voicesall.forEach(function(obj,index){
      let uri = obj.voiceURI;
      if (!vuris.includes(uri)){
          vuris.push(uri);
          voices.push(obj);
       }
    });
    voices.forEach(function(obj,index){obj.id = index;});
    this.allVoices = voices;
    return voices;
  }

  speakTranslation(translatedWord :string){
    let u = new SpeechSynthesisUtterance();
    let voices = this.getAllVoices();
    let lang = this.langArray.find((x) => x.code == this.selectedLang).lang;
    let index = voices.findIndex((x) => x.lang == lang);
    u.voice = voices[index];
     u.lang = u.voice.lang;
    u.text =translatedWord;
    u.rate = 0.8;
    speechSynthesis.speak(u);
  }

  handlePredictionChange(results: PredictionResult[]): void {
    let  filterArray = results.reduce((accumalator, current) => {
      if(!accumalator.some(item => item.translation === current.object)) {
        accumalator.push(current);
      }
      return accumalator;
  },[]);

    this.results = filterArray;
  }

  getTranslation(word, langArray) {
    this.canCallAPI = false;
    this.translateService
      .getTranslation(word, this.selectedLang)
      .subscribe((response) => {
          this.limitMessage = false;
          this.tranlationData = response.responseData;
          langArray.push({
            object: word,
            translation: this.tranlationData.translatedText,
          });
          this.canCallAPI = true;
          return this.tranlationData.translatedText;

      }),
      (err) => {
        this.limitMessage = true;
      }
  }

  addObject(langArray, word) {
    let index;
    let translation;
    if (!this.canCallAPI) {
      return false;
    }
    if (langArray.length) {
      index = langArray.findIndex((x) => x.object == word);
      if (index < 0) {
        translation = this.getTranslation(word, langArray);
      }
    } else {
      translation = this.getTranslation(word, langArray);
    }
    return translation;
  }

  showTranslation(word: string) {
    let translate;
    switch (this.selectedLang) {
      case "mar": {
        this.addObject(this.mar, word);
        if (this.mar && this.mar !== 'undefined' && this.mar.length)
          translate = this.mar.find((x) => x.object == word).translation;
        break;
      }
      case "hin": {
        this.addObject(this.hin, word);
        if (this.hin && this.hin !== 'undefined' &&  this.hin.length)
          translate = this.hin.find((x) => x.object == word).translation;
        break;
      }
      case "nl": {
        this.addObject(this.nl, word);
        if (this.nl && this.nl !== 'undefined' && this.nl.length)
           translate = this.nl.find((x) => x.object == word).translation;
        break;
      }
      case "de": {
        this.addObject(this.de, word);
        if (this.de && this.de !== 'undefined' && this.de.length)
          translate = this.de.find((x) => x.object == word).translation;
        break;
      }

      case "tr": {
        this.addObject(this.tr, word);
        if (this.tr && this.tr !== 'undefined' && this.tr.length)
          translate = this.tr.find((x) => x.object == word).translation;
        break;
      }

      case "pl": {
        this.addObject(this.pl, word);
        if (this.pl && this.pl !== 'undefined' && this.pl.length)
          translate = this.pl.find((x) => x.object == word).translation;
        break;
      }

      case "es": {
        this.addObject(this.es, word);
        if (this.es && this.es !== 'undefined' && this.es.length)
          translate = this.es.find((x) => x.object == word).translation;
        break;
      }
      default: {
        break;
      }
    }
    return translate;

    console.log(this.nl, "aaaaaaaaaaaaaaa");
  }
}
