const { createApp } = Vue;

createApp({
  data() {
    return {
      authenticated: false,
      token: null,
      messages: [],
      searchQuery: '',
      loginData: {
        username: '',
        password: ''
      },
      isLoading: false // Add loading state
    };
  },
  computed: {
    filteredMessages() {
      const query = this.searchQuery.toLowerCase();
      return this.messages.filter(message => 
        message.name.toLowerCase().includes(query) ||
        message.email.toLowerCase().includes(query) ||
        message.subject.toLowerCase().includes(query) ||
        message.message.toLowerCase().includes(query)||
        message.phone.includes(query)
      );
    }
  },
  created() {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.authenticated = true;
      this.fetchMessages();
    }
  },
  methods: {
    async login() {
      try {
        this.isLoading = true; // Start loading
        const response = await axios.post('https://rumin-production.up.railway.app/api/auth/login', this.loginData);
        this.token = response.data.token;
        localStorage.setItem('token', this.token);
        this.authenticated = true;
        await this.fetchMessages();
      } catch (error) {
        alert(error.response?.data?.message || 'Login failed');
      } finally {
        this.isLoading = false; // End loading
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.token = null;
      this.authenticated = false;
      this.messages = [];
    },
    async fetchMessages() {
      try {
        this.isLoading = true; // Start loading
        const response = await axios.get('https://rumin-production.up.railway.app/api/contact', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.messages = response.data.data;
      } catch (error) {
        if (error.response?.status === 401) {
          this.logout();
        }
        console.error('Error fetching messages:', error);
      } finally {
        this.isLoading = false; // End loading
      }
    }
  }
}).mount('#app');