/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import {
  MapPin, Phone, Clock, ChevronRight, Star, Instagram, Facebook, Music,
  UtensilsCrossed, Wine, Quote, X, Calendar, Users, CalendarCheck, GlassWater, Trash2, ChevronLeft
} from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { db, handleFirestoreError, OperationType } from "./lib/firebase";
import {
  deleteDoc, doc, getDoc, collection, runTransaction, serverTimestamp,
  getDocs, query, orderBy, onSnapshot, writeBatch
} from "firebase/firestore";

const CAPACITIES: Record<string, number> = {
  hall: 30,
  garden: 70,
  bar: 25
};
const OWNER_PHONE = "089 637 0777";

// Carousel images
const hallImages = {
  main: [
    "https://i.postimg.cc/L5CsGMys/IMG-0694(1).jpg",
    "https://i.postimg.cc/Gt7p61Mc/IMG-0692(1).jpg",
    "https://i.postimg.cc/2SX4hsmH/viber-izobrazenie-2026-05-19-19-25-06-204.jpg",
    "https://i.postimg.cc/t4mhWKp9/viber-izobrazenie-2026-05-19-19-25-05-878.jpg",
    "https://i.postimg.cc/HLcb26ks/IMG-0693(1).jpg",
    "https://i.postimg.cc/R06wRgZ1/IMG-0691-(1)(1).jpg",
    "https://i.postimg.cc/0NM7fVyS/IMG-0689(1).jpg"
  ],
  garden: [
    "https://i.postimg.cc/nLjqk3hZ/viber-izobrazenie-2026-05-19-19-25-06-188.jpg",
    "https://i.postimg.cc/2yc5gfHN/viber-izobrazenie-2026-05-19-19-25-06-583.jpg",
    "https://i.postimg.cc/nrRLNtdt/viber-izobrazenie-2026-05-19-19-25-05-071.jpg",
    "https://i.postimg.cc/g2Bv8CmY/viber-izobrazenie-2026-05-19-19-25-06-145.jpg",
    "https://i.postimg.cc/GmSkGWr7/viber-izobrazenie-2026-05-19-19-25-04-931.jpg"
  ],
  bar: [
    "https://i.postimg.cc/DyGPRRLm/20260520-165035.jpg",
    "https://i.postimg.cc/hGZmX0T5/20260520-164838.jpg",
    "https://i.postimg.cc/bvVnZRkM/20260520-164919.jpg",
    "https://i.postimg.cc/8CXv7bLc/20260520-164943.jpg",
    "https://i.postimg.cc/nLSmX1qX/20260520-165159.jpg",
    "https://i.postimg.cc/pT9FznBW/20260520-165903.jpg",
    "https://i.postimg.cc/k4VbKtyG/20260520-165916.jpg"
  ]
};

// All gallery images (unique)
const allGalleryImages = [
  ...hallImages.main,
  ...hallImages.garden,
  ...hallImages.bar,
  "https://i.postimg.cc/HkPQXqH6/viber-izobrazenie-2026-05-19-19-25-04-890.jpg",
  "https://i.postimg.cc/Z5DrpGZV/viber-izobrazenie-2026-05-19-19-25-04-913.jpg",
  "https://i.postimg.cc/6qjQFNHJ/viber-izobrazenie-2026-05-19-19-25-05-010.jpg",
  "https://i.postimg.cc/nrRLNt3y/viber-izobrazenie-2026-05-19-19-25-05-042.jpg",
  "https://i.postimg.cc/s2Q5cTgz/viber-izobrazenie-2026-05-19-19-25-06-651.jpg",
  "https://i.postimg.cc/MGM1D9pW/viber-izobrazenie-2026-05-19-19-25-06-774.jpg",
  "https://i.postimg.cc/Cx6jk3Sh/viber-izobrazenie-2026-05-19-19-25-06-168.jpg",
  "https://i.postimg.cc/Pqp14S5L/IMG-0695(1).jpg"
];

const LANGUAGES = {
  BG: {
    nav: ["Начало", "Меню", "Зали", "Атмосфера", "Галерия", "Отзиви"],
    subtitle: "Plovdiv · От 2012",
    heroTag: "Tomato Пловдив",
    heroTitle1: "Естетично",
    heroTitle2: "Бижу",
    heroDesc: "Скрито в историческото сърце на Пловдив, Tomato е мястото, където майсторски приготвените вкусове срещат душевния ритъм на джаза. Добре дошли в Tomato",
    viewMenu: "Виж Менюто",
    bookNow: "Резервирай",
    langNameBG: "Български",
    langNameEN: "English",
    privateRoomTitle: "Нашите Пространства",
    privateRoomHeader: "Зали",
    halls: [
      {
        id: "main",
        name: "Основна зала",
        desc: "Добре дошли в нашата основна зала, където уютът среща изтънчения вкус. Със своя капацитет от 30 места, залата е перфектното място както за споделена вечеря с любими хора, така е и за организирани тържества. Интериорът умело съчетава очарованието на старинния стил с изчистения модерен дизайн. Живият огън на камината внася топлина и домашна атмосфера, а селектираната тиха джаз музика допълва усещането за спокойствие и уединение. Тук времето забавя своя ход, за да се насладите изцяло на момента.",
        features: ["30 места", "Жива камина", "Джаз атмосфера"]
      },
      {
        id: "garden",
        name: "Градина",
        desc: "Нашата градина е истински оазис сред шума на града. Със своите 70 места, тя предлага тишина и свежест през топлите летни вечери. Пространството може да се затваря в студени дни, за да се поддържа приятна атмосфера. Зеленината и дискретното осветление създават приказна обстановка за романтична вечеря или спокойна среща с приятели. Това е нашата зала за пушачи.",
        features: ["70 места", "Свежа растителност", "Дискретно осветление"]
      },
      {
        id: "bar",
        name: "Бар",
        desc: "Нашият бар е пулсиращото сърце на Tomato, където изкуството на коктейлите среща джаз ритъма. Капацитетът на бара е 25 места, проектирани за перфектна близост и уединение край селекцията от премиум напитки. Тук нашите майстори бармани ще ви предложат уникални авторски коктейли и редки питиета, поднесени с много стил. Динамичната атмосфера край бар-плота, приглушеното осветление и приятните разговори правят това перфектното място за завършек на деня или начало на вълнуваща вечер.",
        features: ["25 места", "Авторски коктейли", "Премиум уиски селекция"]
      }
    ],
    privateRoomDesc: "Нашата градина е истински оазис сред шума на града. Идеалното пространство за тези, които ценят спокойния разговор и свежия въздух в уютна джаз обстановка.",
    privateRoomFeatures: ["70 места", "Свежа растителност", "Дискретно осветление"],
    vipAtmosphere: [
      {
        title: "Кехлибарен Сияние",
        desc: "Ръчно подбрани винтидж нишки на фона на суров бетон, които задават ритъма на вечерта.",
        image: "https://i.postimg.cc/HkPQXqH6/viber-izobrazenie-2026-05-19-19-25-04-890.jpg"
      },
      {
        title: "Вътрешното Светилище",
        desc: "Тухлени стени и топлината на камината срещат престижа на пълното уединение.",
        image: "https://i.postimg.cc/2SX4hsmH/viber-izobrazenie-2026-05-19-19-25-06-204.jpg"
      },
      {
        title: "Джаз Настроение",
        desc: "Пространство, където музиката и светлината се сливат в едно изживяване.",
        image: "https://i.postimg.cc/s2Q5cTgz/viber-izobrazenie-2026-05-19-19-25-06-651.jpg"
      }
    ],
    fullMenuTitle: "Цялата колекция",
    vipMenuTitle: "Предложения на Бара",
    vipPackages: [
      {
        name: "Ексклузивни Плата",
        items: [
          { name: "Дегустационно меню 'Tomato'", price: "45€", info: "Петстепенно авторско изживяване за ценители" },
          { name: "Селекция отлежали сирена", price: "25€", info: "Подбрани от местни бутикови ферми" },
          { name: "Плато за ценители", price: "35€", info: "Комбинация от премиум мезета и специален хляб" }
        ]
      },
      {
        name: "Напитки Премиум",
        items: [
          { name: "Винена дегустация", price: "35€", info: "Три редки реколти от долината на Марица" },
          { name: "Селекция малцово уиски", price: "55€", info: "За истинските познавачи (3х30 мл)" },
          { name: "Авторски коктейл Бар", price: "12€", info: "Специално приготвен за вашето събитие" }
        ]
      }
    ],
    menuHeader: "Нашето Меню",
    galleryTitle: "Визуални истории",
    gallerySubtitle: "Уловени Моменти",
    galleryDesc: "Поглед към естетичната атмосфера и майсторските кулинарни творения в Tomato.",
    vibeTitle: "Атмосфера",
    vibeQuote: "Където вкусът среща душата",
    vibeDesc: "При нас ще откриете тиха, приятна и релаксираща музика от различни стилове (jazz, lounge, soulful house и други), перфектно допълваща нашето изискано меню. Всеки детайл, от приглушеното златно осветление до избора на селектирани ритми, е подбран, за да ви отведе в свят на абсолютен комфорт и удоволствие.",
    vibeLabels: { vibe: "Вайб", music: "Музика", vibeVal: "Изискан и емоционален", musicVal: "Jazz, Lounge, Soulful House" },
    vibeRhythm: "Ритъмът на Пловдив",
    reviewTitle: "Истории от наши гости",
    reviewHeader: "Отзиви",
    visitTitle: "Посетете ни",
    visitHeader: "В сърцето на Пловдив",
    addressLabel: "Адрес",
    addressValue: "ул. \"Йоаким Груев\" 21, 4000 Център, Пловдив",
    resLabel: "Резервации",
    workingHoursTitle: "Работно време",
    workingHoursWeek: "Пон - Пет: 08:00 - 23:00",
    workingHoursSat: "Събота: 16:00 - 21:00",
    workingHoursSun: "Неделя: Почивен ден",
    summerHoursAnnouncement: "очаквайте лятно работно време",
    directions: "Упътване",
    locationTag: "Бижуто на Капана",
    locationDesc: "Намираме се в историческото ядро на Пловдив. Последвайте ритъма на пианото до нашата врата.",
    bookingTitle: "Резервация",
    bookingHeader: "Запазете маса",
    nameLabel: "Вашето име",
    namePlaceholder: "Иван Иванов",
    phoneLabel: "Телефон",
    phonePlaceholder: "+359...",
    guestsLabel: "Гости",
    guestsOptions: ["2 души", "3 души", "4 души", "5+ души"],
    dateTimeLabel: "Дата и Час",
    confirmRes: "Потвърди резервацията",
    locationHall: "Зала",
    locationGarden: "Градина",
    locationBar: "Бар",
    onlineResStat: "Вземете 10% отстъпка за резервации през сайта!",
    reservationsTab: "Резервации",
    resPasswordLabel: "Парола за достъп",
    resPasswordPlaceholder: "Въведете парола",
    resAuthError: "Грешна парола",
    resListTitle: "Списък Резервации",
    resListEmpty: "Няма направени резервации",
    resListGuests: "гости",
    resDelete: "Изтрий",
    resNote: "Ще ви се обадим скоро за потвърждение на вашата маса.",
    footerContact: "Контакт и Резервации",
    footerCopyright: "© 2026 Tomato · Естетичен ресторант Пловдив",
    footerBuild: "Създадено чрез AI Studio Build",
    footerRights: "Всички права запазени",
    scroll: "Надолу",
    spotifyPlaylist: "Spotify Плейлист",
    fullMenu: [
      {
        title: "Напитки",
        categories: [
          {
            name: "Напитки с кафе, мляко и чай",
            items: [
              { name: "Кафе Lavazza", price: "1,99€", info: "60 мл" },
              { name: "Кафе без кофеин", price: "2,50€", info: "60 мл" },
              { name: "Капучино", price: "2,60€", info: "130 мл" },
              { name: "Кафе Лате", price: "2,60€", info: "220 мл" },
              { name: "Макиато", price: "1,99€", info: "60 мл" },
              { name: "Виенско кафе", price: "2,60€", info: "80 мл" },
              { name: "Кафе фрапе черно/бяло", price: "2,60€", info: "200 мл" },
              { name: "Кафе Фредо", price: "2,60€", info: "200 мл" },
              { name: "Ирландско кафе", price: "5,50€", info: "120 мл" },
              { name: "Мляко с инстантно кафе", price: "2,60€", info: "160 мл" },
              { name: "Мляко с мед и канела", price: "2,60€", info: "160 мл" },
              { name: "Мляко с какао", price: "2,60€", info: "160 мл" },
              { name: "Фрапе какао", price: "2,60€", info: "200 мл" },
              { name: "Горещ шоколад", price: "2,99€", info: "160 мл" },
              { name: "Чай Ронефелд", price: "2,20€", info: "200 мл /билков, горски плодове, зелен, черен/" }
            ]
          },
          {
            name: "Безалкохолни напитки",
            items: [
              { name: "Coca Cola продукти", price: "1,99€", info: "250 мл" },
              { name: "Soda Schweppes", price: "1,99€", info: "250 мл" },
              { name: "Натурален сок", price: "2,60€", info: "250 мл" },
              { name: "Минерална вода Девин", price: "1,50€", info: "400 мл" },
              { name: "Минерална вода Девин", price: "2,60€", info: "1,2 л" },
              { name: "Red Bull", price: "3,60€", info: "250 мл" },
              { name: "Фреш", price: "3,20€", info: "300 мл /портокал, грейпфрут/" },
              { name: "Шейкове", price: "3,20€", info: "300 мл /млечен, шоколадов/" },
              { name: "Лимонади", price: "3,20€", info: "300 мл" }
            ]
          },
          {
            name: "Бира и Сайдери",
            items: [
              { name: "Шуменско", price: "1,99€", info: "330 мл" },
              { name: "Шуменско", price: "2,50€", info: "500 мл" },
              { name: "Карлсберг наливна", price: "3,40€", info: "330 мл" },
              { name: "Карлсберг наливна", price: "3,90€", info: "500 мл" },
              { name: "Карлсберг 0.0%", price: "3,40€", info: "330 мл" },
              { name: "Kloster Weiss / Gold", price: "4,20€", info: "500 мл" },
              { name: "Berliner Kindl", price: "4,20€", info: "500 мл" }
            ]
          },
          {
            name: "Коктейли",
            items: [
              { name: "Mojito", price: "4,99€", info: "200 мл" },
              { name: "Margarita", price: "4,99€", info: "150 мл" },
              { name: "Long Island Ice Tea", price: "4,99€", info: "300 мл" },
              { name: "Aperol Spritz", price: "4,99€", info: "350 мл" },
              { name: "Pink Zu", price: "4,99€", info: "350 мл" },
              { name: "Bloody Bison", price: "4,99€", info: "200 мл" },
              { name: "Bison Smash", price: "4,99€", info: "150 мл" }
            ]
          },
          {
            name: "Уиски",
            items: [
              { name: "Jameson", price: "3,40€", info: "50 мл" },
              { name: "Glenfiddich Single Malt 12 y.o.", price: "6,90€", info: "50 мл" },
              { name: "Johnnie Walker 12 y.o.", price: "5,90€", info: "50 мл" },
              { name: "Jack Daniels", price: "4,60€", info: "50 мл" },
              { name: "Jim Beam", price: "3,40€", info: "50 мл" }
            ]
          },
          {
            name: "Други алкохолни",
            items: [
              { name: "Reyka Водка", price: "4,60€", info: "50 мл" },
              { name: "Finlandia Водка", price: "2,50€", info: "50 мл" },
              { name: "Bombay Sapphire Джин", price: "3,40€", info: "50 мл" },
              { name: "Beefeater Джин", price: "2,50€", info: "50 мл" },
              { name: "Bacardi Superior Ром", price: "2,50€", info: "50 мл" },
              { name: "Jose Cuervo Текила", price: "1,90€", info: "30 мл" }
            ]
          },
          {
            name: "Вермути, Ликьори и Коняк",
            items: [
              { name: "Martini /Extra Dry, Bianco/", price: "1,90€", info: "50 мл" },
              { name: "Baileys", price: "2,90€", info: "50 мл" },
              { name: "Limonchelo", price: "2,90€", info: "50 мл" },
              { name: "Jagermeister", price: "2,90€", info: "50 мл" },
              { name: "Metaxa ***", price: "2,90€", info: "50 мл" }
            ]
          },
          {
            name: "Аперитиви и Ракии",
            items: [
              { name: "Стралджанска Мускатова Барел", price: "3,00€", info: "50 мл" },
              { name: "Стралджанска Мускатова Ракия", price: "2,70€", info: "50 мл" },
              { name: "Сливенска перла Барел", price: "3,00€", info: "50 мл" },
              { name: "Сливенска перла", price: "2,70€", info: "50 мл" },
              { name: "Пещерска отлична ракия", price: "1,50€", info: "50 мл" },
              { name: "Ракия 'Наше лозе'", price: "1,50€", info: "50 мл" },
              { name: "Карловска мускатова", price: "2,00€", info: "50 мл" },
              { name: "Сръбска дюлева ракия", price: "3,00€", info: "50 мл" },
              { name: "Сръбска крушева ракия", price: "3,00€", info: "50 мл" },
              { name: "Ouzo", price: "2,00€", info: "50 мл" },
              { name: "Pernod", price: "2,70€", info: "50 мл" }
            ]
          }
        ]
      },
      {
        title: "Меню Кухня",
        categories: [
          {
            name: "Салати",
            items: [
              { name: "Салата със скариди, авокадо и манго", price: "11,00€", info: "300 гр" },
              { name: "Салата с риба тон", price: "8,50€", info: "300 гр" },
              { name: "Салата с червено цвекло и синьо сирене", price: "9,50€", info: "300 гр /печена тиква, круши, орехи/" },
              { name: "Средиземноморска салата с моцарела", price: "7,50€", info: "300 гр" },
              { name: "Селска салата с гриловани зеленчуци", price: "7,00€", info: "300 гр" },
              { name: "Салата Мешалале", price: "7,00€", info: "300 гр" },
              { name: "Салата 'Цезар' с пиле и бекон", price: "8,70€", info: "300 гр" },
              { name: "Салата с гриловани домати и моцарела", price: "7,70€", info: "300 гр" }
            ]
          },
          {
            name: "BBQ",
            items: [
              { name: "BBQ дъска за 1 човек", price: "10,00€", info: "250 гр" },
              { name: "BBQ дъска за 2 души", price: "20,00€", info: "500 гр" },
              { name: "BBQ дъска за 4 души", price: "40,00€", info: "1,5 кг" },
              { name: "Нашите три кюфтета", price: "8,50€", info: "300 гр /със салца и картофи/" },
              { name: "Свински ребра", price: "13,50€", info: "450 гр" },
              { name: "Телешка наденица", price: "8,50€", info: "300 гр" },
              { name: "Адана кебап", price: "9,50€", info: "300 гр" },
              { name: "Свински шиш кебап", price: "8,50€", info: "350 гр" },
              { name: "Наденички Чоризо", price: "9,50€", info: "250 гр" },
              { name: "Телешки бон филенца с гъбен сос", price: "20,00€", info: "300 гр" }
            ]
          },
          {
            name: "Рибни и Вегетариански",
            items: [
              { name: "Филе от лаврак на тиган", price: "19,00€", info: "300 гр" },
              { name: "Филе от сьомга BBQ", price: "19,00€", info: "300 гр" },
              { name: "Ризото с пиле и гъби", price: "9,00€", info: "300 гр" },
              { name: "Паста със скариди и чери домати", price: "11,00€", info: "300 гр /бейби спанак/" },
              { name: "Паста с гриловани зеленчуци", price: "8,00€", info: "300 гр /босилек/" }
            ]
          }
        ]
      }
    ],
    gallery: allGalleryImages.map(url => ({ url, title: "Tomato" })),
    reviews: [
      {
        name: "Чефо",
        source: "Германия",
        text: "Идвам от Германия, за да посетя Пловдив, и ядох една от най-добрите вечери в живота си тук. Близо до центъра, на много тихо място, където наистина можете да се насладите на храната си.",
        rating: 5
      },
      {
        name: "Данаил Ангелов",
        source: "Local Guide",
        text: "Прекрасно и естетично бижу, скрито в сърцето на Пловдив. Атмосферата е уникална и жива. Сервитьорът беше много любезен, а храната е една от най-добрите, които ще опитате в града.",
        rating: 5
      },
      {
        name: "Валентин Генев",
        source: "Local Guide",
        text: "Храната беше много добра, но кюфтетата бяха направо невероятни! Наистина се постараха да ни накарат да се чувстваме комфортно и добре дошли.",
        rating: 5
      }
    ],
    quote: "Естетично бижу, скрито в сърцето на Пловдив."
  },
  EN: {
    nav: ["Home", "Menu", "Halls", "Vibe", "Gallery", "Reviews"],
    subtitle: "Plovdiv · Since 2012",
    heroTag: "Tomato Plovdiv",
    heroTitle1: "Aesthetic",
    heroTitle2: "Gem",
    heroDesc: "Hidden in the heart of Plovdiv, Tomato is where masterfully cooked flavors meet the soulful rhythm of jazz.",
    viewMenu: "View Menu",
    bookNow: "Book Now",
    langNameBG: "Bulgarian",
    langNameEN: "English",
    privateRoomTitle: "Our Spaces",
    privateRoomHeader: "Halls",
    halls: [
      {
        id: "main",
        name: "Main Hall",
        desc: "Welcome to our main hall, where comfort meets refined taste. With a capacity of 30 seats, the hall is the perfect place for both a shared dinner with loved ones and organized celebrations. The interior skillfully combines the charm of vintage style with clean modern design. The living fire of the fireplace brings warmth and a homey atmosphere, while the selected quiet jazz music completes the feeling of peace and privacy. Here, time slows down so you can fully enjoy the moment.",
        features: ["30 Seats", "Live Fireplace", "Jazz Vibe"]
      },
      {
        id: "garden",
        name: "Garden",
        desc: "Our garden is a true oasis amidst the city noise. With its 70 seats, it offers peace and freshness during warm summer evenings. The space can be enclosed during colder days to maintain a pleasant atmosphere. The greenery and discrete lighting create a fairytale setting for a romantic dinner or a quiet gathering. This is our smoking area.",
        features: ["70 Seats", "Lush Greenery", "Mood Lighting"]
      },
      {
        id: "bar",
        name: "Bar",
        desc: "Our bar is the pulsing heart of Tomato, where the art of mixology meets the jazz rhythm. The bar capacity is 25 seats, designed for perfect closeness and privacy around our premium drink selection. Here, our master bartenders will offer you unique signature cocktails and rare spirits, served with style. The dynamic atmosphere, dim golden lighting, and engaging conversations make it the perfect spot to end your day or kickstart an exciting evening.",
        features: ["25 Seats", "Signature Cocktails", "Premium Spirits"]
      }
    ],
    privateRoomDesc: "Our garden is a true oasis amidst the city noise. The perfect space for those who appreciate quiet conversation and fresh air in a cozy jazz environment.",
    privateRoomFeatures: ["70 Seats", "Lush Greenery", "Mood Lighting"],
    vipAtmosphere: [
      {
        title: "Amber Glow",
        desc: "Hand-selected vintage filaments against a raw concrete ceiling, setting a sophisticated jazz mood.",
        image: "https://i.postimg.cc/HkPQXqH6/viber-izobrazenie-2026-05-19-19-25-04-890.jpg"
      },
      {
        title: "The Inner Sanctum",
        desc: "Brick walls and fireplace warmth meet the rhythm of silence and prestige.",
        image: "https://i.postimg.cc/2SX4hsmH/viber-izobrazenie-2026-05-19-19-25-06-204.jpg"
      },
      {
        title: "Jazz Reverie",
        desc: "A space where music and light merge into a single, immersive experience.",
        image: "https://i.postimg.cc/s2Q5cTgz/viber-izobrazenie-2026-05-19-19-25-06-651.jpg"
      }
    ],
    fullMenuTitle: "The Full Collection",
    vipMenuTitle: "Bar Offers",
    vipPackages: [
      {
        name: "Exclusive Platters",
        items: [
          { name: "'Tomato' Tasting Menu", price: "45€", info: "Five-course signature experience for connoisseurs" },
          { name: "Aged Cheese Selection", price: "25€", info: "Sourced from local boutique farms" },
          { name: "Connoisseur Platter", price: "35€", info: "Premium charcuterie and artisan bread combo" }
        ]
      },
      {
        name: "Premium Sips",
        items: [
          { name: "Wine Flight", price: "35€", info: "Three rare vintages from the Maritsa Valley" },
          { name: "Malt Whiskey Selection", price: "55€", info: "For true aficionados (3x30 ml)" },
          { name: "Signature Bar Cocktail", price: "12€", info: "Specially crafted for your event" }
        ]
      }
    ],
    menuHeader: "Our Menu",
    galleryTitle: "Visual Stories",
    gallerySubtitle: "Captured Moments",
    galleryDesc: "A glimpse into the aesthetic atmosphere and masterful culinary creations at Tomato.",
    vibeTitle: "Atmosphere",
    vibeQuote: "Where Taste Meets Soul",
    vibeDesc: "Here you will find quiet, pleasant, and relaxing music from various styles (jazz, lounge, soulful house, and others), perfectly complementing our exquisite menu. Every detail, from the dim golden lighting to the choice of selected rhythms, is curated to bring you a world of ultimate comfort and pleasure.",
    vibeLabels: { vibe: "Vibe", music: "Music", vibeVal: "Sophisticated & Moody", musicVal: "Jazz, Lounge, Soulful House" },
    vibeRhythm: "The Rhythm of Plovdiv",
    reviewTitle: "Stories from Guests",
    reviewHeader: "Reviews",
    visitTitle: "Visit Us",
    visitHeader: "In the Heart of Plovdiv",
    addressLabel: "Address",
    addressValue: "21 Yoakim Gruev St, 4000 Center, Plovdiv",
    resLabel: "Reservations",
    workingHoursTitle: "Working Hours",
    workingHoursWeek: "Mon - Fri: 8:00 AM - 11:00 PM",
    workingHoursSat: "Saturday: 4:00 PM - 9:00 PM",
    workingHoursSun: "Sunday: Closed",
    summerHoursAnnouncement: "summer working hours coming soon",
    directions: "Get Directions",
    locationTag: "Kapana Gem",
    locationDesc: "We are nestled in the historic core of Plovdiv. Follow the rhythm of the piano to our door.",
    bookingTitle: "Booking",
    bookingHeader: "Reserve your table",
    nameLabel: "Your Name",
    namePlaceholder: "John Doe",
    phoneLabel: "Phone Number",
    phonePlaceholder: "+1...",
    guestsLabel: "Guests",
    guestsOptions: ["2 People", "3 People", "4 People", "5+ People"],
    dateTimeLabel: "Date & Time",
    confirmRes: "Confirm Reservation",
    locationHall: "Main Hall",
    locationGarden: "Garden",
    locationBar: "Bar",
    onlineResStat: "Get 10% OFF for reservations made through the website!",
    reservationsTab: "Reservations",
    resPasswordLabel: "Access Password",
    resPasswordPlaceholder: "Enter password",
    resAuthError: "Incorrect password",
    resListTitle: "Reservations List",
    resListEmpty: "No reservations found",
    resListGuests: "guests",
    resDelete: "Delete",
    resNote: "We will call you back shortly to confirm your table.",
    footerContact: "Contact & Bookings",
    footerCopyright: "© 2026 Tomato · Aesthetic Restaurant Plovdiv",
    footerBuild: "Created with AI Studio Build",
    footerRights: "All Rights Reserved",
    scroll: "Scroll",
    spotifyPlaylist: "Spotify Playlist",
    fullMenu: [
      {
        title: "Drinks",
        categories: [
          {
            name: "Coffee, Milk & Tea",
            items: [
              { name: "Lavazza Coffee", price: "1,99€", info: "60 ml" },
              { name: "Decaf Coffee", price: "2,50€", info: "60 ml" },
              { name: "Cappuccino", price: "2,60€", info: "130 ml" },
              { name: "Caffe Latte", price: "2,60€", info: "220 ml" },
              { name: "Macchiato", price: "1,99€", info: "60 ml" },
              { name: "Viennese Coffee", price: "2,60€", info: "80 ml" },
              { name: "Frape Black/White", price: "2,60€", info: "200 ml" },
              { name: "Freddo Coffee", price: "2,60€", info: "200 ml" },
              { name: "Irish Coffee", price: "5,50€", info: "120 ml" },
              { name: "Instant Coffee with Milk", price: "2,60€", info: "160 ml" },
              { name: "Milk with Honey & Cinnamon", price: "2,60€", info: "160 ml" },
              { name: "Milk with Cocoa", price: "2,60€", info: "160 ml" },
              { name: "Cocoa Frape", price: "2,60€", info: "200 ml" },
              { name: "Hot Chocolate", price: "2,99€", info: "160 ml" },
              { name: "Ronnefeldt Tea", price: "2,20€", info: "200 ml /Herbal, Forest Fruit, Green, Black/" }
            ]
          },
          {
            name: "Soft Drinks",
            items: [
              { name: "Coca Cola Products", price: "1,99€", info: "250 ml" },
              { name: "Soda Schweppes", price: "1,99€", info: "250 ml" },
              { name: "Fruit Juice", price: "2,60€", info: "250 ml" },
              { name: "Mineral Water Devin", price: "1,50€", info: "400 ml" },
              { name: "Mineral Water Devin", price: "2,60€", info: "1.2 L" },
              { name: "Red Bull", price: "3,60€", info: "250 ml" },
              { name: "Fresh Juice", price: "3,20€", info: "300 ml /Orange, Grapefruit/" },
              { name: "Shakes", price: "3,20€", info: "300 ml /Milk, Chocolate/" },
              { name: "Lemonades", price: "3,20€", info: "300 ml" }
            ]
          },
          {
            name: "Beer & Ciders",
            items: [
              { name: "Shumensko", price: "1,99€", info: "330 ml" },
              { name: "Shumensko", price: "2,50€", info: "500 ml" },
              { name: "Carlsberg Draught", price: "3,40€", info: "330 ml" },
              { name: "Carlsberg Draught", price: "3,90€", info: "500 ml" },
              { name: "Carlsberg 0.0%", price: "3,40€", info: "330 ml" },
              { name: "Kloster Weiss / Gold", price: "4,20€", info: "500 ml" },
              { name: "Berliner Kindl", price: "4,20€", info: "500 ml" }
            ]
          },
          {
            name: "Cocktails",
            items: [
              { name: "Mojito", price: "4,99€", info: "200 ml" },
              { name: "Margarita", price: "4,99€", info: "150 ml" },
              { name: "Long Island Ice Tea", price: "4,99€", info: "300 ml" },
              { name: "Aperol Spritz", price: "4,99€", info: "350 ml" },
              { name: "Pink Zu", price: "4,99€", info: "350 ml" },
              { name: "Bloody Bison", price: "4,99€", info: "200 ml" },
              { name: "Bison Smash", price: "4,99€", info: "150 ml" }
            ]
          },
          {
            name: "Whiskey",
            items: [
              { name: "Jameson", price: "3,40€", info: "50 ml" },
              { name: "Glenfiddich Single Malt 12 y.o.", price: "6,90€", info: "50 ml" },
              { name: "Johnnie Walker 12 y.o.", price: "5,90€", info: "50 ml" },
              { name: "Jack Daniels", price: "4,60€", info: "50 ml" },
              { name: "Jim Beam", price: "3,40€", info: "50 ml" }
            ]
          },
          {
            name: "Other Spirits",
            items: [
              { name: "Reyka Vodka", price: "4,60€", info: "50 ml" },
              { name: "Finlandia Vodka", price: "2,50€", info: "50 ml" },
              { name: "Bombay Sapphire Gin", price: "3,40€", info: "50 ml" },
              { name: "Beefeater Gin", price: "2,50€", info: "50 ml" },
              { name: "Bacardi Superior Rum", price: "2,50€", info: "50 ml" },
              { name: "Jose Cuervo Tequila", price: "1,90€", info: "30 ml" }
            ]
          },
          {
            name: "Vermouth, Liqueurs & Cognac",
            items: [
              { name: "Martini /Extra Dry, Bianco/", price: "1,90€", info: "50 ml" },
              { name: "Baileys", price: "2,90€", info: "50 ml" },
              { name: "Limonchelo", price: "2,90€", info: "50 ml" },
              { name: "Jagermeister", price: "2,90€", info: "50 ml" },
              { name: "Metaxa ***", price: "2,90€", info: "50 ml" }
            ]
          },
          {
            name: "Aperitifs & Rakia",
            items: [
              { name: "Straldzhanaka Muscat Barrel", price: "3,00€", info: "50 ml" },
              { name: "Straldzhanaka Muscat Rakia", price: "2,70€", info: "50 ml" },
              { name: "Slivenska Perla Barrel", price: "3,00€", info: "50 ml" },
              { name: "Slivenska Perla", price: "2,70€", info: "50 ml" },
              { name: "Peshtoverska Rakia", price: "1,50€", info: "50 ml" },
              { name: "Rakia 'Nashe Loze'", price: "1,50€", info: "50 ml" },
              { name: "Karlovska Muscat", price: "2,00€", info: "50 ml" },
              { name: "Serbian Quince Rakia", price: "3,00€", info: "50 ml" },
              { name: "Serbian Pear Rakia", price: "3,00€", info: "50 ml" },
              { name: "Ouzo", price: "2,00€", info: "50 ml" },
              { name: "Pernod", price: "2,70€", info: "50 ml" }
            ]
          }
        ]
      },
      {
        title: "Kitchen Menu",
        categories: [
          {
            name: "Salads",
            items: [
              { name: "Shrimp, Avocado & Mango Salad", price: "11,00€", info: "300 g" },
              { name: "Tuna Salad", price: "8,50€", info: "300 g" },
              { name: "Beetroot & Blue Cheese Salad", price: "9,50€", info: "300 g /Baked Pumpkin, Pears, Walnuts/" },
              { name: "Mediterranean Mozzarella Salad", price: "7,50€", info: "300 g" },
              { name: "Village Salad with Grilled Veggies", price: "7,00€", info: "300 g" },
              { name: "Meshalale Salad", price: "7,00€", info: "300 g" },
              { name: "Chicken & Bacon Caesar", price: "8,70€", info: "300 g" },
              { name: "Grilled Tomato & Mozzarella Salad", price: "7,70€", info: "300 g" }
            ]
          },
          {
            name: "BBQ",
            items: [
              { name: "BBQ Board for 1", price: "10,00€", info: "250 g" },
              { name: "BBQ Board for 2", price: "20,00€", info: "500 g" },
              { name: "BBQ Board for 4", price: "40,00€", info: "1.5 kg" },
              { name: "Our Three Meatballs", price: "8,50€", info: "300 g /with salsa and potatoes/" },
              { name: "Pork Ribs", price: "13,50€", info: "450 g" },
              { name: "Beef Sausage", price: "8,50€", info: "300 g" },
              { name: "Adana Kebab", price: "9,50€", info: "300 g" },
              { name: "Pork Shish Kebab", price: "8,50€", info: "350 g" },
              { name: "Chorizo Sausages", price: "9,50€", info: "250 g" },
              { name: "Beef Fillet with Mushroom Sauce", price: "20,00€", info: "300 g" }
            ]
          },
          {
            name: "Fish & Vegetarian",
            items: [
              { name: "Pan-Seared Sea Bass", price: "19,00€", info: "300 g" },
              { name: "BBQ Salmon Fillet", price: "19,00€", info: "300 g" },
              { name: "Chicken & Mushroom Risotto", price: "9,00€", info: "300 g" },
              { name: "Shrimp & Cherry Tomato Pasta", price: "11,00€", info: "300 g /baby spinach/" },
              { name: "Grilled Veggie & Basil Pasta", price: "8,00€", info: "300 g /basil/" }
            ]
          }
        ]
      }
    ],
    gallery: allGalleryImages.map(url => ({ url, title: "Tomato" })),
    reviews: [
      {
        name: "Chefo",
        source: "Germany",
        text: "I came from Germany to visit Plovdiv and had one of the best meals in my life here. Close to the center, in a very quiet place where you can really enjoy your food.",
        rating: 5
      },
      {
        name: "Danail Angelov",
        source: "Local Guide",
        text: "A beautiful and aesthetic gem hidden in the heart of Plovdiv. The atmosphere is unique and lively. The waiter was very kind and the food is one of the best you will try in the city.",
        rating: 5
      },
      {
        name: "Valentin Genev",
        source: "Local Guide",
        text: "The food was very good, but the meatballs were simply amazing! They really tried to make us feel comfortable and welcome.",
        rating: 5
      }
    ],
    quote: "An aesthetic gem, hidden in the heart of Plovdiv."
  }
};

const NAV_LINKS_MAP: Record<string, string> = {
  "Начало": "home",
  "Меню": "menu",
  "Зали": "private-room",
  "Атмосфера": "vibe",
  "Галерия": "gallery",
  "Отзиви": "reviews",
  "Home": "home",
  "Menu": "menu",
  "Halls": "private-room",
  "Vibe": "vibe",
  "Gallery": "gallery",
  "Reviews": "reviews"
};

export default function App() {
  const [lang, setLang] = useState<"BG" | "EN">("BG");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [overlayView, setOverlayView] = useState<"none" | "full-menu" | "gallery" | "reservations">("none");
  const [menuSection, setMenuSection] = useState<"drinks" | "food">("drinks");
  const [scrolled, setScrolled] = useState(false);
  const [selectedHall, setSelectedHall] = useState<"main" | "garden" | "bar">("main");
  const [hallIndex, setHallIndex] = useState<Record<string, number>>({
    main: 0,
    garden: 0,
    bar: 0
  });

  // Admin Reservations State
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminAuthError, setAdminAuthError] = useState(false);
  const [allReservations, setAllReservations] = useState<any[]>([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);

  // Booking System State
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split("T")[0]);
  const [bookingTime, setBookingTime] = useState("19:00");
  const [bookingLocation, setBookingLocation] = useState<"hall" | "garden" | "bar">("hall");
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingGuests, setBookingGuests] = useState("2");
  const [availableSpots, setAvailableSpots] = useState<number | null>(null);
  const [liveSpots, setLiveSpots] = useState<Record<string, number | null>>({
    hall: null,
    garden: null,
    bar: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const cleanupExpiredReservations = useCallback(async (reservations: any[]) => {
    const now = new Date();
    const toDelete = reservations.filter(res => {
      try {
        const [year, month, day] = res.date.split("-").map(Number);
        const [hour, min] = res.time.split(":").map(Number);
        const resTime = new Date(year, month - 1, day, hour, min);
        const expireTime = new Date(resTime.getTime() + 30 * 60000);
        return now > expireTime;
      } catch (e) {
        return false;
      }
    });

    for (const res of toDelete) {
      try {
        await deleteDoc(doc(db, "reservations", res.id));
        // Also update daily capacity for that reservation's slots (optional, but good)
        const dayRef = doc(db, "daily_capacity", res.date);
        const daySnap = await getDoc(dayRef);
        if (daySnap.exists()) {
          const slotsKey = `slots_${res.location}`;
          const currentSlots = daySnap.data()[slotsKey] || {};
          if (currentSlots[res.time]) {
            const newSlots = { ...currentSlots };
            newSlots[res.time] = Math.max(0, (newSlots[res.time] || 0) - res.guests);
            await updateDoc(dayRef, { [slotsKey]: newSlots });
          }
        }
      } catch (e) {
        console.error("Cleanup error:", e);
      }
    }
  }, []);

  const t = LANGUAGES[lang];

  const getTimeSlotsForDate = useCallback((dateString: string) => {
    if (!dateString) return [];
    const date = new Date(dateString);
    const day = date.getDay();

    if (day === 0) return [];

    if (day >= 1 && day <= 5) {
      const slots = [];
      for (let h = 8; h <= 22; h++) {
        slots.push(`${h.toString().padStart(2, "0")}:00`);
        slots.push(`${h.toString().padStart(2, "0")}:30`);
      }
      slots.push("23:00");
      return slots;
    }

    if (day === 6) {
      const slots = [];
      for (let h = 16; h <= 20; h++) {
        slots.push(`${h.toString().padStart(2, "0")}:00`);
        slots.push(`${h.toString().padStart(2, "0")}:30`);
      }
      slots.push("21:00");
      return slots;
    }

    return [];
  }, []);

  const fetchCapacityForDateTime = useCallback(async (date: string, time: string, location: "hall" | "garden" | "bar", setTarget: (val: number) => void) => {
    if (!date || !time) return;

    try {
      const dayRef = doc(db, "daily_capacity", date);
      const daySnap = await getDoc(dayRef);

      let spots = CAPACITIES[location];
      if (daySnap.exists()) {
        const slotsKey = `slots_${location}`;
        const slots = daySnap.data()[slotsKey] || {};
        const bookedAtTime = slots[time] || 0;
        spots = CAPACITIES[location] - bookedAtTime;
      }
      setTarget(spots);
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, `daily_capacity/${date}`);
    }
  }, []);

  useEffect(() => {
    const dateStr = new Date().toISOString().split("T")[0];
    const slots = getTimeSlotsForDate(dateStr);

    if (slots.length > 0) {
      const now = new Date();
      const currentH = now.getHours();
      const currentM = now.getMinutes();
      const currentTimeStr = `${currentH.toString().padStart(2, "0")}:${currentM.toString().padStart(2, "0")}`;

      const displayTime = slots.find(s => s >= currentTimeStr) || slots[0];

      const updateLiveSpots = async () => {
        const locations: ("hall" | "garden" | "bar")[] = ["hall", "garden", "bar"];
        const newSpots: any = {};

        for (const loc of locations) {
          await fetchCapacityForDateTime(dateStr, displayTime, loc, (val) => {
            newSpots[loc] = val;
          });
        }
        setLiveSpots(newStore => ({ ...newStore, ...newSpots }));
      };

      updateLiveSpots();
      const interval = setInterval(updateLiveSpots, 300000);
      return () => clearInterval(interval);
    } else {
      setLiveSpots({ hall: null, garden: null, bar: null });
    }
  }, [fetchCapacityForDateTime, getTimeSlotsForDate]);

  useEffect(() => {
    const slots = getTimeSlotsForDate(bookingDate);
    if (slots.length > 0) {
      if (!slots.includes(bookingTime)) {
        setBookingTime(slots[0]);
      }
    }
  }, [bookingDate, getTimeSlotsForDate, bookingTime]);

  useEffect(() => {
    if (bookingDate && bookingTime) {
      fetchCapacityForDateTime(bookingDate, bookingTime, bookingLocation, setAvailableSpots);
    }
  }, [bookingDate, bookingTime, bookingLocation, fetchCapacityForDateTime]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (isAdminAuth && overlayView === "reservations") {
      setIsLoadingReservations(true);
      const q = query(collection(db, "reservations"), orderBy("date", "desc"), orderBy("time", "desc"));
      unsubscribe = onSnapshot(q, (snap) => {
        const resData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllReservations(resData);
        setIsLoadingReservations(false);
        cleanupExpiredReservations(resData);
      }, (e) => {
        handleFirestoreError(e, OperationType.GET, "reservations");
        setIsLoadingReservations(false);
      });
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isAdminAuth, overlayView, cleanupExpiredReservations]);

  function handleAdminLogin(e: any) {
    e.preventDefault();
    const correctPassword = (import.meta as any).env.VITE_RESERVATIONS_PASSWORD || "tomato_admin";
    if (adminPassword === correctPassword) {
      setIsAdminAuth(true);
      setAdminAuthError(false);
    } else {
      setAdminAuthError(true);
    }
  }

  async function handleDeleteReservation(id: string) {
    if (!window.confirm("Сигурни ли сте, че искате да изтриете тази резервация?")) return;
    try {
      // First get the reservation data to update capacity
      const resRef = doc(db, "reservations", id);
      const resSnap = await getDoc(resRef);
      if (resSnap.exists()) {
        const resData = resSnap.data();
        const dayRef = doc(db, "daily_capacity", resData.date);
        const daySnap = await getDoc(dayRef);
        if (daySnap.exists()) {
          const slotsKey = `slots_${resData.location}`;
          const currentSlots = daySnap.data()[slotsKey] || {};
          if (currentSlots[resData.time]) {
            const newSlots = { ...currentSlots };
            newSlots[resData.time] = Math.max(0, (newSlots[resData.time] || 0) - resData.guests);
            await updateDoc(dayRef, { [slotsKey]: newSlots });
          }
        }
      }
      // Delete the reservation document
      await deleteDoc(doc(db, "reservations", id));
      // Optionally refresh live spots if today
      const today = new Date().toISOString().split("T")[0];
      const now = new Date();
      const currentTimeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
      const slots = getTimeSlotsForDate(today);
      const displayTime = slots.find(s => s >= currentTimeStr) || slots[0];
      const locations: ("hall" | "garden" | "bar")[] = ["hall", "garden", "bar"];
      for (const loc of locations) {
        fetchCapacityForDateTime(today, displayTime, loc, (val) => {
          setLiveSpots(prev => ({ ...prev, [loc]: val }));
        });
      }
    } catch (e) {
      console.error("Delete error:", e);
      alert("Възникна грешка при изтриването.");
    }
  }

  async function handleBooking(e: any) {
    e.preventDefault();
    setBookingError(null);

    if (!bookingTime) {
      setBookingError("ERROR");
      return;
    }

    setIsSubmitting(true);

    const guestsCount = parseInt(bookingGuests) || 2;
    const hour = parseInt(bookingTime.split(":")[0]);
    const daySlots = getTimeSlotsForDate(bookingDate);

    let affectedSlots: string[] = [];
    if (hour >= 19 || bookingTime === "00:00") {
      affectedSlots = daySlots.filter(s => s >= bookingTime);
    } else {
      const [h, m] = bookingTime.split(":").map(Number);
      const totalMinutesStart = h * 60 + m;
      const totalMinutesEnd = totalMinutesStart + 120;

      affectedSlots = daySlots.filter(s => {
        const [sh, sm] = s.split(":").map(Number);
        const slotMinutes = sh * 60 + sm;
        return slotMinutes >= totalMinutesStart && slotMinutes < totalMinutesEnd;
      });
    }

    try {
      await runTransaction(db, async (transaction) => {
        const dayRef = doc(db, "daily_capacity", bookingDate);
        const daySnap = await transaction.get(dayRef);

        const slotsKey = `slots_${bookingLocation}`;
        let allData: any = {};
        if (daySnap.exists()) {
          allData = daySnap.data();
        }

        const slots = allData[slotsKey] || {};

        for (const slot of affectedSlots) {
          const bookedAtSlot = (slots as any)[slot] || 0;
          if (bookedAtSlot + guestsCount > CAPACITIES[bookingLocation]) {
            throw new Error("FULLY_BOOKED");
          }
        }

        const resRef = doc(collection(db, "reservations"));
        transaction.set(resRef, {
          name: bookingName,
          phone: bookingPhone,
          guests: guestsCount,
          date: bookingDate,
          time: bookingTime,
          location: bookingLocation,
          duration: hour >= 19 || bookingTime === "00:00" ? "night" : "2h",
          affectedSlots,
          createdAt: serverTimestamp()
        });

        const newSlots = { ...slots };
        for (const slot of affectedSlots) {
          (newSlots as any)[slot] = ((newSlots as any)[slot] || 0) + guestsCount;
        }

        if (daySnap.exists()) {
          transaction.update(dayRef, { [slotsKey]: newSlots });
        } else {
          transaction.set(dayRef, { [slotsKey]: newSlots });
        }
      });

      setBookingSuccess(true);
      fetchCapacityForDateTime(bookingDate, bookingTime, bookingLocation, setAvailableSpots);

      const dateStr = new Date().toISOString().split("T")[0];
      if (bookingDate === dateStr) {
        const slots = getTimeSlotsForDate(dateStr);
        const now = new Date();
        const displayTime = slots.find(s => s >= `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`) || slots[0];

        if (bookingTime === displayTime || affectedSlots.includes(displayTime)) {
          const locations: ("hall" | "garden" | "bar")[] = ["hall", "garden", "bar"];
          for (const loc of locations) {
            fetchCapacityForDateTime(dateStr, displayTime, loc, (val) => {
              setLiveSpots(prev => ({ ...prev, [loc]: val }));
            });
          }
        }
      }

      setTimeout(() => {
        setIsBookingOpen(false);
        setBookingSuccess(false);
        setBookingName("");
        setBookingPhone("");
      }, 3000);

      fetchCapacityForDateTime(bookingDate, bookingTime, bookingLocation, setAvailableSpots);
    } catch (e: any) {
      console.error("Booking failed:", e);
      if (e.message === "FULLY_BOOKED") {
        setBookingError("FULL");
      } else {
        try {
          handleFirestoreError(e, OperationType.WRITE, "reservations");
        } catch (err: any) {
          const errorMsg = String(err.message || err);
          if (errorMsg.includes("permission-denied") || errorMsg.includes("permissions")) {
            setBookingError("PERMISSION_ERROR");
          } else {
            setBookingError("ERROR");
          }
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

  return (
    <div ref={containerRef} className="relative bg-jazz-black selection:bg-jazz-gold selection:text-jazz-black min-h-screen">
      {/* Navbar / Header */}
      <nav className={`fixed top-0 left-0 w-full z-[80] flex justify-between items-center px-6 md:px-16 py-6 transition-all duration-500 ${scrolled ? "backdrop-blur-md border-b border-white/5 bg-jazz-black/50" : "bg-transparent border-transparent"}`}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 md:gap-6 group cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
            <img
              src="https://i.postimg.cc/s2jX3RhP/20260516-160804(1)(1)(1)(1)(1).jpg"
              alt="Tomato Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-5xl font-bold font-serif tracking-tighter text-jazz-gold uppercase">TOMATO</h1>
            <span className="text-[7px] md:text-[8px] tracking-[0.4em] md:tracking-[0.5em] uppercase opacity-40 font-bold">{t.subtitle}</span>
          </div>
        </motion.div>

        <div className="flex items-center gap-4 md:gap-10">
          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-full px-4 py-2">
            <button
              onClick={() => setLang("BG")}
              className={`text-[10px] font-black tracking-widest transition-colors ${lang === "BG" ? "text-jazz-gold" : "text-white/40 hover:text-white"}`}
            >
              BG
            </button>
            <div className="w-[1px] h-3 bg-white/10" />
            <button
              onClick={() => setLang("EN")}
              className={`text-[10px] font-black tracking-widest transition-colors ${lang === "EN" ? "text-jazz-gold" : "text-white/40 hover:text-white"}`}
            >
              EN
            </button>
          </div>

          <div className="hidden sm:flex flex-col items-end gap-1">
            <button
              onClick={() => setIsBookingOpen(true)}
              className="flex items-center gap-3 px-6 py-2.5 bg-jazz-gold text-jazz-black text-[9px] uppercase tracking-[0.2em] font-black hover:bg-white transition-colors duration-500 shadow-lg group"
            >
              {t.bookNow}
              {liveSpots.hall !== null && (
                <span className="flex items-center gap-1.5 pl-3 border-l border-jazz-black/10 text-jazz-black/60 group-hover:text-jazz-black transition-colors">
                  <Users size={10} />
                  {liveSpots.hall}
                </span>
              )}
            </button>
            <span className="text-xs uppercase tracking-widest text-[#00ff88] animate-pulse font-black">{t.onlineResStat}</span>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col gap-1.5 p-2 group cursor-pointer"
          >
            <motion.div
              animate={isMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
              className="w-6 h-[1.5px] bg-jazz-gold transition-transform"
            />
            <motion.div
              animate={isMenuOpen ? { rotate: -45, y: -4, width: "1.5rem" } : { rotate: 0, y: 0, width: "1rem" }}
              className="w-4 h-[1.5px] bg-jazz-gold self-end transition-all"
            />
          </button>
        </div>
      </nav>

      {/* Primary Menu Overlay */}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-jazz-black flex flex-col items-center justify-center p-8 backdrop-blur-3xl"
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

            <div className="relative z-10 flex flex-col items-center justify-center gap-8 md:gap-14 w-full">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="flex items-center gap-4 py-2 px-4 bg-white/5 rounded-full border border-white/5">
                  <button
                    onClick={() => { setLang("BG"); setIsMenuOpen(false); }}
                    className={`text-[10px] font-black tracking-[0.3em] transition-colors ${lang === "BG" ? "text-jazz-gold" : "text-white/40 hover:text-white"}`}
                  >
                    BG
                  </button>
                  <div className="w-[1px] h-3 bg-white/10" />
                  <button
                    onClick={() => { setLang("EN"); setIsMenuOpen(false); }}
                    className={`text-[10px] font-black tracking-[0.3em] transition-colors ${lang === "EN" ? "text-jazz-gold" : "text-white/40 hover:text-white"}`}
                  >
                    EN
                  </button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-[10px] uppercase tracking-[0.6em] text-jazz-gold/40 font-black">Tomato Plovdiv</p>
                  <div className="w-8 h-[1px] bg-jazz-gold/20"></div>
                </div>
              </motion.div>

              <div className="flex flex-col items-center gap-3 md:gap-6 w-full max-w-xl mx-auto px-6 text-center">
                {[
                  { label: t.nav[0], action: () => { window.scrollTo({ top: 0, behavior: "smooth" }); setIsMenuOpen(false); } },
                  { label: t.menuHeader, action: () => { setOverlayView("full-menu"); setIsMenuOpen(false); } },
                  { label: t.privateRoomHeader, action: () => { document.getElementById("private-room")?.scrollIntoView({ behavior: "smooth" }); setIsMenuOpen(false); } },
                  { label: t.gallerySubtitle, action: () => { setOverlayView("gallery"); setIsMenuOpen(false); } },
                  { label: t.vibeTitle, action: () => { document.getElementById("vibe")?.scrollIntoView({ behavior: "smooth" }); setIsMenuOpen(false); } },
                  { label: t.visitTitle, action: () => { document.getElementById("location")?.scrollIntoView({ behavior: "smooth" }); setIsMenuOpen(false); } },
                  { label: t.reservationsTab, action: () => { setOverlayView("reservations"); setIsMenuOpen(false); } },
                ].map((item, i) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={item.action}
                    className="text-3xl md:text-5xl font-serif italic text-white hover:text-jazz-gold transition-all tracking-tight group w-full text-center py-1 md:py-2 block"
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={() => { setIsBookingOpen(true); setIsMenuOpen(false); }}
                className="mt-4 md:mt-8 w-full max-w-md py-5 bg-jazz-gold text-jazz-black text-[10px] uppercase tracking-[0.5em] font-black shadow-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
              >
                {t.bookNow}
                {liveSpots.hall !== null && (
                  <span className="opacity-40 text-[8px] border-l border-jazz-black/20 pl-3">
                    {liveSpots.hall} {lang === "BG" ? "СВОБОДНИ" : "AVAILABLE"}
                  </span>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sub-menu Overlays (Menu, Gallery, Reservations) */}
      <AnimatePresence>
        {overlayView !== "none" && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[95] bg-jazz-black overflow-y-auto"
          >
            <button
              onClick={() => setOverlayView("none")}
              className="fixed top-8 right-8 z-[110] p-4 bg-jazz-black/50 backdrop-blur-md border border-white/10 text-jazz-gold rounded-full hover:bg-jazz-gold hover:text-jazz-black transition-all shadow-2xl group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>

            {overlayView === "full-menu" && (
              <div className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <span className="text-[10px] uppercase tracking-[0.6em] text-jazz-gold mb-6 block font-bold opacity-60">{t.fullMenuTitle}</span>
                  <h2 className="text-5xl md:text-9xl font-serif text-white italic tracking-tighter leading-none mb-12">
                    {t.menuHeader.split(" ").slice(0, 1)} <br /> {t.menuHeader.split(" ").slice(1).join(" ")}
                  </h2>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-20">
                  <button
                    onClick={() => setMenuSection("drinks")}
                    className={`px-8 md:px-16 py-4 md:py-5 border text-[10px] uppercase tracking-[0.4em] font-black transition-all duration-500 ${menuSection === "drinks" ? "bg-jazz-gold text-jazz-black border-jazz-gold shadow-2xl scale-[1.05]" : "bg-transparent text-white border-white/20 hover:border-jazz-gold/50"}`}
                  >
                    {lang === "BG" ? "Напитки" : "Drinks"}
                  </button>
                  <button
                    onClick={() => setMenuSection("food")}
                    className={`px-8 md:px-16 py-4 md:py-5 border text-[10px] uppercase tracking-[0.4em] font-black transition-all duration-500 ${menuSection === "food" ? "bg-jazz-gold text-jazz-black border-jazz-gold shadow-2xl scale-[1.05]" : "bg-transparent text-white border-white/20 hover:border-jazz-gold/50"}`}
                  >
                    {lang === "BG" ? "Кухня" : "Food"}
                  </button>
                </div>

                <div className="space-y-32">
                  {t.fullMenu
                    .filter((group, idx) => (menuSection === "drinks" ? idx === 0 : idx === 1))
                    .map((group, gIdx) => (
                      <motion.div
                        key={group.title}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="flex flex-col items-center mb-16 px-4">
                          <div className="w-12 h-[1px] bg-jazz-gold/30 mb-6"></div>
                          <h3 className="text-3xl md:text-6xl font-serif text-white italic tracking-tighter text-center">
                            {group.title}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 md:gap-24">
                          {group.categories.map((section, idx) => (
                            <motion.div
                              key={section.name}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="space-y-12"
                            >
                              <h4 className="text-jazz-gold text-xs uppercase tracking-[0.5em] font-bold pb-6 border-b border-jazz-gold/20 italic">
                                {section.name}
                              </h4>
                              <div className="space-y-12">
                                {section.items.map((item) => (
                                  <div key={item.name} className="group cursor-pointer">
                                    <div className="flex justify-between items-start mb-3 gap-4">
                                      <h5 className="text-xl md:text-2xl font-serif italic text-jazz-cream group-hover:text-jazz-gold transition-colors leading-tight">{item.name}</h5>
                                      <span className="text-[11px] text-jazz-gold/40 italic whitespace-nowrap pt-2 font-bold">{item.price}</span>
                                    </div>
                                    <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] leading-relaxed max-w-[80%]">{item.info}</p>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            )}

            {overlayView === "reservations" && (
              <div className="py-24 px-6 md:px-16 max-w-4xl mx-auto">
                {!isAdminAuth ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto bg-white/[0.02] border border-white/10 p-8 md:p-12 mt-12"
                  >
                    <h3 className="text-2xl font-serif italic text-white mb-8 text-center">{t.reservationsTab}</h3>
                    <form onSubmit={handleAdminLogin} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 block ml-1 font-bold">{t.resPasswordLabel}</label>
                        <input
                          type="password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder={t.resPasswordPlaceholder}
                          className="w-full bg-white/5 border border-white/10 px-6 py-4 text-white text-sm focus:outline-none focus:border-jazz-gold/50 transition-colors"
                          required
                        />
                      </div>
                      {adminAuthError && (
                        <p className="text-jazz-red text-[10px] uppercase tracking-widest text-center">{t.resAuthError}</p>
                      )}
                      <button
                        type="submit"
                        className="w-full py-5 bg-jazz-gold text-jazz-black uppercase text-[10px] tracking-[0.3em] font-black hover:scale-[1.02] transition-transform shadow-2xl"
                      >
                        Login
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                  >
                    <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-12">
                      <h3 className="text-3xl md:text-5xl font-serif italic text-white tracking-tighter">{t.resListTitle}</h3>
                    </div>

                    {isLoadingReservations ? (
                      <div className="flex flex-col items-center py-20 gap-4">
                        <div className="w-8 h-8 border-2 border-jazz-gold border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : allReservations.length === 0 ? (
                      <div className="text-center py-20 opacity-40 text-[10px] uppercase tracking-[0.3em]">{t.resListEmpty}</div>
                    ) : (
                      <div className="space-y-4">
                        {allReservations.map((res: any) => (
                          <div key={res.id} className="bg-white/[0.02] border border-white/5 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/10 transition-colors group">
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <h4 className="text-xl font-serif italic text-jazz-cream group-hover:text-jazz-gold transition-colors">{res.name}</h4>
                                <span className={`px-2 py-0.5 text-[8px] uppercase tracking-widest font-bold rounded-sm ${
                                  res.location === "garden"
                                    ? "bg-green-500/10 text-green-500"
                                    : res.location === "bar"
                                      ? "bg-blue-500/10 text-blue-400"
                                      : "bg-jazz-gold/10 text-jazz-gold"
                                }`}>
                                  {res.location === "garden" ? t.locationGarden : res.location === "bar" ? t.locationBar : t.locationHall}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-white/40 text-[10px] uppercase tracking-widest font-medium">
                                <span className="flex items-center gap-1.5"><Calendar size={10} /> {res.date}</span>
                                <span className="flex items-center gap-1.5"><Clock size={10} /> {res.time}</span>
                                <span className="flex items-center gap-1.5"><Users size={10} /> {res.guests} {t.resListGuests}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <a href={`tel:${res.phone}`} className="flex items-center gap-2 px-4 py-2 border border-white/10 text-[10px] uppercase tracking-widest font-bold text-white/60 hover:text-white hover:border-white/30 transition-all">
                                <Phone size={10} /> {res.phone}
                              </a>
                              <button
                                onClick={() => handleDeleteReservation(res.id)}
                                className="flex items-center gap-2 px-4 py-2 border border-red-500/20 text-[10px] uppercase tracking-widest font-bold text-red-500/60 hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/40 transition-all"
                              >
                                <Trash2 size={10} /> {t.resDelete}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {overlayView === "gallery" && (
              <div className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                  <span className="text-[10px] uppercase tracking-[0.6em] text-jazz-gold mb-6 block font-bold opacity-60">{t.galleryTitle}</span>
                  <h2 className="text-5xl md:text-9xl font-serif text-white italic tracking-tighter leading-none">
                    {t.gallerySubtitle.split(" ").slice(0, 1)} <br /> {t.gallerySubtitle.split(" ").slice(1).join(" ")}
                  </h2>
                  <p className="mt-8 text-white/40 text-sm max-w-lg mx-auto font-light leading-relaxed italic">
                    {t.galleryDesc}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 px-4 md:px-12">
                  {allGalleryImages.map((url, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="relative aspect-[4/5] overflow-hidden group border border-white/5"
                    >
                      <img
                        src={url}
                        alt={`Tomato gallery ${i}`}
                        className="w-full h-full object-cover grayscale-[0.8] group-hover:grayscale-0 sepia-[0.4] group-hover:sepia-0 contrast-125 scale-110 group-hover:scale-100 transition-all duration-[2s] ease-in-out"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-1000 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
                      <div className="absolute inset-x-6 bottom-6 py-4 px-6 bg-jazz-black/90 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex flex-col gap-1 border-l-2 border-jazz-gold">
                        <span className="text-xs font-serif italic text-white">Tomato</span>
                        <span className="text-[8px] uppercase tracking-[0.3em] text-jazz-gold/60 font-bold">Captured Moment</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex flex-col justify-center items-center pt-20">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-jazz-black/60 via-jazz-black/40 to-jazz-black z-10" />
          <img
            src="https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=1920"
            alt="Abstract Jazz"
            className="w-full h-full object-cover grayscale brightness-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 z-[5] overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] border border-jazz-gold/10 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 left-1/3 w-[800px] h-[800px] border border-jazz-gold/5 rounded-full animate-pulse [animation-delay:1s]"></div>
            <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-jazz-gold/20 to-transparent"></div>
          </div>
        </motion.div>

        <div className="relative z-20 text-center px-4 mt-20 md:mt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-center gap-4 md:gap-6 mb-12">
              <div className="w-8 md:w-12 h-[1px] bg-jazz-gold/40"></div>
              <span className="text-[10px] md:text-[12px] uppercase tracking-[0.4em] md:tracking-[0.8em] text-jazz-gold font-bold">{t.heroTag}</span>
              <div className="w-8 md:w-12 h-[1px] bg-jazz-gold/40"></div>
            </div>

            <h1 className="text-6xl md:text-[12rem] font-serif text-white mb-10 md:mb-12 tracking-tighter leading-none relative group px-2">
              <span className="relative z-10">{t.heroTitle1}</span>
              <br />
              <span className="italic text-jazz-gold relative z-10">{t.heroTitle2}</span>
              <div className="absolute -inset-10 bg-jazz-gold/10 blur-[120px] rounded-full -z-10 opacity-50"></div>
            </h1>

            <p className="max-w-2xl mx-auto text-jazz-cream/60 text-base md:text-xl font-light leading-relaxed mb-16 italic tracking-wide px-4">
              {t.heroDesc}
            </p>

            <div className="mt-16 flex flex-col items-center gap-8 w-full px-4">
              <div className="flex flex-col md:flex-row gap-4 md:gap-10 justify-center items-center w-full max-w-[320px] md:max-w-none">
                <button
                  onClick={() => setOverlayView("full-menu")}
                  className="group relative w-full md:w-auto px-12 md:px-16 py-5 md:py-6 bg-transparent text-white text-[10px] uppercase tracking-[0.4em] font-bold overflow-hidden transition-all border border-white/10 flex items-center justify-center min-w-[200px]"
                >
                  <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500"></div>
                  <span className="relative z-10 group-hover:text-jazz-black whitespace-nowrap">{t.viewMenu}</span>
                </button>
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="group relative w-full md:w-auto px-12 md:px-16 py-5 md:py-6 bg-jazz-gold text-jazz-black text-[10px] uppercase tracking-[0.4em] font-bold overflow-hidden transition-all shadow-2xl flex items-center justify-center min-w-[200px]"
                >
                  <div className="absolute inset-0 bg-white -translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500"></div>
                  <span className="relative z-10 whitespace-nowrap">{t.bookNow}</span>
                </button>
              </div>
              <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#00ff88] font-black animate-pulse text-center">
                {t.onlineResStat}
              </span>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-6 md:bottom-10 z-20 flex flex-col items-center gap-2 opacity-20"
        >
          <span className="text-[9px] uppercase tracking-[0.2em] md:tracking-[0.4em]">{t.scroll}</span>
          <div className="w-[1px] h-12 md:h-16 bg-white shrink-0" />
        </motion.div>
      </section>

      {/* Main Quote Section */}
      <section id="menu" className="py-24 md:py-32 px-6 md:px-16 max-w-7xl mx-auto flex justify-center">
        <div className="w-full max-w-4xl relative group overflow-hidden bg-white/[0.02] border border-white/5 flex items-center justify-center min-h-[400px] md:min-h-[600px] p-6 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-t from-jazz-black via-transparent to-transparent z-10" />

          <div className="relative flex flex-col items-center z-20 w-full max-w-[250px] md:max-w-none">
            <div className="w-full md:w-72 h-80 md:h-96 border border-jazz-gold/20 rotate-3 absolute -z-10 translate-x-1 md:translate-x-4"></div>
            <div className="w-full md:w-72 h-80 md:h-96 border border-jazz-gold/30 -rotate-2 absolute -z-10 -translate-x-1 md:-translate-x-2"></div>
            <div className="w-full md:w-72 h-72 md:h-96 bg-jazz-red flex items-center justify-center shadow-2xl relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-700">
              <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
              <div className="text-center space-y-6 px-8 relative z-10">
                <div className="w-16 h-[1px] bg-jazz-gold mx-auto opacity-50"></div>
                <Quote size={24} className="mx-auto text-jazz-gold/30" />
                <p className="text-xl md:text-3xl font-serif italic text-white leading-tight">
                  {t.quote}
                </p>
                <div className="space-y-1">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-jazz-gold font-bold">{lang === "BG" ? "Данаил Ангелов" : "Danail Angelov"}</p>
                  <p className="text-[9px] tracking-widest uppercase text-white/40">Local Guide</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20">
            <p className="text-[9px] uppercase tracking-[0.5em] text-jazz-gold font-bold mb-2 opacity-60">{t.vibeTitle}</p>
            <p className="text-sm md:text-lg font-serif italic text-jazz-cream/80">{t.addressValue}</p>
          </div>
        </div>
      </section>

      {/* Halls Section with carousels */}
      <section id="private-room" className="py-24 md:py-32 px-6 md:px-16 border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col mb-16">
            <span className="text-jazz-gold text-lg md:text-2xl uppercase tracking-[0.4em] font-bold block mb-8">{t.privateRoomTitle}</span>
            <div className="flex flex-wrap gap-4 md:gap-8">
              {(t as any).halls.map((hall: any) => (
                <button
                  key={hall.id}
                  onClick={() => setSelectedHall(hall.id)}
                  className={`text-2xl md:text-5xl font-serif italic tracking-tighter transition-all ${selectedHall === hall.id ? "text-jazz-gold font-bold" : "text-white hover:text-jazz-gold/70"}`}
                >
                  {hall.name}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedHall}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col lg:flex-row gap-16 items-center"
            >
              {/* Carousel */}
              <div className="w-full lg:w-1/2 relative group">
                <div className="absolute -inset-4 bg-jazz-gold/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <div className="relative aspect-[16/9] overflow-hidden rounded-sm border border-white/10 group">
                  <img
                    src={hallImages[selectedHall as keyof typeof hallImages][hallIndex[selectedHall]]}
                    alt={selectedHall}
                    className="w-full h-full object-cover transition-transform duration-[2.5s] ease-out grayscale-[0.5] group-hover:grayscale-0 sepia-[0.3] group-hover:sepia-0 contrast-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-jazz-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-jazz-black/80 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 z-10">
                    <span className="text-jazz-gold text-[10px] uppercase tracking-[0.4em] font-bold block mb-2">{(t as any).halls.find((h: any) => h.id === selectedHall)?.name}</span>
                    <p className="text-white/40 text-[9px] uppercase tracking-widest italic">Tomato Experience</p>
                  </div>
                  <button
                    onClick={() => setHallIndex(prev => ({ ...prev, [selectedHall]: (prev[selectedHall] - 1 + hallImages[selectedHall as keyof typeof hallImages].length) % hallImages[selectedHall as keyof typeof hallImages].length }))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-all z-20"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => setHallIndex(prev => ({ ...prev, [selectedHall]: (prev[selectedHall] + 1) % hallImages[selectedHall as keyof typeof hallImages].length }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-all z-20"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {hallImages[selectedHall as keyof typeof hallImages].map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setHallIndex(prev => ({ ...prev, [selectedHall]: idx }))}
                        className={`w-2 h-2 rounded-full transition-all ${idx === hallIndex[selectedHall] ? "bg-jazz-gold w-4" : "bg-white/40"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2 space-y-10">
                <div>
                  <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tighter italic leading-tight mb-8">
                    {(t as any).halls.find((h: any) => h.id === selectedHall)?.name}
                  </h2>
                  <p className="text-white/60 text-base md:text-xl font-light leading-relaxed max-w-xl">
                    {(t as any).halls.find((h: any) => h.id === selectedHall)?.desc}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 py-8 border-y border-white/5">
                  {(t as any).halls.find((h: any) => h.id === selectedHall)?.features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="w-1.5 h-1.5 bg-jazz-gold rounded-full group-hover:scale-150 transition-transform"></div>
                      <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/80 font-medium group-hover:text-jazz-gold transition-colors">{feature}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-4 group col-span-2 sm:col-span-1">
                    <div className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse"></div>
                    <div className="flex flex-col">
                      <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold">{lang === "BG" ? "Жива наличност" : "Live Availability"}</span>
                      <span className="text-[10px] md:text-xs uppercase tracking-widest text-[#00ff88] font-black">
                        {(() => {
                          const currentLoc = selectedHall === "main" ? "hall" : selectedHall === "garden" ? "garden" : "bar";
                          return liveSpots[currentLoc] !== null
                            ? `${liveSpots[currentLoc]} / ${CAPACITIES[currentLoc]} ${lang === "BG" ? "СВОБОДНИ" : "FREE"}`
                            : "...";
                        })()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-12">
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="group relative inline-flex px-8 py-5 bg-jazz-gold text-jazz-black text-[10px] uppercase tracking-[0.4em] font-black overflow-hidden transition-all shadow-2xl flex items-center gap-3"
                  >
                    <div className="absolute inset-0 bg-white -translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500"></div>
                    <span className="relative z-10">{t.bookNow}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Vibe Section */}
      <section id="vibe" className="py-24 md:py-32 px-6 md:px-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20 items-center text-center md:text-left">
          <div className="w-full md:w-1/2 aspect-[3/4] md:aspect-[4/5] bg-zinc-900 overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-1000">
            <img
              src="https://i.postimg.cc/Pqp14S5L/IMG-0695(1).jpg"
              alt="Jazz atmosphere"
              className="w-full h-full object-cover opacity-80 border border-black"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-jazz-black/80 to-transparent"></div>
            <div className="absolute bottom-10 left-6 md:bottom-12 md:left-12 text-left">
              <Music size={48} className="text-jazz-gold/40 mb-6" />
              <h2 className="text-3xl md:text-6xl font-serif italic text-white tracking-tighter leading-none">{t.vibeRhythm.split(" ").slice(0, 1)} <br /> {t.vibeRhythm.split(" ").slice(1).join(" ")}</h2>
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-10 px-4 md:px-0">
            <div>
              <span className="text-jazz-gold text-[10px] uppercase tracking-[0.5em] mb-4 block font-bold">{t.vibeTitle}</span>
              <h2 className="text-3xl md:text-6xl font-serif text-white tracking-tighter leading-[1] mb-8 italic">{t.vibeQuote.split(" ").slice(0, 2).join(" ")} <br /> {t.vibeQuote.split(" ").slice(2).join(" ")}</h2>
              <p className="text-jazz-cream/40 text-lg font-light leading-relaxed italic max-w-lg mx-auto md:mx-0">
                {t.vibeDesc}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
              <div className="space-y-4">
                <p className="text-jazz-gold text-[10px] uppercase tracking-[0.4em] font-bold">{t.vibeLabels.vibe}</p>
                <p className="text-lg md:text-xl font-serif italic text-white/80">{t.vibeLabels.vibeVal}</p>
              </div>
              <div className="space-y-4">
                <p className="text-jazz-gold text-[10px] uppercase tracking-[0.4em] font-bold">{t.vibeLabels.music}</p>
                <p className="text-lg md:text-xl font-serif italic text-white/80">{t.vibeLabels.musicVal}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 md:py-32 px-6 md:px-16 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24 px-4">
            <span className="text-[10px] uppercase tracking-[0.5em] text-jazz-gold mb-4 block font-bold">{t.reviewTitle}</span>
            <h2 className="text-4xl md:text-8xl font-serif text-white tracking-tighter italic">{t.reviewHeader}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {t.reviews.map((review, i) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 md:p-10 border border-white/5 bg-white/[0.02] relative group hover:border-jazz-gold/30 transition-all duration-500"
              >
                <Quote size={32} className="absolute top-6 right-6 text-jazz-gold/10 group-hover:text-jazz-gold/20 transition-colors" />
                <div className="flex gap-1 mb-8">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={12} className="fill-jazz-gold text-jazz-gold opacity-60" />
                  ))}
                </div>
                <p className="text-jazz-cream/70 text-base md:text-lg font-light leading-relaxed mb-10 italic">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-jazz-gold/20 flex items-center justify-center font-serif italic text-jazz-gold">
                    {review.name[0]}
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-medium">{review.name}</h4>
                    <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">{review.source}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location/Contact Section */}
      <section id="location" className="py-24 md:py-32 px-6 md:px-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex justify-center text-center">
          <div className="max-w-2xl px-4 md:px-0">
            <span className="text-[10px] uppercase tracking-[0.5em] text-jazz-gold mb-6 block font-bold">{t.visitTitle}</span>
            <h2 className="text-4xl md:text-8xl font-serif text-white tracking-tighter leading-[0.9] mb-12 italic">
              {t.visitHeader.split(" ").slice(0, 2).join(" ")} <br /> {t.visitHeader.split(" ").slice(2).join(" ")}
            </h2>

            <div className="flex flex-col md:flex-row gap-12 md:gap-20 justify-center items-center mb-16 px-4">
              <div className="flex flex-col items-center gap-4">
                <MapPin className="text-jazz-gold/60" size={32} />
                <div className="space-y-2">
                  <p className="text-jazz-gold text-[9px] uppercase tracking-[0.3em] font-bold opacity-60">{t.addressLabel}</p>
                  <p className="text-xl font-serif italic text-jazz-cream/80 leading-tight">{t.addressValue}</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 text-center">
                <Clock className="text-jazz-gold/60" size={32} />
                <div className="space-y-2">
                  <p className="text-jazz-gold text-[9px] uppercase tracking-[0.3em] font-bold opacity-60">{t.workingHoursTitle}</p>
                  <div className="text-xs font-serif italic text-jazz-cream/80 leading-relaxed uppercase tracking-widest">
                    <p>{t.workingHoursWeek}</p>
                    <p>{t.workingHoursSat}</p>
                    <p>{t.workingHoursSun}</p>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-jazz-gold/90 mt-2">
                    {t.summerHoursAnnouncement}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <Phone className="text-jazz-gold/60" size={32} />
                <div className="space-y-2">
                  <p className="text-jazz-gold text-[9px] uppercase tracking-[0.3em] font-bold opacity-60">{t.resLabel}</p>
                  <p className="text-xl font-serif italic text-jazz-cream/80 leading-tight">089 637 0777</p>
                </div>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=ul.+Yoakim+Gruev+21,+4000+Plovdiv"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 md:px-12 py-5 border border-jazz-gold/30 text-jazz-gold text-[10px] uppercase tracking-[0.4em] font-black hover:bg-jazz-gold hover:text-jazz-black transition-all duration-500 shadow-xl"
            >
              {t.directions}
            </a>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-jazz-black/95 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-xl bg-[#0d0d0d] border border-jazz-gold/20 p-8 md:p-12 relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsBookingOpen(false)}
                className="absolute top-8 right-8 text-white/30 hover:text-jazz-gold transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-10">
                <h3 className="text-jazz-gold text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">{t.bookingTitle}</h3>
                <h2 className="text-4xl md:text-5xl font-serif text-white italic tracking-tighter">{t.bookingHeader}</h2>
                {bookingDate && bookingTime && availableSpots !== null && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 inline-flex flex-col items-center gap-2 px-6 py-3 bg-white/5 border border-white/5 rounded-sm"
                  >
                    <span className="text-[10px] uppercase tracking-widest text-white/40">{lang === "BG" ? `Свободни места за ${bookingTime}` : `Available spots for ${bookingTime}`}</span>
                    <span className={`text-2xl font-serif italic ${availableSpots !== null && availableSpots < 10 ? "text-jazz-red" : "text-jazz-gold"}`}>
                      {availableSpots} / {CAPACITIES[bookingLocation]}
                    </span>
                  </motion.div>
                )}
              </div>

              {bookingSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Star className="text-green-500 fill-green-500" size={32} />
                  </div>
                  <h3 className="text-3xl font-serif italic text-white mb-4">
                    {lang === "BG" ? "Резервацията е приета!" : "Booking Received!"}
                  </h3>
                  <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]">
                    {t.resNote}
                  </p>
                </motion.div>
              ) : bookingError === "FULL" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-16 h-16 bg-jazz-red/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <X className="text-jazz-red" size={32} />
                  </div>
                  <h3 className="text-2xl font-serif italic text-white mb-6 leading-tight">
                    {lang === "BG"
                      ? `За съжаление нямаме свободни места за ${bookingTime} на тази дата.`
                      : `Unfortunately, we are fully booked for ${bookingTime} on this date.`}
                  </h3>
                  <div className="p-6 border border-jazz-gold/30 bg-jazz-gold/5 space-y-4">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-jazz-gold font-bold">
                      {lang === "BG" ? "Свържете се с управител" : "Contact Manager"}
                    </p>
                    <p className="text-3xl font-serif italic text-white">089 637 0777</p>
                  </div>
                  <button
                    onClick={() => { setBookingError(null); setBookingDate(""); }}
                    className="mt-8 text-[10px] uppercase tracking-widest text-jazz-gold underline underline-offset-4"
                  >
                    {lang === "BG" ? "Избери друга дата" : "Choose another date"}
                  </button>
                </motion.div>
              ) : (
                <form className="space-y-6" onSubmit={handleBooking}>
                  <div className="flex flex-wrap gap-2 p-1 bg-white/[0.03] border border-white/10 mb-6">
                    <button
                      type="button"
                      onClick={() => setBookingLocation("hall")}
                      className={`flex-1 min-w-[80px] py-3 text-[10px] uppercase font-bold tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${bookingLocation === "hall" ? "bg-jazz-gold text-jazz-black" : "text-white/40 hover:text-white/60"}`}
                    >
                      <UtensilsCrossed size={12} />
                      {t.locationHall}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingLocation("garden")}
                      className={`flex-1 min-w-[80px] py-3 text-[10px] uppercase font-bold tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${bookingLocation === "garden" ? "bg-jazz-gold text-jazz-black" : "text-white/40 hover:text-white/60"}`}
                    >
                      <Wine size={12} />
                      {t.locationGarden}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingLocation("bar")}
                      className={`flex-1 min-w-[80px] py-3 text-[10px] uppercase font-bold tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${bookingLocation === "bar" ? "bg-jazz-gold text-jazz-black" : "text-white/40 hover:text-white/60"}`}
                    >
                      <GlassWater size={12} />
                      {t.locationBar}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 block ml-1 font-bold">{t.nameLabel}</label>
                      <input
                        type="text"
                        required
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        placeholder={t.namePlaceholder}
                        className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm text-white focus:border-jazz-gold/50 outline-none transition-colors italic"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 block ml-1 font-bold">{t.phoneLabel}</label>
                      <input
                        type="tel"
                        required
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        placeholder={t.phonePlaceholder}
                        className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm text-white focus:border-jazz-gold/50 outline-none transition-colors italic"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 block ml-1 font-bold">{t.dateTimeLabel} - {lang === "BG" ? "Дата" : "Date"}</label>
                      <div className="relative">
                        <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-jazz-gold/50 pointer-events-none" />
                        <input
                          type="date"
                          required
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full bg-white/[0.03] border border-white/10 p-4 pl-12 text-sm text-white focus:border-jazz-gold/50 outline-none transition-colors italic appearance-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 block ml-1 font-bold">{lang === "BG" ? "Час" : "Hour"}</label>
                      <div className="relative">
                        <Clock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-jazz-gold/50 pointer-events-none" />
                        <select
                          required
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          disabled={getTimeSlotsForDate(bookingDate).length === 0}
                          className="w-full bg-white/[0.03] border border-white/10 p-4 pl-12 text-sm text-white focus:border-jazz-gold/50 outline-none transition-colors appearance-none italic disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {getTimeSlotsForDate(bookingDate).length > 0 ? (
                            getTimeSlotsForDate(bookingDate).map(time => (
                              <option key={time} value={time} className="bg-jazz-black">{time}</option>
                            ))
                          ) : (
                            <option value="" className="bg-jazz-black">
                              {lang === "BG" ? "Затворено" : "Closed"}
                            </option>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 block ml-1 font-bold">{t.guestsLabel}</label>
                    <div className="relative">
                      <Users size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-jazz-gold/50 pointer-events-none" />
                      <select
                        required
                        value={bookingGuests}
                        onChange={(e) => setBookingGuests(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 p-4 pl-12 text-sm text-white focus:border-jazz-gold/50 outline-none transition-colors appearance-none italic"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                          <option key={n} value={n} className="bg-jazz-black">{n} {lang === "BG" ? (n === 1 ? "човек" : "души") : (n === 1 ? "person" : "people")}</option>
                        ))}
                        <option value="15" className="bg-jazz-black">10-20 {lang === "BG" ? "души" : "people"}</option>
                        <option value="30" className="bg-jazz-black">20-50 {lang === "BG" ? "души" : "people"}</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-6">
                    <div className="mb-6 py-3 border-y border-white/5 text-center">
                      <span className="text-xs uppercase tracking-[0.2em] text-[#00ff88] font-black animate-pulse">
                        {t.onlineResStat}
                      </span>
                    </div>
                    <div className="mt-8 space-y-4">
                      {bookingError && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center p-6 bg-jazz-red/10 border border-jazz-red/20 space-y-2"
                        >
                          <p className="text-jazz-red text-[11px] uppercase tracking-[0.3em] font-black">
                            {bookingError === "FULL" ? (lang === "BG" ? "Няма свободни места" : "Fully booked") : (bookingError === "PERMISSION_ERROR" ? "Database Error" : (lang === "BG" ? "Грешка при резервацията" : "Booking error"))}
                          </p>
                          <p className="text-white/40 text-[9px] uppercase tracking-widest leading-relaxed">
                            {bookingError === "PERMISSION_ERROR"
                              ? "The booking system encountered a permission issue. Please contact 089 637 0777 directly."
                              : "Please check your connection and ensuring all fields are filled correctly."}
                          </p>
                        </motion.div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting || (availableSpots !== null && availableSpots <= 0)}
                        className="w-full py-5 bg-jazz-gold text-jazz-black uppercase text-[10px] tracking-[0.3em] font-black hover:scale-[1.02] transition-transform shadow-2xl disabled:opacity-50 disabled:grayscale disabled:scale-100 flex items-center justify-center gap-3"
                      >
                        {isSubmitting ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-3 h-3 border-2 border-jazz-black border-t-transparent rounded-full" />
                        ) : (
                          <CalendarCheck size={14} />
                        )}
                        {t.confirmRes}
                      </button>
                    </div>
                    <p className="text-[10px] text-center mt-6 text-white/20 uppercase tracking-[0.2em]">
                      {t.resNote}
                    </p>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/10 pt-20 pb-16 px-8 md:px-16 bg-jazz-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
          <div className="flex flex-col">
            <h2 className="text-4xl font-serif text-jazz-gold tracking-tighter uppercase mb-6">TOMATO</h2>
            <div className="flex gap-10 text-[10px] uppercase tracking-[0.3em] opacity-40 font-bold">
              <a href="#" className="hover:text-jazz-gold transition-colors">Instagram</a>
              <a href="#" className="hover:text-jazz-gold transition-colors">{t.spotifyPlaylist}</a>
              <a href="#" className="hover:text-jazz-gold transition-colors">{t.bookingTitle}</a>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-[0.4em] opacity-40 mb-2 font-bold">{t.footerContact}</p>
              <p className="text-xl font-sans text-jazz-gold tracking-tighter">089 637 0777</p>
            </div>
            <div className="w-14 h-14 border border-jazz-gold flex items-center justify-center group cursor-pointer hover:bg-jazz-gold transition-colors">
              <div className="w-1.5 h-1.5 bg-jazz-gold rounded-full group-hover:bg-jazz-black transition-colors"></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/20">{t.footerCopyright}</p>
          <div className="flex gap-8 text-[9px] uppercase tracking-[0.3em] text-white/20 italic">
            <span>{t.footerBuild}</span>
            <span>{t.footerRights}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
