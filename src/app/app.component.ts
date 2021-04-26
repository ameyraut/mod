import { Component } from "@angular/core";
import { PredictionConfig } from "./model/prediction-config";
import { PredictionResult } from "./model/prediction-result";
import { TranslateService } from "./services/translate.service";
import { Observable } from "rxjs";
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
  public limitMessage: boolean = false;
  isTranslationAvailable: boolean = true;
  mar: any = [];
  hin: any = [];
  nl: any = [];
  de: any = [];
  fr: any = [];
  it: any = [];
  tr: any = [];
  pl: any = [];
  es: any = [];
  allVoices: any;
  setlangIndex: number = 0;
  showSpinner: boolean = true;
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
        code: 12,
        lang: "nl",
      },
      {
        name: "French",
        code: 6,
        lang: "fr",
      },
      {
        name: "German",
        code: 0,
        lang: "de",
      },
      {
        name: "Hindi",
        code: 7,
        lang: "hi",
      },
      {
        name: "Italian",
        code: 9,
        lang: "it",
      },
      {
        name: "Marathi",
        code: 7,
        lang: "mar",
      },
      {
        name: "Polish",
        code: 13,
        lang: "pl",
      },
      {
        name: "Spanish",
        code: 4,
        lang: "es",
      },
      // {
      //   name: "Turkis",
      //   code: "tr",
      //   lang: "tr-TR",
      // },
    ];

    if (window.speechSynthesis) {
      if (speechSynthesis.onvoiceschanged !== undefined) {
        this.isTranslationAvailable = true;
        //Chrome gets the voices asynchronously so this is needed
        speechSynthesis.onvoiceschanged = this.getAllVoices;
        this.showSpinner = false;
      }
      this.getAllVoices(); //for all the other browsers
    } else {
      this.isTranslationAvailable = false;
      this.showSpinner = false;
    }
  }

  getAllVoices() {
    let voicesall = speechSynthesis.getVoices();
    let vuris = [];
    let voices = [];
    //unfortunately we have to check for duplicates
    voicesall.forEach(function (obj, index) {
      let uri = obj.voiceURI;
      if (!vuris.includes(uri)) {
        vuris.push(uri);
        voices.push(obj);
      }
    });
    voices.forEach(function (obj, index) {
      obj.id = index;
    });
    this.allVoices = voices;
    console.log(this.allVoices, " voices");
    this.showSpinner = false;
  }

  speakTranslation(translatedWord: string) {
    if (this.allVoices && this.allVoices.length) {
      let u = new SpeechSynthesisUtterance();
      u.voice = this.allVoices[this.setlangIndex];
      u.lang = u.voice.lang;
      u.text = translatedWord;
      u.rate = 0.8;
      speechSynthesis.speak(u);
      console.log(u, " uuuuuuuuu");
    } else {
      this.getAllVoices();
    }
  }

  getIndex(lang) {
    return this.allVoices.findIndex((x) => x.lang == lang.lang);
  }
  handlePredictionChange(results: PredictionResult[]): void {
    let filterArray = results.reduce((accumalator, current) => {
      if (!accumalator.some((item) => item.translation === current.object)) {
        accumalator.push(current);
      }
      return accumalator;
    }, []);

    this.results = filterArray;
  }

  setLang(event) {
    this.setlangIndex = event.target.value;
    const selectEl = event.target;
    this.selectedLang = selectEl.options[selectEl.selectedIndex].getAttribute(
      "data-lang"
    );
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
      };
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
        if (this.mar && this.mar !== "undefined" && this.mar.length)
          translate = this.mar.find((x) => x.object == word).translation;
        break;
      }
      case "hin": {
        this.addObject(this.hin, word);
        if (this.hin && this.hin !== "undefined" && this.hin.length)
          translate = this.hin.find((x) => x.object == word).translation;
        break;
      }
      case "nl": {
        this.addObject(this.nl, word);
        if (this.nl && this.nl !== "undefined" && this.nl.length)
          translate = this.nl.find((x) => x.object == word).translation;
        break;
      }
      case "de": {
        this.addObject(this.de, word);
        if (this.de && this.de !== "undefined" && this.de.length)
          translate = this.de.find((x) => x.object == word).translation;
        break;
      }

      case "tr": {
        this.addObject(this.tr, word);
        if (this.tr && this.tr !== "undefined" && this.tr.length)
          translate = this.tr.find((x) => x.object == word).translation;
        break;
      }

      case "it": {
        this.addObject(this.it, word);
        if (this.it && this.it !== "undefined" && this.tr.length)
          translate = this.it.find((x) => x.object == word).translation;
        break;
      }

      case "pl": {
        this.addObject(this.pl, word);
        if (this.pl && this.pl !== "undefined" && this.pl.length)
          translate = this.pl.find((x) => x.object == word).translation;
        break;
      }

      case "es": {
        this.addObject(this.es, word);
        if (this.es && this.es !== "undefined" && this.es.length)
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
