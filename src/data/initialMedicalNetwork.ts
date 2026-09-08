import { MedicalNetworkEntry } from '../types';

export const initialMedicalNetwork: MedicalNetworkEntry[] = [
  // القاهرة
  {
    id: 1,
    governorate: 'القاهرة',
    providerName: 'مستشفي كليوباترا',
    area: 'مصر الجديده',
    networkType: 'A+',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: '39 شارع كليوباترا ميدان صلاح الدين',
    telephone: '02 24143931'
  },
  {
    id: 2,
    governorate: 'القاهرة',
    providerName: 'عيادات كليوباترا',
    area: 'التجمع الخامس',
    networkType: 'A+',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: 'قطعه 418 التجمع الخامس مركز المدينة القطاع الثالث',
    telephone: '19668'
  },
  {
    id: 3,
    governorate: 'القاهرة',
    providerName: 'مستشفى شفا - التجمع الخامس',
    area: 'التجمع الخامس',
    networkType: 'A+',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: '164 - 166 ش ال90 الشمالى - التجمع الخامس',
    telephone: '20078888 - 15051'
  },
  {
    id: 5,
    governorate: 'القاهرة',
    providerName: 'المستشفي الجوي التخصصي',
    area: 'التجمع الخامس',
    networkType: 'A',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: 'ش التسعين - التجمع الخامس - القاهره الجديده',
    telephone: '19448'
  },
  {
    id: 6,
    governorate: 'القاهرة',
    providerName: 'مستشفي السلام الدولي',
    area: 'المعادي',
    networkType: 'A',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: 'كورنيش النيل المعادي',
    telephone: '19885'
  },
  {
    id: 8,
    governorate: 'القاهرة',
    providerName: 'المجمع الطبي للقوات المسلحه بالمعادي',
    area: 'المعادي',
    networkType: 'A',
    specialty: 'جميع التخصصات (أشعة وتحاليل)',
    providerType: 'مستشفي',
    address: 'كورنيش النيل - بجوار المحكمه الدستوريه العليا',
    telephone: '25256314 - 25256316'
  },
  {
    id: 9,
    governorate: 'القاهرة',
    providerName: 'مستشفي القاهره التخصصي',
    area: 'مصر الجديده',
    networkType: 'A',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: '4 ش ابو عبيده البكري - روكسي',
    telephone: '24509800 - 19668'
  },
  {
    id: 10,
    governorate: 'القاهرة',
    providerName: 'مستشفي دار الفؤاد',
    area: 'مدينه نصر',
    networkType: 'A',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: 'شارع يوسف عباس متفرع من طريق النصر امام نادي الزهور',
    telephone: '16370'
  },
  {
    id: 11,
    governorate: 'القاهرة',
    providerName: 'مستشفي النزهه الدولي',
    area: 'مساكن شيراتون',
    networkType: 'A',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: '9 شارع الرشيد متفرع من المشير احمد اسماعيل',
    telephone: '22664249 - 22660555'
  },
  {
    id: 39,
    governorate: 'القاهرة',
    providerName: 'مستشفي العيون الدولي',
    area: 'مصر الجديده',
    networkType: 'B',
    specialty: 'جراحه العيون والليزك',
    providerType: 'مستشفي',
    address: '21 شارع الاندلس خلف حديقه الميريلاند - روكسي',
    telephone: '19650'
  },
  {
    id: 98,
    governorate: 'القاهرة',
    providerName: 'التيسير للعلاج الطبيعي والعيادات',
    area: 'مدينه نصر',
    networkType: 'B',
    specialty: 'عيادات خارجيه وعلاج طبيعي',
    providerType: 'مركز طبي',
    address: 'فرع المأمون 53 ش ابن النفيس الحي الثامن',
    telephone: '1006622514'
  },
  {
    id: 160,
    governorate: 'القاهرة',
    providerName: 'مركز برايت لطب الاسنان',
    area: 'المقطم',
    networkType: 'B',
    specialty: 'طب وجراحة الاسنان',
    providerType: 'مركز متخصص',
    address: '4/6 أ ش الجامعه الحديثه - المقطم',
    telephone: '01148400208'
  },
  {
    id: 429,
    governorate: 'القاهرة',
    providerName: 'صيدليات العزبى (روكسي ومصر الجديدة)',
    area: 'مصر الجديدة',
    networkType: 'B',
    specialty: 'أدوية ومستلزمات طبية',
    providerType: 'صيدليه',
    address: '9 شارع ابراهيم من ش الاهرام - روكسي',
    telephone: '19600'
  },
  {
    id: 431,
    governorate: 'القاهرة',
    providerName: 'صيدليات العزبى (مدينة نصر)',
    area: 'مدينة نصر',
    networkType: 'B',
    specialty: 'أدوية ومستلزمات طبية',
    providerType: 'صيدليه',
    address: '9 شارع البطراوى متفرع من شارع عباس العقاد',
    telephone: '19600'
  },
  {
    id: 454,
    governorate: 'القاهرة',
    providerName: 'صيدليات العزبى (المعادي)',
    area: 'المعادى',
    networkType: 'B',
    specialty: 'أدوية ومستلزمات طبية',
    providerType: 'صيدليه',
    address: '45 شارع النصر - ميدان الجزائر',
    telephone: '19600'
  },
  {
    id: 463,
    governorate: 'القاهرة',
    providerName: 'صيدليات العزبى (التجمع الخامس)',
    area: 'التجمع الخامس',
    networkType: 'B',
    specialty: 'أدوية ومستلزمات طبية',
    providerType: 'صيدليه',
    address: 'كايرو فيستيفال سيتي مول وشارع التسعين',
    telephone: '19600'
  },
  {
    id: 622,
    governorate: 'القاهرة',
    providerName: 'صيدليات سيف (الفرع الرئيسي)',
    area: 'المعادى',
    networkType: 'B',
    specialty: 'أدوية ومستلزمات طبية',
    providerType: 'صيدليه',
    address: 'شارع 9 ميدان المحطة',
    telephone: '23593844'
  },
  {
    id: 748,
    governorate: 'القاهرة',
    providerName: 'مراكز كايرو سكان للاشعه',
    area: 'مصر الجديده',
    networkType: 'A',
    specialty: 'أشعة تشخيصية ورنين ومقطعية',
    providerType: 'مركز اشعه',
    address: '18 شارع القبه - بجوار كنيسه الادفنتيست',
    telephone: '19144'
  },
  {
    id: 758,
    governorate: 'القاهرة',
    providerName: 'البرج سكان للأشعة',
    area: 'مصر الجديده',
    networkType: 'B',
    specialty: 'أشعة رنين ومقطعية وسونار',
    providerType: 'مركز اشعه',
    address: '67 ش الميرغني - مصر الجديده',
    telephone: '19911'
  },
  {
    id: 770,
    governorate: 'القاهرة',
    providerName: 'تكنوسكان للاشعة',
    area: 'التجمع الخامس',
    networkType: 'B',
    specialty: 'أشعة تشخيصية',
    providerType: 'مركز اشعه',
    address: 'ميديكال بارك 2 - امام مجمع المحاكم',
    telephone: '19989'
  },
  {
    id: 824,
    governorate: 'القاهرة',
    providerName: 'معامل الفا للتحاليل الطبية',
    area: 'مصر الجديده',
    networkType: 'A',
    specialty: 'تحاليل طبية شاملة',
    providerType: 'معمل تحاليل',
    address: '73 ش الميرغنى عمارة صيدليات سيف',
    telephone: '19186'
  },
  {
    id: 917,
    governorate: 'القاهرة',
    providerName: 'معامل المختبر (التجمع الخامس)',
    area: 'التجمع الخامس',
    networkType: 'B',
    specialty: 'تحاليل طبية',
    providerType: 'معمل تحاليل',
    address: 'ميديكال بارك خلف المستشفى الجوي',
    telephone: '19014'
  },
  {
    id: 1075,
    governorate: 'القاهرة',
    providerName: 'رويال لاب للتحاليل الطبية',
    area: 'مصر الجديده',
    networkType: 'B',
    specialty: 'تحاليل طبية',
    providerType: 'معمل تحاليل',
    address: '5 شارع الطحاوى برج الصفوة - روكسى',
    telephone: '16064'
  },
  {
    id: 1287,
    governorate: 'القاهرة',
    providerName: 'مركز منير نصيف للبصريات',
    area: 'مصر الجديده',
    networkType: 'B',
    specialty: 'نظارات وبصريات طبية',
    providerType: 'بصريات',
    address: '57 ش الخليفه المامون - روكسي',
    telephone: '222562062'
  },
  {
    id: 1294,
    governorate: 'القاهرة',
    providerName: 'مركز منير نصيف للبصريات (وسط البلد)',
    area: 'وسط البلد',
    networkType: 'B',
    specialty: 'نظارات وبصريات طبية',
    providerType: 'بصريات',
    address: '30 ش طلعت حرب - التحرير',
    telephone: '225745506'
  },

  // الجيزة
  {
    id: 1318,
    governorate: 'الجيزة',
    providerName: 'مستشفى مصر الدولى',
    area: 'الدقي',
    networkType: 'A+',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: '12 ش عادل حسين رستم (السرايا سابقا) - الدقى',
    telephone: '16010'
  },
  {
    id: 1320,
    governorate: 'الجيزة',
    providerName: 'مستشفي دار الفؤاد - 6 أكتوبر',
    area: 'اكتوبر',
    networkType: 'A',
    specialty: 'جميع التخصصات وجراحة القلب',
    providerType: 'مستشفي',
    address: 'امتداد محور 26 يوليو الحي المتميز بجوار جامعه مصر',
    telephone: '16370'
  },
  {
    id: 1321,
    governorate: 'الجيزة',
    providerName: 'مستشفى الصفوة - 6 أكتوبر',
    area: 'اكتوبر',
    networkType: 'A',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: 'خدمات الحى الأول بجوار مسجد الحصري',
    telephone: '38372288'
  },
  {
    id: 1322,
    governorate: 'الجيزة',
    providerName: 'مستشفي السلام المهندسين',
    area: 'المهندسين',
    networkType: 'A',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: '3 شارع سوريا - المهندسين',
    telephone: '33030502'
  },
  {
    id: 1323,
    governorate: 'الجيزة',
    providerName: 'مستشفي الكاتب',
    area: 'الدقي',
    networkType: 'A',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: '17 شارع عبد الله الكاتب - ميدان فيني',
    telephone: '0233353322'
  },
  {
    id: 1335,
    governorate: 'الجيزة',
    providerName: 'مستشفي الشيخ زايد التخصصي',
    area: 'الشيخ زايد',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: 'مدينه الشيخ زايد - طريق محور 26 يوليو',
    telephone: '38500927'
  },
  {
    id: 1337,
    governorate: 'الجيزة',
    providerName: 'مستشفي العيون الدولي بالدقي',
    area: 'الدقي',
    networkType: 'B',
    specialty: 'جراحه العيون والليزك',
    providerType: 'مستشفي',
    address: '14 ش عادل حسين رستم ميدان فيني',
    telephone: '19650'
  },
  {
    id: 1446,
    governorate: 'الجيزة',
    providerName: 'مركز ماستر للاسنان (هشام عيسى)',
    area: 'المهندسين',
    networkType: 'B',
    specialty: 'طب وجراحة الاسنان',
    providerType: 'مركز متخصص',
    address: '157 ش السودان امام السلام شوبينج سنتر',
    telephone: '01100835132'
  },
  {
    id: 1613,
    governorate: 'الجيزة',
    providerName: 'صيدليات العزبى (المهندسين والدقي)',
    area: 'المهندسين',
    networkType: 'B',
    specialty: 'أدوية ومستلزمات طبية',
    providerType: 'صيدليه',
    address: '44 شارع لبنان المهندسين العجوزة',
    telephone: '19600'
  },
  {
    id: 1770,
    governorate: 'الجيزة',
    providerName: 'مراكز كايرو سكان للاشعه (المهندسين)',
    area: 'المهندسين',
    networkType: 'A',
    specialty: 'أشعة تشخيصية متقدمة',
    providerType: 'مركز اشعه',
    address: '35 شارع سليمان اباظه - المهندسين',
    telephone: '19144'
  },
  {
    id: 1851,
    governorate: 'الجيزة',
    providerName: 'معامل الفا للتحاليل (المهندسين)',
    area: 'المهندسين',
    networkType: 'A',
    specialty: 'تحاليل طبية',
    providerType: 'معمل تحاليل',
    address: '26 ش البطل احمد عبد العزيز من جامعة الدول',
    telephone: '19186'
  },

  // الإسكندرية
  {
    id: 2131,
    governorate: 'الاسكندرية',
    providerName: 'مستشفي سموحه الدولي',
    area: 'سموحه',
    networkType: 'A',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: '1 ش فوزي معاذ - سموحه',
    telephone: '15012'
  },
  {
    id: 2141,
    governorate: 'الاسكندرية',
    providerName: 'مستشفي مبره العصافره شرق',
    area: 'العصافره',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: '432 شارع ملك حفني امام محطه قطار العصافره',
    telephone: '5551612'
  },
  {
    id: 2142,
    governorate: 'الاسكندرية',
    providerName: 'مستشفي مبره العصافره غرب',
    area: 'الكيلو 21',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: 'ميدان الكيلو 21 - الطريق الساحلي',
    telephone: '033190099'
  },
  {
    id: 2152,
    governorate: 'الاسكندرية',
    providerName: 'مستشفي الالماني بالإسكندرية',
    area: 'سابا باشا',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: '56 شارع عبد السلام عارف',
    telephone: '5841717'
  },
  {
    id: 2158,
    governorate: 'الاسكندرية',
    providerName: 'مستشفى ايليت الإسكندرية',
    area: 'محرم بك',
    networkType: 'A',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: 'أول الطريق الدائرى خلف كارفور وداون تاون',
    telephone: '15461'
  },
  {
    id: 2243,
    governorate: 'الاسكندرية',
    providerName: 'صيدليات العزبي (سان ستيفانو)',
    area: 'سان ستيفانو',
    networkType: 'B',
    specialty: 'أدوية',
    providerType: 'صيدليه',
    address: '2 ش طلعت وش الكازينو امام فندق سان ستيفانو',
    telephone: '19600'
  },
  {
    id: 2246,
    governorate: 'الاسكندرية',
    providerName: 'صيدليات العزبي (رشدي)',
    area: 'رشدى',
    networkType: 'B',
    specialty: 'أدوية',
    providerType: 'صيدليه',
    address: '15 ش سوريا - رشدى',
    telephone: '19600'
  },
  {
    id: 2310,
    governorate: 'الاسكندرية',
    providerName: 'صيدليات بلبع بالإسكندرية',
    area: 'سموحه',
    networkType: 'B',
    specialty: 'أدوية ومستلزمات',
    providerType: 'صيدليه',
    address: '5 شارع فوزي معاذ - سموحه',
    telephone: '034292121'
  },
  {
    id: 2369,
    governorate: 'الاسكندرية',
    providerName: 'مركز دار الاشعه الاسكندريه',
    area: 'محطة الرمل',
    networkType: 'B',
    specialty: 'أشعة رنين ومقطعية',
    providerType: 'مركز اشعه',
    address: '4 شارع امين فكري بجوار مدرسه المنار',
    telephone: '15866'
  },
  {
    id: 2381,
    governorate: 'الاسكندرية',
    providerName: 'سموحه للاشعه',
    area: 'سموحه',
    networkType: 'B',
    specialty: 'أشعة تشخيصية',
    providerType: 'مركز اشعه',
    address: '25 ش فوزي معاذ - سموحة',
    telephone: '034268088'
  },
  {
    id: 2408,
    governorate: 'الاسكندرية',
    providerName: 'معامل المختبر (سموحة)',
    area: 'سموحه',
    networkType: 'B',
    specialty: 'تحاليل طبية',
    providerType: 'معمل تحاليل',
    address: '27 ميدان فيكتوريا عمانويل',
    telephone: '19014'
  },

  // القليوبية
  {
    id: 2555,
    governorate: 'القليوبية',
    providerName: 'مستشفى العبور التخصصي',
    area: 'العبور',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: 'الحي الاول محليه 5 خلف قسم شرطه العبور',
    telephone: '44795152'
  },
  {
    id: 2557,
    governorate: 'القليوبية',
    providerName: 'مستشفى الامل التخصصي - شبرا الخيمة',
    area: 'شبرا الخيمه',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: '15 شارع 25 من ش احمد عرابي',
    telephone: '46043470'
  },
  {
    id: 2563,
    governorate: 'القليوبية',
    providerName: 'مستشفي الراعي الصالح ببنها',
    area: 'بنها',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: '20 ش سعد زغلول - بنها',
    telephone: '0133260280'
  },
  {
    id: 2571,
    governorate: 'القليوبية',
    providerName: 'مستشفي كريستال عصفور',
    area: 'شبرا الخيمه',
    networkType: 'B',
    specialty: 'عيادات خارجيه وجراحة',
    providerType: 'مستشفي',
    address: 'نهايه كوبري احمد عرابي بجوار مسجد كريستال عصفور',
    telephone: '42236557'
  },
  {
    id: 2664,
    governorate: 'القليوبية',
    providerName: 'صيدليات العزبي (شبرا الخيمة)',
    area: 'شبرا الخيمه',
    networkType: 'B',
    specialty: 'أدوية',
    providerType: 'صيدليه',
    address: 'شارع 15 مايو برج طيبة',
    telephone: '19600'
  },
  {
    id: 2675,
    governorate: 'القليوبية',
    providerName: 'صيدليات العزبي (بنها)',
    area: 'بنها',
    networkType: 'B',
    specialty: 'أدوية',
    providerType: 'صيدليه',
    address: 'شارع الجيش محطة الرشيدى شارع فريد ندا',
    telephone: '19600'
  },
  {
    id: 2728,
    governorate: 'القليوبية',
    providerName: 'تكنوسكان للاشعة (بنها)',
    area: 'بنها',
    networkType: 'B',
    specialty: 'أشعة رنين ومقطعية',
    providerType: 'مركز اشعه',
    address: '7 شارع بنك مصر من ش سعد زغلول',
    telephone: '19989'
  },
  {
    id: 2754,
    governorate: 'القليوبية',
    providerName: 'معامل الفا (بنها)',
    area: 'بنها',
    networkType: 'A',
    specialty: 'تحاليل طبية',
    providerType: 'معمل تحاليل',
    address: '29 ش سعد زغلول - محطه العادلي',
    telephone: '19186'
  },

  // الشرقية
  {
    id: 2853,
    governorate: 'الشرقية',
    providerName: 'مستشفي الغندور - العاشر من رمضان',
    area: 'العاشر من رمضان',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: 'منطقه المستشفيات بين الحي الثالث والرابع',
    telephone: '554369327'
  },
  {
    id: 2854,
    governorate: 'الشرقية',
    providerName: 'مستشفي التيسير الدولي بالزقازيق',
    area: 'الزقازيق',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: 'شارع موقف المنصوره - منشيه السادات',
    telephone: '16240'
  },
  {
    id: 2895,
    governorate: 'الشرقية',
    providerName: 'مركز الفا للعيون بالزقازيق',
    area: 'الزقازيق',
    networkType: 'B',
    specialty: 'جراحه العيون والليزك',
    providerType: 'مركز متخصص',
    address: 'نهايه شارع طلبه عويضه برج زيزينيا - القوميه',
    telephone: '0552300312'
  },
  {
    id: 2955,
    governorate: 'الشرقية',
    providerName: 'صيدليات العزبي (الزقازيق)',
    area: 'الزقازيق',
    networkType: 'B',
    specialty: 'أدوية ومستلزمات',
    providerType: 'صيدليه',
    address: 'شارع جمال عبدالناصر بجوار محافظة الشرقية',
    telephone: '19600'
  },
  {
    id: 2990,
    governorate: 'الشرقية',
    providerName: 'تكنوسكان للاشعة (الزقازيق)',
    area: 'الزقازيق',
    networkType: 'B',
    specialty: 'أشعة رنين ومقطعية',
    providerType: 'مركز اشعه',
    address: 'شارع مسجد السلام متفرع من شارع القوميه',
    telephone: '19989'
  },
  {
    id: 3016,
    governorate: 'الشرقية',
    providerName: 'معامل المختبر (الزقازيق)',
    area: 'الزقازيق',
    networkType: 'B',
    specialty: 'تحاليل طبية',
    providerType: 'معمل تحاليل',
    address: 'ناصيه الجلاء والزيات حي المنتزه',
    telephone: '19014'
  },

  // الدقهلية
  {
    id: 3071,
    governorate: 'الدقهلية',
    providerName: 'مستشفي الجزيره الدولي (السلاب)',
    area: 'المنصوره',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: '17 ش الدكتور عاطف المنجي - المشايه السفليه - جزيرة الورد',
    telephone: '050 2208568'
  },
  {
    id: 3072,
    governorate: 'الدقهلية',
    providerName: 'مستشفي الخير الدولي بالمنصورة',
    area: 'المنصوره',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: '153 ش قناه السويس - المنصوره',
    telephone: '0502504066'
  },
  {
    id: 3100,
    governorate: 'الدقهلية',
    providerName: 'صيدليات العزبي (المنصورة)',
    area: 'المنصوره',
    networkType: 'B',
    specialty: 'أدوية',
    providerType: 'صيدليه',
    address: 'عوض الله مول وش قناة السويس بتوريل',
    telephone: '19600'
  },
  {
    id: 3125,
    governorate: 'الدقهلية',
    providerName: 'تكنوسكان للاشعة (المنصورة)',
    area: 'المنصوره',
    networkType: 'B',
    specialty: 'أشعة رنين ومقطعية',
    providerType: 'مركز اشعه',
    address: 'ميدان علي مبارك (الهابي لاند)',
    telephone: '19989'
  },
  {
    id: 3134,
    governorate: 'الدقهلية',
    providerName: 'معامل المختبر (المنصورة)',
    area: 'المنصوره',
    networkType: 'B',
    specialty: 'تحاليل طبية',
    providerType: 'معمل تحاليل',
    address: 'ش الجمهوريه بجوار بنك مصر',
    telephone: '19014'
  },

  // السويس
  {
    id: 3853,
    governorate: 'السويس',
    providerName: 'مستشفي ابن سينا الدولي بالسويس',
    area: 'السويس',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: '8 ش المدينه الرياضيه - الملاحه',
    telephone: '0623496927'
  },
  {
    id: 3855,
    governorate: 'السويس',
    providerName: 'مستشفي المواساه التخصصي بالسويس',
    area: 'الاربعين',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: '296 شارع الجيش - الاربعين',
    telephone: '062 3498539'
  },
  {
    id: 3871,
    governorate: 'السويس',
    providerName: 'صيدليات العزبي (السويس)',
    area: 'السويس',
    networkType: 'B',
    specialty: 'أدوية',
    providerType: 'صيدليه',
    address: 'ش الجلاء وميدان الإسعاف',
    telephone: '19600'
  },
  {
    id: 3886,
    governorate: 'السويس',
    providerName: 'تكنوسكان للاشعة (السويس)',
    area: 'السويس',
    networkType: 'B',
    specialty: 'أشعة تشخيصية',
    providerType: 'مركز اشعه',
    address: 'برج وايت هاوس - 322 شارع الجيش',
    telephone: '19989'
  },
  {
    id: 3891,
    governorate: 'السويس',
    providerName: 'معامل المختبر (السويس)',
    area: 'السويس',
    networkType: 'B',
    specialty: 'تحاليل طبية',
    providerType: 'معمل تحاليل',
    address: '300 ش الجيش ميدان الخضر',
    telephone: '19014'
  },

  // بورسعيد
  {
    id: 3725,
    governorate: 'بورسعيد',
    providerName: 'مستشفي ال سليمان ببورسعيد',
    area: 'بورسعيد',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: 'شارع الامين و سعد زغلول حي المناخ',
    telephone: '0663220220'
  },
  {
    id: 3739,
    governorate: 'بورسعيد',
    providerName: 'صيدليات العزبي (بورسعيد)',
    area: 'بور سعيد',
    networkType: 'B',
    specialty: 'أدوية',
    providerType: 'صيدليه',
    address: '53 شارع عرابي برج الفورسيزون',
    telephone: '19600'
  },
  {
    id: 3747,
    governorate: 'بورسعيد',
    providerName: 'الايمان للاشعه ببورسعيد',
    area: 'بورسعيد',
    networkType: 'B',
    specialty: 'أشعة رنين ومقطعية',
    providerType: 'مركز اشعه',
    address: 'شارع 100 و الازهر - حي العرب',
    telephone: '0663238310'
  },
  {
    id: 3755,
    governorate: 'بورسعيد',
    providerName: 'معامل المختبر (بورسعيد)',
    area: 'بورسعيد',
    networkType: 'B',
    specialty: 'تحاليل طبية',
    providerType: 'معمل تحاليل',
    address: 'شارع الجمهوريه بمجمع البريد الاستثماري',
    telephone: '19014'
  },

  // الإسماعيلية
  {
    id: 3773,
    governorate: 'الاسماعيلية',
    providerName: 'مستشفي الامل التخصصي بالإسماعيلية',
    area: 'الاسماعيليه',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: '24 حي الزهور بجوار مدرسه الزهور',
    telephone: '064 3239186'
  },
  {
    id: 3778,
    governorate: 'الاسماعيلية',
    providerName: 'مستشفي الاسماعيليه للعيون (قرطبة)',
    area: 'الاسماعيليه',
    networkType: 'B',
    specialty: 'جراحه العيون والليزك',
    providerType: 'مركز متخصص',
    address: 'برج قرطبه امام مجمع المحاكم الموقف الجديد',
    telephone: '0643226570'
  },
  {
    id: 3785,
    governorate: 'الاسماعيلية',
    providerName: 'صيدليات العزبي (الإسماعيلية)',
    area: 'الاسماعيليه',
    networkType: 'B',
    specialty: 'أدوية',
    providerType: 'صيدليه',
    address: 'شارع شبين الكوم وشارع الحرية',
    telephone: '19600'
  },
  {
    id: 3791,
    governorate: 'الاسماعيلية',
    providerName: 'الايمان للاشعه بالإسماعيلية',
    area: 'الاسماعيليه',
    networkType: 'B',
    specialty: 'أشعة رنين ومقطعية',
    providerType: 'مركز اشعه',
    address: 'برج الجوهره امام الموقف الجديد ومجمع المحاكم',
    telephone: '0643228984'
  },
  {
    id: 3798,
    governorate: 'الاسماعيلية',
    providerName: 'معامل المختبر (الإسماعيلية)',
    area: 'الاسماعيليه',
    networkType: 'B',
    specialty: 'تحاليل طبية',
    providerType: 'معمل تحاليل',
    address: '41 شارع الجمهوريه (الثلاثيني)',
    telephone: '19014'
  },

  // بني سويف
  {
    id: 3919,
    governorate: 'بني سويف',
    providerName: 'مستشفي برج الجزيره (اللوتس)',
    area: 'بني سويف',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: 'شارع شفيق تقاطع شارع 23 يوليو بجوار مسجد الانبياء',
    telephone: '0822366061'
  },
  {
    id: 3952,
    governorate: 'بني سويف',
    providerName: 'صيدليات العزبي (بني سويف)',
    area: 'بني سويف',
    networkType: 'B',
    specialty: 'أدوية',
    providerType: 'صيدليه',
    address: 'شارع احمد عرابى وش عبدالسلام عارف',
    telephone: '19600'
  },
  {
    id: 3966,
    governorate: 'بني سويف',
    providerName: 'مركز جاما للاشعه (بني سويف)',
    area: 'بني سويف',
    networkType: 'B',
    specialty: 'أشعة تشخيصية',
    providerType: 'مركز اشعه',
    address: 'ميدان الزراعيين بجوار نقابه الزراعيين',
    telephone: '01277850444'
  },
  {
    id: 3974,
    governorate: 'بني سويف',
    providerName: 'معامل المختبر (بني سويف)',
    area: 'بني سويف',
    networkType: 'B',
    specialty: 'تحاليل طبية',
    providerType: 'معمل تحاليل',
    address: '6 ميدان حارث ناصيه ش الجبالي',
    telephone: '19014'
  },

  // الفيوم
  {
    id: 4001,
    governorate: 'الفيوم',
    providerName: 'مستشفي العيون الدولي بالفيوم',
    area: 'الفيوم',
    networkType: 'B',
    specialty: 'جراحه العيون والليزك',
    providerType: 'مستشفي',
    address: '16 أ ش العمده من ش الحريه اعلي النساجون الشرقيون',
    telephone: '19650'
  },
  {
    id: 4003,
    governorate: 'الفيوم',
    providerName: 'مستشفي الندي التخصصي بالفيوم',
    area: 'الفيوم',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: 'المسله – العبودي – برج الندي',
    telephone: '084 2152311'
  },
  {
    id: 4018,
    governorate: 'الفيوم',
    providerName: 'صيدليات العزبي (الفيوم)',
    area: 'الفيوم',
    networkType: 'B',
    specialty: 'أدوية',
    providerType: 'صيدليه',
    address: 'برج اجياد شارع جمال عبدالناصر امام المسلة',
    telephone: '19600'
  },
  {
    id: 4026,
    governorate: 'الفيوم',
    providerName: 'الفيوم سكان للأشعة',
    area: 'الفيوم',
    networkType: 'B',
    specialty: 'أشعة رنين ومقطعية',
    providerType: 'مركز اشعه',
    address: 'شارع النبوي المهندس برج الزهراء امام مستشفي الندي',
    telephone: '0842150516'
  },
  {
    id: 4032,
    governorate: 'الفيوم',
    providerName: 'معامل المختبر (الفيوم)',
    area: 'الفيوم',
    networkType: 'B',
    specialty: 'تحاليل طبية',
    providerType: 'معمل تحاليل',
    address: 'شارع الحريه عماره النساجون الشرقيون وميدان المسلة',
    telephone: '19014'
  },

  // المنيا
  {
    id: 4056,
    governorate: 'المنيا',
    providerName: 'مستشفي المنيا الوطني',
    area: 'المنيا',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: '33 شارع سعد زغلول',
    telephone: '086 2319319'
  },
  {
    id: 4071,
    governorate: 'المنيا',
    providerName: 'صيدليات العزبي (المنيا)',
    area: 'المنيا',
    networkType: 'B',
    specialty: 'أدوية',
    providerType: 'صيدليه',
    address: '32 شارع الجمهورية وشارع طه حسين',
    telephone: '19600'
  },
  {
    id: 4104,
    governorate: 'المنيا',
    providerName: 'مركز الطاهره للاشعه (المنيا الجديدة)',
    area: 'المنيا',
    networkType: 'B',
    specialty: 'أشعة رنين ومقطعية وPET-CT',
    providerType: 'مركز اشعه',
    address: 'سيتى سكيب مول - المنيا الجديده',
    telephone: '19173'
  },
  {
    id: 4111,
    governorate: 'المنيا',
    providerName: 'معامل المختبر (المنيا)',
    area: 'المنيا',
    networkType: 'B',
    specialty: 'تحاليل طبية',
    providerType: 'معمل تحاليل',
    address: 'ميدان المحطه برج سافوي الدور الثاني علوي',
    telephone: '19014'
  },

  // أسيوط
  {
    id: 4134,
    governorate: 'اسيوط',
    providerName: 'مستشفي الحنان التخصصي بأسيوط',
    area: 'اسيوط',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: '9 ش خورشيد من ش ثابت بجوار الفرعونيه للصرافه',
    telephone: '088 2335306'
  },
  {
    id: 4151,
    governorate: 'اسيوط',
    providerName: 'صيدليات العزبي (أسيوط)',
    area: 'اسيوط',
    networkType: 'B',
    specialty: 'أدوية',
    providerType: 'صيدليه',
    address: 'شارع الجمهورية وبرج النحال امتداد يسرى راغب',
    telephone: '19600'
  },
  {
    id: 4171,
    governorate: 'اسيوط',
    providerName: 'تكنوسكان للاشعة (أسيوط)',
    area: 'اسيوط',
    networkType: 'B',
    specialty: 'أشعة تشخيصية',
    providerType: 'مركز اشعه',
    address: 'شارع سيتي الاول بجوار الجمعية الشرعية',
    telephone: '19989'
  },
  {
    id: 4178,
    governorate: 'اسيوط',
    providerName: 'معامل المختبر (أسيوط)',
    area: 'اسيوط',
    networkType: 'B',
    specialty: 'تحاليل طبية',
    providerType: 'معمل تحاليل',
    address: 'ش يسري راغب عماره الاوقاف رقم 4 وش الجمهورية',
    telephone: '19014'
  },

  // سوهاج
  {
    id: 4203,
    governorate: 'سوهاج',
    providerName: 'مستشفي الحياه الدولي بسوهاج',
    area: 'سوهاج',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: 'سوهاج - الغزل - برج نادي الشرطه القبلي',
    telephone: '093 2100858'
  },
  {
    id: 4218,
    governorate: 'سوهاج',
    providerName: 'صيدليات العزبي (سوهاج)',
    area: 'سوهاج',
    networkType: 'B',
    specialty: 'أدوية',
    providerType: 'صيدليه',
    address: 'ميدان الثقافة وشارع 15 الكبش',
    telephone: '19600'
  },
  {
    id: 4255,
    governorate: 'سوهاج',
    providerName: 'دار سوهاج للاشعه',
    area: 'سوهاج',
    networkType: 'B',
    specialty: 'أشعة رنين ومقطعية',
    providerType: 'مركز اشعه',
    address: 'ميدان الثقافه اول شارع اسيوط سوهاج بمبني النيابه الاداريه',
    telephone: '0932306292'
  },
  {
    id: 4260,
    governorate: 'سوهاج',
    providerName: 'معامل المختبر (سوهاج)',
    area: 'سوهاج',
    networkType: 'B',
    specialty: 'تحاليل طبية',
    providerType: 'معمل تحاليل',
    address: 'ميدان العارف بالله وش اسيوط امام مجمع المحاكم',
    telephone: '19014'
  },

  // قنا والأقصر وأسوان
  {
    id: 4274,
    governorate: 'قنا',
    providerName: 'مستشفي الشفاء بقنا',
    area: 'قنا',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: 'كورنيش النيل بجوار كوبري دندره',
    telephone: '1021989199'
  },
  {
    id: 4284,
    governorate: 'قنا',
    providerName: 'صيدليات العزبي (قنا)',
    area: 'قنا',
    networkType: 'B',
    specialty: 'أدوية',
    providerType: 'صيدليه',
    address: 'شارع الأقصر وميدان المحطة',
    telephone: '19600'
  },
  {
    id: 4312,
    governorate: 'الاقصر',
    providerName: 'مستشفي كليوباترا بالأقصر',
    area: 'الاقصر',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: 'شارع كليوباترا - الأقصر',
    telephone: '095 2256322'
  },
  {
    id: 4321,
    governorate: 'الاقصر',
    providerName: 'صيدليات العزبي (الأقصر)',
    area: 'الاقصر',
    networkType: 'B',
    specialty: 'أدوية',
    providerType: 'صيدليه',
    address: 'شارع التلفزيون بجوار خير زمان',
    telephone: '19600'
  },
  {
    id: 4338,
    governorate: 'اسوان',
    providerName: 'مستشفي الهلال الاحمر بأسوان',
    area: 'اسوان',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: 'شرق البندر بجوار مسجد الطابيه',
    telephone: '1203426415'
  },
  {
    id: 4345,
    governorate: 'اسوان',
    providerName: 'صيدليات العزبي (أسوان)',
    area: 'اسوان',
    networkType: 'B',
    specialty: 'أدوية',
    providerType: 'صيدليه',
    address: 'كورنيش النيل مبنى الغرفة التجارية ومول اسوان بلازا',
    telephone: '19600'
  },
  {
    id: 4356,
    governorate: 'اسوان',
    providerName: 'مركز النيل للاشعه و التحاليل بأسوان',
    area: 'اسوان',
    networkType: 'B',
    specialty: 'أشعة وتحاليل',
    providerType: 'مركز اشعه',
    address: 'امام مسجد الطابيه - أسوان',
    telephone: '097 2458000'
  },

  // البحر الأحمر وجنوب وشمال سيناء
  {
    id: 4404,
    governorate: 'البحر الاحمر',
    providerName: 'مستشفي البحر الاحمر بالغردقة',
    area: 'الغردقه',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: 'الدهار طريق النصر',
    telephone: '065 3572161'
  },
  {
    id: 4416,
    governorate: 'البحر الاحمر',
    providerName: 'صيدليات العزبي (الغردقة)',
    area: 'الغردقه',
    networkType: 'B',
    specialty: 'أدوية',
    providerType: 'صيدليه',
    address: 'سنزو مول ومطار الغردقة وممشى الشيراتون',
    telephone: '19600'
  },
  {
    id: 4389,
    governorate: 'جنوب سيناء',
    providerName: 'مستشفي شرم الشيخ الدولي',
    area: 'شرم الشيخ',
    networkType: 'B',
    specialty: 'جميع التخصصات وطوارئ',
    providerType: 'مستشفي',
    address: 'طريق السلام حي النور',
    telephone: '069 3660893'
  },
  {
    id: 4376,
    governorate: 'شمال سيناء',
    providerName: 'مستشفي سيناء التخصصي بالعريش',
    area: 'العريش',
    networkType: 'B',
    specialty: 'جميع التخصصات',
    providerType: 'مستشفي',
    address: '33 ش بورسعيد خلف البنك الاهلي',
    telephone: '068 3360868'
  },
  {
    id: 4453,
    governorate: 'مرسي مطروح',
    providerName: 'مستشفي عبدالله عيسي بمطروح',
    area: 'مرسي مطروح',
    networkType: 'B',
    specialty: 'جميع التخصصات (أشعة وتحاليل)',
    providerType: 'مستشفي',
    address: 'شارع عبد الله عيسي - مرسى مطروح',
    telephone: '046 4934823'
  },
  {
    id: 4457,
    governorate: 'مرسي مطروح',
    providerName: 'صيدليات العزبي (مطروح والعلمين)',
    area: 'مرسي مطروح',
    networkType: 'B',
    specialty: 'أدوية',
    providerType: 'صيدليه',
    address: 'شارع علم الروم ومول أهل مصر بالبوسيت ومارينا والعلمين الجديدة',
    telephone: '19600'
  }
];
