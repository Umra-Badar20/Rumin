const { createApp } = Vue;

createApp({
  data() {
    return {
      authenticated: false,
      token: null,
      inquiries: [],
      searchQuery: '',
      loginData: {
        username: '',
        password: ''
      },
      isLoading: false
    };
  },
  computed: {
    filteredInquiries() {
      if (!this.inquiries) return [];
      const query = this.searchQuery.toLowerCase();
      return this.inquiries.filter(inquiry => 
        (inquiry.name && inquiry.name.toLowerCase().includes(query)) ||
        (inquiry.age && inquiry.age.toString().includes(query)) ||
        (inquiry.qualification && inquiry.qualification.toLowerCase().includes(query)) ||
        (inquiry.percentage && inquiry.percentage.toLowerCase().includes(query)) ||
        (inquiry.englishTest && inquiry.englishTest.toLowerCase().includes(query)) ||
        (inquiry.country && inquiry.country.toLowerCase().includes(query))
      );
    }
  },
  created() {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.authenticated = true;
      this.fetchInquiries();
    }
  },
  methods: {
    async login() {
      try {
        this.isLoading = true;
        const response = await axios.post('https://rumin-puce.vercel.app/api/auth/login', this.loginData);
        this.token = response.data.token;
        localStorage.setItem('token', this.token);
        this.authenticated = true;
        await this.fetchInquiries();
        
        await Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'You have been logged in successfully',
          confirmButtonColor: '#3085d6'
        });
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.response?.data?.message || 'Invalid credentials',
          confirmButtonColor: '#3085d6'
        });
      } finally {
        this.isLoading = false;
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.token = null;
      this.authenticated = false;
      this.inquiries = [];
    },
    async fetchInquiries() {
      try {
        this.isLoading = true;
        const response = await axios.get('https://rumin-puce.vercel.app/api/contact', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.inquiries = response.data.data || [];
      } catch (error) {
        if (error.response?.status === 401) {
          this.logout();
          await Swal.fire({
            icon: 'error',
            title: 'Session Expired',
            text: 'Please login again',
            confirmButtonColor: '#3085d6'
          });
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Fetch Error',
            text: 'Failed to load inquiries',
            confirmButtonColor: '#3085d6'
          });
          console.error('Error fetching inquiries:', error);
        }
      } finally {
        this.isLoading = false;
      }
    },
   async deleteInquiry(id) {
  try {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Deleting...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      // Ensure the URL is constructed correctly
      const apiUrl = `https://rumin-puce.vercel.app/api/contact/${id}`;
      console.log('Attempting to delete at:', apiUrl);
      
      const response = await axios.delete(apiUrl, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      console.log('Delete successful:', response.data);
      
      this.inquiries = this.inquiries.filter(inquiry => inquiry._id !== id);
      
      await Swal.fire(
        'Deleted!',
        'The inquiry has been deleted.',
        'success'
      );
    }
  } catch (error) {
    console.error('Full error details:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.config?.headers
    });

    let errorMessage = 'Failed to delete inquiry';
    if (error.response) {
      errorMessage = error.response.data?.message || 
                   `Server responded with ${error.response.status}`;
    }

    await Swal.fire({
      icon: 'error',
      title: 'Delete Failed',
      text: errorMessage,
      confirmButtonColor: '#3085d6'
    });
  }
}
  }
}).mount('#app');