import { Component } from "@angular/core";
import { PredictionConfig } from "./model/prediction-config";
import { PredictionResult } from "./model/prediction-result";
import { TranslateService } from "./services/translate.service";

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
  mar: any = [];
  hin: any = [];
  nl: any = [];
  de: any = [];
  fr: any = [];
  it: any = [];
  tr: any = [];
  pl: any = [];
  es: any = [];
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
        lang: "nl",
      },
      {
        name: "French",
        code: "fr",
        lang: "fr",
      },
      {
        name: "German",
        code: "de",
        lang: "de",
      },
      {
        name: "Hindi",
        code: "hin",
        lang: "hi",
      },
      {
        name: "Italian",
        code: "it",
        lang: "it",
      },
      {
        name: "Marathi",
        code: "mar",
        lang: "hi",
      },
      {
        name: "Polish",
        code: "pl",
        lang: "pl",
      },
      {
        name: "Spanish",
        code: "es",
        lang: "es",
      },
      {
        name: "Turkis",
        code: "tr",
        lang: "tr",
      },
    ];
  }

  handlePredictionChange(results: PredictionResult[]): void {
    let  filterArray = results.reduce((accumalator, current) => {
      if(!accumalator.some(item => item.object === current.object)) {
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
        this.tranlationData = response.responseData;
        langArray.push({
          object: word,
          translation: this.tranlationData.translatedText,
        });
        this.canCallAPI = true;
        return this.tranlationData.translatedText;
      });
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
    return translation || 'loading...';
  }

  showTranslation(word: string) {
    let translate;
    switch (this.selectedLang) {
      case "mar": {
        this.addObject(this.mar, word);
        if (this.mar && this.mar !== 'undefine' && this.mar.length)
          translate = this.mar.find((x) => x.object == word).translation;
        break;
      }
      case "hin": {
        this.addObject(this.hin, word);
        if (this.hin && this.hin !== 'undefine' &&  this.hin.length)
          translate = this.hin.find((x) => x.object == word).translation;
        break;
      }
      case "nl": {
        this.addObject(this.nl, word);
        if (this.nl && this.nl !== 'undefine' && this.nl.length)
           translate = this.nl.find((x) => x.object == word).translation;
        break;
      }
      case "de": {
        this.addObject(this.de, word);
        if (this.de && this.de !== 'undefine' && this.de.length)
          translate = this.de.find((x) => x.object == word).translation;
        break;
      }

      case "tr": {
        this.addObject(this.tr, word);
        if (this.tr && this.tr !== 'undefine' && this.tr.length)
          translate = this.tr.find((x) => x.object == word).translation;
        break;
      }

      case "pl": {
        this.addObject(this.pl, word);
        if (this.pl && this.pl !== 'undefine' && this.pl.length)
          translate = this.pl.find((x) => x.object == word).translation;
        break;
      }

      case "es": {
        this.addObject(this.es, word);
        if (this.es && this.es !== 'undefine' && this.es.length)
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
