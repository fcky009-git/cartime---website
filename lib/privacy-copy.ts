import type { Locale } from "@/lib/locales";

type PrivacyCopy = {
  draft: string;
  request: string;
  measurement: string;
  contact: string;
};

export const privacyCopy: Record<Locale, PrivacyCopy> = {
  en: {
    draft: "Draft for legal review. CarTime must approve the final policy before advertising measurement is enabled.",
    request: "CarTime receives the contact details, rental dates, pick-up and return information, vehicle choice, driver eligibility and any notes you enter. CarTime uses them to handle your enquiry, check availability and contact you about the rental. The request is stored in the private booking system. Staff may also receive a notification. When you choose WhatsApp, email or an external map, the relevant provider handles that interaction under its own privacy terms.",
    measurement: "The site stores your theme and cookie preference. Your booking draft and any pass details shown after submission can remain in this browser tab after a reload, until the tab is closed or the draft is cleared. When advertising measurement is configured, Google Tag Manager loads after you allow optional measurement. Google tags may then process technical and usage information to measure site visits and ad results. The site sends event names for a saved request or a contact-link click. Booking fields are excluded from those events. You can withdraw consent through Cookie settings. Your choice is stored for up to 180 days.",
    contact: "For questions about your information or to request access, correction or deletion, contact CarTime at",
  },
  ru: {
    draft: "Черновик для юридической проверки. Итоговый текст необходимо согласовать до включения рекламных измерений.",
    request: "CarTime получает контактные данные, даты аренды, места выдачи и возврата, выбранный автомобиль, сведения о водителе и комментарии из формы. Эти данные нужны для обработки заявки, проверки наличия и связи с вами. Заявка сохраняется в закрытой системе, сотрудники могут получить уведомление. Для WhatsApp, электронной почты и внешней карты действуют условия соответствующих сервисов.",
    measurement: "Сайт хранит настройки темы и выбор cookie. Черновик заявки и данные пропуска могут сохраняться в текущей вкладке после перезагрузки до её закрытия или очистки черновика. Если измерения настроены, Google Tag Manager загружается после вашего согласия. Теги могут обрабатывать технические данные и сведения о посещениях для измерения посещаемости и рекламы. Сайт передаёт названия событий сохранения заявки и нажатия на контакты без полей заявки. Согласие можно отозвать в настройках cookie. Выбор хранится до 180 дней.",
    contact: "Чтобы задать вопрос о своих данных, запросить доступ, исправление или удаление, напишите CarTime на",
  },
  az: {
    draft: "Hüquqi yoxlama üçün layihə. Reklam ölçməsi aktiv edilməzdən əvvəl yekun mətn təsdiqlənməlidir.",
    request: "CarTime əlaqə məlumatlarını, icarə tarixlərini, təhvil və qaytarma yerlərini, avtomobil seçimini, sürücü məlumatlarını və qeydləri sorğunuzu işləmək, mövcudluğu yoxlamaq və sizinlə əlaqə saxlamaq üçün istifadə edir. Sorğu qapalı sistemdə saxlanılır və əməkdaşlara bildiriş göndərilə bilər. WhatsApp, e-poçt və xarici xəritə üçün həmin xidmətlərin şərtləri tətbiq olunur.",
    measurement: "Sayt mövzu ayarlarını və kuki seçimini saxlayır. Sorğunun layihəsi və keçid məlumatları vərəq bağlanana və ya layihə silinənə qədər brauzerdə qala bilər. Ölçmə qurulduqda Google Tag Manager yalnız razılıqdan sonra yüklənir. Google teqləri ziyarətləri və reklam nəticələrini ölçmək üçün texniki məlumatlardan istifadə edə bilər. Sorğunun saxlanması və əlaqə keçidinə klik hadisələrinin adları sorğunun sahələri olmadan göndərilir. Razılığı kuki ayarlarında geri götürə bilərsiniz. Seçim 180 günədək saxlanılır.",
    contact: "Məlumatlarınızla bağlı sual, giriş, düzəliş və ya silmə tələbi üçün CarTime ilə əlaqə saxlayın:",
  },
  de: {
    draft: "Entwurf zur rechtlichen Prüfung. Vor der Aktivierung der Werbemessung muss die endgültige Fassung genehmigt werden.",
    request: "CarTime verwendet Kontaktdaten, Mietdaten, Abhol- und Rückgabeorte, Fahrzeugwahl, Fahrerangaben und Hinweise, um Ihre Anfrage zu bearbeiten und Sie zu kontaktieren. Anfragen werden in einem privaten Buchungssystem gespeichert. Mitarbeitende können benachrichtigt werden. Für WhatsApp, E-Mail und externe Karten gelten die Bedingungen der jeweiligen Anbieter.",
    measurement: "Die Website speichert Design und Cookie-Auswahl. Anfrageentwurf und Zugangsdaten zum Pass können bis zum Schließen des Tabs oder Löschen des Entwurfs gespeichert bleiben. Ist die Messung eingerichtet, wird Google Tag Manager erst nach Zustimmung geladen. Google-Tags können technische Nutzungsdaten zur Messung von Besuchen und Werbung verarbeiten. Der Website-Code sendet Ereignisnamen ohne Formularfelder. Die Einwilligung ist in den Cookie-Einstellungen widerrufbar. Ihre Auswahl wird bis zu 180 Tage gespeichert.",
    contact: "Für Fragen, Auskunft, Berichtigung oder Löschung Ihrer Daten erreichen Sie CarTime unter",
  },
  zh: {
    draft: "待法律审核的草案。启用广告衡量前须批准最终版本。",
    request: "CarTime 使用您提交的联系方式、租车日期、取还车信息、车辆选择、驾驶员信息和备注来处理询问、确认可用情况并联系您。请求存储在非公开预订系统中，工作人员可能收到通知。WhatsApp、电子邮件及外部地图适用各提供商的条款。",
    measurement: "网站会保存主题和 Cookie 选择。租车申请草稿和通行凭证可能在重新加载页面后继续保留，直到关闭当前标签页或清除草稿。如果已配置衡量功能，只有在您同意后才加载 Google Tag Manager。Google 标签可能处理技术及使用数据以衡量访问与广告成效。网站代码发送事件名称，事件不包括表单字段。您可以在 Cookie 设置中撤回同意。选择最多保存 180 天。",
    contact: "如需咨询、访问、更正或删除您的资料，请联系 CarTime：",
  },
  ko: {
    draft: "법률 검토용 초안입니다. 광고 측정을 켜기 전에 최종 문서를 승인해야 합니다.",
    request: "CarTime은 문의 처리, 차량 확인 및 연락을 위해 연락처, 대여 날짜, 인수·반납 장소, 차량 선택, 운전자 요건 및 메모를 사용합니다. 요청은 비공개 예약 시스템에 저장되며 직원에게 알림이 전달될 수 있습니다. WhatsApp, 이메일 및 외부 지도에는 각 제공자의 조건이 적용됩니다.",
    measurement: "사이트는 테마 및 쿠키 선택을 저장합니다. 탭을 닫거나 초안을 지울 때까지 예약 초안과 패스 정보가 현재 탭에 남아 있을 수 있습니다. 측정 기능을 설정한 경우 동의한 후에 Google Tag Manager가 실행됩니다. Google 태그는 방문 및 광고 성과를 측정하기 위해 기술·사용 정보를 처리할 수 있습니다. 사이트 코드는 양식 데이터 없이 이벤트 이름을 보냅니다. 쿠키 설정에서 동의를 철회할 수 있습니다. 선택은 최대 180일간 저장됩니다.",
    contact: "개인정보 문의, 열람, 수정 또는 삭제 요청은 CarTime에 연락해 주세요.",
  },
  fr: {
    draft: "Projet pour validation juridique. La version définitive doit être approuvée avant l’activation de la mesure publicitaire.",
    request: "CarTime utilise vos coordonnées, les dates, les lieux de prise en charge et de retour, le véhicule choisi, les renseignements sur le conducteur et vos remarques pour traiter la demande, vérifier la disponibilité et vous répondre. La demande est conservée dans un système de réservation privé. L’équipe peut être avertie. Les conditions des prestataires s’appliquent à WhatsApp, à l’e-mail et aux cartes externes.",
    measurement: "Le site enregistre le thème et vos choix de cookies. Le brouillon et les informations du pass peuvent rester dans l’onglet jusqu’à sa fermeture ou à l’effacement du brouillon. Lorsque la mesure est configurée, Google Tag Manager se charge après votre accord. Les balises Google peuvent traiter des données techniques et d’usage pour mesurer les visites et la publicité. Le code du site transmet les noms des événements sans les champs du formulaire. Vous pouvez retirer votre accord dans les paramètres des cookies. Votre choix est conservé jusqu’à 180 jours.",
    contact: "Pour toute question ou demande d’accès, de rectification ou de suppression, contactez CarTime à",
  },
  ar: {
    draft: "مسودة للمراجعة القانونية. يجب اعتماد النص النهائي قبل تفعيل قياس الإعلانات.",
    request: "يستخدم CarTime بيانات الاتصال ومواعيد الإيجار ومواقع الاستلام والإرجاع والسيارة المختارة وبيانات أهلية السائق والملاحظات لمعالجة طلبك والتحقق من التوفر والتواصل معك. يُحفظ الطلب في نظام الحجز الخاص وقد يتلقى الموظفون إشعاراً به. تخضع خدمات واتساب والبريد الإلكتروني والخرائط الخارجية لشروط مقدميها.",
    measurement: "يحفظ الموقع تفضيلات المظهر وملفات تعريف الارتباط. قد تبقى مسودة الطلب وبيانات تصريح الرحلة في علامة التبويب الحالية حتى إغلاقها أو مسح المسودة. عند إعداد القياس، لا يتم تحميل Google Tag Manager إلا بعد موافقتك. قد تعالج علامات Google بيانات تقنية وبيانات الاستخدام لقياس الزيارات ونتائج الإعلانات. يرسل الموقع أسماء الأحداث دون حقول نموذج الحجز. يمكنك سحب الموافقة من الإعدادات. يُحفظ اختيارك لمدة تصل إلى 180 يوماً.",
    contact: "للاستفسار عن بياناتك أو طلب الاطلاع عليها أو تصحيحها أو حذفها، تواصل مع CarTime عبر",
  },
};
