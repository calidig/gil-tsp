import { Injectable } from '@angular/core'
import { LanguageConfig, LanguagesConfigs, Translation, TranslationModel } from '../models/translation-model'
import { Observable, Subject } from 'rxjs'
import { StorageService } from './storage.service'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  languagesConfigs: LanguagesConfigs = {
    en: {
      name: 'English',
      cfg: {
        type: 'ltr',
        lg: 'en'
      }
    },
    he: {
      name: 'Hebrew',
      cfg: {
        type: 'rtl',
        lg: 'he'
      }
    }
  }

  translationsDictionary
    : TranslationModel
    = {
    CoreAI: this.getConstTranslation('CoreAi'),
    admin: this.getConstTranslation('admin'),
    dashboard: {
      en: 'dashboard',
      he: 'לוּחַ מַחווָנִים'
    },
    start: {
      en: 'start',
      he: 'הַתחָלָה'
    },
    finish: {
      en: 'finish',
      he: 'סיים'
    },
    max_distance: {
      en: 'maximum distance for a route(km)',
      he: 'מרחק מקסימלי למסלול'
    },
    max_time: {
      en: 'maximum time for a route(hours)',
      he: 'זמן מקסימאלי למסלול'
    },
    stop: {
      en: 'stop',
      he: 'תפסיק'
    },
    language: {
      en: 'language',
      he: 'שפה'
    },
    closeMenu: {
      en: 'close menu',
      he: 'סגור תפריט'
    },
    login: {
      en: 'login',
      he: 'התחברות'
    },
    register: {
      en: 'register',
      he: 'להירשם'
    },
    logout: {
      en: 'logout',
      he: 'להתנתק'
    },
    password: {
      en: 'password',
      he: 'סיסמה'
    },
    confirmPassword: {
      en: 'confirm password',
      he: 'אשר סיסמה'
    },
    email: {
      en: 'email',
      he: 'אימייל'
    },
    name: {
      en: 'name',
      he: 'שֵׁם'
    },
    nameThisRouteSoYouCanFindIt: {
      en: 'Name this route so you can find it later',
      he: 'תן שם למסלול זה כדי שתוכל למצוא אותו מאוחר יותר'
    },
    firstName: {
      en: 'first name',
      he: 'שם פרטי'
    },
    homeAddressLabel: {
      en: 'Home address',
      he: 'כתובת בית'
    },
    lastName: {
      en: 'last name',
      he: 'שם משפחה'
    },
    username: {
      en: 'username',
      he: 'שם משתמש'
    },
    submit: {
      en: 'submit',
      he: 'שלח'
    },
    profile: {
      en: 'profile',
      he: 'פּרוֹפִיל'
    },
    dontHaveAnAccount: {
      en: 'Don\'t have an account?',
      he: 'אין לך חשבון?'
    },
    alreadyHaveAnAccount: {
      en: 'Already have an account?',
      he: 'כבר יש לך חשבון?'
    },
    notFound: {
      en: '404: Not Found',
      he: 'לא נמצא'
    },
    selectAlgorithm: {
      en: 'Select algorithm',
      he: 'בחר באלגוריתם'
    },
    genericAlgorithm: {
      en: 'Genetic algorithm',
      he: 'אלגוריתם גנטי'
    },
    optimal: {
      en: 'One Car',
      he: 'אוֹפְּטִימָלִי'
    },
    vrp: {
      en: 'Multiple cars',
      he: 'מכוניות מרובות'
    },
    fileType: {
      en: 'File Type',
      he: 'סוג קובץ'
    },
    csv: {
      en: 'CSV',
      he: 'CSV'
    },
    image: {
      en: 'Image',
      he: 'תמונה'
    },
    uploadFile: {
      en: 'Upload File',
      he: 'העלה קובץ'
    },
    browseCSV: {
      en: 'Browse',
      he: 'לְדַפדֵף'
    },
    startLocation: {
      en: 'Start Location: ',
      he: 'התחל מיקום: '
    },
    rememberLabel: {
      en: 'Remember depot location',
      he: 'זכור את מיקום המחסן'
    },
    settings: {
      en: 'settings',
      he: 'הגדרות'
    },
    next: {
      en: 'Next',
      he: 'הַבָּא'
    },
    formInvalid: {
      en: 'Form Invalid',
      he: 'הטופס לא חוקי'
    },
    findRoute: {
      en: 'Find route',
      he: 'מצא מסלול'
    },
    startDate: {
      en: 'Start Date',
      he: 'תאריך התחלה'
    },
    startTime: {
      en: 'Start Time',
      he: 'שעת התחלה'
    },
    home: {
      en: 'home',
      he: 'בית'
    },
    routes: {
      en: 'routes',
      he: 'בית'
    },
    pendingTasks: {
      en: 'pending Tasks',
      he: 'משימות ממתינות'
    },
    tasks: {
      en: 'tasks',
      he: 'משימות'
    },
    team: {
      en: 'team',
      he: 'בית'
    },
    newRoute: {
      en: 'New Route',
      he: 'בית'
    },
    menu: {
      en: 'menu',
      he: 'תַפרִיט'
    },
    nameInvalid: {
      en: 'invalid name',
      he: 'שם שגוי'
    },
    success: {
      en: 'success',
      he: 'הַצלָחָה'
    },
    add: {
      en: 'add',
      he: 'לְהוֹסִיף'
    },
    hours: {
      en: 'hours',
      he: 'שעה (ות'
    },
    minutes: {
      en: 'minutes',
      he: 'דקות'
    },
    save: {
      en: 'save',
      he: 'להציל'
    },
    saved: {
      en: 'saved',
      he: 'שמור'
    },
    eta: {
      en: 'ETA',
      he: 'ETA'
    },
    description: {
      en: 'description',
      he: 'תיאור'
    },
    carload: {
      en: 'Carload',
      he: 'עומס רכב'
    },
    car: {
      en: 'Car',
      he: 'אוטו'
    },
    nameThisRoute: {
      en: 'Name this route so you can recognize it later',
      he: 'תן שם למסלול זה כדי שתוכל לזהות אותו אחר כך'
    },
    carSizeLabel: {
      en: 'car size',
      he: 'גודל מכונית'
    },
    small: {
      en: 'small',
      he: 'קָטָן'
    },
    medium: {
      en: 'medium',
      he: 'בינוני'
    },
    large: {
      en: 'large',
      he: 'גָדוֹל'
    },
    place: {
      en: 'Place',
      he: 'מקום'
    },
    cluster: {
      en: 'Cluster',
      he: 'אֶשׁכּוֹל'
    },
    demand: {
      en: 'Demand',
      he: 'דרש'
    },
    phoneContact: {
      en: 'Phone Contact',
      he: 'איש קשר טלפוני'
    },
    timeInPoint: {
      en: 'Time in point',
      he: 'זמן נקודה'
    },
    isDriver: {
      en: 'Am I a driver?',
      he: 'האם אני נהג'
    },
    assignTo: {
      en: 'Assign to ',
      he: 'הקצה ל'
    },
    invalidKeyInCSV: {
      en: 'Invalid header in CSV: ',
      he: 'כותרת לא חוקית ב- CSV:'
    },
    formErrorRequired: {
      en: 'This field is required',
      he: 'שדה חובה'
    },
    date: {
      en: 'date',
      he: 'תַאֲרִיך'
    },
    status: {
      en: 'status',
      he: 'סטָטוּס'
    },
    actions: {
      en: 'actions',
      he: 'פעולות'
    },
    sortBy: {
      en: 'sort by',
      he: 'מיין לפי'
    },
    company: {
      en: 'company',
      he: 'חֶברָה'
    },
    delete: {
      en: 'delete',
      he: 'לִמְחוֹק'
    },
    cancel: {
      en: 'cancel',
      he: 'לְבַטֵל'
    },
    driver: {
      en: 'Driver',
      he: 'נהג'
    },
    isAvailable: {
      en: 'available',
      he: 'זמין'
    },
    view: {
      en: 'view',
      he: 'נוף'
    },
    direction: {
      en: 'Direction',
      he: 'כיוון'
    }
  }

  public activeLanguage: LanguageConfig
  private languageSubject = new Subject<LanguageConfig>()
  language$ = this.languageSubject.asObservable()

  constructor(private store: StorageService) {
    this.language$.subscribe(t => {
      console.log(t)
      this.activeLanguage = t
      document.dir = t.type
    })

    this.translationsDictionary = new Proxy(this.translationsDictionary, {
      get: (target, name: string) => target[name][this.activeLanguage?.lg]
    })
  }

  public setLanguage(lg: string): void {
    console.log('key lg: ', lg)
    const config = this.languagesConfigs[lg].cfg
    this.store.set$('lg', config).subscribe(() => this.languageSubject.next(config))
  }

  public load(): Observable<any> {
    console.log('load language')
    return this.store.get$('lg').pipe(map((cfg: LanguageConfig) => this.languageSubject.next(cfg || this.languagesConfigs.en.cfg)))
  }

  private getConstTranslation(word): Translation {
    return {
      en: word,
      he: word
    }
  }
}
