from djoser import email

class CustomPasswordResetEmail(email.PasswordResetEmail):
    template_name = "email/password_reset.html"

    def get_context_data(self):
        # Force the frontend domain and name context
        context = super().get_context_data()
        context['domain'] = 'bitbybit-seven.vercel.app'
        context['site_name'] = 'Bit By Bit'
        context['protocol'] = 'https'
        return context

class CustomActivationEmail(email.ActivationEmail):
    template_name = "email/activation.html"

    def get_context_data(self):
        context = super().get_context_data()
        context['domain'] = 'bitbybit-seven.vercel.app'
        context['site_name'] = 'Bit By Bit'
        context['protocol'] = 'https'
        return context