/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  MapPin, Phone, Clock, ChevronRight, Star, Instagram, Facebook, Music,
  UtensilsCrossed, Wine, Quote, X, Calendar, Users, CalendarCheck,
  GlassWater, ChevronLeft
} from "lucide-react";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";

// ==================== ДАННИ ====================
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

const heroImages = [
  "https://i.postimg.cc/Y08JGw5P/20260516-160857.jpg",
  "https://i.postimg.cc/g2Bv8CmY/viber-izobrazenie-2026-05-19-19-25-06-145.jpg",
  "https://i.postimg.cc/Gt7p61Mc/IMG-0692(1).jpg"
];

const RESERVATION_LINK = "https://www.google.com/maps/reserve/v/dine/c/cLjMFkgllLM?source=pa&opi=89978449&hl=en-BG&gei=14gcarvWJM2Mxc8PhfSl0QQ&gsas=1&ahbb=1&sourceurl=https://www.google.com/search?hl%3Den-US%26ram_mb%3D7225%26aos%3D18%26ampcct%3D7778%26cs%3D1%26q%3Dtomato%2Brestaurant%26agsai%3Dsg8HwFfHgBc%26padt%3D117%26rdid%3D40711b74-5722-41e3-a90c-bade1d5929b5%26client%3Dms-android-samsung-ss%26gs_ssp%3DeJzj4tVP1zc0TKnISU_KKEo2YLRSMagwNElMTjFMSjFPSUq0NEwxtjKoMDOwNDYySzY0NbUwTU1L8xIsyc9NLMlXKEotLkksLUrMKwEAFNwWtw%26source%3Dand.gsa.launcher.icon%26pf%3Dop";

const LANGUAGES = {
  BG: {
    nav: ["Начало", "Меню", "Зали", "Атмосфера", "Галерия", "Отзиви", "Частни Събития"],
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
      { id: "main", name: "Основна зала", desc: "Добре дошли в нашата основна зала, където уютът среща изтънчения вкус. Със своя капацитет от 30 места, залата е перфектното място както за споделена вечеря с любими хора, така е и за организирани тържества. Интериорът умело съчетава очарованието на старинния стил с изчистения модерен дизайн. Живият огън на камината внася топлина и домашна атмосфера, а селектираната тиха джаз музика допълва усещането за спокойствие и уединение. Тук времето забавя своя ход, за да се насладите изцяло на момента.", features: ["30 места", "Жива камина", "Джаз атмосфера"] },
      { id: "garden", name: "Градина", desc: "Нашата градина е истински оазис сред шума на града. Със своите 70 места, тя предлага тишина и свежест през топлите летни вечери. Пространството може да се затваря в студени дни, за да се поддържа приятна атмосфера. Зеленината и дискретното осветление създават приказна обстановка за романтична вечеря или спокойна среща с приятели. Това е нашата зала за пушачи.", features: ["70 места", "Свежа растителност", "Дискретно осветление"] },
      { id: "bar", name: "Бар", desc: "Нашият бар е пулсиращото сърце на Tomato, където изкуството на коктейлите среща джаз ритъма. Капацитетът на бара е 25 места, проектирани за перфектна близост и уединение край селекцията от премиум напитки. Тук нашите майстори бармани ще ви предложат уникални авторски коктейли и редки питиета, поднесени с много стил. Динамичната атмосфера край бар-плота, приглушеното осветление и приятните разговори правят това перфектното място за завършек на деня или начало на вълнуваща вечер.", features: ["25 места", "Авторски коктейли", "Премиум уиски селекция"] }
    ],
    privateRoomDesc: "Нашата градина е истински оазис сред шума на града. Идеалното пространство за тези, които ценят спокойния разговор и свежия въздух в уютна джаз обстановка.",
    privateRoomFeatures: ["70 места", "Свежа растителност", "Дискретно осветление"],
    vipAtmosphere: [
      { title: "Кехлибарен Сияние", desc: "Ръчно подбрани винтидж нишки на фона на суров бетон, които задават ритъма на вечерта.", image: "https://i.postimg.cc/HkPQXqH6/viber-izobrazenie-2026-05-19-19-25-04-890.jpg" },
      { title: "Вътрешното Светилище", desc: "Тухлени стени и топлината на камината срещат престижа на пълното уединение.", image: "https://i.postimg.cc/2SX4hsmH/viber-izobrazenie-2026-05-19-19-25-06-204.jpg" },
      { title: "Джаз Настроение", desc: "Пространство, където музиката и светлината се сливат в едно изживяване.", image: "https://i.postimg.cc/s2Q5cTgz/viber-izobrazenie-2026-05-19-19-25-06-651.jpg" }
    ],
    fullMenuTitle: "Цялата колекция",
    vipMenuTitle: "Предложения на Бара",
    vipPackages: [
      { name: "Ексклузивни Плата", items: [{ name: "Дегустационно меню 'Tomato'", price: "45€", info: "Петстепенно авторско изживяване за ценители" }, { name: "Селекция отлежали сирена", price: "25€", info: "Подбрани от местни бутикови ферми" }, { name: "Плато за ценители", price: "35€", info: "Комбинация от премиум мезета и специален хляб" }] },
      { name: "Напитки Премиум", items: [{ name: "Винена дегустация", price: "35€", info: "Три редки реколти от долината на Марица" }, { name: "Селекция малцово уиски", price: "55€", info: "За истинските познавачи (3х30 мл)" }, { name: "Авторски коктейл Бар", price: "12€", info: "Специално приготвен за вашето събитие" }] }
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
    workingHoursWeek: "Пон - Сря: 08:00 - 17:00",
    workingHoursThuFri: "Чет - Пет: 08:00 - 23:00",
    workingHoursSat: "Събота: 16:00 - 23:00",
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
    onlineResStat: "10% отстъпка за резервации през сайта",
    footerContact: "Контакт и Резервации",
    footerCopyright: "© 2026 Tomato · Естетичен ресторант Пловдив",
    footerBuild: "Създадено от AR Studio",
    footerRights: "Всички права запазени",
    scroll: "Надолу",
    spotifyPlaylist: "Фейсбук",
    privateEventsTitle: "Частни Събития",
    privateEventsHeader: "Наем на Пространствата",
    privateEventsSubtitle: "Организирайте вашето специално събитие при нас",
    privateEventsDesc1: "Искате ли да организирате частно парти, семеен празник или корпоративно събитие? Tomato предлага възможност за наем на нашите три уникални пространства.",
    privateEventsDesc2: "Ние ще се погрижим всичко да бъде перфектно - от декорацията според вашия вкус до кетъринг опциите.",
    privateEventsRentalTitle: "Условия за наем",
    privateEventsRentalCondition1: "Цена: 10 евро на човек",
    privateEventsRentalCondition2: "Минимален брой гости: 15 души или минимална сума 150 евро",
    privateEventsRentalCondition3: "Налични дни: Понеделник до Четвъртък след 17:00 часа и цяла Неделя",
    privateEventsRentalCondition4: "Можете да донесете свои храни и напитки",
    privateEventsRentalCondition5: "По желание: ресторантът може да приготви храната вместо вас",
    privateEventsRentalCondition6: "По желание: ресторантът може да украси пространството според вашия избор",
    privateEventsRoomsTitle: "Нашите три пространства",
    privateEventsRoomMain: "Основна зала - капацитет до 30 души",
    privateEventsRoomGarden: "Градина - капацитет до 70 души",
    privateEventsRoomBar: "Бар - капацитет до 25 души",
    privateEventsContact: "За повече информация и резервации, моля свържете се с нас на телефон 089 637 0777",
    fullMenu: [
      {
        title: "Напитки",
        categories: [
          { name: "Напитки с кафе, мляко и чай", items: [{ name: "Кафе Lavazza", price: "1,99€", info: "60 мл" }, { name: "Кафе без кофеин", price: "2,50€", info: "60 мл" }, { name: "Капучино", price: "2,60€", info: "130 мл" }, { name: "Кафе Лате", price: "2,60€", info: "220 мл" }, { name: "Макиато", price: "1,99€", info: "60 мл" }, { name: "Виенско кафе", price: "2,60€", info: "80 мл" }, { name: "Кафе фрапе черно/бяло", price: "2,60€", info: "200 мл" }, { name: "Кафе Фредо", price: "2,60€", info: "200 мл" }, { name: "Ирландско кафе", price: "5,50€", info: "120 мл" }, { name: "Мляко с инстантно кафе", price: "2,60€", info: "160 мл" }, { name: "Мляко с мед и канела", price: "2,60€", info: "160 мл" }, { name: "Мляко с какао", price: "2,60€", info: "160 мл" }, { name: "Фрапе какао", price: "2,60€", info: "200 мл" }, { name: "Горещ шоколад", price: "2,99€", info: "160 мл" }, { name: "Чай Ронефелд", price: "2,20€", info: "200 мл /билков, горски плодове, зелен, черен/" }] },
          { name: "Безалкохолни напитки", items: [{ name: "Coca Cola продукти", price: "1,99€", info: "250 мл" }, { name: "Soda Schweppes", price: "1,99€", info: "250 мл" }, { name: "Натурален сок", price: "2,60€", info: "250 мл" }, { name: "Минерална вода Девин", price: "1,50€", info: "400 мл" }, { name: "Минерална вода Девин", price: "2,60€", info: "1,2 л" }, { name: "Red Bull", price: "3,60€", info: "250 мл" }, { name: "Фреш", price: "3,20€", info: "300 мл /портокал, грейпфрут/" }, { name: "Шейкове", price: "3,20€", info: "300 мл /млечен, шоколадов/" }, { name: "Лимонади", price: "3,20€", info: "300 мл" }] },
          { name: "Бира и Сайдери", items: [{ name: "Шуменско", price: "1,99€", info: "330 мл" }, { name: "Шуменско", price: "2,50€", info: "500 мл" }, { name: "Карлсберг наливна", price: "3,40€", info: "330 мл" }, { name: "Карлсберг наливна", price: "3,90€", info: "500 мл" }, { name: "Карлсберг 0.0%", price: "3,40€", info: "330 мл" }, { name: "Kloster Weiss / Gold", price: "4,20€", info: "500 мл" }, { name: "Berliner Kindl", price: "4,20€", info: "500 мл" }] },
          { name: "Коктейли", items: [{ name: "Mojito", price: "4,99€", info: "200 мл" }, { name: "Margarita", price: "4,99€", info: "150 мл" }, { name: "Long Island Ice Tea", price: "4,99€", info: "300 мл" }, { name: "Aperol Spritz", price: "4,99€", info: "350 мл" }, { name: "Pink Zu", price: "4,99€", info: "350 мл" }, { name: "Bloody Bison", price: "4,99€", info: "200 мл" }, { name: "Bison Smash", price: "4,99€", info: "150 мл" }] },
          { name: "Уиски", items: [{ name: "Jameson", price: "3,40€", info: "50 мл" }, { name: "Glenfiddich Single Malt 12 y.o.", price: "6,90€", info: "50 мл" }, { name: "Johnnie Walker 12 y.o.", price: "5,90€", info: "50 мл" }, { name: "Jack Daniels", price: "4,60€", info: "50 мл" }, { name: "Jim Beam", price: "3,40€", info: "50 мл" }] },
          { name: "Други алкохолни", items: [{ name: "Reyka Водка", price: "4,60€", info: "50 мл" }, { name: "Finlandia Водка", price: "2,50€", info: "50 мл" }, { name: "Bombay Sapphire Джин", price: "3,40€", info: "50 мл" }, { name: "Beefeater Джин", price: "2,50€", info: "50 мл" }, { name: "Bacardi Superior Ром", price: "2,50€", info: "50 мл" }, { name: "Jose Cuervo Текила", price: "1,90€", info: "30 мл" }] },
          { name: "Вермути, Ликьори и Коняк", items: [{ name: "Martini /Extra Dry, Bianco/", price: "1,90€", info: "50 мл" }, { name: "Baileys", price: "2,90€", info: "50 мл" }, { name: "Limonchelo", price: "2,90€", info: "50 мл" }, { name: "Jagermeister", price: "2,90€", info: "50 мл" }, { name: "Metaxa ***", price: "2,90€", info: "50 мл" }] },
          { name: "Аперитиви и Ракии", items: [{ name: "Стралджанска Мускатова Барел", price: "3,00€", info: "50 мл" }, { name: "Стралджанска Мускатова Ракия", price: "2,70€", info: "50 мл" }, { name: "Сливенска перла Барел", price: "3,00€", info: "50 мл" }, { name: "Сливенска перла", price: "2,70€", info: "50 мл" }, { name: "Пещерска отлична ракия", price: "1,50€", info: "50 мл" }, { name: "Ракия 'Наше лозе'", price: "1,50€", info: "50 мл" }, { name: "Карловска мускатова", price: "2,00€", info: "50 мл" }, { name: "Сръбска дюлева ракия", price: "3,00€", info: "50 мл" }, { name: "Сръбска крушева ракия", price: "3,00€", info: "50 мл" }, { name: "Ouzo", price: "2,00€", info: "50 мл" }, { name: "Pernod", price: "2,70€", info: "50 мл" }] }
        ]
      },
      {
        title: "Меню Кухня",
        categories: [
          { name: "Салати", items: [{ name: "Салата със скариди, авокадо и манго", price: "11,00€", info: "300 гр" }, { name: "Салата с риба тон", price: "8,50€", info: "300 гр" }, { name: "Салата с червено цвекло и синьо сирене", price: "9,50€", info: "300 гр /печена тиква, круши, орехи/" }, { name: "Средиземноморска салата с моцарела", price: "7,50€", info: "300 гр" }, { name: "Селска салата с гриловани зеленчуци", price: "7,00€", info: "300 гр" }, { name: "Салата Мешалале", price: "7,00€", info: "300 гр" }, { name: "Салата 'Цезар' с пиле и бекон", price: "8,70€", info: "300 гр" }, { name: "Салата с гриловани домати и моцарела", price: "7,70€", info: "300 гр" }] },
          { name: "Мезета", items: [{ name: "Мус ог сьомга със зелена салата и багета", price: "6,70€", info: "200 гр" }, { name: "Трио разядки от хумус, мариновани маслини с Фета сирене и мутабал", price: "7,70€", info: "300 гр" }, { name: "Панирана Скаморца с боровинки", price: "8,50€", info: "200 гр" }, { name: "Телешки език с масло и гъби", price: "9,30€", info: "250 гр" }, { name: "Касапско тиганче", price: "7,70€", info: "250 гр /телешки език, шкембе, дроб, гъби и вино/" }, { name: "Скариди със сметана", price: "10,50€", info: "200 гр" }, { name: "Телешки дроб с яйце и кисели краставички", price: "6,00€", info: "250 гр" }, { name: "Свински уши", price: "6,00€", info: "250 гр" }, { name: "Пилешки крилца", price: "6,60€", info: "300 гр" }, { name: "Хрупкави пилешки хапки с чеснов сос", price: "7,20€", info: "250 гр" }, { name: "Пукани картофи с панчета и кашкавал", price: "6,70€", info: "250 гр" }, { name: "Пържени картофи с пармеджано и труфел", price: "5,00€", info: "200 гр" }, { name: "Пържени картофи", price: "3,60€", info: "200 гр" }, { name: "Пърленка с чесън", price: "1,50€", info: "100 гр" }, { name: "Пърленка с кашкавал", price: "3,00€", info: "140 гр" }] },
          { name: "Tomato Промо Предложения", items: [{ name: "BBQ дъска за 1 човек", price: "10,00€", info: "250 гр" }, { name: "BBQ дъска за 2 души", price: "20,00€", info: "500 гр" }, { name: "BBQ дъска за 4 човека", price: "40,00€", info: "1,5 кг" }] },
          { name: "BBQ", items: [{ name: "Нашите три кюфтета", price: "8,50€", info: "300 гр /със салца и картофи/" }, { name: "Свински ребра", price: "13,50€", info: "450 гр" }, { name: "Телешка наденица", price: "8,50€", info: "300 гр" }, { name: "Адана кебап", price: "9,50€", info: "300 гр" }, { name: "Свински шиш кебап", price: "8,50€", info: "350 гр" }, { name: "Наденички Чоризо", price: "9,50€", info: "250 гр" }, { name: "Телешки бон филенца с гъбен сос", price: "20,00€", info: "300 гр" }] },
          { name: "Рибни и Вегетариански", items: [{ name: "Филе от лаврак на тиган", price: "19,00€", info: "300 гр" }, { name: "Филе от сьомга BBQ", price: "19,00€", info: "300 гр" }, { name: "Ризото с пиле и гъби", price: "9,00€", info: "300 гр" }, { name: "Паста със скариди и чери домати", price: "11,00€", info: "300 гр /бейби спанак/" }, { name: "Паста с гриловани зеленчуци", price: "8,00€", info: "300 гр /босилек/" }] }
        ]
      }
    ],
    gallery: allGalleryImages.map(url => ({ url, title: "Tomato" })),
    reviews: [
      { name: "Чефо", source: "Германия", text: "Идвам от Германия, за да посетя Пловдив, и ядох една от най-добрите вечери в живота си тук. Близо до центъра, на много тихо място, където наистина можете да се насладите на храната си.", rating: 5 },
      { name: "Данаил Ангелов", source: "Local Guide", text: "Прекрасно и естетично бижу, скрито в сърцето на Пловдив. Атмосферата е уникална и жива. Сервитьорът беше много любезен, а храната е една от най-добрите, които ще опитате в града.", rating: 5 },
      { name: "Валентин Генев", source: "Local Guide", text: "Храната беше много добра, но кюфтетата бяха направо невероятни! Наистина се постараха да ни накарат да се чувстваме комфортно и добре дошли.", rating: 5 }
    ],
    quote: "Естетично бижу, скрито в сърцето на Пловдив."
  },
  EN: {
    nav: ["Home", "Menu", "Halls", "Vibe", "Gallery", "Reviews", "Private Events"],
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
      { id: "main", name: "Main Hall", desc: "Welcome to our main hall, where comfort meets refined taste. With a capacity of 30 seats, the hall is the perfect place for both a shared dinner with loved ones and organized celebrations. The interior skillfully combines the charm of vintage style with clean modern design. The living fire of the fireplace brings warmth and a homey atmosphere, while the selected quiet jazz music completes the feeling of peace and privacy. Here, time slows down so you can fully enjoy the moment.", features: ["30 Seats", "Live Fireplace", "Jazz Vibe"] },
      { id: "garden", name: "Garden", desc: "Our garden is a true oasis amidst the city noise. With its 70 seats, it offers peace and freshness during warm summer evenings. The space can be enclosed during colder days to maintain a pleasant atmosphere. The greenery and discrete lighting create a fairytale setting for a romantic dinner or a quiet gathering. This is our smoking area.", features: ["70 Seats", "Lush Greenery", "Mood Lighting"] },
      { id: "bar", name: "Bar", desc: "Our bar is the pulsing heart of Tomato, where the art of mixology meets the jazz rhythm. The bar capacity is 25 seats, designed for perfect closeness and privacy around our premium drink selection. Here, our master bartenders will offer you unique signature cocktails and rare spirits, served with style. The dynamic atmosphere, dim golden lighting, and engaging conversations make it the perfect spot to end your day or kickstart an exciting evening.", features: ["25 Seats", "Signature Cocktails", "Premium Spirits"] }
    ],
    privateRoomDesc: "Our garden is a true oasis amidst the city noise. The perfect space for those who appreciate quiet conversation and fresh air in a cozy jazz environment.",
    privateRoomFeatures: ["70 Seats", "Lush Greenery", "Mood Lighting"],
    vipAtmosphere: [
      { title: "Amber Glow", desc: "Hand-selected vintage filaments against a raw concrete ceiling, setting a sophisticated jazz mood.", image: "https://i.postimg.cc/HkPQXqH6/viber-izobrazenie-2026-05-19-19-25-04-890.jpg" },
      { title: "The Inner Sanctum", desc: "Brick walls and fireplace warmth meet the rhythm of silence and prestige.", image: "https://i.postimg.cc/2SX4hsmH/viber-izobrazenie-2026-05-19-19-25-06-204.jpg" },
      { title: "Jazz Reverie", desc: "A space where music and light merge into a single, immersive experience.", image: "https://i.postimg.cc/s2Q5cTgz/viber-izobrazenie-2026-05-19-19-25-06-651.jpg" }
    ],
    fullMenuTitle: "The Full Collection",
    vipMenuTitle: "Bar Offers",
    vipPackages: [
      { name: "Exclusive Platters", items: [{ name: "'Tomato' Tasting Menu", price: "45€", info: "Five-course signature experience for connoisseurs" }, { name: "Aged Cheese Selection", price: "25€", info: "Sourced from local boutique farms" }, { name: "Connoisseur Platter", price: "35€", info: "Premium charcuterie and artisan bread combo" }] },
      { name: "Premium Sips", items: [{ name: "Wine Flight", price: "35€", info: "Three rare vintages from the Maritsa Valley" }, { name: "Malt Whiskey Selection", price: "55€", info: "For true aficionados (3x30 ml)" }, { name: "Signature Bar Cocktail", price: "12€", info: "Specially crafted for your event" }] }
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
    workingHoursWeek: "Mon - Wed: 8:00 AM - 5:00 PM",
    workingHoursThuFri: "Thu - Fri: 8:00 AM - 11:00 PM",
    workingHoursSat: "Saturday: 4:00 PM - 11:00 PM",
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
    onlineResStat: "10% off for reservations made trough the website",
    footerContact: "Contact & Bookings",
    footerCopyright: "© 2026 Tomato · Aesthetic Restaurant Plovdiv",
    footerBuild: "Website created by AR Studio",
    footerRights: "All Rights Reserved",
    scroll: "Scroll",
    spotifyPlaylist: "Facebook",
    privateEventsTitle: "Private Events",
    privateEventsHeader: "Rent Our Spaces",
    privateEventsSubtitle: "Host your special event with us",
    privateEventsDesc1: "Do you want to organize a private party, family celebration or corporate event? Tomato offers the opportunity to rent our three unique spaces.",
    privateEventsDesc2: "We will take care of everything to be perfect - from decoration according to your taste to catering options.",
    privateEventsRentalTitle: "Rental Terms",
    privateEventsRentalCondition1: "Price: 10 euro per person",
    privateEventsRentalCondition2: "Minimum guests: 15 people or minimum amount 150 euro",
    privateEventsRentalCondition3: "Available days: Monday to Thursday after 5pm and all day Sunday",
    privateEventsRentalCondition4: "You can bring your own food and drinks",
    privateEventsRentalCondition5: "Optional: the restaurant can cook the food for you",
    privateEventsRentalCondition6: "Optional: the restaurant can decorate the space according to your choice",
    privateEventsRoomsTitle: "Our Three Spaces",
    privateEventsRoomMain: "Main Hall - capacity up to 30 people",
    privateEventsRoomGarden: "Garden - capacity up to 70 people",
    privateEventsRoomBar: "Bar - capacity up to 25 people",
    privateEventsContact: "For more information and reservations, please contact us at 089 637 0777",
    fullMenu: [
      {
        title: "Drinks",
        categories: [
          { name: "Coffee, Milk & Tea", items: [{ name: "Lavazza Coffee", price: "1,99€", info: "60 ml" }, { name: "Decaf Coffee", price: "2,50€", info: "60 ml" }, { name: "Cappuccino", price: "2,60€", info: "130 ml" }, { name: "Caffe Latte", price: "2,60€", info: "220 ml" }, { name: "Macchiato", price: "1,99€", info: "60 ml" }, { name: "Viennese Coffee", price: "2,60€", info: "80 ml" }, { name: "Frape Black/White", price: "2,60€", info: "200 ml" }, { name: "Freddo Coffee", price: "2,60€", info: "200 ml" }, { name: "Irish Coffee", price: "5,50€", info: "120 ml" }, { name: "Instant Coffee with Milk", price: "2,60€", info: "160 ml" }, { name: "Milk with Honey & Cinnamon", price: "2,60€", info: "160 ml" }, { name: "Milk with Cocoa", price: "2,60€", info: "160 ml" }, { name: "Cocoa Frape", price: "2,60€", info: "200 ml" }, { name: "Hot Chocolate", price: "2,99€", info: "160 ml" }, { name: "Ronnefeldt Tea", price: "2,20€", info: "200 ml /Herbal, Forest Fruit, Green, Black/" }] },
          { name: "Soft Drinks", items: [{ name: "Coca Cola Products", price: "1,99€", info: "250 ml" }, { name: "Soda Schweppes", price: "1,99€", info: "250 ml" }, { name: "Fruit Juice", price: "2,60€", info: "250 ml" }, { name: "Mineral Water Devin", price: "1,50€", info: "400 ml" }, { name: "Mineral Water Devin", price: "2,60€", info: "1.2 L" }, { name: "Red Bull", price: "3,60€", info: "250 ml" }, { name: "Fresh Juice", price: "3,20€", info: "300 ml /Orange, Grapefruit/" }, { name: "Shakes", price: "3,20€", info: "300 ml /Milk, Chocolate/" }, { name: "Lemonades", price: "3,20€", info: "300 ml" }] },
          { name: "Beer & Ciders", items: [{ name: "Shumensko", price: "1,99€", info: "330 ml" }, { name: "Shumensko", price: "2,50€", info: "500 ml" }, { name: "Carlsberg Draught", price: "3,40€", info: "330 ml" }, { name: "Carlsberg Draught", price: "3,90€", info: "500 ml" }, { name: "Carlsberg 0.0%", price: "3,40€", info: "330 ml" }, { name: "Kloster Weiss / Gold", price: "4,20€", info: "500 ml" }, { name: "Berliner Kindl", price: "4,20€", info: "500 ml" }] },
          { name: "Cocktails", items: [{ name: "Mojito", price: "4,99€", info: "200 ml" }, { name: "Margarita", price: "4,99€", info: "150 ml" }, { name: "Long Island Ice Tea", price: "4,99€", info: "300 ml" }, { name: "Aperol Spritz", price: "4,99€", info: "350 ml" }, { name: "Pink Zu", price: "4,99€", info: "350 ml" }, { name: "Bloody Bison", price: "4,99€", info: "200 ml" }, { name: "Bison Smash", price: "4,99€", info: "150 ml" }] },
          { name: "Whiskey", items: [{ name: "Jameson", price: "3,40€", info: "50 ml" }, { name: "Glenfiddich Single Malt 12 y.o.", price: "6,90€", info: "50 ml" }, { name: "Johnnie Walker 12 y.o.", price: "5,90€", info: "50 ml" }, { name: "Jack Daniels", price: "4,60€", info: "50 ml" }, { name: "Jim Beam", price: "3,40€", info: "50 ml" }] },
          { name: "Other Spirits", items: [{ name: "Reyka Vodka", price: "4,60€", info: "50 ml" }, { name: "Finlandia Vodka", price: "2,50€", info: "50 ml" }, { name: "Bombay Sapphire Gin", price: "3,40€", info: "50 ml" }, { name: "Beefeater Gin", price: "2,50€", info: "50 ml" }, { name: "Bacardi Superior Rum", price: "2,50€", info: "50 ml" }, { name: "Jose Cuervo Tequila", price: "1,90€", info: "30 ml" }] },
          { name: "Vermouth, Liqueurs & Cognac", items: [{ name: "Martini /Extra Dry, Bianco/", price: "1,90€", info: "50 ml" }, { name: "Baileys", price: "2,90€", info: "50 ml" }, { name: "Limonchelo", price: "2,90€", info: "50 ml" }, { name: "Jagermeister", price: "2,90€", info: "50 ml" }, { name: "Metaxa ***", price: "2,90€", info: "50 ml" }] },
          { name: "Aperitifs & Rakia", items: [{ name: "Straldzhanaka Muscat Barrel", price: "3,00€", info: "50 ml" }, { name: "Straldzhanaka Muscat Rakia", price: "2,70€", info: "50 ml" }, { name: "Slivenska Perla Barrel", price: "3,00€", info: "50 ml" }, { name: "Slivenska Perla", price: "2,70€", info: "50 ml" }, { name: "Peshterska Rakia", price: "1,50€", info: "50 ml" }, { name: "Rakia 'Nashe Loze'", price: "1,50€", info: "50 ml" }, { name: "Karlovska Muscat", price: "2,00€", info: "50 ml" }, { name: "Serbian Quince Rakia", price: "3,00€", info: "50 ml" }, { name: "Serbian Pear Rakia", price: "3,00€", info: "50 ml" }, { name: "Ouzo", price: "2,00€", info: "50 ml" }, { name: "Pernod", price: "2,70€", info: "50 ml" }] }
        ]
      },
      {
        title: "Kitchen Menu",
        categories: [
          { name: "Salads", items: [{ name: "Shrimp, Avocado & Mango Salad", price: "11,00€", info: "300 g" }, { name: "Tuna Salad", price: "8,50€", info: "300 g" }, { name: "Beetroot & Blue Cheese Salad", price: "9,50€", info: "300 g /Baked Pumpkin, Pears, Walnuts/" }, { name: "Mediterranean Mozzarella Salad", price: "7,50€", info: "300 g" }, { name: "Village Salad with Grilled Veggies", price: "7,00€", info: "300 g" }, { name: "Meshalale Salad", price: "7,00€", info: "300 g" }, { name: "Chicken & Bacon Caesar", price: "8,70€", info: "300 g" }, { name: "Grilled Tomato & Mozzarella Salad", price: "7,70€", info: "300 g" }] },
          { name: "Appetizers", items: [{ name: "Salmon mousse with green salad and baguette", price: "6,70€", info: "200 гр" }, { name: "Trio of appetizers of hummus, marinated olives with Feta cheese and mutabal", price: "7,70€", info: "300 гр" }, { name: "Breaded Scamorza with blueberries", price: "8,50€", info: "200 гр" }, { name: "Beef tongue with butter and mushrooms", price: "9,30€", info: "250 гр" }, { name: "Butcher's Pan", price: "7,70€", info: "250 g /beef tongue, tripe, liver, mushrooms and wine/" }, { name: "Shrimp with cream", price: "10,50€", info: "200 гр" }, { name: "Beef liver with egg and pickles", price: "6,00€", info: "250 гр" }, { name: "Pig ears", price: "6,00€", info: "250 гр" }, { name: "chicken wings", price: "6,60€", info: "300 гр" }, { name: "Crispy chicken bites with garlic sauce", price: "7,20€", info: "250 гр" }, { name: "Popped potatoes with pancetta and yellow cheese", price: "6,70€", info: "250 гр" }, { name: "French fries with parmesan and truffle", price: "5,00€", info: "200 гр" }, { name: "French fries", price: "3,60€", info: "200 гр" }, { name: "Parlenka with garlic", price: "1,50€", info: "100 гр" }, { name: "Parlenka with yellow cheese", price: "3,00€", info: "140 гр" }] },
          { name: "Tomato Promo Offers", items: [{ name: "BBQ board for 1 person", price: "10,00€", info: "250 гр" }, { name: "BBQ board for 2 people", price: "20,00€", info: "500 гр" }, { name: "BBQ board for 4 people", price: "40,00€", info: "1,5 кг" }] },
          { name: "BBQ", items: [{ name: "Our Three Meatballs", price: "8,50€", info: "300 g /with salsa and potatoes/" }, { name: "Pork Ribs", price: "13,50€", info: "450 g" }, { name: "Beef Sausage", price: "8,50€", info: "300 g" }, { name: "Adana Kebab", price: "9,50€", info: "300 g" }, { name: "Pork Shish Kebab", price: "8,50€", info: "350 g" }, { name: "Chorizo Sausages", price: "9,50€", info: "250 g" }, { name: "Beef Fillet with Mushroom Sauce", price: "20,00€", info: "300 g" }] },
          { name: "Fish & Vegetarian", items: [{ name: "Pan-Seared Sea Bass", price: "19,00€", info: "300 g" }, { name: "BBQ Salmon Fillet", price: "19,00€", info: "300 g" }, { name: "Chicken & Mushroom Risotto", price: "9,00€", info: "300 g" }, { name: "Shrimp & Cherry Tomato Pasta", price: "11,00€", info: "300 g /baby spinach/" }, { name: "Grilled Veggie & Basil Pasta", price: "8,00€", info: "300 g /basil/" }] }
        ]
      }
    ],
    gallery: allGalleryImages.map(url => ({ url, title: "Tomato" })),
    reviews: [
      { name: "Chefo", source: "Germany", text: "I came from Germany to visit Plovdiv and had one of the best meals in my life here. Close to the center, in a very quiet place where you can really enjoy your food.", rating: 5 },
      { name: "Danail Angelov", source: "Local Guide", text: "A beautiful and aesthetic gem hidden in the heart of Plovdiv. The atmosphere is unique and lively. The waiter was very kind and the food is one of the best you will try in the city.", rating: 5 },
      { name: "Valentin Genev", source: "Local Guide", text: "The food was very good, but the meatballs were simply amazing! They really tried to make us feel comfortable and welcome.", rating: 5 }
    ],
    quote: "An aesthetic gem, hidden in the heart of Plovdiv."
  }
};

const NAV_LINKS_MAP: Record<string, string> = {
  "Начало": "home", "Меню": "menu", "Зали": "private-room", "Атмосфера": "vibe",
  "Галерия": "gallery", "Отзиви": "reviews", "Частни Събития": "private-events",
  "Home": "home", "Menu": "menu", "Halls": "private-room", "Vibe": "vibe",
  "Gallery": "gallery", "Reviews": "reviews", "Private Events": "private-events"
};

// ==================== ОПТИМИЗИРАНИ КОМПОНЕНТИ ====================
const GalleryImage = ({ url, index }: { url: string; index: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.05 }}
    className="relative aspect-[4/5] overflow-hidden group border border-white/5"
  >
    <img
      src={url}
      alt={`Tomato gallery ${index}`}
      className="w-full h-full object-cover transition-all duration-[2s] ease-in-out"
      loading="lazy"
      referrerPolicy="no-referrer"
    />
    <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-1000 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
    <div className="absolute inset-x-6 bottom-6 py-4 px-6 bg-jazz-black/90 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex flex-col gap-1 border-l-2 border-jazz-gold">
      <span className="text-xs font-serif italic text-white">Tomato</span>
      <span className="text-[8px] uppercase tracking-[0.3em] text-jazz-gold/60 font-bold">Captured Moment</span>
    </div>
  </motion.div>
);

const ReviewCard = ({ review, index }: { review: any; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    viewport={{ once: true, margin: "-50px" }}
    className="p-8 md:p-10 border border-white/5 bg-white/[0.02] relative group hover:border-jazz-gold/30 transition-all duration-500"
  >
    <Quote size={32} className="absolute top-6 right-6 text-jazz-gold/10 group-hover:text-jazz-gold/20 transition-colors" />
    <div className="flex gap-1 mb-8">
      {[...Array(review.rating)].map((_, i) => (
        <Star key={i} size={12} className="fill-jazz-gold text-jazz-gold opacity-60" />
      ))}
    </div>
    <p className="text-jazz-cream/70 text-base md:text-lg font-light leading-relaxed mb-10 italic">"{review.text}"</p>
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
);

// ==================== MAIN APP ====================
export default function App() {
  const [lang, setLang] = useState<"BG" | "EN">("BG");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [overlayView, setOverlayView] = useState<"none" | "gallery" | "private-events">("none");
  const [scrolled, setScrolled] = useState(false);
  const [selectedHall, setSelectedHall] = useState<"main" | "garden" | "bar">("main");
  const [hallIndex, setHallIndex] = useState<Record<string, number>>({ main: 0, garden: 0, bar: 0 });
  const [heroIndex, setHeroIndex] = useState(0);

  const t = useMemo(() => LANGUAGES[lang], [lang]);

  const handleReservationClick = useCallback(() => window.open(RESERVATION_LINK, "_blank"), []);
  const handleMenuClick = useCallback(() => window.open('/menu-standalone.html', '_blank'), []);
  const handleScroll = useCallback(() => setScrolled(window.scrollY > 20), []);
  const handleHallPrev = useCallback(() => {
    setHallIndex(prev => ({ ...prev, [selectedHall]: (prev[selectedHall] - 1 + hallImages[selectedHall].length) % hallImages[selectedHall].length }));
  }, [selectedHall]);
  const handleHallNext = useCallback(() => {
    setHallIndex(prev => ({ ...prev, [selectedHall]: (prev[selectedHall] + 1) % hallImages[selectedHall].length }));
  }, [selectedHall]);

  // Автосмяна залите на 7 секунди
  useEffect(() => {
    if (!selectedHall) return;
    const interval = setInterval(() => {
      setHallIndex(prev => ({ ...prev, [selectedHall]: (prev[selectedHall] + 1) % hallImages[selectedHall].length }));
    }, 7000);
    return () => clearInterval(interval);
  }, [selectedHall]);

  // Автосмяна hero на 5 секунди
  useEffect(() => {
    const interval = setInterval(() => setHeroIndex((prev) => (prev + 1) % heroImages.length), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

  const currentHall = useMemo(() => (t as any).halls.find((h: any) => h.id === selectedHall), [t, selectedHall]);

  return (
    <div ref={containerRef} className="relative bg-jazz-black selection:bg-jazz-gold selection:text-jazz-black min-h-screen">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 w-full z-[80] flex justify-between items-center px-6 md:px-16 py-6 transition-all duration-500 ${scrolled ? "backdrop-blur-md border-b border-white/5 bg-jazz-black/50" : "bg-transparent border-transparent"}`}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4 md:gap-6 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
            <img src="https://i.postimg.cc/s2jX3RhP/20260516-160804(1)(1)(1)(1)(1).jpg" alt="Tomato Logo" className="w-full h-full object-cover" loading="eager" referrerPolicy="no-referrer" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-5xl font-bold font-serif tracking-tighter text-jazz-gold uppercase">TOMATO</h1>
            <span className="text-[7px] md:text-[8px] tracking-[0.4em] md:tracking-[0.5em] uppercase opacity-40 font-bold">{t.subtitle}</span>
          </div>
        </motion.div>
        <div className="flex items-center gap-4 md:gap-10">
          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-full px-4 py-2">
            <button onClick={() => setLang("BG")} className={`text-[10px] font-black tracking-widest transition-colors ${lang === "BG" ? "text-jazz-gold" : "text-white/40 hover:text-white"}`}>BG</button>
            <div className="w-[1px] h-3 bg-white/10" />
            <button onClick={() => setLang("EN")} className={`text-[10px] font-black tracking-widest transition-colors ${lang === "EN" ? "text-jazz-gold" : "text-white/40 hover:text-white"}`}>EN</button>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1">
            <button onClick={handleReservationClick} className="flex items-center gap-3 px-6 py-2.5 bg-jazz-gold text-jazz-black text-[9px] uppercase tracking-[0.2em] font-black hover:bg-white transition-colors duration-500 shadow-lg group">{t.bookNow}</button>
            <span className="text-xs uppercase tracking-widest text-[#00ff88] animate-pulse font-black">{t.onlineResStat}</span>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex flex-col gap-1.5 p-2 group cursor-pointer">
            <motion.div animate={isMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} className="w-6 h-[1.5px] bg-jazz-gold transition-transform" />
            <motion.div animate={isMenuOpen ? { rotate: -45, y: -4, width: "1.5rem" } : { rotate: 0, y: 0, width: "1rem" }} className="w-4 h-[1.5px] bg-jazz-gold self-end transition-all" />
          </button>
        </div>
      </nav>

      {/* Menu Overlay - ПРОМЕНЕНА ПОДРЕДБАТА! "Частни Събития" е втори */}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] bg-jazz-black flex flex-col items-center justify-center p-8 backdrop-blur-3xl">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="relative z-10 flex flex-col items-center justify-center gap-8 md:gap-14 w-full">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-4 py-2 px-4 bg-white/5 rounded-full border border-white/5">
                  <button onClick={() => { setLang("BG"); setIsMenuOpen(false); }} className={`text-[10px] font-black tracking-[0.3em] transition-colors ${lang === "BG" ? "text-jazz-gold" : "text-white/40 hover:text-white"}`}>BG</button>
                  <div className="w-[1px] h-3 bg-white/10" />
                  <button onClick={() => { setLang("EN"); setIsMenuOpen(false); }} className={`text-[10px] font-black tracking-[0.3em] transition-colors ${lang === "EN" ? "text-jazz-gold" : "text-white/40 hover:text-white"}`}>EN</button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-[10px] uppercase tracking-[0.6em] text-jazz-gold/40 font-black">Tomato Plovdiv</p>
                  <div className="w-8 h-[1px] bg-jazz-gold/20" />
                </div>
              </motion.div>
              <div className="flex flex-col items-center gap-3 md:gap-6 w-full max-w-xl mx-auto px-6 text-center">
                {[
                  { label: t.nav[0], action: () => { window.scrollTo({ top: 0, behavior: "smooth" }); setIsMenuOpen(false); } },
                  { label: t.nav[6], action: () => { setOverlayView("private-events"); setIsMenuOpen(false); } }, // Частни Събития - ВТОРИ!
                  { label: t.menuHeader, action: () => { handleMenuClick(); setIsMenuOpen(false); } },
                  { label: t.privateRoomHeader, action: () => { document.getElementById("private-room")?.scrollIntoView({ behavior: "smooth" }); setIsMenuOpen(false); } },
                  { label: t.gallerySubtitle, action: () => { setOverlayView("gallery"); setIsMenuOpen(false); } },
                  { label: t.vibeTitle, action: () => { document.getElementById("vibe")?.scrollIntoView({ behavior: "smooth" }); setIsMenuOpen(false); } },
                  { label: t.visitTitle, action: () => { document.getElementById("location")?.scrollIntoView({ behavior: "smooth" }); setIsMenuOpen(false); } },
                ].map((item, i) => (
                  <motion.button key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={item.action} className="text-3xl md:text-5xl font-serif italic text-white hover:text-jazz-gold transition-all tracking-tight group w-full text-center py-1 md:py-2 block">{item.label}</motion.button>
                ))}
              </div>
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} onClick={handleReservationClick} className="mt-4 md:mt-8 w-full max-w-md py-5 bg-jazz-gold text-jazz-black text-[10px] uppercase tracking-[0.5em] font-black shadow-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-3">{t.bookNow}</motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlays (Gallery, Private Events) */}
      <AnimatePresence>
        {overlayView !== "none" && (
          <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="fixed inset-0 z-[95] bg-jazz-black overflow-y-auto">
            <button onClick={() => setOverlayView("none")} className="fixed top-8 right-8 z-[110] p-4 bg-jazz-black/50 backdrop-blur-md border border-white/10 text-jazz-gold rounded-full hover:bg-jazz-gold hover:text-jazz-black transition-all shadow-2xl group">
              <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>
            {overlayView === "gallery" && (
              <div className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                  <span className="text-[10px] uppercase tracking-[0.6em] text-jazz-gold mb-6 block font-bold opacity-60">{t.galleryTitle}</span>
                  <h2 className="text-5xl md:text-9xl font-serif text-white italic tracking-tighter leading-none">{t.gallerySubtitle.split(" ").slice(0, 1)} <br /> {t.gallerySubtitle.split(" ").slice(1).join(" ")}</h2>
                  <p className="mt-8 text-white/40 text-sm max-w-lg mx-auto font-light leading-relaxed italic">{t.galleryDesc}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 px-4 md:px-12">
                  {allGalleryImages.map((url, i) => <GalleryImage key={i} url={url} index={i} />)}
                </div>
              </div>
            )}
            {overlayView === "private-events" && (
              <div className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                  <span className="text-[10px] uppercase tracking-[0.6em] text-jazz-gold mb-6 block font-bold opacity-60">{t.privateEventsTitle}</span>
                  <h2 className="text-5xl md:text-9xl font-serif text-white italic tracking-tighter leading-none">{t.privateEventsHeader.split(" ").slice(0, 2).join(" ")} <br /> {t.privateEventsHeader.split(" ").slice(2).join(" ")}</h2>
                  <p className="mt-8 text-white/60 text-lg max-w-2xl mx-auto font-light leading-relaxed italic">{t.privateEventsSubtitle}</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                  <div className="space-y-8">
                    <p className="text-white/80 text-base leading-relaxed">{t.privateEventsDesc1}</p>
                    <p className="text-white/80 text-base leading-relaxed">{t.privateEventsDesc2}</p>
                    <div className="pt-8 border-t border-white/10">
                      <h3 className="text-2xl font-serif italic text-jazz-gold mb-6">{t.privateEventsRentalTitle}</h3>
                      <ul className="space-y-4">
                        {[1,2,3,4,5,6].map(i => (<li key={i} className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-jazz-gold rounded-full mt-2 shrink-0" /><span className="text-white/70 text-sm">{t[`privateEventsRentalCondition${i}`]}</span></li>))}
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="bg-white/5 border border-white/10 p-8 md:p-10">
                      <h3 className="text-2xl font-serif italic text-jazz-gold mb-6">{t.privateEventsRoomsTitle}</h3>
                      <ul className="space-y-6">
                        {["Main", "Garden", "Bar"].map(room => (<li key={room} className="flex items-center gap-4 group cursor-pointer"><div className="w-10 h-10 rounded-full border border-jazz-gold/30 flex items-center justify-center group-hover:bg-jazz-gold/10 transition-colors"><Users size={18} className="text-jazz-gold" /></div><span className="text-white/80 text-sm font-light">{t[`privateEventsRoom${room}`]}</span></li>))}
                      </ul>
                    </div>
                    <div className="bg-jazz-gold/5 border border-jazz-gold/20 p-8 md:p-10 text-center">
                      <Calendar size={32} className="mx-auto text-jazz-gold mb-4" />
                      <p className="text-white/80 text-sm leading-relaxed italic">{t.privateEventsContact}</p>
                      <button onClick={handleReservationClick} className="mt-6 px-8 py-4 bg-jazz-gold text-jazz-black text-[10px] uppercase tracking-[0.4em] font-black hover:bg-white transition-all duration-500">{t.bookNow}</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex flex-col justify-center items-center pt-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={heroIndex} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5, ease: "easeInOut" }}>
              <img src={heroImages[heroIndex]} alt="Hero Background" className="w-full h-full object-cover" loading="eager" referrerPolicy="no-referrer" />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-jazz-black/60 via-jazz-black/40 to-jazz-black z-10" />
          <div className="absolute inset-0 z-[5] overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] border border-jazz-gold/10 rounded-full animate-pulse" />
            <div className="absolute top-1/3 left-1/3 w-[800px] h-[800px] border border-jazz-gold/5 rounded-full animate-pulse [animation-delay:1s]" />
            <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-jazz-gold/20 to-transparent" />
          </div>
        </div>
        <div className="relative z-20 text-center px-4 mt-20 md:mt-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex items-center justify-center gap-4 md:gap-6 mb-12">
              <div className="w-8 md:w-12 h-[1px] bg-jazz-gold/40" />
              <span className="text-[10px] md:text-[12px] uppercase tracking-[0.4em] md:tracking-[0.8em] text-jazz-gold font-bold">{t.heroTag}</span>
              <div className="w-8 md:w-12 h-[1px] bg-jazz-gold/40" />
            </div>
            <h1 className="text-6xl md:text-[12rem] font-serif text-white mb-10 md:mb-12 tracking-tighter leading-none relative group px-2">
              <span className="relative z-10">{t.heroTitle1}</span><br />
              <span className="italic text-jazz-gold relative z-10">{t.heroTitle2}</span>
              <div className="absolute -inset-10 bg-jazz-gold/10 blur-[120px] rounded-full -z-10 opacity-50" />
            </h1>
            <p className="max-w-2xl mx-auto text-jazz-cream/60 text-base md:text-xl font-light leading-relaxed mb-16 italic tracking-wide px-4">{t.heroDesc}</p>
            <div className="mt-16 flex flex-col items-center gap-8 w-full px-4">
              <div className="flex flex-col md:flex-row gap-4 md:gap-10 justify-center items-center w-full max-w-[320px] md:max-w-none">
                <button onClick={handleMenuClick} className="group relative w-full md:w-auto px-12 md:px-16 py-5 md:py-6 bg-transparent text-white text-[10px] uppercase tracking-[0.4em] font-bold overflow-hidden transition-all border border-white/10 flex items-center justify-center min-w-[200px]">
                  <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 group-hover:text-jazz-black whitespace-nowrap">{t.viewMenu}</span>
                </button>
                <button onClick={handleReservationClick} className="group relative w-full md:w-auto px-12 md:px-16 py-5 md:py-6 bg-jazz-gold text-jazz-black text-[10px] uppercase tracking-[0.4em] font-bold overflow-hidden transition-all shadow-2xl flex items-center justify-center min-w-[200px]">
                  <div className="absolute inset-0 bg-white -translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 whitespace-nowrap">{t.bookNow}</span>
                </button>
              </div>
              <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#00ff88] font-black animate-pulse text-center">{t.onlineResStat}</span>
            </div>
          </motion.div>
        </div>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-6 md:bottom-10 z-20 flex flex-col items-center gap-2 opacity-20">
          <span className="text-[9px] uppercase tracking-[0.2em] md:tracking-[0.4em]">{t.scroll}</span>
          <div className="w-[1px] h-12 md:h-16 bg-white shrink-0" />
        </motion.div>
      </section>

      {/* Main Quote Section */}
      <section className="py-24 md:py-32 px-6 md:px-16 max-w-7xl mx-auto flex justify-center">
        <div className="w-full max-w-4xl relative group overflow-hidden bg-white/[0.02] border border-white/5 flex items-center justify-center min-h-[400px] md:min-h-[600px] p-6 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-t from-jazz-black via-transparent to-transparent z-10" />
          <div className="relative flex flex-col items-center z-20 w-full max-w-[250px] md:max-w-none">
            <div className="w-full md:w-72 h-80 md:h-96 border border-jazz-gold/20 rotate-3 absolute -z-10 translate-x-1 md:translate-x-4" />
            <div className="w-full md:w-72 h-80 md:h-96 border border-jazz-gold/30 -rotate-2 absolute -z-10 -translate-x-1 md:-translate-x-2" />
            <div className="w-full md:w-72 h-72 md:h-96 bg-jazz-red flex items-center justify-center shadow-2xl relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-700">
              <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              <div className="text-center space-y-6 px-8 relative z-10">
                <div className="w-16 h-[1px] bg-jazz-gold mx-auto opacity-50" />
                <Quote size={24} className="mx-auto text-jazz-gold/30" />
                <p className="text-xl md:text-3xl font-serif italic text-white leading-tight">{t.quote}</p>
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

      {/* Halls Section */}
      <section id="private-room" className="py-24 md:py-32 px-6 md:px-16 border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col mb-16">
            <span className="text-jazz-gold text-lg md:text-2xl uppercase tracking-[0.4em] font-bold block mb-8">{t.privateRoomTitle}</span>
            <div className="flex flex-wrap gap-4 md:gap-8">
              {(t as any).halls.map((hall: any) => (
                <button key={hall.id} onClick={() => setSelectedHall(hall.id)} className={`text-2xl md:text-5xl font-serif italic tracking-tighter transition-all ${selectedHall === hall.id ? "text-jazz-gold font-bold" : "text-white hover:text-jazz-gold/70"}`}>{hall.name}</button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={selectedHall} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: "easeOut" }} className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="w-full lg:w-1/2 relative group">
                <div className="absolute -inset-4 bg-jazz-gold/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative aspect-[16/9] overflow-hidden rounded-sm border border-white/10 group">
                  <img src={hallImages[selectedHall][hallIndex[selectedHall]]} alt={selectedHall} className="w-full h-full object-cover transition-transform duration-[2.5s] ease-out" loading="lazy" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-jazz-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-jazz-black/80 to-transparent" />
                  <div className="absolute bottom-8 left-8 z-10">
                    <span className="text-jazz-gold text-[10px] uppercase tracking-[0.4em] font-bold block mb-2">{currentHall?.name}</span>
                    <p className="text-white/40 text-[9px] uppercase tracking-widest italic">Tomato Experience</p>
                  </div>
                  <button onClick={handleHallPrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-all z-20"><ChevronLeft size={24} /></button>
                  <button onClick={handleHallNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-all z-20"><ChevronRight size={24} /></button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {hallImages[selectedHall].map((_, idx) => (<button key={idx} onClick={() => setHallIndex(prev => ({ ...prev, [selectedHall]: idx }))} className={`w-2 h-2 rounded-full transition-all ${idx === hallIndex[selectedHall] ? "bg-jazz-gold w-4" : "bg-white/40"}`} />))}
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 space-y-10">
                <div>
                  <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tighter italic leading-tight mb-8">{currentHall?.name}</h2>
                  <p className="text-white/60 text-base md:text-xl font-light leading-relaxed max-w-xl">{currentHall?.desc}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 py-8 border-y border-white/5">
                  {currentHall?.features.map((feature: string, i: number) => (<div key={i} className="flex items-center gap-4 group"><div className="w-1.5 h-1.5 bg-jazz-gold rounded-full group-hover:scale-150 transition-transform" /><span className="text-[10px] md:text-xs uppercase tracking-widest text-white/80 font-medium group-hover:text-jazz-gold transition-colors">{feature}</span></div>))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-12">
                  <button onClick={handleReservationClick} className="group relative inline-flex px-8 py-5 bg-jazz-gold text-jazz-black text-[10px] uppercase tracking-[0.4em] font-black overflow-hidden transition-all shadow-2xl flex items-center gap-3">
                    <div className="absolute inset-0 bg-white -translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500" />
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
          <div className="w-full md:w-1/2 aspect-[3/4] md:aspect-[4/5] bg-zinc-900 overflow-hidden relative transition-all duration-1000">
            <img src="https://i.postimg.cc/Pqp14S5L/IMG-0695(1).jpg" alt="Jazz atmosphere" className="w-full h-full object-cover opacity-80 border border-black" loading="lazy" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-r from-jazz-black/80 to-transparent" />
            <div className="absolute bottom-10 left-6 md:bottom-12 md:left-12 text-left">
              <Music size={48} className="text-jazz-gold/40 mb-6" />
              <h2 className="text-3xl md:text-6xl font-serif italic text-white tracking-tighter leading-none">{t.vibeRhythm.split(" ").slice(0, 1)} <br /> {t.vibeRhythm.split(" ").slice(1).join(" ")}</h2>
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-10 px-4 md:px-0">
            <div>
              <span className="text-jazz-gold text-[10px] uppercase tracking-[0.5em] mb-4 block font-bold">{t.vibeTitle}</span>
              <h2 className="text-3xl md:text-6xl font-serif text-white tracking-tighter leading-[1] mb-8 italic">{t.vibeQuote.split(" ").slice(0, 2).join(" ")} <br /> {t.vibeQuote.split(" ").slice(2).join(" ")}</h2>
              <p className="text-jazz-cream/40 text-lg font-light leading-relaxed italic max-w-lg mx-auto md:mx-0">{t.vibeDesc}</p>
            </div>
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
              <div className="space-y-4"><p className="text-jazz-gold text-[10px] uppercase tracking-[0.4em] font-bold">{t.vibeLabels.vibe}</p><p className="text-lg md:text-xl font-serif italic text-white/80">{t.vibeLabels.vibeVal}</p></div>
              <div className="space-y-4"><p className="text-jazz-gold text-[10px] uppercase tracking-[0.4em] font-bold">{t.vibeLabels.music}</p><p className="text-lg md:text-xl font-serif italic text-white/80">{t.vibeLabels.musicVal}</p></div>
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
            {t.reviews.map((review, i) => <ReviewCard key={review.name} review={review} index={i} />)}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-24 md:py-32 px-6 md:px-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex justify-center text-center">
          <div className="max-w-2xl px-4 md:px-0">
            <span className="text-[10px] uppercase tracking-[0.5em] text-jazz-gold mb-6 block font-bold">{t.visitTitle}</span>
            <h2 className="text-4xl md:text-8xl font-serif text-white tracking-tighter leading-[0.9] mb-12 italic">{t.visitHeader.split(" ").slice(0, 2).join(" ")} <br /> {t.visitHeader.split(" ").slice(2).join(" ")}</h2>
            <div className="flex flex-col md:flex-row gap-12 md:gap-20 justify-center items-center mb-16 px-4">
              <div className="flex flex-col items-center gap-4"><MapPin className="text-jazz-gold/60" size={32} /><div className="space-y-2"><p className="text-jazz-gold text-[9px] uppercase tracking-[0.3em] font-bold opacity-60">{t.addressLabel}</p><p className="text-xl font-serif italic text-jazz-cream/80 leading-tight">{t.addressValue}</p></div></div>
              <div className="flex flex-col items-center gap-4 text-center"><Clock className="text-jazz-gold/60" size={32} /><div className="space-y-2"><p className="text-jazz-gold text-[9px] uppercase tracking-[0.3em] font-bold opacity-60">{t.workingHoursTitle}</p><div className="text-sm md:text-base font-serif italic text-jazz-cream/80 leading-relaxed uppercase tracking-widest"><p>{t.workingHoursWeek}</p><p>{t.workingHoursThuFri}</p><p>{t.workingHoursSat}</p><p>{t.workingHoursSun}</p></div><p className="text-[10px] uppercase tracking-[0.2em] font-bold text-jazz-gold/90 mt-2">{t.summerHoursAnnouncement}</p></div></div>
              <div className="flex flex-col items-center gap-4"><Phone className="text-jazz-gold/60" size={32} /><div className="space-y-2"><p className="text-jazz-gold text-[9px] uppercase tracking-[0.3em] font-bold opacity-60">{t.resLabel}</p><p className="text-xl font-serif italic text-jazz-cream/80 leading-tight">089 637 0777</p></div></div>
            </div>
            <a href="https://www.google.com/maps/dir/?api=1&destination=ul.+Yoakim+Gruev+21,+4000+Plovdiv" target="_blank" rel="noopener noreferrer" className="inline-block px-8 md:px-12 py-5 border border-jazz-gold/30 text-jazz-gold text-[10px] uppercase tracking-[0.4em] font-black hover:bg-jazz-gold hover:text-jazz-black transition-all duration-500 shadow-xl">{t.directions}</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 pt-20 pb-16 px-8 md:px-16 bg-jazz-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
          <div className="flex flex-col">
            <h2 className="text-4xl font-serif text-jazz-gold tracking-tighter uppercase mb-6">TOMATO</h2>
            <div className="flex gap-10 text-[14px] uppercase tracking-[0.3em] opacity-70 font-bold">
              <a href="https://www.instagram.com/to.mato.2016?igsh=d3MzbjJ6dW0zaWg1" target="_blank" rel="noopener noreferrer" className="hover:text-jazz-gold transition-colors">Instagram</a>
              <a href="#" className="hover:text-jazz-gold transition-colors">{t.spotifyPlaylist}</a>
              <button onClick={handleReservationClick} className="hover:text-jazz-gold transition-colors">{t.bookingTitle}</button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right"><p className="text-[9px] uppercase tracking-[0.4em] opacity-40 mb-2 font-bold">{t.footerContact}</p><p className="text-xl font-sans text-jazz-gold tracking-tighter">089 637 0777</p></div>
            <div className="w-14 h-14 border border-jazz-gold flex items-center justify-center group cursor-pointer hover:bg-jazz-gold transition-colors"><div className="w-1.5 h-1.5 bg-jazz-gold rounded-full group-hover:bg-jazz-black transition-colors" /></div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/20">{t.footerCopyright}</p>
          <div className="flex gap-8 text-[14px] uppercase tracking-[0.3em] text-white/70 italic"><a href="https://ar-studio-business.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-jazz-gold transition-all duration-300 not-italic font-medium">{t.footerBuild}</a><span>{t.footerRights}</span></div>
        </div>
      </footer>
    </div>
  );
}
