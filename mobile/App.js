import React, { useState, createContext, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// =============================================================================
// 1. DICTIONARY & LOCALIZATION (RU / EN)
// =============================================================================
const TRANSLATIONS = {
  RU: {
    appTitle: 'OmniPass MaaS',
    appSubtitle: 'Мультимодальная транспортная платформа',
    appTagline: 'Бесшовные поездки на автобусах, поездах и такси',
    recoveryBadge: '⚡ Алгоритм динамической защиты стыковок',
    systemStatus: 'СОСТОЯНИЕ СЕТИ В РЕАЛЬНОМ ВРЕМЕНИ',
    allOnTime: '🟢 Все линии в графике • Стыковочное такси: 09:25',
    trainDelayedStatus: (mins, time) =>
      `⚠️ Задержка поезда (+${mins} мин) • Такси автоматически перенесено на ${time}`,

    // Roles
    loginAsPassenger: 'Войти как Пассажир',
    passengerDesc: 'Поиск маршрутов, бронирование единого билета и цифровой QR-пасс',
    loginAsOperator: 'Диспетчерский центр',
    operatorDesc: 'Симулятор сбоев: генерация опозданий и авто-коррекция подачи такси',
    demoFooter: 'Mobility as a Service • Дипломный проект MaaS 2026',

    // Nav Bar
    rolesBack: '‹ Выбор роли',
    passengerPortal: 'Кабинет пассажира',
    operatorCenter: 'Центр управления сетью',
    toOperatorView: 'Диспетчер ➔',
    toPassengerView: 'Пассажир ➔',

    // Tabs
    tabSearch: 'Поиск маршрута',
    tabPass: 'Единый билет',

    // Search
    planTitle: 'Куда вы едете?',
    planSubtitle: 'Сквозной билет объединяет маршруты всех перевозчиков города',
    fromLabel: 'ОТПРАВЛЕНИЕ',
    toLabel: 'НАЗНАЧЕНИЕ',
    departureLabel: 'ВРЕМЯ ПОЕЗДКИ',
    departureValue: 'Сегодня • 08:00 (Рекомендуемое)',
    findRoutesBtn: 'Найти мультимодальные рейсы',
    routeOptionsTitle: 'Рекомендуемые маршруты',

    // Routes
    optimalRoute: 'САМЫЙ БЫСТРЫЙ',
    economyRoute: 'ЭКОНОМИЧНЫЙ',
    expressRoute: 'ЭКСПРЕСС + ТАКСИ',
    duration: 'В пути',
    legsCount: 'пересадки',
    selectRouteBtn: 'Выбрать маршрут',
    selectedRouteBadge: 'Выбран для оформления',
    buyPassBtn: (price) => `Купить единый билет • ${price}`,

    // Pass Tab
    toastPurchased: '🎉 Единый билет оформлен! QR-пропуск активен в Apple Wallet.',
    disruptionActiveTitle: 'Сработала динамическая защита',
    disruptionActiveBody: (mins, taxiTime) =>
      `Поезд №101 задерживается на ${mins} мин. Подача такси SwiftCab автоматически перенесена на ${taxiTime}.`,
    noPenaltyTag: '🛡️ Доплата: 0 ₽ • Пересадка гарантирована',
    normalProtectionActive:
      '🛡️ Защита пересадок активна: такси автоматически переносится при задержке поезда без доплат.',

    // Ticket Pass
    passType: 'OMNIPASS MULTIMODAL PASS',
    refLabel: 'БИЛЕТ:',
    statusOnTime: 'ПО ГРАФИКУ',
    statusRescheduled: 'ПЕРЕНЕСЕНО (+20M)',
    passengerLabel: 'ПАССАЖИР',
    totalFareLabel: 'ТАРИФ',
    originLabel: 'ОТКУДА',
    destLabel: 'КУДА',
    itineraryTitle: 'ГРАФИК СЕГМЕНТОВ МАРШРУТА',

    legBusTitle: 'Автобус №42',
    legBusSub: 'Пригородный ➔ Центральный вокзал (Платформа 4)',
    legTrainTitle: (time) => `Скоростной поезд №101`,
    legTrainSub: (time) => `Центральный вокзал ➔ Деловой терминал (Приб. ${time})`,
    legTaxiTitle: (start, end) => `Стыковочное такси SwiftCab`,
    legTaxiSub: (start, end) => `Подача к выходу терминала А (${start} – ${end})`,

    statusLegOk: 'По расписанию',
    statusLegDelayed: (mins) => `Задержка +${mins}м`,
    statusLegRescheduled: 'Перенесено',
    buffer10m: '⏳ Запас на пересадку: 10 мин',
    autoProtectedBuffer: '⚡ Стыковка защищена алгоритмом MaaS',

    qrHeader: 'ЕДИНЫЙ QR-КОД ДЛЯ ТУРНИКЕТОВ И ПОСАДКИ',
    qrSub: 'Приложите к валидатору в автобусе, на турникете вокзала и покажите водителю такси',
    fullScreenQrBtn: 'Развернуть во весь экран',

    // Bottom Sheet Payment
    payModalTitle: 'Оформление единого билета',
    payMethodLabel: 'Выберите быстрый способ оплаты:',
    methodSbp: 'СБП • Быстрый платёж 0%',
    methodCard: 'Банковская карта (Мир, Visa)',
    methodWallet: 'Кошелёк OmniPass (Баланс: 5 000 ₽)',
    payConfirmBtn: (price) => `Оплатить ${price}`,
    cancelBtn: 'Отмена',

    // Operator Hub
    operatorTitle: 'Операционный симулятор сбоев',
    operatorSubtitle: 'Инструмент для демонстрации работы алгоритма авто-переноса стыковок комиссии.',
    corridorTitle: 'КОНТРОЛИРУЕМЫЙ СЕГМЕНТ СЕТИ',
    trainName: '🚆 Поезд «Экспресс-Сити» №101',
    trainRoute: 'Центральный вокзал ➔ Деловой терминал',
    schedArrival: 'Плановое прибытие:',
    currStatus: 'Текущий статус рейса:',
    downstreamTaxi: 'Стыковочное такси пассажира:',

    simulateSectionTitle: 'ПАРАМЕТРЫ ЗАДЕРЖКИ ДЛЯ СИМУЛЯЦИИ:',
    delayAmountLabel: 'Величина опоздания:',
    delayReasonLabel: 'Причина инцидента:',
    reasonSignal: 'Сбой сигнальной автоматики на перегоне',
    reasonWeather: 'Обледенение контактной сети и путей',
    reasonTraffic: 'Внеплановые технические работы',

    simulateBtn: (mins) => `🚨 СИМУЛИРОВАТЬ ЗАДЕРЖКУ (+${mins} МИН)`,
    simulateSub: 'Алгоритм мгновенно пересчитает время подачи такси без штрафов',
    resetBtn: '🔄 Восстановить расписание по графику',

    talkingPointsTitle: '💡 Подсказка для презентации:',
    talkingPoint1: '1. Нажмите большую красную кнопку симуляции сбоя.',
    talkingPoint2: '2. Стыковочное такси перенесется с 09:25 на 09:45 без штрафа за ожидание.',
    talkingPoint3: '3. Перейдите в "Пассажир ➔" и покажите обновленный премиальный билет комиссии!',
    viewPassengerPassBtn: 'Перейти к билету пассажира ➔',

    driverNotification:
      '🚕 Уведомление водителю SwiftCab (Toyota Camry #88): «Время подачи заказа №88 скорректировано диспетчерской на 09:45. Плата за ожидание отменена по гарантии MaaS».',
  },
  EN: {
    appTitle: 'OmniPass MaaS',
    appSubtitle: 'Universal Mobility as a Service Platform',
    appTagline: 'Seamless journeys across buses, trains, and taxis',
    recoveryBadge: '⚡ Dynamic Disruption Recovery Engine',
    systemStatus: 'REAL-TIME TRANSIT NETWORK STATUS',
    allOnTime: '🟢 All Lines On Schedule • Connecting Taxi: 09:25',
    trainDelayedStatus: (mins, time) =>
      `⚠️ Train Delay (+${mins}m) • Connecting Taxi auto-rescheduled to ${time}`,

    // Roles
    loginAsPassenger: 'Log in as Passenger',
    passengerDesc: 'Search multimodal routes, single-pass booking & Apple Wallet ticket',
    loginAsOperator: 'Transit Operations Hub',
    operatorDesc: 'Disruption Simulator: inject train delays & auto-reschedule taxis',
    demoFooter: 'Mobility as a Service • Capstone Presentation 2026',

    // Nav Bar
    rolesBack: '‹ Roles',
    passengerPortal: 'Passenger Portal',
    operatorCenter: 'Operations Center',
    toOperatorView: 'Operator ➔',
    toPassengerView: 'Passenger ➔',

    // Tabs
    tabSearch: 'Plan Trip',
    tabPass: 'My Pass',

    // Search
    planTitle: 'Where to today?',
    planSubtitle: 'Unified single-pass booking across all public and on-demand operators',
    fromLabel: 'ORIGIN',
    toLabel: 'DESTINATION',
    departureLabel: 'DEPARTURE TIME',
    departureValue: 'Today • 08:00 AM (Recommended)',
    findRoutesBtn: 'Search Multimodal Routes',
    routeOptionsTitle: 'Recommended Itineraries',

    // Routes
    optimalRoute: 'FASTEST JOURNEY',
    economyRoute: 'BEST ECONOMY',
    expressRoute: 'AIRPORT EXPRESS + CAB',
    duration: 'Duration',
    legsCount: 'transfers',
    selectRouteBtn: 'Select this Route',
    selectedRouteBadge: 'Selected for Checkout',
    buyPassBtn: (price) => `Book Single Pass • ${price}`,

    // Pass Tab
    toastPurchased: '🎉 Pass Confirmed! Digital ticket active in your wallet.',
    disruptionActiveTitle: 'Dynamic Recovery Active',
    disruptionActiveBody: (mins, taxiTime) =>
      `Train #101 delayed by ${mins}m. Connecting SwiftCab taxi pickup auto-rescheduled to ${taxiTime}.`,
    noPenaltyTag: '🛡️ $0 Penalty Fee • Guaranteed Connection',
    normalProtectionActive:
      '🛡️ Connection Guarantee Active: Taxis auto-reschedule when trains are delayed at no extra fee.',

    // Ticket Pass
    passType: 'OMNIPASS MULTIMODAL PASS',
    refLabel: 'PASS REF:',
    statusOnTime: 'ON TIME',
    statusRescheduled: 'RESCHEDULED (+20M)',
    passengerLabel: 'PASSENGER',
    totalFareLabel: 'TOTAL FARE',
    originLabel: 'FROM',
    destLabel: 'TO',
    itineraryTitle: 'JOURNEY SEGMENTS TIMELINE',

    legBusTitle: 'Feeder Bus #42',
    legBusSub: 'Suburbia Heights ➔ Central Station (Bay 4)',
    legTrainTitle: (time) => `Express Train #101`,
    legTrainSub: (time) => `Central Station ➔ Grand Terminal (Arr. ${time})`,
    legTaxiTitle: (start, end) => `Connecting Taxi SwiftCab`,
    legTaxiSub: (start, end) => `Terminal A Pickup Zone (${start} – ${end})`,

    statusLegOk: 'On Time',
    statusLegDelayed: (mins) => `+${mins}m Delay`,
    statusLegRescheduled: 'Rescheduled',
    buffer10m: '⏳ Transfer buffer: 10 mins',
    autoProtectedBuffer: '⚡ Protected by MaaS connection engine',

    qrHeader: 'DIGITAL PASS QR CODE FOR GATES & VEHICLES',
    qrSub: 'Tap on turnstiles, bus validators and present to your taxi driver',
    fullScreenQrBtn: 'Fullscreen Apple Wallet View',

    // Bottom Sheet Payment
    payModalTitle: 'Complete Booking Payment',
    payMethodLabel: 'Select Payment Method:',
    methodSbp: 'Instant Bank Transfer (SBP)',
    methodCard: 'Credit / Debit Card (Apple Pay, Mir)',
    methodWallet: 'OmniPass Mobility Wallet ($120.00)',
    payConfirmBtn: (price) => `Authorize & Pay ${price}`,
    cancelBtn: 'Cancel',

    // Operator Hub
    operatorTitle: 'Transit Operations & Delay Simulator',
    operatorSubtitle: 'Tool to demonstrate automatic taxi rescheduling upon unexpected rail incidents.',
    corridorTitle: 'MONITORED TRANSIT CORRIDOR',
    trainName: '🚆 MetroRail Express Line 101',
    trainRoute: 'Central Station ➔ Grand Financial Terminal',
    schedArrival: 'Scheduled Arrival:',
    currStatus: 'Current Corridor Status:',
    downstreamTaxi: 'Connecting Taxi Pickup:',

    simulateSectionTitle: 'SIMULATION INCIDENT PARAMETERS:',
    delayAmountLabel: 'Delay Duration:',
    delayReasonLabel: 'Root Incident Cause:',
    reasonSignal: 'Track signaling automation failure',
    reasonWeather: 'Severe snowstorm / track icing',
    reasonTraffic: 'Unscheduled emergency track repairs',

    simulateBtn: (mins) => `🚨 SIMULATE TRAIN DELAY (+${mins} MINS)`,
    simulateSub: 'MaaS algorithm will immediately reschedule connecting taxi',
    resetBtn: '🔄 Reset Timetable to On-Time',

    talkingPointsTitle: '💡 Presentation Talking Points:',
    talkingPoint1: '1. Tap the big red button to trigger an unexpected train delay.',
    talkingPoint2: '2. Notice the connecting taxi shifts from 09:25 to 09:45 with $0 penalty fee.',
    talkingPoint3: '3. Switch to "Passenger ➔" to show the evaluator the updated premium ticket!',
    viewPassengerPassBtn: 'View Passenger Pass Result ➔',

    driverNotification:
      '🚕 SwiftCab Driver Notice (Toyota Camry #88): "Booking #88 rescheduled by dispatch. New pickup: 09:45. Waiting fee waived under MaaS guarantee."',
  },
};

// =============================================================================
// 2. GLOBAL STATE CONTEXT (MaaS Prototype State)
// =============================================================================
const MaaSContext = createContext();

export const MaaSProvider = ({ children }) => {
  const [lang, setLang] = useState('RU');
  const t = TRANSLATIONS[lang];

  const [currentRole, setCurrentRole] = useState('ROLE_SELECT'); // 'ROLE_SELECT' | 'PASSENGER' | 'ADMIN'
  const [passengerTab, setPassengerTab] = useState('PASS'); // 'SEARCH' | 'PASS'

  const [selectedRouteId, setSelectedRouteId] = useState(1);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [payMethod, setPayMethod] = useState('SBP');

  // Disruption simulation parameters
  const [selectedDelayMinutes, setSelectedDelayMinutes] = useState(20);
  const [selectedReason, setSelectedReason] = useState('SIGNAL');
  const [isTrainDelayed, setIsTrainDelayed] = useState(false);
  const [delayMinutes, setDelayMinutes] = useState(0);

  // Dynamic connection times
  const [trainArrivalTime, setTrainArrivalTime] = useState('09:15');
  const [taxiPickupTime, setTaxiPickupTime] = useState('09:25');
  const [taxiDropoffTime, setTaxiDropoffTime] = useState('09:50');

  const [bookedSuccessToast, setBookedSuccessToast] = useState(false);

  const triggerSimulation = () => {
    const mins = selectedDelayMinutes;
    setIsTrainDelayed(true);
    setDelayMinutes(mins);

    if (mins === 15) {
      setTrainArrivalTime('09:30');
      setTaxiPickupTime('09:40');
      setTaxiDropoffTime('10:05');
    } else if (mins === 20) {
      setTrainArrivalTime('09:35');
      setTaxiPickupTime('09:45');
      setTaxiDropoffTime('10:10');
    } else if (mins === 30) {
      setTrainArrivalTime('09:45');
      setTaxiPickupTime('09:55');
      setTaxiDropoffTime('10:20');
    } else {
      setTrainArrivalTime('10:00');
      setTaxiPickupTime('10:10');
      setTaxiDropoffTime('10:35');
    }
  };

  const resetSimulation = () => {
    setIsTrainDelayed(false);
    setDelayMinutes(0);
    setTrainArrivalTime('09:15');
    setTaxiPickupTime('09:25');
    setTaxiDropoffTime('09:50');
  };

  return (
    <MaaSContext.Provider
      value={{
        lang,
        setLang,
        t,
        currentRole,
        setCurrentRole,
        passengerTab,
        setPassengerTab,
        selectedRouteId,
        setSelectedRouteId,
        showPayModal,
        setShowPayModal,
        showQrModal,
        setShowQrModal,
        payMethod,
        setPayMethod,
        selectedDelayMinutes,
        setSelectedDelayMinutes,
        selectedReason,
        setSelectedReason,
        isTrainDelayed,
        delayMinutes,
        trainArrivalTime,
        taxiPickupTime,
        taxiDropoffTime,
        triggerSimulation,
        resetSimulation,
        bookedSuccessToast,
        setBookedSuccessToast,
      }}
    >
      {children}
    </MaaSContext.Provider>
  );
};

export const useMaaS = () => useContext(MaaSContext);

// =============================================================================
// 3. LANGUAGE SWITCHER (Apple-inspired segmented control)
// =============================================================================
const LanguageSwitcher = () => {
  const { lang, setLang } = useMaaS();
  return (
    <View style={styles.langPillContainer}>
      <TouchableOpacity
        style={[styles.langBtn, lang === 'RU' && styles.langBtnActive]}
        activeOpacity={0.8}
        onPress={() => setLang('RU')}
      >
        <Text style={[styles.langText, lang === 'RU' && styles.langTextActive]}>
          🇷🇺 RU
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.langBtn, lang === 'EN' && styles.langBtnActive]}
        activeOpacity={0.8}
        onPress={() => setLang('EN')}
      >
        <Text style={[styles.langText, lang === 'EN' && styles.langTextActive]}>
          🇬🇧 EN
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// =============================================================================
// 4. ROLE SELECTION SCREEN (Modern Uber/Airbnb Welcome)
// =============================================================================
const RoleSelectionScreen = () => {
  const { t, setCurrentRole, isTrainDelayed, delayMinutes, taxiPickupTime } = useMaaS();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Top Header */}
      <View style={styles.homeTopBar}>
        <View style={styles.tagVersionPill}>
          <Text style={styles.tagVersionText}>MaaS v3.0 Premium</Text>
        </View>
        <LanguageSwitcher />
      </View>

      <ScrollView contentContainerStyle={styles.homeScrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroLogoBubble}>
            <Text style={styles.heroLogoIcon}>🚆</Text>
          </View>
          <Text style={styles.heroTitle}>{t.appTitle}</Text>
          <Text style={styles.heroSubtitle}>{t.appSubtitle}</Text>
          <Text style={styles.heroTagline}>{t.appTagline}</Text>

          <View style={styles.heroPill}>
            <Text style={styles.heroPillText}>{t.recoveryBadge}</Text>
          </View>
        </View>

        {/* Floating Status Card */}
        <View style={styles.floatingStatusCard}>
          <Text style={styles.statusCardHeader}>{t.systemStatus}</Text>
          <Text style={styles.statusCardText}>
            {isTrainDelayed
              ? t.trainDelayedStatus(delayMinutes, taxiPickupTime)
              : t.allOnTime}
          </Text>
        </View>

        {/* Roles Selection Cards */}
        <View style={styles.rolesSection}>
          {/* Passenger Card */}
          <TouchableOpacity
            style={[styles.roleCard, styles.roleCardPassenger]}
            activeOpacity={0.88}
            onPress={() => setCurrentRole('PASSENGER')}
          >
            <View style={styles.roleCardIconContainer}>
              <Text style={styles.roleCardIcon}>🧳</Text>
            </View>
            <View style={styles.roleCardContent}>
              <Text style={styles.roleCardTitle}>{t.loginAsPassenger}</Text>
              <Text style={styles.roleCardDesc}>{t.passengerDesc}</Text>
            </View>
            <View style={styles.roleCardChevron}>
              <Text style={styles.chevronIcon}>›</Text>
            </View>
          </TouchableOpacity>

          {/* Operator Card */}
          <TouchableOpacity
            style={[styles.roleCard, styles.roleCardOperator]}
            activeOpacity={0.88}
            onPress={() => setCurrentRole('ADMIN')}
          >
            <View style={[styles.roleCardIconContainer, styles.roleCardIconOperator]}>
              <Text style={styles.roleCardIcon}>🚨</Text>
            </View>
            <View style={styles.roleCardContent}>
              <Text style={styles.roleCardTitle}>{t.loginAsOperator}</Text>
              <Text style={styles.roleCardDesc}>{t.operatorDesc}</Text>
            </View>
            <View style={styles.roleCardChevron}>
              <Text style={styles.chevronIcon}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.homeFooter}>
          <Text style={styles.homeFooterText}>{t.demoFooter}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// =============================================================================
// 5. PASSENGER SEARCH SCREEN (Apple Maps / Citymapper Inspired)
// =============================================================================
const PassengerSearchTab = () => {
  const { t, lang, selectedRouteId, setSelectedRouteId, setShowPayModal } = useMaaS();
  const [fromLoc, setFromLoc] = useState(lang === 'RU' ? 'Академгородок, Пригород' : 'Green Suburbia Heights');
  const [toLoc, setToLoc] = useState(lang === 'RU' ? 'Инновационный Технопарк' : 'Innovation Tech Park');

  const priceSign = lang === 'RU' ? '₽' : '$';
  const priceMulti = lang === 'RU' ? 85 : 1;

  const routes = [
    {
      id: 1,
      badge: t.optimalRoute,
      badgeColor: '#0066FF',
      time: '08:00 ➔ 09:50',
      duration: '1h 50m',
      transfers: '2 transfers',
      price: 34 * priceMulti,
      segments: [
        { mode: 'BUS', icon: '🚌', title: 'Feeder Bus #42', time: '08:00 - 08:30', color: '#0284C7' },
        { mode: 'TRAIN', icon: '🚆', title: 'Express Train #101', time: '08:40 - 09:15', color: '#7C3AED' },
        { mode: 'TAXI', icon: '🚕', title: 'SwiftCab On-Demand', time: '09:25 - 09:50', color: '#D97706' },
      ],
    },
    {
      id: 2,
      badge: t.economyRoute,
      badgeColor: '#059669',
      time: '07:45 ➔ 10:00',
      duration: '2h 15m',
      transfers: '1 transfer',
      price: 12 * priceMulti,
      segments: [
        { mode: 'BUS', icon: '🚌', title: 'City Bus #15', time: '07:45 - 08:25', color: '#0284C7' },
        { mode: 'METRO', icon: '🚇', title: 'Metro Line Red', time: '08:40 - 10:00', color: '#DC2626' },
      ],
    },
    {
      id: 3,
      badge: t.expressRoute,
      badgeColor: '#7C3AED',
      time: '08:15 ➔ 09:25',
      duration: '1h 10m',
      transfers: '1 transfer',
      price: 48 * priceMulti,
      segments: [
        { mode: 'TRAIN', icon: '🚆', title: 'AeroExpress #204', time: '08:15 - 08:50', color: '#7C3AED' },
        { mode: 'TAXI', icon: '🚕', title: 'SwiftCab Comfort+', time: '09:00 - 09:25', color: '#D97706' },
      ],
    },
  ];

  const currentRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  return (
    <View style={styles.tabContainer}>
      <ScrollView style={styles.tabScrollView} showsVerticalScrollIndicator={false}>
        {/* Title & Subtitle */}
        <View style={styles.headerTextBlock}>
          <Text style={styles.pageTitle}>{t.planTitle}</Text>
          <Text style={styles.pageSubtitle}>{t.planSubtitle}</Text>
        </View>

        {/* Clean Apple Maps Floating Search Box */}
        <View style={styles.searchCardWrapper}>
          <View style={styles.searchInputRow}>
            <View style={styles.originDot} />
            <View style={styles.inputFlex}>
              <Text style={styles.inputMiniLabel}>{t.fromLabel}</Text>
              <TextInput style={styles.inputText} value={fromLoc} onChangeText={setFromLoc} />
            </View>
          </View>

          <View style={styles.searchInnerDivider} />

          <View style={styles.searchInputRow}>
            <View style={styles.destinationSquare} />
            <View style={styles.inputFlex}>
              <Text style={styles.inputMiniLabel}>{t.toLabel}</Text>
              <TextInput style={styles.inputText} value={toLoc} onChangeText={setToLoc} />
            </View>
          </View>

          <View style={styles.searchInnerDivider} />

          <View style={styles.searchInputRow}>
            <Text style={styles.calendarIcon}>🕒</Text>
            <View style={styles.inputFlex}>
              <Text style={styles.inputMiniLabel}>{t.departureLabel}</Text>
              <Text style={styles.dateTimeDisplay}>{t.departureValue}</Text>
            </View>
          </View>
        </View>

        {/* Route Cards Header */}
        <View style={styles.routeSectionHeaderRow}>
          <Text style={styles.routeSectionTitle}>{t.routeOptionsTitle}</Text>
          <Text style={styles.routeCountPill}>3 options</Text>
        </View>

        {/* Interactive Route Cards */}
        {routes.map((route) => {
          const isSelected = selectedRouteId === route.id;
          const formattedPrice = `${route.price.toLocaleString()} ${priceSign}`;

          return (
            <TouchableOpacity
              key={route.id}
              style={[styles.cleanRouteCard, isSelected && styles.cleanRouteCardSelected]}
              activeOpacity={0.9}
              onPress={() => setSelectedRouteId(route.id)}
            >
              {/* Card Header */}
              <View style={styles.cleanRouteTop}>
                <View style={[styles.pillBadge, { backgroundColor: route.badgeColor }]}>
                  <Text style={styles.pillBadgeText}>{route.badge}</Text>
                </View>
                <Text style={styles.cleanRoutePrice}>{formattedPrice}</Text>
              </View>

              {/* Time & Duration */}
              <View style={styles.cleanRouteTimeRow}>
                <Text style={styles.cleanRouteTime}>{route.time}</Text>
                <Text style={styles.cleanRouteDuration}>
                  ⏱️ {route.duration} • {route.segments.length} {t.legsCount}
                </Text>
              </View>

              {/* Visual Segment Timeline Pills */}
              <View style={styles.segmentPillChain}>
                {route.segments.map((seg, sIdx) => (
                  <View key={sIdx} style={styles.segmentChainItem}>
                    <View style={[styles.segmentIconBox, { backgroundColor: seg.color }]}>
                      <Text style={styles.segmentIconText}>{seg.icon}</Text>
                    </View>
                    {sIdx < route.segments.length - 1 && <View style={styles.chainConnectorLine} />}
                  </View>
                ))}
              </View>

              {/* Selection Indicator */}
              <View style={styles.cardSelectionFooter}>
                {isSelected ? (
                  <View style={styles.selectedPillBadge}>
                    <Text style={styles.selectedPillBadgeText}>✓ {t.selectedRouteBadge}</Text>
                  </View>
                ) : (
                  <Text style={styles.unselectedPrompt}>{t.selectRouteBtn} ›</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Floating Modern Thumb-Friendly Action Bar */}
      <View style={styles.floatingActionDock}>
        <TouchableOpacity
          style={styles.primaryActionButton}
          activeOpacity={0.88}
          onPress={() => setShowPayModal(true)}
        >
          <Text style={styles.primaryActionText}>
            {t.buyPassBtn(`${currentRoute.price.toLocaleString()} ${priceSign}`)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// =============================================================================
// 6. PASSENGER PASS SCREEN (Apple Wallet / Google Wallet Digital Pass)
// =============================================================================
const PassengerPassTab = () => {
  const {
    t,
    lang,
    isTrainDelayed,
    delayMinutes,
    trainArrivalTime,
    taxiPickupTime,
    taxiDropoffTime,
    bookedSuccessToast,
    setBookedSuccessToast,
    setShowQrModal,
  } = useMaaS();

  const priceText = lang === 'RU' ? '2 890 ₽' : '$34.00';

  return (
    <ScrollView style={styles.tabScrollView} showsVerticalScrollIndicator={false}>
      {/* Toast Alert */}
      {bookedSuccessToast && (
        <View style={styles.modernSuccessToast}>
          <Text style={styles.toastEmoji}>🎉</Text>
          <Text style={styles.toastMessageText}>{t.toastPurchased}</Text>
          <TouchableOpacity onPress={() => setBookedSuccessToast(false)}>
            <Text style={styles.toastCloseBtn}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* DYNAMIC DISRUPTION RECOVERY BANNER */}
      {isTrainDelayed ? (
        <View style={styles.disruptionAlertCard}>
          <View style={styles.disruptionHeaderRow}>
            <View style={styles.alertIconBubble}>
              <Text style={styles.alertIconBubbleText}>⚠️</Text>
            </View>
            <View style={styles.disruptionTitleCol}>
              <Text style={styles.disruptionTitle}>{t.disruptionActiveTitle}</Text>
              <Text style={styles.disruptionSub}>
                {t.disruptionActiveBody(delayMinutes, taxiPickupTime)}
              </Text>
            </View>
          </View>
          <View style={styles.guaranteeTag}>
            <Text style={styles.guaranteeTagText}>{t.noPenaltyTag}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.passiveProtectionCard}>
          <Text style={styles.passiveProtectionEmoji}>🛡️</Text>
          <Text style={styles.passiveProtectionText}>{t.normalProtectionActive}</Text>
        </View>
      )}

      {/* APPLE WALLET STYLE DIGITAL BOARDING PASS */}
      <View style={styles.walletTicketWrapper}>
        {/* Pass Top Banner */}
        <View style={styles.walletPassHeader}>
          <View>
            <Text style={styles.walletBrandHeader}>{t.passType}</Text>
            <Text style={styles.walletPassRef}>REF: MAAS-2026-X892</Text>
          </View>
          <View
            style={[
              styles.walletStatusPill,
              { backgroundColor: isTrainDelayed ? '#F59E0B' : '#059669' },
            ]}
          >
            <Text style={styles.walletStatusText}>
              {isTrainDelayed ? t.statusRescheduled : t.statusOnTime}
            </Text>
          </View>
        </View>

        {/* Passenger & Fare Grid */}
        <View style={styles.walletInfoGrid}>
          <View style={styles.walletInfoCol}>
            <Text style={styles.walletLabel}>{t.passengerLabel}</Text>
            <Text style={styles.walletValue}>
              {lang === 'RU' ? 'Алиса Смирнова' : 'Alice Smith'}
            </Text>
          </View>
          <View style={styles.walletInfoCol}>
            <Text style={styles.walletLabel}>{t.totalFareLabel}</Text>
            <Text style={styles.walletValue}>{priceText} (CONFIRMED)</Text>
          </View>
        </View>

        <View style={styles.walletInfoGrid}>
          <View style={styles.walletInfoCol}>
            <Text style={styles.walletLabel}>{t.originLabel}</Text>
            <Text style={styles.walletValue}>
              {lang === 'RU' ? 'Академгородок' : 'Suburbia Green'}
            </Text>
          </View>
          <View style={styles.walletInfoCol}>
            <Text style={styles.walletLabel}>{t.destLabel}</Text>
            <Text style={styles.walletValue}>
              {lang === 'RU' ? 'Технопарк' : 'Tech Park'}
            </Text>
          </View>
        </View>

        {/* Scalloped Notches & Dashed Line */}
        <View style={styles.scallopedRow}>
          <View style={styles.notchLeft} />
          <View style={styles.dashedSeparator} />
          <View style={styles.notchRight} />
        </View>

        {/* Connected Vertical Timeline of Segments */}
        <Text style={styles.timelineSectionHeading}>{t.itineraryTitle}</Text>

        <View style={styles.verticalTimeline}>
          {/* Segment 1: Bus */}
          <View style={styles.timelineItemRow}>
            <View style={styles.timelineNodeCol}>
              <View style={[styles.timelineNodeDot, { backgroundColor: '#0284C7' }]}>
                <Text style={styles.nodeIcon}>🚌</Text>
              </View>
              <View style={styles.timelineVerticalLine} />
            </View>
            <View style={styles.timelineContentBox}>
              <View style={styles.timelineHeaderLine}>
                <Text style={styles.segmentName}>{t.legBusTitle}</Text>
                <Text style={styles.statusOkText}>{t.statusLegOk}</Text>
              </View>
              <Text style={styles.segmentSubDetails}>{t.legBusSub}</Text>
              <Text style={styles.bufferTagText}>{t.buffer10m}</Text>
            </View>
          </View>

          {/* Segment 2: Train */}
          <View style={styles.timelineItemRow}>
            <View style={styles.timelineNodeCol}>
              <View style={[styles.timelineNodeDot, { backgroundColor: '#7C3AED' }]}>
                <Text style={styles.nodeIcon}>🚆</Text>
              </View>
              <View style={styles.timelineVerticalLine} />
            </View>
            <View style={styles.timelineContentBox}>
              <View style={styles.timelineHeaderLine}>
                <Text style={styles.segmentName}>
                  {t.legTrainTitle(isTrainDelayed ? trainArrivalTime : '09:15')}
                </Text>
                <Text style={isTrainDelayed ? styles.statusDelayedText : styles.statusOkText}>
                  {isTrainDelayed ? t.statusLegDelayed(delayMinutes) : t.statusLegOk}
                </Text>
              </View>
              <Text style={styles.segmentSubDetails}>
                {t.legTrainSub(isTrainDelayed ? trainArrivalTime : '09:15')}
              </Text>
              <Text style={styles.bufferTagText}>{t.autoProtectedBuffer}</Text>
            </View>
          </View>

          {/* Segment 3: Taxi (Dynamic State-Dependent) */}
          <View style={styles.timelineItemRow}>
            <View style={styles.timelineNodeCol}>
              <View
                style={[
                  styles.timelineNodeDot,
                  { backgroundColor: isTrainDelayed ? '#F59E0B' : '#D97706' },
                ]}
              >
                <Text style={styles.nodeIcon}>🚕</Text>
              </View>
            </View>
            <View
              style={[
                styles.timelineContentBox,
                isTrainDelayed && styles.timelineContentBoxHighlighted,
              ]}
            >
              <View style={styles.timelineHeaderLine}>
                <Text style={styles.segmentName}>
                  {t.legTaxiTitle(taxiPickupTime, taxiDropoffTime)}
                </Text>
                <Text style={isTrainDelayed ? styles.statusRescheduledText : styles.statusOkText}>
                  {isTrainDelayed ? t.statusLegRescheduled : t.statusLegOk}
                </Text>
              </View>
              <Text style={styles.segmentSubDetails}>
                {t.legTaxiSub(taxiPickupTime, taxiDropoffTime)}
              </Text>
            </View>
          </View>
        </View>

        {/* Dashed Tear Line */}
        <View style={styles.scallopedRow}>
          <View style={styles.notchLeft} />
          <View style={styles.dashedSeparator} />
          <View style={styles.notchRight} />
        </View>

        {/* QR Code Section */}
        <View style={styles.walletQrSection}>
          <Text style={styles.qrHeaderLabel}>{t.qrHeader}</Text>

          <TouchableOpacity
            style={styles.premiumQrContainer}
            activeOpacity={0.88}
            onPress={() => setShowQrModal(true)}
          >
            <View style={styles.qrRow}>
              <View style={styles.qrEyeSquare} />
              <View style={styles.qrPixelBlock} />
              <View style={styles.qrEyeSquare} />
            </View>
            <View style={styles.qrRow}>
              <View style={styles.qrBarWide} />
              <View style={styles.qrCenterBadge}>
                <Text style={styles.qrCenterEmoji}>🚆</Text>
              </View>
              <View style={styles.qrBarWide} />
            </View>
            <View style={styles.qrRow}>
              <View style={styles.qrEyeSquare} />
              <View style={styles.qrPixelBlock} />
              <View style={styles.qrEyeSquare} />
            </View>
          </TouchableOpacity>

          <Text style={styles.qrInstructionText}>{t.qrSub}</Text>

          <TouchableOpacity
            style={styles.walletExpandButton}
            activeOpacity={0.8}
            onPress={() => setShowQrModal(true)}
          >
            <Text style={styles.walletExpandText}>{t.fullScreenQrBtn}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

// =============================================================================
// 7. PASSENGER SCREEN (CONTAINER WITH NAVIGATION & BOTTOM SHEETS)
// =============================================================================
const PassengerScreen = () => {
  const {
    t,
    lang,
    setCurrentRole,
    passengerTab,
    setPassengerTab,
    isTrainDelayed,
    showPayModal,
    setShowPayModal,
    showQrModal,
    setShowQrModal,
    payMethod,
    setPayMethod,
    setBookedSuccessToast,
  } = useMaaS();

  const handleConfirmPayment = () => {
    setShowPayModal(false);
    setBookedSuccessToast(true);
    setPassengerTab('PASS');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Screen Top Bar */}
      <View style={styles.screenTopBar}>
        <TouchableOpacity
          style={styles.topBarBackBtn}
          activeOpacity={0.7}
          onPress={() => setCurrentRole('ROLE_SELECT')}
        >
          <Text style={styles.topBarBackText}>{t.rolesBack}</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitleText}>{t.passengerPortal}</Text>
        <TouchableOpacity
          style={styles.topBarSwitchRolePill}
          activeOpacity={0.8}
          onPress={() => setCurrentRole('ADMIN')}
        >
          <Text style={styles.topBarSwitchRoleText}>{t.toOperatorView}</Text>
        </TouchableOpacity>
      </View>

      {/* Tab View */}
      {passengerTab === 'SEARCH' ? <PassengerSearchTab /> : <PassengerPassTab />}

      {/* Modern Bottom Tab Bar */}
      <View style={styles.modernBottomNav}>
        <TouchableOpacity
          style={[styles.bottomNavTab, passengerTab === 'SEARCH' && styles.bottomNavTabActive]}
          activeOpacity={0.8}
          onPress={() => setPassengerTab('SEARCH')}
        >
          <Text style={styles.bottomNavIcon}>🔍</Text>
          <Text
            style={[
              styles.bottomNavLabel,
              passengerTab === 'SEARCH' && styles.bottomNavLabelActive,
            ]}
          >
            {t.tabSearch}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bottomNavTab, passengerTab === 'PASS' && styles.bottomNavTabActive]}
          activeOpacity={0.8}
          onPress={() => setPassengerTab('PASS')}
        >
          <View style={styles.iconWithBadgeWrapper}>
            <Text style={styles.bottomNavIcon}>🎫</Text>
            {isTrainDelayed && <View style={styles.redBadgeDot} />}
          </View>
          <Text
            style={[
              styles.bottomNavLabel,
              passengerTab === 'PASS' && styles.bottomNavLabelActive,
            ]}
          >
            {t.tabPass}
          </Text>
        </TouchableOpacity>
      </View>

      {/* SLEEK BOTTOM SHEET MODAL: PAYMENT */}
      <Modal visible={showPayModal} transparent animationType="slide">
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity
            style={styles.sheetBackdropDismiss}
            activeOpacity={1}
            onPress={() => setShowPayModal(false)}
          />
          <View style={styles.bottomSheetCard}>
            <View style={styles.bottomSheetGrabber} />
            <Text style={styles.sheetTitle}>{t.payModalTitle}</Text>
            <Text style={styles.sheetSubtitle}>{t.payMethodLabel}</Text>

            {/* Payment Options */}
            <TouchableOpacity
              style={[styles.sheetOptionRow, payMethod === 'SBP' && styles.sheetOptionRowSelected]}
              activeOpacity={0.85}
              onPress={() => setPayMethod('SBP')}
            >
              <Text style={styles.optionEmoji}>⚡</Text>
              <Text style={styles.optionLabel}>{t.methodSbp}</Text>
              {payMethod === 'SBP' && <Text style={styles.optionCheck}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sheetOptionRow, payMethod === 'CARD' && styles.sheetOptionRowSelected]}
              activeOpacity={0.85}
              onPress={() => setPayMethod('CARD')}
            >
              <Text style={styles.optionEmoji}>💳</Text>
              <Text style={styles.optionLabel}>{t.methodCard}</Text>
              {payMethod === 'CARD' && <Text style={styles.optionCheck}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sheetOptionRow, payMethod === 'WALLET' && styles.sheetOptionRowSelected]}
              activeOpacity={0.85}
              onPress={() => setPayMethod('WALLET')}
            >
              <Text style={styles.optionEmoji}>👛</Text>
              <Text style={styles.optionLabel}>{t.methodWallet}</Text>
              {payMethod === 'WALLET' && <Text style={styles.optionCheck}>✓</Text>}
            </TouchableOpacity>

            {/* Confirm Button */}
            <TouchableOpacity
              style={styles.sheetConfirmButton}
              activeOpacity={0.88}
              onPress={handleConfirmPayment}
            >
              <Text style={styles.sheetConfirmButtonText}>
                {t.payConfirmBtn(lang === 'RU' ? '2 890 ₽' : '$34.00')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetCancelButton}
              activeOpacity={0.7}
              onPress={() => setShowPayModal(false)}
            >
              <Text style={styles.sheetCancelButtonText}>{t.cancelBtn}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* FULLSCREEN WALLET QR MODAL */}
      <Modal visible={showQrModal} transparent animationType="fade">
        <View style={styles.fullScreenQrOverlay}>
          <View style={styles.fullScreenQrCard}>
            <Text style={styles.fullScreenBrand}>OMNIPASS WALLET PASS</Text>
            <Text style={styles.fullScreenSub}>
              {lang === 'RU'
                ? 'Поднесите экран к считывателю турникета'
                : 'Hold display near the scanner validator'}
            </Text>

            {/* Large QR */}
            <View style={styles.largeQrBox}>
              <View style={styles.qrRow}>
                <View style={[styles.qrEyeSquare, { width: 44, height: 44 }]} />
                <View style={[styles.qrPixelBlock, { width: 18, height: 18 }]} />
                <View style={[styles.qrEyeSquare, { width: 44, height: 44 }]} />
              </View>
              <View style={styles.qrRow}>
                <View style={[styles.qrBarWide, { width: 52, height: 20 }]} />
                <View style={[styles.qrCenterBadge, { width: 48, height: 48, borderRadius: 24 }]}>
                  <Text style={{ fontSize: 24 }}>🚆</Text>
                </View>
                <View style={[styles.qrBarWide, { width: 52, height: 20 }]} />
              </View>
              <View style={styles.qrRow}>
                <View style={[styles.qrEyeSquare, { width: 44, height: 44 }]} />
                <View style={[styles.qrPixelBlock, { width: 18, height: 18 }]} />
                <View style={[styles.qrEyeSquare, { width: 44, height: 44 }]} />
              </View>
            </View>

            <Text style={styles.fullScreenCodeText}>OMNIPASS:ALICE:SEG_1-2-3:ACTIVE</Text>

            <TouchableOpacity
              style={styles.fullScreenCloseBtn}
              activeOpacity={0.8}
              onPress={() => setShowQrModal(false)}
            >
              <Text style={styles.fullScreenCloseText}>✕ {t.cancelBtn}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// =============================================================================
// 8. ADMIN / OPERATOR SCREEN (DISRUPTION SIMULATOR)
// =============================================================================
const AdminScreen = () => {
  const {
    t,
    setCurrentRole,
    selectedDelayMinutes,
    setSelectedDelayMinutes,
    selectedReason,
    setSelectedReason,
    isTrainDelayed,
    delayMinutes,
    trainArrivalTime,
    taxiPickupTime,
    triggerSimulation,
    resetSimulation,
  } = useMaaS();

  const [toastMessage, setToastMessage] = useState(null);

  const handleSimulate = () => {
    triggerSimulation();
    setToastMessage(
      `🚨 Задержка +${selectedDelayMinutes} мин зарегистрирована. Стыковочное такси №88 перенесено на ${
        selectedDelayMinutes === 15
          ? '09:40'
          : selectedDelayMinutes === 20
          ? '09:45'
          : selectedDelayMinutes === 30
          ? '09:55'
          : '10:10'
      }. Доплата: 0 ₽.`
    );
  };

  const handleReset = () => {
    resetSimulation();
    setToastMessage('🔄 Расписание успешно сброшено. Рейсы следуют по плановому графику.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Screen Top Bar */}
      <View style={styles.screenTopBar}>
        <TouchableOpacity
          style={styles.topBarBackBtn}
          activeOpacity={0.7}
          onPress={() => setCurrentRole('ROLE_SELECT')}
        >
          <Text style={styles.topBarBackText}>{t.rolesBack}</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitleText}>{t.operatorCenter}</Text>
        <TouchableOpacity
          style={styles.topBarSwitchRolePill}
          activeOpacity={0.8}
          onPress={() => setCurrentRole('PASSENGER')}
        >
          <Text style={styles.topBarSwitchRoleText}>{t.toPassengerView}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.tabScrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.headerTextBlock}>
          <Text style={styles.pageTitle}>{t.operatorTitle}</Text>
          <Text style={styles.pageSubtitle}>{t.operatorSubtitle}</Text>
        </View>

        {/* Success Alert Banner */}
        {toastMessage && (
          <View style={styles.operatorToastCard}>
            <Text style={styles.operatorToastText}>{toastMessage}</Text>
            <TouchableOpacity onPress={() => setToastMessage(null)}>
              <Text style={styles.toastCloseBtn}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Live Monitored Corridor Card */}
        <View style={styles.corridorMonitorCard}>
          <Text style={styles.corridorTag}>{t.corridorTitle}</Text>
          <Text style={styles.corridorHeading}>{t.trainName}</Text>
          <Text style={styles.corridorSubText}>{t.trainRoute}</Text>

          <View style={styles.corridorDataRow}>
            <Text style={styles.dataRowLabel}>{t.schedArrival}</Text>
            <Text style={styles.dataRowValue}>09:15</Text>
          </View>

          <View style={styles.corridorDataRow}>
            <Text style={styles.dataRowLabel}>{t.currStatus}</Text>
            <Text
              style={[
                styles.dataRowValue,
                { color: isTrainDelayed ? '#EF4444' : '#059669', fontWeight: '800' },
              ]}
            >
              {isTrainDelayed
                ? `ЗАДЕРЖКА (+${delayMinutes} МИН) — Приб. ${trainArrivalTime}`
                : 'ПО ГРАФИКУ (09:15)'}
            </Text>
          </View>

          <View style={styles.corridorDataRow}>
            <Text style={styles.dataRowLabel}>{t.downstreamTaxi}</Text>
            <Text
              style={[
                styles.dataRowValue,
                { color: isTrainDelayed ? '#F59E0B' : '#0F172A', fontWeight: '800' },
              ]}
            >
              SwiftCab #88 @ {taxiPickupTime}
            </Text>
          </View>
        </View>

        {/* Simulation Configuration Card */}
        <View style={styles.configIncidentCard}>
          <Text style={styles.configCardLabel}>{t.simulateSectionTitle}</Text>

          {/* Delay Minutes Selection */}
          <Text style={styles.configFieldLabel}>{t.delayAmountLabel}</Text>
          <View style={styles.delayPillsGrid}>
            {[15, 20, 30, 45].map((mins) => (
              <TouchableOpacity
                key={mins}
                style={[
                  styles.delayPillButton,
                  selectedDelayMinutes === mins && styles.delayPillButtonActive,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedDelayMinutes(mins)}
              >
                <Text
                  style={[
                    styles.delayPillButtonText,
                    selectedDelayMinutes === mins && styles.delayPillButtonTextActive,
                  ]}
                >
                  +{mins} мин
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Incident Reasons */}
          <Text style={styles.configFieldLabel}>{t.delayReasonLabel}</Text>
          <View style={styles.reasonsList}>
            <TouchableOpacity
              style={[
                styles.reasonSelectionRow,
                selectedReason === 'SIGNAL' && styles.reasonSelectionRowActive,
              ]}
              activeOpacity={0.85}
              onPress={() => setSelectedReason('SIGNAL')}
            >
              <Text style={styles.reasonEmoji}>🚥</Text>
              <Text style={styles.reasonLabelText}>{t.reasonSignal}</Text>
              {selectedReason === 'SIGNAL' && <Text style={styles.reasonCheck}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.reasonSelectionRow,
                selectedReason === 'WEATHER' && styles.reasonSelectionRowActive,
              ]}
              activeOpacity={0.85}
              onPress={() => setSelectedReason('WEATHER')}
            >
              <Text style={styles.reasonEmoji}>❄️</Text>
              <Text style={styles.reasonLabelText}>{t.reasonWeather}</Text>
              {selectedReason === 'WEATHER' && <Text style={styles.reasonCheck}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.reasonSelectionRow,
                selectedReason === 'REPAIRS' && styles.reasonSelectionRowActive,
              ]}
              activeOpacity={0.85}
              onPress={() => setSelectedReason('REPAIRS')}
            >
              <Text style={styles.reasonEmoji}>🔧</Text>
              <Text style={styles.reasonLabelText}>{t.reasonTraffic}</Text>
              {selectedReason === 'REPAIRS' && <Text style={styles.reasonCheck}>✓</Text>}
            </TouchableOpacity>
          </View>
        </View>

        {/* Big Action Buttons */}
        <View style={styles.operatorActionSection}>
          <TouchableOpacity
            style={[styles.bigRedTriggerButton, isTrainDelayed && styles.buttonDisabledState]}
            activeOpacity={0.88}
            onPress={handleSimulate}
          >
            <Text style={styles.bigRedTriggerIcon}>🚨</Text>
            <Text style={styles.bigRedTriggerTitle}>{t.simulateBtn(selectedDelayMinutes)}</Text>
            <Text style={styles.bigRedTriggerSub}>{t.simulateSub}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineResetButton}
            activeOpacity={0.8}
            onPress={handleReset}
          >
            <Text style={styles.outlineResetButtonText}>{t.resetBtn}</Text>
          </TouchableOpacity>
        </View>

        {/* Driver Push Notification Simulator */}
        {isTrainDelayed && (
          <View style={styles.driverPushBubble}>
            <Text style={styles.driverPushHeader}>📲 PUSH-УВЕДОМЛЕНИЕ ВОДИТЕЛЮ ТАКСИ:</Text>
            <Text style={styles.driverPushMessage}>{t.driverNotification}</Text>
          </View>
        )}

        {/* Presentation Talking Points Card */}
        <View style={styles.presentationHelperCard}>
          <Text style={styles.helperCardTitle}>{t.talkingPointsTitle}</Text>
          <Text style={styles.helperCardBullet}>{t.talkingPoint1}</Text>
          <Text style={styles.helperCardBullet}>{t.talkingPoint2}</Text>
          <Text style={styles.helperCardBullet}>{t.talkingPoint3}</Text>

          <TouchableOpacity
            style={styles.switchPassengerButton}
            activeOpacity={0.85}
            onPress={() => setCurrentRole('PASSENGER')}
          >
            <Text style={styles.switchPassengerButtonText}>{t.viewPassengerPassBtn}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// =============================================================================
// 9. ROOT NAVIGATOR
// =============================================================================
export default function App() {
  return (
    <MaaSProvider>
      <MainAppNavigator />
    </MaaSProvider>
  );
}

const MainAppNavigator = () => {
  const { currentRole } = useMaaS();

  switch (currentRole) {
    case 'PASSENGER':
      return <PassengerScreen />;
    case 'ADMIN':
      return <AdminScreen />;
    case 'ROLE_SELECT':
    default:
      return <RoleSelectionScreen />;
  }
};

// =============================================================================
// 10. PREMIUM STYLESHEET (Uber / Apple Maps / Airbnb Design System)
// =============================================================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // Language & Version Controls
  homeTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  tagVersionPill: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  tagVersionText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
  },
  langPillContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 20,
    padding: 3,
  },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  langBtnActive: {
    backgroundColor: '#0F172A',
  },
  langText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
  },
  langTextActive: {
    color: '#FFFFFF',
  },

  // Hero Section
  homeScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  heroLogoBubble: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#0066FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  heroLogoIcon: {
    fontSize: 38,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#475569',
    marginTop: 6,
    fontWeight: '600',
    textAlign: 'center',
  },
  heroTagline: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  heroPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  heroPillText: {
    color: '#0066FF',
    fontSize: 12,
    fontWeight: '800',
  },

  // Floating Status Card
  floatingStatusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statusCardHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  statusCardText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 4,
  },

  // Role Cards
  rolesSection: {
    gap: 16,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    minHeight: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  roleCardPassenger: {
    borderLeftWidth: 6,
    borderLeftColor: '#0066FF',
  },
  roleCardOperator: {
    borderLeftWidth: 6,
    borderLeftColor: '#EF4444',
  },
  roleCardIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  roleCardIconOperator: {
    backgroundColor: '#FEF2F2',
  },
  roleCardIcon: {
    fontSize: 26,
  },
  roleCardContent: {
    flex: 1,
  },
  roleCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  roleCardDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 16,
  },
  roleCardChevron: {
    paddingLeft: 8,
  },
  chevronIcon: {
    fontSize: 24,
    color: '#CBD5E1',
    fontWeight: '300',
  },
  homeFooter: {
    marginTop: 32,
    alignItems: 'center',
  },
  homeFooterText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },

  // Screen Top Bar
  screenTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  topBarBackBtn: {
    paddingVertical: 6,
    paddingRight: 10,
  },
  topBarBackText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0066FF',
  },
  screenTitleText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  topBarSwitchRolePill: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  topBarSwitchRoleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Base Tabs
  tabContainer: {
    flex: 1,
  },
  tabScrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerTextBlock: {
    marginTop: 20,
    marginBottom: 18,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 20,
  },

  // Apple Maps Style Floating Search Box
  searchCardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: 4,
  },
  originDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#059669',
    marginRight: 14,
  },
  destinationSquare: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#0066FF',
    marginRight: 14,
  },
  calendarIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  inputFlex: {
    flex: 1,
  },
  inputMiniLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6,
  },
  inputText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    paddingVertical: 2,
  },
  dateTimeDisplay: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  searchInnerDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },

  // Route Options Section
  routeSectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  routeSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  routeCountPill: {
    backgroundColor: '#E2E8F0',
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },

  // Clean Route Card
  cleanRouteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cleanRouteCardSelected: {
    borderColor: '#0066FF',
    backgroundColor: '#FAFCFF',
    shadowColor: '#0066FF',
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  cleanRouteTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pillBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cleanRoutePrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  cleanRouteTimeRow: {
    marginBottom: 12,
  },
  cleanRouteTime: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  cleanRouteDuration: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  segmentPillChain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  segmentChainItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segmentIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentIconText: {
    fontSize: 16,
  },
  chainConnectorLine: {
    width: 24,
    height: 2,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 6,
  },
  cardSelectionFooter: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  selectedPillBadge: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  selectedPillBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  unselectedPrompt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0066FF',
  },

  // Floating Action Dock (Checkout button)
  floatingActionDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryActionButton: {
    backgroundColor: '#0066FF',
    minHeight: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  // Toast
  modernSuccessToast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
    marginBottom: 8,
  },
  toastEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  toastMessageText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#065F46',
  },
  toastCloseBtn: {
    fontSize: 16,
    color: '#64748B',
    paddingHorizontal: 6,
  },

  // Disruption Banner (Glowing Amber)
  disruptionAlertCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 2,
    borderColor: '#F59E0B',
    borderRadius: 20,
    padding: 18,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 3,
  },
  disruptionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  alertIconBubble: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertIconBubbleText: {
    fontSize: 18,
  },
  disruptionTitleCol: {
    flex: 1,
  },
  disruptionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#92400E',
  },
  disruptionSub: {
    fontSize: 13,
    color: '#78350F',
    marginTop: 4,
    lineHeight: 18,
    fontWeight: '600',
  },
  guaranteeTag: {
    backgroundColor: '#FEF3C7',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 10,
  },
  guaranteeTagText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '800',
  },
  passiveProtectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
    marginBottom: 16,
  },
  passiveProtectionEmoji: {
    fontSize: 18,
    marginRight: 10,
  },
  passiveProtectionText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
    lineHeight: 17,
  },

  // Apple Wallet Boarding Pass Card
  walletTicketWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingTop: 20,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 30,
  },
  walletPassHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  walletBrandHeader: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0066FF',
    letterSpacing: 0.8,
  },
  walletPassRef: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 2,
  },
  walletStatusPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  walletStatusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  walletInfoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  walletInfoCol: {
    flex: 1,
  },
  walletLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6,
  },
  walletValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },

  // Scalloped Pass Notches
  scallopedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    overflow: 'hidden',
  },
  notchLeft: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    marginLeft: -10,
  },
  dashedSeparator: {
    flex: 1,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  notchRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    marginRight: -10,
  },

  // Timeline
  timelineSectionHeading: {
    fontSize: 11,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 0.8,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  verticalTimeline: {
    paddingHorizontal: 20,
  },
  timelineItemRow: {
    flexDirection: 'row',
    minHeight: 64,
  },
  timelineNodeCol: {
    alignItems: 'center',
    width: 36,
    marginRight: 12,
  },
  timelineNodeDot: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeIcon: {
    fontSize: 16,
  },
  timelineVerticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  timelineContentBox: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineContentBoxHighlighted: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 10,
  },
  timelineHeaderLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  segmentName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  segmentSubDetails: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  bufferTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    marginTop: 4,
  },
  statusOkText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  statusDelayedText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#DC2626',
  },
  statusRescheduledText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
  },

  // QR Section
  walletQrSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 6,
  },
  qrHeaderLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  premiumQrContainer: {
    width: 150,
    height: 150,
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 14,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 4,
  },
  qrRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qrEyeSquare: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#0066FF',
  },
  qrPixelBlock: {
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: '#60A5FA',
  },
  qrBarWide: {
    width: 34,
    height: 14,
    borderRadius: 3,
    backgroundColor: '#93C5FD',
  },
  qrCenterBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCenterEmoji: {
    fontSize: 16,
  },
  qrInstructionText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 16,
    paddingHorizontal: 16,
  },
  walletExpandButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
  },
  walletExpandText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0066FF',
  },

  // Bottom Navigation
  modernBottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
  },
  bottomNavTab: {
    alignItems: 'center',
    flex: 1,
    minHeight: 44,
  },
  bottomNavTabActive: {},
  bottomNavIcon: {
    fontSize: 22,
  },
  bottomNavLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 3,
  },
  bottomNavLabelActive: {
    color: '#0066FF',
    fontWeight: '800',
  },
  iconWithBadgeWrapper: {
    position: 'relative',
  },
  redBadgeDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // Bottom Sheet Modal
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  sheetBackdropDismiss: {
    flex: 1,
  },
  bottomSheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  bottomSheetGrabber: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  sheetSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 18,
  },
  sheetOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  sheetOptionRowSelected: {
    borderColor: '#0066FF',
    backgroundColor: '#EFF6FF',
  },
  optionEmoji: {
    fontSize: 22,
    marginRight: 14,
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  optionCheck: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0066FF',
  },
  sheetConfirmButton: {
    backgroundColor: '#059669',
    minHeight: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  sheetConfirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  sheetCancelButton: {
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  sheetCancelButtonText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
  },

  // Fullscreen QR Modal
  fullScreenQrOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  fullScreenQrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 28,
    elevation: 10,
  },
  fullScreenBrand: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0066FF',
    letterSpacing: 0.8,
  },
  fullScreenSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  largeQrBox: {
    width: 220,
    height: 220,
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 16,
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  fullScreenCodeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '800',
    fontSize: 15,
    color: '#0F172A',
    marginTop: 12,
  },
  fullScreenCloseBtn: {
    marginTop: 20,
    width: '100%',
    minHeight: 48,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenCloseText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#475569',
  },

  // Operator UI
  operatorToastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  operatorToastText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#991B1B',
    lineHeight: 18,
  },
  corridorMonitorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  corridorTag: {
    fontSize: 10,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  corridorHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 4,
  },
  corridorSubText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 14,
  },
  corridorDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  dataRowLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  dataRowValue: {
    fontSize: 13,
    color: '#0F172A',
  },

  // Incident Configuration
  configIncidentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  configCardLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  configFieldLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
    marginBottom: 10,
  },
  delayPillsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  delayPillButton: {
    flex: 1,
    minHeight: 46,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  delayPillButtonActive: {
    backgroundColor: '#EF4444',
    borderColor: '#DC2626',
  },
  delayPillButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
  },
  delayPillButtonTextActive: {
    color: '#FFFFFF',
  },
  reasonsList: {
    gap: 8,
  },
  reasonSelectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  reasonSelectionRowActive: {
    borderColor: '#0066FF',
    backgroundColor: '#EFF6FF',
  },
  reasonEmoji: {
    fontSize: 18,
    marginRight: 10,
  },
  reasonLabelText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  reasonCheck: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0066FF',
  },

  // Action Buttons Operator
  operatorActionSection: {
    gap: 12,
    marginBottom: 18,
  },
  bigRedTriggerButton: {
    backgroundColor: '#EF4444',
    minHeight: 60,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  buttonDisabledState: {
    opacity: 0.85,
  },
  bigRedTriggerIcon: {
    fontSize: 26,
    marginBottom: 2,
  },
  bigRedTriggerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  bigRedTriggerSub: {
    color: '#FEE2E2',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  outlineResetButton: {
    backgroundColor: '#FFFFFF',
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  outlineResetButtonText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '800',
  },

  // Driver Push Notification Card
  driverPushBubble: {
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 5,
    borderLeftColor: '#F59E0B',
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
  },
  driverPushHeader: {
    fontSize: 11,
    fontWeight: '900',
    color: '#92400E',
    marginBottom: 4,
  },
  driverPushMessage: {
    fontSize: 13,
    color: '#78350F',
    fontWeight: '700',
    lineHeight: 18,
  },

  // Presentation Helper
  presentationHelperCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 30,
  },
  helperCardTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1E40AF',
    marginBottom: 8,
  },
  helperCardBullet: {
    fontSize: 13,
    color: '#1E3A8A',
    lineHeight: 20,
    marginBottom: 4,
    fontWeight: '600',
  },
  switchPassengerButton: {
    backgroundColor: '#1E40AF',
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  switchPassengerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
