import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
@Injectable({
  providedIn: "root",
})
export class TranslateService {
  constructor(private http: HttpClient) {}

  getTranslation(text: string, lang: string) {
     return this.http.get<any>(`https://api.mymemory.translated.net/get?q=${text}&langpair=en|${lang}` );
  }
}
